// Deterministic SVG generators for Watcher Mode anatomical eyes and halftone illustrations.
// Built once on the server/build step so there is zero client-side layout shift.
export const EYE_PATH = 'M2 20Q40-2 78 20Q40 42 2 20Z';

export const SHARED_EYE_DEFS = `<svg width="0" height="0" style="position:absolute;pointer-events:none" aria-hidden="true"><defs>
<clipPath id="alm"><path d="${EYE_PATH}"/></clipPath>
<radialGradient id="scl" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#f6eee8"/><stop offset=".55" stop-color="#e6d3ca"/><stop offset=".85" stop-color="#bf9089"/><stop offset="1" stop-color="#6e403b"/></radialGradient>
<linearGradient id="shd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".85"/><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#300" stop-opacity=".25"/></linearGradient>
<radialGradient id="irs"><stop offset="0" stop-color="#ff6a3d"/><stop offset=".55" stop-color="#d1130a"/><stop offset=".88" stop-color="#6a0300"/><stop offset="1" stop-color="#1a0000"/></radialGradient>
<linearGradient id="lidg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#100000"/><stop offset="1" stop-color="#4a0b08"/></linearGradient>
<radialGradient id="skn"><stop offset="0" stop-color="#4a120c"/><stop offset=".6" stop-color="#2c0a07" stop-opacity=".85"/><stop offset="1" stop-color="#2c0a07" stop-opacity="0"/></radialGradient>
<radialGradient id="car" cx=".4" cy=".4"><stop offset="0" stop-color="#e98a7c"/><stop offset="1" stop-color="#8e2f27" stop-opacity=".2"/></radialGradient>
<filter id="bl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation=".35"/></filter>
<pattern id="dotk" width="3.5" height="3.5" patternUnits="userSpaceOnUse"><circle cx="1.75" cy="1.75" r=".8" fill="#2a1a14"/></pattern>
<pattern id="dotr" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".9" fill="#3a0000"/></pattern>
<pattern id="ht" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.7" fill="#000" fill-opacity=".5"/></pattern>
</defs></svg>`;

// Precompute procedural fibers, lashes, and scleral blood vessels with fixed seed.
const EYE_PARTS = (() => {
  let f = '';
  let l = '';
  let z = 11;
  const r = () => (z = (z * 9301 + 49297) % 233280) / 233280;

  for (let i = 0; i < 110; i++) {
    const a = (i / 110) * 6.2832;
    const r1 = 4.9 + r() * 1.2;
    const r2 = r1 + 2.2 + r() * 4.4;
    const c = Math.cos(a);
    const n = Math.sin(a);
    const lt = i % 3 === 0;
    f += `<path d='M${(40 + c * r1).toFixed(2)} ${(20 + n * r1).toFixed(2)}L${(40 + c * r2).toFixed(2)} ${(20 + n * r2).toFixed(2)}' stroke='${lt ? '#ffb48c' : '#2a0000'}' stroke-opacity='${lt ? 0.34 : 0.42}' stroke-width='${(0.12 + r() * 0.18).toFixed(2)}'/>`;
  }

  for (let i = 1; i < 18; i++) {
    const t = i / 18;
    const x = 2 + 76 * t;
    const y = 20 * (1 - t) ** 2 - 4 * (1 - t) * t + 20 * t * t;
    const vx = x - 40;
    const vy = y - 28;
    const m = Math.hypot(vx, vy);
    const L = 2.2 + r() * 1.6;
    const dx = (vx / m) * L;
    const dy = (vy / m) * L;
    l += `<path d='M${x.toFixed(1)} ${y.toFixed(1)}q${(dx * 0.4 + (t < 0.5 ? -0.5 : 0.5)).toFixed(1)} ${(dy * 0.6).toFixed(1)} ${dx.toFixed(1)} ${dy.toFixed(1)}'/>`;
  }

  let v = '';
  const sm = (p: [number, number][]) => {
    let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
    for (let i = 1; i < p.length - 1; i++) {
      d += `Q${p[i][0].toFixed(1)} ${p[i][1].toFixed(1)} ${((p[i][0] + p[i + 1][0]) / 2).toFixed(1)} ${((p[i][1] + p[i + 1][1]) / 2).toFixed(1)}`;
    }
    return d;
  };
  const pa = (d: string, w: number, o: number) => `<path d='${d}' stroke-width='${w}' stroke-opacity='${o}'/>`;

  for (const sd of [-1, 1]) {
    for (let k = 0; k < 6; k++) {
      let x = sd < 0 ? 2.5 + r() * 4 : 77.5 - r() * 4;
      let y = 16 + r() * 10;
      let a = (sd < 0 ? 0 : Math.PI) + (r() - 0.5) * 1.2;
      const p: [number, number][] = [[x, y]];
      const L = 9 + r() * 10;
      for (let j = 0; j < 7; j++) {
        a += (r() - 0.5) * 0.95;
        x += (Math.cos(a) * L) / 7;
        y += (Math.sin(a) * L) / 7;
        p.push([x, y]);
      }
      v += pa(sm(p.slice(0, 4)), 0.34, 0.55) + pa(sm(p.slice(2, 6)), 0.24, 0.42) + pa(sm(p.slice(4)), 0.14, 0.28);
      for (let b = 0; b < 2; b++) {
        const i = 1 + Math.floor(r() * 4);
        let bx = p[i][0];
        let by = p[i][1];
        let ba = a + (r() < 0.5 ? -1 : 1) * (0.5 + r() * 0.6);
        const q: [number, number][] = [[bx, by]];
        for (let j = 0; j < 4; j++) {
          ba += (r() - 0.5) * 0.8;
          bx += Math.cos(ba) * (1 + r() * 1.3);
          by += Math.sin(ba) * (1 + r() * 1.3);
          q.push([bx, by]);
        }
        v += pa(sm(q), 0.13, 0.34);
      }
    }
  }
  v = `<g fill='none' stroke='#a8191a' stroke-linecap='round'>${v}</g>`;
  return { f, l, v };
})();

export function eyeInner(id = ''): string {
  const g = EYE_PARTS;
  return `<ellipse cx='40' cy='20' rx='50' ry='29' fill='url(#skn)'/><path d='${EYE_PATH}' fill='url(#scl)'/><g clip-path='url(#alm)'>${g.v}<ellipse cx='6' cy='21' rx='4.2' ry='3' fill='url(#car)'/>
<g class='pu'${id ? ` id='${id}'` : ''}><circle cx='40' cy='20' r='12.5' fill='url(#irs)'/>${g.f}<circle cx='40' cy='20' r='7.2' fill='none' stroke='#ffa07a' stroke-opacity='.28' stroke-width='.7' stroke-dasharray='1.2 .5'/><ellipse cx='45.5' cy='15.5' rx='1.3' ry='.8' fill='#2a0000' fill-opacity='.4'/><ellipse cx='34.5' cy='24.5' rx='1.1' ry='.7' fill='#2a0000' fill-opacity='.35'/><ellipse cx='46' cy='24' rx='.9' ry='1.2' fill='#2a0000' fill-opacity='.35'/><circle cx='40' cy='20' r='12.1' fill='none' stroke='#0a0000' stroke-opacity='.85' stroke-width='1.5'/><path d='M33 25Q40 31 47 25' fill='none' stroke='#ffb090' stroke-opacity='.25' stroke-width='1.2' filter='url(#bl)'/><circle cx='40' cy='20' r='4.4' fill='#030000' stroke='#2a0806' stroke-width='.35'/><rect x='33.6' y='13.4' width='4.4' height='3.4' rx='1' fill='#fff' fill-opacity='.92' filter='url(#bl)'/><circle cx='44.6' cy='24.2' r='.75' fill='#fff' fill-opacity='.55'/></g>
<path d='M9 22.5Q40 38 71 22.5' fill='none' stroke='#fff' stroke-opacity='.3' stroke-width='.55'/><rect width='80' height='40' fill='url(#shd)'/><g class='lid'><path d='M-2 -40H82V3Q40 12-2 3Z' fill='url(#lidg)'/><path d='M-2 3Q40 12 82 3' fill='none' stroke='#000' stroke-width='1.6'/></g></g><path d='${EYE_PATH}' fill='none' stroke='#000' stroke-width='1.5'/><path d='M4 14Q40-8 76 14' fill='none' stroke='#5a0805' stroke-width='.8' stroke-opacity='.8'/><path d='M10 29Q40 44 70 29' fill='none' stroke='#3a0805' stroke-width='.6' stroke-opacity='.6'/><g fill='none' stroke='#000' stroke-linecap='round' stroke-width='.55'>${g.l}</g>`;
}

export function spikes(n: number, a: number, b: number): string {
  let p = '';
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? a : b;
    const t = (i * Math.PI) / n;
    p += `${(r * Math.cos(t)).toFixed(1)},${(r * Math.sin(t)).toFixed(1)} `;
  }
  return p.trim();
}

export function heroEyeInner(): string {
  return `<g id="rings"><circle r="190" fill="none" stroke="#e10600" stroke-opacity=".4"/><circle r="150" fill="none" stroke="#e10600" stroke-opacity=".3" stroke-dasharray="2 6"/><path d="M0-198v18M0 180v18M-198 0h18M180 0h18" stroke="#e10600" stroke-width="2"/></g><g class="blink"><g id="sun"><polygon points="${spikes(48, 112, 178)}" fill="#e10600"/><circle r="104" fill="#e10600" fill-opacity=".4"/><circle r="104" fill="url(#ht)"/></g><g id="ball"><g transform="translate(-170 -85) scale(4.25)">${eyeInner('piv')}</g></g></g>`;
}

export function coverageEyeSvg(status: string): string {
  if (status === 'n') {
    return `<svg class="cov-eye" viewBox="0 0 80 40" aria-hidden="true" focusable="false"><path d="${EYE_PATH}" fill="none" stroke="#777" stroke-dasharray="3 3"/></svg>`;
  }
  const overlay =
    status === 'm'
      ? '<path d="M8 38L72 2" stroke="#fff" stroke-width="4.5"/>'
      : status === 'f'
        ? '<path d="M26 8l28 24M54 8L26 32" stroke="#f2a550" stroke-width="4.5"/>'
        : '';
  return `<svg class="cov-eye${status === 'f' ? ' shut' : ''}" viewBox="0 0 80 40" aria-hidden="true" focusable="false">${eyeInner()}${overlay}</svg>`;
}

const INK = `stroke='#0a0000' stroke-linejoin='round' stroke-linecap='round'`;

export const MASK_SVG = `<svg class='mask' viewBox='0 0 100 120' aria-hidden='true'><g ${INK} stroke-width='2.4'><path d='M50 6C26 6 12 24 14 52C16 80 32 112 50 114C68 112 84 80 86 52C88 24 74 6 50 6Z' fill='#efe7de'/><path d='M50 6C74 6 88 24 86 52C84 80 68 112 50 114Z' fill='url(#dotk)' stroke='none'/><path d='M50 6C26 6 12 24 14 52C16 80 32 112 50 114C68 112 84 80 86 52C88 24 74 6 50 6Z' fill='none'/><path d='M24 46Q34 38 44 46Q34 53 24 46Z' fill='#0a0000' stroke-width='1.4'/><path d='M56 46Q66 38 76 46Q66 53 56 46Z' fill='#0a0000' stroke-width='1.4'/><path d='M21 37Q33 29 46 37M54 37Q67 29 79 37' fill='none' stroke-width='1.6'/><path d='M50 52V70M45 72Q50 77 55 72' fill='none' stroke-width='1.6'/><path d='M33 88Q50 99 67 88' fill='none' stroke-width='2'/><path d='M38 91v7M44 94v7M50 95v7M56 94v7M62 91v7' fill='none' stroke-width='1.2'/><path d='M64 8L59 22L65 31L60 42' fill='none' stroke-width='1.2'/></g><g fill='none' stroke='#e10600' stroke-width='3.2' stroke-linecap='round'><path d='M34 50C33 62 37 72 33 86'/><path d='M66 50C67 60 63 78 67 98'/></g><circle cx='33' cy='90' r='2.8' fill='#e10600'/><circle cx='67' cy='102' r='2.8' fill='#e10600'/></svg>`;

export const ROSE_SVG = `<svg viewBox='0 0 100 120' aria-hidden='true'><g ${INK}><path d='M50 66V118' stroke-width='3.2' fill='none'/><path d='M50 100C34 94 22 98 15 110C30 116 44 112 50 100Z' fill='#3a0808' stroke='#8a1212' stroke-width='1.6'/><path d='M50 90C66 82 80 86 86 98C70 104 58 100 50 90Z' fill='#3a0808' stroke='#8a1212' stroke-width='1.6'/><path d='M50 108l-6-4M50 98l7-3' stroke-width='1.4' fill='none'/>${[0, 72, 144, 216, 288].map(a => `<circle cx='50' cy='27' r='24' fill='#8e0a0a' stroke-width='1.8' transform='rotate(${a} 50 50)'/>`).join('')}<circle cx='50' cy='50' r='40' fill='url(#dotr)' stroke='none'/>${[36, 108, 180, 252, 324].map(a => `<circle cx='50' cy='36' r='19' fill='#b80d0d' stroke-width='1.6' transform='rotate(${a} 50 50)'/>`).join('')}${[0, 72, 144, 216, 288].map(a => `<circle cx='50' cy='43' r='13' fill='#d41616' stroke-width='1.4' transform='rotate(${a} 50 50)'/>`).join('')}<g fill='none' stroke='#ff8a7a' stroke-opacity='.55' stroke-width='1.2'>${[0, 72, 144, 216, 288].map(a => `<path d='M36 22Q44 14 54 16' transform='rotate(${a} 50 50)'/>`).join('')}</g></g><g transform='translate(30 40) scale(.5)'>${eyeInner()}</g><path d='M44 58c-1 8 2 12 0 18' stroke='#e10600' stroke-width='2.2' fill='none' stroke-linecap='round'/><circle cx='44' cy='79' r='2.3' fill='#e10600'/></svg>`;

const fg = (x: number, y: number, l: number, w: number, rot: number) =>
  `<g transform='translate(${x} ${y}) rotate(${rot})'><path d='M${-w / 2} 0L${-w * 0.42} ${-l + w * 0.4}Q0 ${-l - w * 0.3} ${w * 0.42} ${-l + w * 0.4}L${w / 2} 0Z' fill='#efe7de'/><path d='M${-w * 0.3} ${-l * 0.4}h${w * 0.6}M${-w * 0.28} ${-l * 0.68}h${w * 0.56}' fill='none' stroke-width='1' stroke-opacity='.6'/></g>`;

export const HAND_SVG = `<svg viewBox='-14 0 134 160' aria-hidden='true'><g ${INK} stroke-width='1.8'>${fg(28, 114, 40, 16, -58)}${fg(43, 98, 52, 15.5, -13)}${fg(58, 93, 58, 16, -3)}${fg(73, 95, 54, 15.5, 7)}${fg(86, 102, 42, 13.5, 18)}<path d='M32 100C28 120 40 134 60 134C80 134 92 120 88 98L86 92C80 96 40 96 34 92Z' fill='#efe7de'/><path d='M60 90C78 92 90 108 88 124C84 134 70 136 60 134Z' fill='url(#dotk)' stroke='none' opacity='.55'/><path d='M40 130L32 160H90L80 130Z' fill='#050202'/><path d='M38 140H84' stroke='#e10600' stroke-width='2'/></g><g transform='translate(46 100) scale(.3)'>${eyeInner()}</g><path d='M60 112c-1 6 1 9 0 13' stroke='#e10600' stroke-width='2' fill='none' stroke-linecap='round'/><circle cx='60' cy='127' r='2' fill='#e10600'/></svg>`;

const DOVE_BODY = `<g ${INK} stroke-width='1.6'><g transform='translate(66 54) scale(.86)'>${[-72, -54, -36, -18].map(a => `<ellipse cx='0' cy='-24' rx='6' ry='24' fill='#cfc4b8' transform='rotate(${a})'/>`).join('')}</g><path d='M20 58C30 50 52 50 70 44C80 40 88 40 94 44C90 52 80 58 70 62C56 70 34 70 20 58Z' fill='#efe7de'/><path d='M30 60C44 64 60 62 74 54C70 60 62 66 50 66C42 66 34 64 30 60Z' fill='url(#dotk)' stroke='none' opacity='.6'/><path d='M20 58L4 66L9 57L2 52L17 52Z' fill='#efe7de'/><g transform='translate(58 52)'><g class='wf'>${[-70, -52, -34, -16, 2].map(a => `<ellipse cx='0' cy='-26' rx='6.5' ry='26' fill='#efe7de' transform='rotate(${a})'/>`).join('')}</g></g><circle cx='92' cy='43' r='7.5' fill='#efe7de'/><path d='M98 42L109 45.5L98 48Z' fill='#0a0000'/><circle cx='93.5' cy='41' r='1.4' fill='#0a0000' stroke='none'/></g>`;

const FLOCK_SPEC: [number, number, number, number, number, number][] = [
  [120, 1, 3.4, 0, -30, 10],
  [260, 0.7, 3, 0.25, 20, -20],
  [380, 0.85, 3.8, 0.1, -40, -60],
  [60, 0.55, 3.2, 0.5, 30, 50],
  [480, 0.6, 3.6, 0.35, -10, -30],
];

export const DOVE_FLOCK_HTML = `<div class='flock w-only-watcher' aria-hidden='true'>${FLOCK_SPEC.map(
  ([t, s, d, l, a, b]) =>
    `<div class='fd' style='top:${t}px;--s:${s};--t:${d}s;--d:${l}s;--y2:${a}px;--y3:${b}px'><svg viewBox='0 -8 120 98'>${DOVE_BODY}</svg></div>`,
).join('')}</div>`;

export const SILHOUETTE_SVG = `<svg class="about-sil" viewBox="0 0 200 200" role="img" aria-label="Silhouette portrait placeholder"><rect width="200" height="200" fill="#8a0000"/><rect width="200" height="200" fill="url(#about-dots)"/><defs><pattern id="about-dots" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#2a0000"/></pattern></defs><path d="M30 200c0-50 30-70 70-70s70 20 70 70z M50 80c0-40 25-60 50-60s52 20 52 60c0 30-20 55-52 55S50 110 50 80z" fill="#050202"/><g fill="none" stroke="#e10600" stroke-width="2"><circle cx="100" cy="62" r="13"/><path d="M100 44v36M82 62h36"/></g><g transform="translate(74 90) scale(.3)">${eyeInner()}</g><g transform="translate(102 90) scale(.3)">${eyeInner()}</g></svg>`;

export function heroLogRows(): { text: string; dur: number; rev: boolean }[] {
  const words = ['4625', 'T1110', '???', '60204', 'lvl10', '??', 'T1082', 'T1547.001', 'T1003.001', 'T1059.001', 'T1070.001'];
  let z = 7;
  const rows: { text: string; dur: number; rev: boolean }[] = [];
  for (let r = 0; r < 46; r++) {
    let t = '';
    for (let i = 0; i < 60; i++) {
      z = (z * 9301 + 49297) % 233280;
      t += words[z % words.length] + '   ';
    }
    rows.push({ text: t + t, dur: 50 + (z % 60), rev: r % 2 === 1 });
  }
  return rows;
}
