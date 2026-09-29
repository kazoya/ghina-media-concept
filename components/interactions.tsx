"use client";

// تفاعلات عامة خفيفة، تُركَّب مرة واحدة في التخطيط:
// 1) ظهور ناعم عند التمرير لعناصر [data-reveal] — مكيَّف من initScrollReveal في C:\apcasystems\apca-script.js
// 2) إضاءة تتبع المؤشر داخل عناصر [data-spotlight] عبر متغيرات CSS (ماوس فقط، بلا مكتبات)
// 3) ظل للشريط العلوي بعد التمرير — فكرة initNavigation في المصدر نفسه
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function Interactions() {
  const path = usePathname();

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)");
    if (reduce || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [path]);

  useEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let pending: { el: HTMLElement; x: number; y: number } | null = null;

    const onMove = (e: PointerEvent) => {
      if (!fine.matches || reduce.matches || e.pointerType !== "mouse") return;
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-spotlight]");
      if (!el) return;
      const r = el.getBoundingClientRect();
      pending = { el, x: e.clientX - r.left, y: e.clientY - r.top };
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          if (!pending) return;
          pending.el.style.setProperty("--mx", `${pending.x}px`);
          pending.el.style.setProperty("--my", `${pending.y}px`);
        });
      }
    };
    document.addEventListener("pointermove", onMove, { passive: true });

    const header = document.querySelector("header[data-header]");
    const onScroll = () => header?.toggleAttribute("data-scrolled", scrollY > 12);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
