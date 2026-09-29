"use client";

// مقتبس ومكيَّف من initDigitalClock في C:\apcasystems\apca-script.js (Intl + Asia/Amman)
import { useSyncExternalStore } from "react";

const timeFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Amman",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});
const dateFmt = new Intl.DateTimeFormat("ar-JO-u-nu-latn", {
  timeZone: "Asia/Amman",
  weekday: "long",
  day: "numeric",
  month: "long",
});

type Tick = { h: string; m: string; s: string; date: string; iso: string };

function read(now: Date): Tick {
  const parts = timeFmt.formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return { h: get("hour"), m: get("minute"), s: get("second"), date: dateFmt.format(now), iso: now.toISOString() };
}

// مخزن واحد تشترك فيه كل الساعات: مؤقت واحد يعمل ما دام هناك مشترك، ويُلغى عند إزالة آخر مكوّن
let current: Tick | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function tick() {
  const now = new Date();
  current = read(now);
  listeners.forEach((l) => l());
  // يتزامن مع بداية الثانية التالية بدل انجراف setInterval
  timer = setTimeout(tick, 1000 - now.getMilliseconds() + 5);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) tick();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearTimeout(timer);
      timer = undefined;
      current = null;
    }
  };
}

const getSnapshot = () => current ?? (current = read(new Date()));
// في الخادم وأثناء hydration: قيمة ثابتة فلا يحدث اختلاف بين الطرفين
const getServerSnapshot = () => null;

export function AmmanClock({ className = "" }: { className?: string }) {
  const t = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div className={`amman-clock ${className}`} role="group" aria-label="توقيت عمّان">
      <span className="text-[11px] font-bold text-gold">توقيت عمّان</span>
      <time dateTime={t?.iso} className="font-mono text-base font-bold tabular-nums tracking-wider text-ink" dir="ltr">
        {t ? (
          <>
            {t.h}
            <span className="text-gold">:</span>
            {t.m}
            <span className="text-gold">:</span>
            <span className="text-gold-strong">{t.s}</span>
          </>
        ) : (
          "--:--:--"
        )}
      </time>
      <span className="text-[11px] text-muted">{t?.date ?? "\u00a0"}</span>
    </div>
  );
}
