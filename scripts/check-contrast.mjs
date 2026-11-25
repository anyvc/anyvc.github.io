// Verifies token pairs meet WCAG AA (4.5:1 body/small text, 3:1 large/decorative) and both modes define the same keys.
import { watcher } from '../src/styles/tokens/watcher.ts';
import { clean } from '../src/styles/tokens/clean.ts';
const hex = c => { const m = /^#([0-9a-f]{6})$/i.exec(c); if (!m) return null; const n = parseInt(m[1], 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
const ratio = (a, b) => { const [x, y] = [lum(hex(a)), lum(hex(b))].sort((p, q) => q - p); return (x + .05) / (y + .05); };
const pairs = [['text', 'bg', 4.5], ['text', 'surface', 4.5], ['muted', 'bg', 4.5], ['muted', 'surface', 4.5],
  ['accentText', 'bg', 4.5], ['accentText', 'surface', 4.5], ['onAccent', 'accent', 'onAccent'], ['accent', 'bg', 3],
  ['status.d', 'surface', 3], ['status.m', 'surface', 3], ['status.f', 'surface', 3], ['status.n', 'surface', 3], ['status.slash', 'status.eyeFill', 3], ['deco.bandText', 'color.tint', 3], ['deco.bandText', 'deco.bandOne', 3]];
const pick = (t, k) => (k.includes('.') ? t[k.split('.')[0]][k.split('.')[1]] : t.color[k]);
let bad = 0;
const keys = o => Object.entries(o).flatMap(([g, v]) => Object.keys(v).map(k => `${g}.${k}`)).sort().join();
if (keys(watcher) !== keys(clean)) { console.error('Token key mismatch between watcher and clean'); bad++; }
for (const [name, t] of [['watcher', watcher], ['clean', clean]]) for (const [fg, bg, rule] of pairs) {
  if (fg.startsWith('deco.') && name === 'clean') continue; // decorative band colors belong to the Watcher-only marquee
  // Watcher red (#e10600) is ~4.1:1 against both near-black and bone: text on a red fill is large/bold only (3:1).
  const min = rule === 'onAccent' ? (name === 'watcher' ? 3 : 4.5) : rule;
  const r = ratio(pick(t, fg), pick(t, bg)); const ok = r >= min;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name.padEnd(7)} ${fg} on ${bg}: ${r.toFixed(2)} (min ${min})`); if (!ok) bad++;
}
if (bad) process.exit(1);
