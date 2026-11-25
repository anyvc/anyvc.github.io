// After the first deploy: node scripts/check-live.mjs [baseUrl] [expectedOrigin]
// Defaults to https://anyvc.github.io. The second argument only matters for local testing.
const base = (process.argv[2] ?? 'https://anyvc.github.io').replace(/\/$/, '');
const origin = (process.argv[3] ?? base).replace(/\/$/, '');
// Never die silently: report unexpected errors (network resets etc.) as a failure with a message.
process.on('uncaughtException', e => { console.error(`FAIL unexpected error: ${e.message}`); process.exit(1); });
process.on('unhandledRejection', e => { console.error(`FAIL unexpected error: ${e?.message ?? e}`); process.exit(1); });
let bad = 0; const fail = (u, m) => { console.error(`FAIL ${u}: ${m}`); bad++; };
const meta = (h, a, k) => (h.match(new RegExp(`<meta[^>]*${a}="${k}"[^>]*content="([^"]*)"`, 'i')) || h.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${a}="${k}"`, 'i')))?.[1];
const get = async path => { try { return await fetch(base + path, { redirect: 'follow' }); } catch (e) { fail(path, `request failed: ${e.message}`); return null; } };

const sm = await get('/sitemap.xml');
const paths = sm?.ok ? [...(await sm.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname) : (fail('/sitemap.xml', 'not reachable'), ['/']);
let pngChecked = false;
for (const path of paths) {
  const r = await get(path); if (!r) continue;
  if (r.status !== 200) { fail(path, `status ${r.status}`); continue; }
  const h = await r.text();
  for (const k of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image', 'og:image:alt']) if (!meta(h, 'property', k)) fail(path, `missing ${k}`);
  if (meta(h, 'name', 'twitter:card') !== 'summary_large_image') fail(path, 'twitter:card');
  const url = meta(h, 'property', 'og:url'), img = meta(h, 'property', 'og:image'), canon = h.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/)?.[1];
  if (url !== origin + path) fail(path, `og:url is ${url}, expected ${origin + path}`);
  if (canon !== url) fail(path, `canonical (${canon}) differs from og:url (${url})`);
  if (img && !img.startsWith(origin + '/')) fail(path, `og:image not absolute on ${origin}: ${img}`);
  if (!pngChecked && img) {
    pngChecked = true;
    const ir = await get(new URL(img).pathname);
    if (ir) { const b = Buffer.from(await ir.arrayBuffer());
      if (!ir.ok || !/image\/png/.test(ir.headers.get('content-type') ?? '')) fail(img, `status ${ir.status}, type ${ir.headers.get('content-type')}`);
      else if (b.readUInt32BE(16) !== 1200 || b.readUInt32BE(20) !== 630) fail(img, `size ${b.readUInt32BE(16)}x${b.readUInt32BE(20)}, expected 1200x630`); }
  }
}
for (const [path, type] of [['/robots.txt', /text/], ['/favicon.svg', /svg/], ['/CV_Rayn_Hanash_Fasya.pdf', /pdf/]]) {
  const r = await get(path); if (r && (!r.ok || !type.test(r.headers.get('content-type') ?? ''))) fail(path, `status ${r.status}, type ${r.headers.get('content-type')}`);
}
const nf = await get('/definitely-not-a-page/'); if (nf && nf.status !== 404) fail('/definitely-not-a-page/', `expected 404, got ${nf.status}`);
if (bad) process.exit(1);
console.log(`check-live: ${paths.length} pages, assets and 404 ok on ${base}`);
console.log('Manual last step: paste the home URL into the LinkedIn Post Inspector and check title, description and image.');
