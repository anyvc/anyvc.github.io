// Watcher Mode visual layer effects:
// 1. One-time boot log splash (once per session, dismissed by any interaction or 2.5s)
// 2. Section heading redaction-bar swipe reveal (h2.rvj -> h2.rvd)
// 3. Dove flock + staggered reveal on #case
// 4. Hand-pull slide-in reveal on #about
// All automatically skipped in Clean View or under prefers-reduced-motion.
const root = document.documentElement;
const off = () => root.dataset.mode === 'clean' || matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!off()) {
  // 1. Heading redaction reveal
  try {
    const hs = [...document.querySelectorAll<HTMLElement>('main section > .w-wrap > h2, footer#contact .w-only-watcher h2')];
    hs.forEach(h => h.classList.add('rvj'));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => {
        es.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('rvd');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.6 });
      hs.forEach(h => io.observe(h));
    } else {
      hs.forEach(h => h.classList.add('rvd'));
    }
  } catch { /* non-fatal */ }

  // 2. One-time boot log splash (home page only)
  if (document.getElementById('top')) {
    try {
      let seen: string | null = null;
      try { seen = sessionStorage.getItem('boot'); } catch { /* ignore */ }
      if (!seen) {
        try { sessionStorage.setItem('boot', '1'); } catch { /* ignore */ }
        const b = document.createElement('div');
        b.id = 'boot';
        b.setAttribute('aria-hidden', 'true');
        document.body.appendChild(b);
        const lines = [
          '4625 logon failure x8',
          'rule 60204 level 10',
          'T1110 detected',
          'T1082 not detected',
          'T1547.001 not detected',
          '3 tests did not run',
          'watching',
        ];
        let i = 0;
        let gone = false;
        const done = () => {
          if (gone) return;
          gone = true;
          clearInterval(timer);
          b.classList.add('out');
          setTimeout(() => b.remove(), 500);
        };
        const timer = setInterval(() => {
          if (i < lines.length) {
            const d = document.createElement('div');
            d.textContent = lines[i++];
            b.appendChild(d);
          } else {
            setTimeout(done, 250);
          }
        }, 110);
        (['click', 'keydown', 'pointerdown', 'wheel', 'touchstart'] as const).forEach(ev =>
          addEventListener(ev, done, { once: true, passive: true }),
        );
        setTimeout(done, 2500);
      }
    } catch { /* non-fatal */ }
  }

  // 3. Dove flock fly-across & card reveal on #case
  const cs = document.getElementById('case');
  if (cs && 'IntersectionObserver' in window) {
    cs.classList.add('rv');
    new IntersectionObserver((es, o) => {
      if (es.some(e => e.isIntersecting)) {
        cs.classList.add('go');
        o.disconnect();
      }
    }, { threshold: 0, rootMargin: '0px 0px -25% 0px' }).observe(cs);
  }

  // 4. Hand-pull reveal on #about
  const as = document.getElementById('about');
  if (as && 'IntersectionObserver' in window) {
    as.classList.add('rv2');
    new IntersectionObserver((es, o) => {
      if (es.some(e => e.isIntersecting)) {
        as.classList.add('go2');
        o.disconnect();
      }
    }, { threshold: 0, rootMargin: '0px 0px -25% 0px' }).observe(as);
  }
}
