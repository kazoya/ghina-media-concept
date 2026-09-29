// Visual effects: BASE=http://localhost:3000 node tests/e2e/visual.e2e.mjs
// كل طلب خارج المنصة يُحجب أثناء الاختبار.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const BASE = (process.env.BASE || "http://localhost:3000").replace(/[/]$/, "");
const OUT = fileURLToPath(new URL("./artifacts/", import.meta.url));
mkdirSync(OUT, { recursive: true });
const host = new URL(BASE).host;
let pass = 0,
  fail = 0;
const ok = (n, c, x = "") => {
  if (c) pass++;
  else fail++;
  console.log(`${c ? "PASS" : "FAIL"}  ${n}${x ? "  — " + x : ""}`);
};

const b = await chromium.launch();
async function ctxFor(opts) {
  const ctx = await b.newContext(opts);
  await ctx.route("**/*", (r) => (new URL(r.request().url()).host === host ? r.continue() : r.abort()));
  return ctx;
}
const ammanNow = () =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Amman", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());

// ——— سطح المكتب ———
{
  const ctx = await ctxFor({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const logs = [];
  p.on("console", (m) => ["error", "warning"].includes(m.type()) && logs.push(m.text()));
  p.on("pageerror", (e) => logs.push(e.message));
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1300);

  const clock = p.locator("header .amman-clock");
  ok("desktop: clock visible in header (xl)", await clock.isVisible());
  const t1 = await clock.locator("time").innerText();
  ok("desktop: clock format HH:MM:SS", /^\d{2}:\d{2}:\d{2}$/.test(t1), t1);
  ok("desktop: clock matches Asia/Amman", t1.startsWith(ammanNow().slice(0, 4)), `${t1} vs ${ammanNow()}`);
  ok("desktop: label «توقيت عمّان»", (await clock.innerText()).includes("توقيت عمّان"));
  const date = await clock.locator("span").last().innerText();
  ok("desktop: Arabic date", /[\u0600-\u06FF]/.test(date), date);
  await p.waitForTimeout(1100);
  ok("desktop: clock ticks", (await clock.locator("time").innerText()) !== t1);

  ok("desktop: particles canvas present, pointer-events none", await p.$eval("section canvas", (c) => getComputedStyle(c).pointerEvents === "none" && c.width > 0));

  const card = p.locator("article[data-spotlight]").first();
  await card.scrollIntoViewIfNeeded();
  await p.waitForTimeout(800);
  const box = await card.boundingBox();
  await p.mouse.move(box.x + 40, box.y + 30);
  await p.mouse.move(box.x + 60, box.y + 50, { steps: 4 });
  await p.waitForTimeout(350);
  const mx = await card.evaluate((el) => el.style.getPropertyValue("--mx"));
  ok("desktop: spotlight follows cursor", mx === "60px", mx);
  ok("desktop: spotlight layer visible on hover", (await card.evaluate((el) => getComputedStyle(el, "::before").opacity)) === "1");
  ok("desktop: hover lift", (await card.evaluate((el) => getComputedStyle(el).transform)) !== "none");
  ok("desktop: native cursor kept", (await card.evaluate((el) => getComputedStyle(el).cursor)) === "auto");
  ok("desktop: text selectable", (await card.evaluate((el) => getComputedStyle(el).userSelect)) !== "none");
  await card.locator("h3").dblclick();
  ok("desktop: double-click selects text", (await p.evaluate(() => getSelection().toString().trim().length)) > 0);

  ok("desktop: revealed sections become visible", (await p.locator("article[data-reveal].is-visible").count()) >= 3);
  await p.evaluate(() => scrollTo(0, 400));
  await p.waitForTimeout(300);
  ok("desktop: header shadow after scroll", await p.$eval("header[data-header]", (h) => h.hasAttribute("data-scrolled")));

  const btn = p.locator("a.btn-primary").first();
  const bb = await btn.boundingBox();
  ok("desktop: primary button ≥44px tall", bb.height >= 44, String(bb.height));
  ok("desktop: button cursor pointer", (await btn.evaluate((el) => getComputedStyle(el).cursor)) === "pointer");

  await p.goto(BASE + "/training", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  ok("desktop: reveal works after navigation", (await p.locator("[data-reveal].is-visible").count()) > 0);
  await p.goto(BASE + "/#founder", { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  ok("desktop: #founder anchor + photo", await p.locator("#founder").isVisible() && await p.locator('img[src*="ghina-fahmawi"]').isVisible());
  await p.screenshot({ path: `${OUT}/v-desktop-founder.png` });
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1300);
  await p.screenshot({ path: `${OUT}/v-desktop-hero.png` });
  await p.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${OUT}/v-desktop-bottom.png` });

  const hyd = logs.filter((l) => /hydrat|did not match|mismatch/i.test(l));
  ok("desktop: no hydration warnings", hyd.length === 0, hyd.join(" | "));
  ok("desktop: no console errors/warnings", logs.length === 0, logs.slice(0, 3).join(" | "));
  await ctx.close();
}

// ——— لمس (موبايل) ———
{
  const ctx = await ctxFor({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const logs = [];
  p.on("pageerror", (e) => logs.push(e.message));
  p.on("console", (m) => m.type() === "error" && logs.push(m.text()));
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1300);
  ok("touch: header clock hidden (no crowding)", !(await p.locator("header > div .amman-clock").isVisible()));
  ok("touch: fine-pointer media query false", !(await p.evaluate(() => matchMedia("(hover: hover) and (pointer: fine)").matches)));
  const card = p.locator("article[data-spotlight]").first();
  await card.scrollIntoViewIfNeeded();
  await card.tap();
  ok("touch: no spotlight vars set", (await card.evaluate((el) => el.style.getPropertyValue("--mx"))) === "");
  ok("touch: spotlight layer stays hidden", (await card.evaluate((el) => getComputedStyle(el, "::before").opacity)) === "0");
  await p.getByRole("button", { name: "القائمة" }).tap();
  const mclock = p.locator("#mnav .amman-clock");
  ok("touch: clock in mobile menu", await mclock.isVisible());
  ok("touch: mobile clock format", /^\d{2}:\d{2}:\d{2}$/.test(await mclock.locator("time").innerText()));
  await p.locator('#mnav a[href="/planner"]').tap();
  await p.waitForURL(BASE + "/planner");
  const opt = p.getByRole("button", { name: "متجر إلكتروني" });
  const ob = await opt.boundingBox();
  ok("touch: planner option ≥44px", ob.height >= 44, String(ob.height));
  await opt.tap();
  ok("touch: planner advances", (await p.locator("main").innerText()).includes("سؤال 2 من 5"));
  ok("touch: no horizontal scroll", (await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0);
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1300);
  await p.screenshot({ path: `${OUT}/v-mobile-hero.png` });
  await p.goto(BASE + "/#founder", { waitUntil: "networkidle" });
  await p.waitForTimeout(1300);
  const ib = await p.locator('img[src*="ghina-fahmawi"]').boundingBox();
  ok("touch: #founder lands on the photo", ib && ib.y >= 0 && ib.y < 844 * 0.6, ib && String(Math.round(ib.y)));
  await p.screenshot({ path: `${OUT}/v-mobile-founder.png` });
  await p.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${OUT}/v-mobile-footer.png` });
  ok("touch: no errors", logs.length === 0, logs.slice(0, 3).join(" | "));
  await ctx.close();
}

// ——— تقليل الحركة ———
{
  const ctx = await ctxFor({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(300);
  const below = p.locator("article[data-reveal]").first();
  ok("reduced-motion: reveal content visible immediately", (await below.evaluate((el) => getComputedStyle(el).opacity)) === "1");
  const a = await p.$eval("section canvas", (c) => c.toDataURL());
  await p.waitForTimeout(600);
  const c2 = await p.$eval("section canvas", (c) => c.toDataURL());
  ok("reduced-motion: particles static (single frame)", a === c2);
  const card = p.locator("article[data-spotlight]").first();
  const box = await card.boundingBox();
  await p.mouse.move(box.x + 30, box.y + 30);
  await p.mouse.move(box.x + 50, box.y + 40, { steps: 3 });
  ok("reduced-motion: spotlight disabled", (await card.evaluate((el) => getComputedStyle(el, "::before").opacity)) === "0");
  await ctx.close();
}

// ——— بلا JavaScript: المحتوى لا يختفي ———
{
  const ctx = await ctxFor({ viewport: { width: 1366, height: 900 }, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(BASE + "/", { waitUntil: "load" });
  ok("no-JS: reveal content still visible", (await p.locator("article[data-reveal]").first().evaluate((el) => getComputedStyle(el).opacity)) === "1");
  ok("no-JS: clock renders placeholder, no crash", (await p.locator("header .amman-clock time").innerText()) === "--:--:--");
  await ctx.close();
}

// ——— تباين الألوان (WCAG) ———
{
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  const L = (h) => { const [r, g, bb] = hex(h); return 0.2126 * r + 0.7152 * g + 0.0722 * bb; };
  const cr = (a, c) => { const [x, y] = [L(a), L(c)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  for (const [n, fg, bg] of [
    ["ink/bg", "#f5eee4", "#110f0d"],
    ["muted/bg", "#bcb0a0", "#110f0d"],
    ["muted/raised", "#bcb0a0", "#211d19"],
    ["gold/bg", "#c4956a", "#110f0d"],
    ["gold-strong/gold-soft", "#e0b68f", "#33271c"],
    ["bg/gold (buttons)", "#110f0d", "#c4956a"],
  ]) {
    const r = cr(fg, bg);
    ok(`contrast ${n} ≥ 4.5`, r >= 4.5, r.toFixed(2));
  }
}

await b.close();
console.log(`\n${pass}/${pass + fail} passed`);
process.exit(fail ? 1 : 0);
