// ONE eye engine: hero eye, footer eyes and the outro eye. Pupils follow the cursor on fine pointers
// (not under reduced motion). The outro eye closes when the end of the page is in view, on every device.
const fine = matchMedia('(pointer: fine)');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
type Eye = { svg: SVGSVGElement; ball: SVGGElement; range: number; x: number; y: number; vis: boolean };
const eyes: Eye[] = [...document.querySelectorAll<SVGSVGElement>('svg[data-eye]')].map(svg => ({
  svg, ball: svg.querySelector<SVGGElement>('[data-eye-ball]')!, range: Number(svg.dataset.range) || 14, x: 0, y: 0, vis: true,
}));

if (eyes.length) {
  const io = new IntersectionObserver(es => es.forEach(en => { const e = eyes.find(v => v.svg === en.target); if (e) e.vis = en.isIntersecting; }));
  eyes.forEach(e => io.observe(e.svg));

  let tx = innerWidth / 2, ty = innerHeight / 2, raf = 0;
  const enabled = () => fine.matches && !reduce.matches;
  const tick = () => {
    raf = 0; let moving = false;
    for (const e of eyes) {
      if (!e.vis) continue;
      const r = e.svg.getBoundingClientRect();
      if (!r.width) continue; // hidden (e.g. Clean mode)
      const dx = tx - (r.left + r.width / 2), dy = ty - (r.top + r.height / 2);
      const k = Math.min(1, Math.hypot(dx, dy) / (r.width * 1.1)), a = Math.atan2(dy, dx);
      const gx = Math.cos(a) * k * e.range, gy = Math.sin(a) * k * e.range * 0.5; // eyes are wider than tall
      e.x += (gx - e.x) * 0.18; e.y += (gy - e.y) * 0.18;
      e.ball.setAttribute('transform', `translate(${e.x.toFixed(2)} ${e.y.toFixed(2)})`);
      if (Math.abs(gx - e.x) > 0.05 || Math.abs(gy - e.y) > 0.05) moving = true;
    }
    if (moving) raf = requestAnimationFrame(tick);
  };
  addEventListener('pointermove', ev => {
    if (!enabled() || ev.pointerType === 'touch') return;
    tx = ev.clientX; ty = ev.clientY;
    if (!raf) raf = requestAnimationFrame(tick);
  }, { passive: true });
  // If tracking gets switched off (e.g. reduced motion toggled), return pupils to the center.
  const recenter = () => { if (!enabled()) eyes.forEach(e => { e.x = e.y = 0; e.ball.removeAttribute('transform'); }); };
  fine.addEventListener('change', recenter); reduce.addEventListener('change', recenter);
}

const end = document.getElementById('page-end');
const outros = document.querySelectorAll<SVGSVGElement>('svg[data-eye="outro"]');
if (end && outros.length && 'IntersectionObserver' in window) {
  new IntersectionObserver(es => es.forEach(en => outros.forEach(o => o.toggleAttribute('data-closed', en.isIntersecting))), { threshold: 0.1 }).observe(end);
}
