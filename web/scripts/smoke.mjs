// Mobile-viewport smoke test for the gate concept.
// Serves dist/ and loads the page in a 360x740 phone context — the design target.
// Checks: widget mounts, no console errors, no page overflow, every touch target >= 44px,
// scroll rows are genuinely reachable, and writes screenshots to /tmp.
//   pnpm build && pnpm smoke
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = '/Users/mimamsayogshala/Ganitatva/web/dist';
const MIME = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml' };

const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]).replace(/^\/ganitatva/, '');
  let f = join(ROOT, p);
  if (existsSync(f) && !extname(f)) f = join(f, 'index.html');
  if (!existsSync(f)) { res.writeHead(404); return res.end('nf'); }
  res.writeHead(200, { 'Content-Type': MIME[extname(f)] ?? 'application/octet-stream' });
  res.end(readFileSync(f));
});
await new Promise((r) => server.listen(4321, r));

const browser = await chromium.launch();
// The design target: a budget phone in portrait.
const ctx = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const page = await ctx.newPage();

const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

await page.goto('http://localhost:4321/ganitatva/concept/fraction-division/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

const mount = await page.locator('#widget-mount').first();
const html = await mount.innerHTML();
const canvasCount = await page.locator('#widget-mount canvas').count();
const stillBuilding = html.includes('still being built') || html.includes('loading');

console.log('canvas elements in mount :', canvasCount);
console.log('fallback text showing    :', stillBuilding);
console.log('interactive controls     :', await page.locator('#widget-mount button, #widget-mount [role="button"], #widget-mount input, #widget-mount select').count());
console.log('aria-live region present :', await page.locator('[aria-live]').count() > 0);
console.log('horizontal page overflow :', await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1));
console.log('console errors           :', errors.length);
for (const e of errors.slice(0, 6)) console.log('   ✗', e.slice(0, 160));

// The object itself — this is what the whole gate rests on.
const box = await page.evaluate(() => {
  const o = document.querySelector('.object');
  const c = document.querySelector('#widget-mount canvas');
  const r = (e) => e ? {x:Math.round(e.getBoundingClientRect().x), y:Math.round(e.getBoundingClientRect().y+window.scrollY), w:Math.round(e.getBoundingClientRect().width), h:Math.round(e.getBoundingClientRect().height)} : null;
  return { object: r(o), canvas: r(c), objectCount: document.querySelectorAll('.object').length };
});
console.log('boxes:', JSON.stringify(box));
const canvas = page.locator('#widget-mount canvas').first();
await canvas.scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
// Element screenshots drift on a very tall page; clip absolute page coords instead.
const ob = box.object, cb = box.canvas;
await page.screenshot({ path: '/tmp/widget.png', fullPage: true,
  clip: { x: ob.x, y: ob.y - 8, width: ob.w, height: ob.h + 16 } });
await page.screenshot({ path: '/tmp/widget-canvas.png', fullPage: true,
  clip: { x: cb.x, y: cb.y, width: cb.w, height: cb.h } });

const diag = await page.evaluate(() => {
  const c = document.querySelector('#widget-mount canvas');
  const cs = getComputedStyle(c);
  const parent = c.parentElement;
  // is anything actually painted?
  const ctx = c.getContext('2d');
  let painted = 0, sample = null;
  try {
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    for (let i = 3; i < d.length; i += 4 * 97) if (d[i] !== 0) painted++;
    sample = [d[0], d[1], d[2], d[3]];
  } catch (e) { sample = 'blocked: ' + e.message; }
  return {
    attrWidth: c.width, attrHeight: c.height,
    cssWidth: cs.width, cssHeight: cs.height,
    styleAttr: c.getAttribute('style'),
    dpr: window.devicePixelRatio,
    parentTag: parent.tagName + '.' + parent.className,
    parentW: Math.round(parent.getBoundingClientRect().width),
    paintedSamples: painted, topLeftPixel: sample,
  };
});
const resp = await page.evaluate(() => {
  const root = document.querySelector('#widget-mount');
  const rw = root.getBoundingClientRect().width;
  const over = [];
  root.querySelectorAll('*').forEach((n) => {
    const r = n.getBoundingClientRect();
    if (r.width > rw + 1 || r.right > root.getBoundingClientRect().right + 1) {
      over.push({ tag: n.tagName, cls: (n.className||'').toString().slice(0,40), w: Math.round(r.width), scrollW: n.scrollWidth });
    }
  });
  // touch target audit
  const small = [];
  root.querySelectorAll('button,[role="button"],input,select,a').forEach((n) => {
    const r = n.getBoundingClientRect();
    if (r.height > 0 && (r.height < 44 || r.width < 44)) small.push({ t: (n.textContent||'').trim().slice(0,18), w: Math.round(r.width), h: Math.round(r.height) });
  });
  // A scroll row legitimately has children past its edge. What matters is whether the row
  // is actually SCROLLABLE (reachable) rather than clipped-and-unreachable.
  const rows = [];
  root.querySelectorAll('.gt-fb__selector,.gt-fb__chips,.gt-fb__row').forEach((n) => {
    const cs = getComputedStyle(n);
    rows.push({
      cls: n.className,
      clientW: n.clientWidth, scrollW: n.scrollWidth,
      overflowX: cs.overflowX,
      scrollable: n.scrollWidth > n.clientWidth + 1,
      reachable: n.scrollWidth > n.clientWidth + 1 ? (cs.overflowX === 'auto' || cs.overflowX === 'scroll') : true,
      withinRoot: Math.round(n.getBoundingClientRect().width) <= Math.round(rw) + 1,
    });
  });
  return { rootWidth: Math.round(rw), rows, tooSmall: small.slice(0,8), tooSmallCount: small.length };
});
console.log('RESPONSIVE:', JSON.stringify(resp, null, 2));
console.log('widget screenshot written');
console.log('describeState():', await page.evaluate(() => {
  const r = document.querySelector('[aria-live]');
  return r ? r.textContent.slice(0, 200) : '(empty)';
}));
console.log('mount fallback text:', (await mount.innerText()).slice(0, 120).replace(/\n/g, ' | '));

await browser.close(); server.close();
