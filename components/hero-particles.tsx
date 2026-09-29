"use client";

/*
 * خلفية عُقد خفيفة للقسم الرئيسي — مكيَّفة من nodes.js المستخدم في C:\apcasystems\js\nodes.js
 * nodes.js — Copyright (C) 2018 Oğuzhan Eroğlu <rohanrhu2@gmail.com> — MIT License
 * https://github.com/rohanrhu/nodes.js
 *
 * التكييف: عدد عُقد أقل، حركة أبطأ، تتوقف خارج الشاشة وعند إخفاء التبويب،
 * تفاعل المؤشر على الأجهزة ذات الماوس فقط، وإطار ثابت واحد مع prefers-reduced-motion.
 */
import { useEffect, useRef } from "react";

type Node = { x: number; y: number; a: number };

const COLOR = "196,149,106";
const LINK = 130;
const PUSH = 90;

export function HeroParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let visible = true;
    let last = performance.now();
    const pointer = { x: -9999, y: -9999 };

    const place = () => {
      const count = Math.round(Math.min(46, Math.max(18, (w * h) / 22000)));
      nodes = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, a: Math.random() * Math.PI * 2 }));
    };

    const size = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      place();
      draw(0);
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      const speed = 9;
      for (const n of nodes) {
        n.x += Math.cos(n.a) * speed * dt;
        n.y += Math.sin(n.a) * speed * dt;
        if (n.x < 0) n.x += w;
        if (n.x > w) n.x -= w;
        if (n.y < 0) n.y += h;
        if (n.y > h) n.y -= h;
        // دفع العقدة إلى حافة دائرة المؤشر (فكرة pointerCircleRadius في nodes.js)
        const dx = n.x - pointer.x;
        const dy = n.y - pointer.y;
        const d = Math.hypot(dx, dy);
        if (d > 0 && d < PUSH) {
          n.x = pointer.x + (dx / d) * PUSH;
          n.y = pointer.y + (dy / d) * PUSH;
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(${COLOR},${(0.22 * (1 - d / LINK)).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = `rgba(${COLOR},0.45)`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      draw(dt);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduce || !visible || document.hidden || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    const host = canvas.parentElement!;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
    };
    if (finePointer && !reduce) {
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
    }
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 size-full" />;
}
