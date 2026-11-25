// Custom crosshair reticle with coordinate/status readout inside the hero (Watcher mode, fine mouse pointers).
const ret = document.getElementById('ret');
const rl = ret?.querySelector('b');
const root = document.documentElement;

if (ret && rl && matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  addEventListener('pointermove', e => {
    if (root.dataset.mode === 'clean') {
      ret.style.opacity = '0';
      return;
    }
    const t = (e.target instanceof Element ? e.target : (e.target as Node)?.parentElement) as HTMLElement | null;
    const inH = !!t?.closest('.hero');
    const c = t?.closest('.cov-card');
    const a = t?.closest('a, button, summary');
    ret.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    ret.classList.toggle('lock', !!(c || a));
    rl.textContent = c
      ? (c.querySelector('.st')?.textContent ?? '')
      : a
        ? 'open'
        : `${Math.round(e.clientX)} / ${Math.round(e.clientY)}`;
    ret.style.opacity = e.pointerType === 'mouse' && inH && !a ? '1' : '0';
  }, { passive: true });

  document.documentElement.addEventListener('pointerleave', () => {
    ret.style.opacity = '0';
  });
}
