// public/img: JPG/WebP/PNG, max 1200px wide, under ~300 KB. Missing folder is fine (photos arrive later).
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
const DIR = process.argv[2] ?? 'public/img', MAX_KB = 300, MAX_W = 1200;
if (!existsSync(DIR)) { console.log('check-images: no public/img yet, skipped'); process.exit(0); }
const width = (f, b) => {
  if (b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return b.readUInt32BE(16);
  if (b[0] === 0xff && b[1] === 0xd8) { let i = 2; while (i < b.length) { if (b[i] !== 0xff) { i++; continue; } const m = b[i + 1]; if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return b.readUInt16BE(i + 7); i += 2 + b.readUInt16BE(i + 2); } }
  return null; // webp/svg: width not checked
};
let bad = 0;
for (const n of readdirSync(DIR)) {
  const f = join(DIR, n), kb = statSync(f).size / 1024, ext = extname(n).toLowerCase();
  if (!['.jpg', '.jpeg', '.webp', '.png', '.svg'].includes(ext)) { console.warn(`WARN ${n}: unexpected file type`); continue; }
  if (kb > MAX_KB) { console.error(`FAIL ${n}: ${kb.toFixed(0)} KB (max ${MAX_KB})`); bad++; }
  const w = width(f, readFileSync(f));
  if (w && w > MAX_W) { console.error(`FAIL ${n}: ${w}px wide (max ${MAX_W})`); bad++; }
}
if (bad) process.exit(1);
console.log('check-images: ok');
