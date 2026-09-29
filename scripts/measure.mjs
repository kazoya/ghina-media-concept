// قياس الأداء والإتاحة من داخل المشروع.
// الاستخدام: npm run build && npm start   ثم   BASE=http://localhost:3000 LABEL=after npm run measure
// المتطلبات: npx playwright install chromium (يُستخدم Chromium الخاص بـ Playwright فلا مسار خاص بجهاز).
//
// ضمانات صحة كل تشغيل:
// - التقرير يُؤخذ من نتيجة Lighthouse في الذاكرة لنفس التشغيل (لا قراءة لملف قديم)، ويُكتب لمسار فريد.
// - يجب: fetchTime بعد بداية التشغيل، requestedUrl = الرابط المقصود، finalDisplayedUrl على نفس المضيف والمسار،
//   لا runtimeError ولا runWarnings، ووجود قيم LCP/FCP/CLS رقمية.
// - الخطأ الوحيد المقبول: فشل chrome-launcher في حذف مجلده المؤقت على Windows (EPERM داخل destroyTmp)
//   وهو يحدث عند kill() أي بعد اكتمال القياس وحفظ النتيجة — أي خطأ آخر يُفشل التشغيل.
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import AxeBuilder from "@axe-core/playwright";

const BASE = (process.env.BASE || "http://localhost:3000").replace(/\/$/, "");
const LABEL = process.env.LABEL || "run";
const RUNS = Number(process.env.RUNS || 3);
// أسماء المسارات بلا "/" أولى لتفادي تحويل المسارات في Git Bash: ROUTES=home,planner
const ROUTES = (process.env.ROUTES || "home,planner").split(",").map((r) => (r === "home" ? "/" : `/${r.replace(/^\//, "")}`));
const AXE_ROUTES = ["/", "/planner", "/services", "/training", "/activities", "/contact", "/opportunities", "/developer"];
const OUT = new URL(`../docs/evidence/runs/${LABEL}/`, import.meta.url);
mkdirSync(OUT, { recursive: true });
const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];

async function assertProductionServer() {
  const html = await (await fetch(BASE + "/")).text();
  if (/react-refresh|webpack-hmr|__nextjs_original-stack-frame|next-dev/i.test(html)) throw new Error("BASE يبدو خادم تطوير؛ القياس يتطلب next build + next start");
}

async function runOnce(route, i) {
  const url = BASE + route;
  const startedAt = Date.now();
  const chrome = await chromeLauncher.launch({ chromePath: chromium.executablePath(), chromeFlags: ["--headless=new", "--no-first-run"] });
  let lhr;
  try {
    const res = await lighthouse(url, { port: chrome.port, output: "json", logLevel: "error" });
    lhr = res?.lhr;
  } finally {
    try {
      await chrome.kill();
    } catch (e) {
      const known = e?.code === "EPERM" && /destroyTmp|rmSync/.test(String(e?.stack));
      if (!known) throw e;
      if (!lhr) throw new Error(`EPERM أثناء التنظيف قبل اكتمال القياس (${url})`);
      // مقبول: التنظيف فشل بعد أن اكتملت النتيجة في الذاكرة
    }
  }
  if (!lhr) throw new Error(`لا نتيجة من Lighthouse (${url})`);
  const problems = [];
  if (lhr.runtimeError) problems.push(`runtimeError ${JSON.stringify(lhr.runtimeError)}`);
  if (lhr.runWarnings?.length) problems.push(`runWarnings ${JSON.stringify(lhr.runWarnings)}`);
  if (lhr.requestedUrl !== url) problems.push(`requestedUrl ${lhr.requestedUrl} ≠ ${url}`);
  const fin = new URL(lhr.finalDisplayedUrl);
  if (fin.host !== new URL(url).host || fin.pathname !== new URL(url).pathname) problems.push(`finalDisplayedUrl ${lhr.finalDisplayedUrl}`);
  if (Date.parse(lhr.fetchTime) < startedAt - 1000) problems.push(`fetchTime ${lhr.fetchTime} قبل بداية التشغيل`);
  const a = lhr.audits;
  for (const k of ["largest-contentful-paint", "first-contentful-paint", "cumulative-layout-shift", "total-blocking-time"])
    if (typeof a[k]?.numericValue !== "number") problems.push(`قيمة مفقودة ${k}`);
  if (problems.length) throw new Error(`تشغيل غير صالح ${url} #${i}: ${problems.join("; ")}`);

  const file = new URL(`${route === "/" ? "home" : route.slice(1)}-${i}-${startedAt}.json`, OUT);
  writeFileSync(file, JSON.stringify(lhr));
  const lcpEl = a["largest-contentful-paint-element"]?.details?.items?.[0]?.items?.[0]?.node;
  const phases = Object.fromEntries((a["largest-contentful-paint-element"]?.details?.items?.[1]?.items ?? []).map((x) => [x.phase, Math.round(x.timing)]));
  const script = a["resource-summary"].details.items.find((x) => x.resourceType === "script");
  return {
    file: file.pathname.split("/").slice(-3).join("/"),
    fetchTime: lhr.fetchTime,
    lighthouse: lhr.lighthouseVersion,
    performance: Math.round(lhr.categories.performance.score * 100),
    accessibility: Math.round(lhr.categories.accessibility.score * 100),
    lcpMs: Math.round(a["largest-contentful-paint"].numericValue),
    fcpMs: Math.round(a["first-contentful-paint"].numericValue),
    cls: +a["cumulative-layout-shift"].numericValue.toFixed(3),
    tbtMs: Math.round(a["total-blocking-time"].numericValue),
    scriptKiB: +(script.transferSize / 1024).toFixed(1),
    lcpElement: lcpEl ? `${lcpEl.selector} «${(lcpEl.nodeLabel || "").slice(0, 50)}»` : null,
    lcpPhases: phases,
  };
}

await assertProductionServer();
const out = { label: LABEL, base: BASE, startedAt: new Date().toISOString(), preset: "Lighthouse mobile default (simulated throttling)", browser: chromium.executablePath().split(/[\\/]/).slice(-3, -1).join("/"), routes: {} };
for (const route of ROUTES) {
  const runs = [];
  for (let i = 1; i <= RUNS; i++) runs.push(await runOnce(route, i));
  const m = {};
  for (const k of ["performance", "accessibility", "lcpMs", "fcpMs", "cls", "tbtMs", "scriptKiB"]) m[k] = median(runs.map((r) => r[k]));
  out.routes[route] = { median: m, lcpMsPerRun: runs.map((r) => r.lcpMs), lcpElement: runs[0].lcpElement, lcpPhasesRun1: runs[0].lcpPhases, runs };
  console.log(`${route}  LCP runs ${runs.map((r) => r.lcpMs).join("/")} ms → median ${m.lcpMs} ms | FCP ${m.fcpMs} | CLS ${m.cls} | TBT ${m.tbtMs} | perf ${m.performance} a11y ${m.accessibility} | JS ${m.scriptKiB} KiB`);
  console.log(`   LCP element: ${runs[0].lcpElement} | phases ${JSON.stringify(runs[0].lcpPhases)}`);
}

const b = await chromium.launch();
out.axe = {};
for (const r of AXE_ROUTES) {
  const c = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await c.newPage();
  await p.goto(BASE + r, { waitUntil: "networkidle" });
  await p.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-visible")));
  await p.waitForTimeout(700);
  const res = await new AxeBuilder({ page: p }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const bad = res.violations.filter((v) => ["critical", "serious"].includes(v.impact));
  out.axe[r] = { criticalSerious: bad.map((v) => `${v.id}(${v.nodes.length})`), other: res.violations.filter((v) => !bad.includes(v)).map((v) => `${v.id}(${v.nodes.length})`) };
  await c.close();
}
await b.close();
console.log("axe critical/serious:", JSON.stringify(Object.fromEntries(Object.entries(out.axe).map(([k, v]) => [k, v.criticalSerious.length]))));
writeFileSync(new URL(`../docs/evidence/lighthouse-${LABEL}.json`, import.meta.url), JSON.stringify(out, null, 2));
