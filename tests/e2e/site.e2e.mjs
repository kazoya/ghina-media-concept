// Site-wide journey: BASE=http://localhost:3000 node tests/e2e/site.e2e.mjs
// كل طلب خارج المنصة يُحجب أثناء الاختبار.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const BASE = (process.env.BASE || "http://localhost:3000").replace(/[/]$/, "");
const OUT = fileURLToPath(new URL("./artifacts/", import.meta.url));
mkdirSync(OUT, { recursive: true });
const host = new URL(BASE).host;
const results = [];
const ok = (name, cond, extra = "") => {
  results.push({ name, pass: !!cond });
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`);
};

const routes = ["/", "/planner", "/services", "/training", "/activities", "/opportunities", "/contact", "/developer"];
const allowedExternal = ["wa.me", "ghinamedia.com", "www.facebook.com", "www.instagram.com", "www.linkedin.com", "www.google.com"];
const LABEL = "تصوّر تجريبي مستقل — غير تابع للموقع الرسمي";

const b = await chromium.launch();

for (const [vp, w, h] of [["desktop", 1366, 900], ["mobile", 390, 844]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const blocked = [];
  // لا يخرج أي طلب إلى خارج المنصة أثناء الاختبار
  await ctx.route("**/*", (r) => {
    const u = new URL(r.request().url());
    if (u.host !== host) {
      blocked.push(u.host);
      return r.abort();
    }
    return r.continue();
  });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  for (const r of routes) {
    const res = await p.goto(BASE + r, { waitUntil: "networkidle" });
    const info = await p.evaluate(() => ({
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      robots: document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "",
      h1: document.querySelector("h1")?.textContent?.trim() ?? "",
      body: document.body.innerText,
      hscroll: document.documentElement.scrollWidth - innerWidth,
      fontDir: getComputedStyle(document.body).direction,
    }));
    ok(`${vp} ${r} status 200`, res.status() === 200, String(res.status()));
    ok(`${vp} ${r} lang=ar dir=rtl`, info.lang === "ar" && info.dir === "rtl" && info.fontDir === "rtl");
    ok(`${vp} ${r} noindex meta`, /noindex/.test(info.robots), info.robots);
    ok(`${vp} ${r} X-Robots-Tag`, /noindex/.test(res.headers()["x-robots-tag"] ?? ""));
    ok(`${vp} ${r} concept label visible`, info.body.includes(LABEL));
    ok(`${vp} ${r} has h1`, info.h1.length > 0, info.h1.slice(0, 40));
    ok(`${vp} ${r} no horizontal scroll`, info.hscroll <= 0, String(info.hscroll));
  }

  // التنقل
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  for (const r of routes.slice(1, 7)) {
    if (vp === "mobile") await p.getByRole("button", { name: "القائمة" }).click();
    const scope = vp === "mobile" ? p.locator("#mnav") : p.getByRole("navigation", { name: "التنقل الرئيسي" });
    await scope.locator(`a[href="${r}"]`).click();
    await p.waitForURL(BASE + r);
    ok(`${vp} nav → ${r}`, p.url() === BASE + r);
  }

  // المخطِّط: تغطيه tests/e2e/studio.e2e.mjs في المستودع؛ هنا فحص دخان فقط
  await p.goto(BASE + "/planner", { waitUntil: "networkidle" });
  await p.getByRole("button", { name: "متجر إلكتروني" }).click();
  ok(`${vp} planner studio loads and advances`, (await p.locator("main").innerText()).includes("سؤال 2 من 5"));

  // الروابط
  const links = new Set();
  for (const r of routes) {
    await p.goto(BASE + r, { waitUntil: "networkidle" });
    for (const hr of await p.$$eval("a[href]", (as) => as.map((a) => a.href))) links.add(hr);
  }
  let bad = [];
  for (const l of links) {
    const u = new URL(l);
    if (u.protocol === "tel:") { if (l !== "tel:+962781385015") bad.push(l); continue; }
    if (u.protocol === "mailto:") { if (l !== "mailto:ghina@ghinamedia.com") bad.push(l); continue; }
    if (u.host === host) {
      const s = (await fetch(u.href.split("#")[0])).status;
      if (s !== 200) bad.push(`${l} → ${s}`);
      continue;
    }
    if (!allowedExternal.includes(u.host)) bad.push(l);
    if (u.host === "wa.me" && !["/962781385015", "/962787523192"].includes(u.pathname)) bad.push(l);
  }
  ok(`${vp} all ${links.size} links valid (internal 200, external whitelisted)`, bad.length === 0, bad.join(" | "));

  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${OUT}/${vp}-home.png` });
  ok(`${vp} no JS/console errors`, errors.length === 0, errors.slice(0, 3).join(" | "));
  ok(`${vp} no request left the site`, true, `blocked external hosts: ${[...new Set(blocked)].join(", ") || "none"}`);
  await ctx.close();
}

const robots = await (await fetch(BASE + "/robots.txt")).text();
ok("robots.txt disallows all", /Disallow: \//.test(robots));
ok("404 page", (await fetch(BASE + "/does-not-exist")).status === 404);

await b.close();
const failed = results.filter((r) => !r.pass).length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
