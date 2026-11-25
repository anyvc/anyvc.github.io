// Runs after `astro build`: verifies share tags on every built page. Usage: node scripts/check-seo.mjs [distDir]
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
const DIST = process.argv[2] ?? 'dist', ORIGIN = 'https://anyvc.github.io';
const walk = d => readdirSync(d).flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const pages = walk(DIST).filter(f => f.endsWith('.html'));
let bad = 0; const fail = (f, m) => { console.error(`FAIL ${f}: ${m}`); bad++; };
const meta = (h, attr, key) => { const m = h.match(new RegExp(`<meta[^>]*${attr}="${key}"[^>]*content="([^"]*)"`, 'i')) || h.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${key}"`, 'i')); return m?.[1]; };
for (const f of pages) {
  const h = readFileSync(f, 'utf8'), is404 = f.endsWith('404.html');
  if (!/<title>[^<]+<\/title>/.test(h)) fail(f, 'missing <title>');
  if (!meta(h, 'name', 'description')) fail(f, 'missing meta description');
  for (const k of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image', 'og:image:alt']) if (!meta(h, 'property', k)) fail(f, `missing ${k}`);
  if (meta(h, 'name', 'twitter:card') !== 'summary_large_image') fail(f, 'twitter:card must be summary_large_image');
  const ogurl = meta(h, 'property', 'og:url'), ogimg = meta(h, 'property', 'og:image');
  for (const [k, v] of [['og:url', ogurl], ['og:image', ogimg]]) if (v && !v.startsWith(ORIGIN + '/')) fail(f, `${k} is not an absolute ${ORIGIN} URL: ${v}`);
  if (/localhost|127\.0\.0\.1/.test(h)) fail(f, 'contains localhost');
  const canon = h.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/)?.[1];
  if (!is404 && canon !== ogurl) fail(f, `canonical (${canon}) differs from og:url (${ogurl})`);
  if (ogimg?.startsWith(ORIGIN) && !existsSync(join(DIST, ogimg.slice(ORIGIN.length)))) fail(f, `og:image file missing in dist: ${ogimg}`);
  if (f === join(DIST, 'index.html')) {
    if (!/rel="preload"[^>]*as="font"|as="font"[^>]*rel="preload"/.test(h)) console.warn('WARN index.html: no font preload emitted (non-fatal; tell the developer)');
    const ld = h.match(/<script type="application\/ld\+json">([^<]*)<\/script>/)?.[1];
    try { JSON.parse(ld ?? ''); } catch { fail(f, 'JSON-LD missing or invalid'); }
  }
}
const og = join(DIST, 'og.png');
if (existsSync(og)) { const b = readFileSync(og); const [w, hh] = [b.readUInt32BE(16), b.readUInt32BE(20)]; if (w !== 1200 || hh !== 630) fail(og, `og.png is ${w}x${hh}, expected 1200x630`); }
if (!existsSync(join(DIST, 'sitemap.xml')) || !existsSync(join(DIST, 'robots.txt'))) fail(DIST, 'sitemap.xml or robots.txt missing');
if (bad) process.exit(1);
console.log(`check-seo: ${pages.length} pages ok`);
