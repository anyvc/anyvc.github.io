// Anatomical Watcher eye engine:
// - Hero eye (#heye): pointer tracking (#piv), sun/ball spring parallax, idle look-around, scroll parallax.
// - Coverage + scattered footer eyes: pointer tracking (.pu) and natural random blinks (.lid).
// - Outro eye (#oeye): eyelid closes smoothly as scroll approaches the end of the page.
// - Footer scattered eyes (#eyes): placed avoiding text blocks, breathing & blinking independently.
const root = document.documentElement;
const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isClean = () => root.dataset.mode === 'clean';

// 1. Hero eye tracking + spring parallax + scroll fade
const heye = document.getElementById('heye');
const piv = document.getElementById('piv');
const sun = document.getElementById('sun');
const ball = document.getElementById('ball');

if (heye && piv && sun && ball) {
  let tx = 0;
  let ty = 0;
  let sx = 0;
  let sy = 0;
  let lm = 0;

  addEventListener('pointermove', e => {
    if (isClean()) return;
    lm = Date.now();
    tx = e.clientX / innerWidth - 0.5;
    ty = e.clientY / innerHeight - 0.5;
    const r = heye.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const a = Math.atan2(e.clientY - cy, e.clientX - cx);
    const d = Math.min(4.5, Math.hypot(e.clientX - cx, e.clientY - cy) / 90);
    piv.style.transform = `translate(${Math.cos(a) * d}px,${Math.sin(a) * d * 0.5}px)`;
  }, { passive: true });

  if (!rm) {
    setInterval(() => {
      if (isClean() || Date.now() - lm <= 2500) return;
      piv.style.transform = `translate(${(Math.random() - 0.5) * 8}px,${(Math.random() - 0.5) * 3}px)`;
      tx = (Math.random() - 0.5) * 0.5;
      ty = (Math.random() - 0.5) * 0.4;
    }, 1700);

    (function loop() {
      sx += (tx - sx) * 0.07;
      sy += (ty - sy) * 0.07;
      if (!isClean()) {
        ball.style.transform = `translate(${sx * 70}px,${sy * 44}px) rotate(${sx * 6}deg)`;
        sun.style.transform = `translate(${-sx * 40}px,${-sy * 26}px) rotate(${-sx * 4}deg)`;
      }
      requestAnimationFrame(loop);
    })();

    addEventListener('scroll', () => {
      if (isClean()) return;
      const y = Math.min(scrollY, innerHeight);
      const p = y / innerHeight;
      heye.style.transform = `translateY(calc(-50% + ${y * 0.18}px)) scale(${1 + p * 0.12})`;
      heye.style.opacity = String(Math.max(0.15, 0.95 - p * 0.9));
    }, { passive: true });
  }
}

// 2. Coverage & footer eyes follow pointer
if (!rm) {
  addEventListener('pointermove', e => {
    if (isClean() || e.pointerType === 'touch') return;
    document.querySelectorAll<SVGSVGElement>('.cov-card svg, #eyes svg, .about-sil').forEach(v => {
      const r = v.getBoundingClientRect();
      if (!r.width || r.bottom < 0 || r.top > innerHeight) return;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const a = Math.atan2(dy, dx);
      const d = Math.min(5, Math.hypot(dx, dy) / 60);
      v.querySelectorAll<SVGGElement>('.pu').forEach(p => {
        p.style.transform = `translate(${Math.cos(a) * d}px,${Math.sin(a) * d * 0.5}px)`;
      });
    });
  }, { passive: true });
}

// 3. Random blinks on eyelids (excluding outro and scattered footer eyes which manage their own lid)
if (!rm) {
  const blinkLoop = (l: Element) => {
    setTimeout(() => {
      if (!l.closest('.shut') && !isClean()) {
        const go = () => {
          l.classList.remove('b');
          void (l as HTMLElement).getBoundingClientRect();
          l.classList.add('b');
        };
        go();
        if (Math.random() < 0.2) setTimeout(go, 330);
      }
      blinkLoop(l);
    }, 3200 + Math.random() * 6000);
  };
  document.querySelectorAll('.lid').forEach(l => {
    if (l.closest('#oeye') || l.closest('#eyes')) return;
    blinkLoop(l);
  });
}

// 4. Outro eye smoothly closes at page bottom
const oeye = document.getElementById('oeye');
const ocap = document.getElementById('ocap');
const olid = oeye?.querySelector<SVGGElement>('.lid');
if (olid && ocap) {
  const updateOutro = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    const p = h > 0 ? scrollY / h : 0;
    const t = Math.min(1, Math.max(0, (p - 0.9) / 0.09));
    olid.style.transform = `translateY(${t * 31}px)`;
    ocap.textContent = t > 0.95 ? 'end of log. eyes closed.' : 'still watching';
  };
  addEventListener('scroll', updateOutro, { passive: true });
  updateOutro();
}

// 5. Scattered blinking/breathing eyes in the Contact footer (Watcher only)
const ey = document.getElementById('eyes');
if (ey) {
  const rnd = (a: number, b: number) => a + Math.random() * (b - a);
  const SH = 'translateY(31px)';
  type Box = { left: number; right: number; top: number; bottom: number };

  const avoidBoxes = (): Box[] =>
    ['#contact .box', '#contact .w-only-watcher h2', '#contact .w-sub', '#oeye', '#ocap', '.outro a']
      .map(s => document.querySelector(s))
      .filter((e): e is Element => !!e)
      .map(e => e.getBoundingClientRect())
      .filter(r => r.width > 0 && r.height > 0);

  const overlaps = (a: Box, b: Box, pad: number) =>
    !(a.right + pad < b.left || a.left - pad > b.right || a.bottom + pad < b.top || a.top - pad > b.bottom);

  const placeOne = (w: HTMLElement, extraBoxes: Box[] = []): Box | null => {
    if (isClean()) return null;
    const er = ey.getBoundingClientRect();
    if (er.width < 120 || er.height < 120) return null;
    const av = avoidBoxes();
    const others: Box[] = extraBoxes.length
      ? extraBoxes
      : [...ey.children]
          .filter(o => o !== w && parseFloat(getComputedStyle(o).opacity) > 0.03)
          .map(o => o.getBoundingClientRect())
          .filter(r => r.width > 0);
    const pad = 20;
    const margin = 14;
    for (let k = 0; k < 80; k++) {
      const wd = rnd(38, 68);
      const ht = wd * 0.5;
      const maxLeft = er.width - wd * 1.2 - margin;
      const maxTop = er.height - ht * 1.2 - margin;
      if (maxLeft <= margin || maxTop <= margin) return null;
      const px = rnd(margin, maxLeft);
      const py = rnd(margin, maxTop);
      const cand: Box = {
        left: er.left + px,
        right: er.left + px + wd * 1.2,
        top: er.top + py,
        bottom: er.top + py + ht * 1.2,
      };
      if (!av.some(r => overlaps(cand, r, pad)) && !others.some(r => overlaps(cand, r, pad))) {
        w.style.left = `${(px / er.width) * 100}%`;
        w.style.top = `${(py / er.height) * 100}%`;
        w.style.width = `${wd.toFixed(0)}px`;
        w.style.display = '';
        return cand;
      }
    }
    return null;
  };

  const layoutAll = () => {
    if (isClean()) return;
    const done: Box[] = [];
    [...ey.children].forEach(el => {
      const w = el as HTMLElement;
      const box = placeOne(w, done);
      if (box) {
        done.push(box);
        if (rm) w.style.opacity = '0.7';
      } else {
        w.style.display = 'none';
      }
    });
  };

  layoutAll();
  addEventListener('load', () => setTimeout(layoutAll, 300));
  let rt = 0;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = window.setTimeout(layoutAll, 250);
  });

  // Re-layout immediately if user switches from Clean View to Watcher Mode
  new MutationObserver(() => {
    if (!isClean()) setTimeout(layoutAll, 50);
  }).observe(root, { attributes: true, attributeFilter: ['data-mode'] });

  if (!rm) {
    ey.querySelectorAll<SVGSVGElement>('svg').forEach(s => {
      s.style.animation = `w-breathe ${rnd(3.2, 6.5).toFixed(2)}s ease-in-out ${(-rnd(0, 6)).toFixed(2)}s infinite`;
    });

    ey.querySelectorAll<HTMLElement>(':scope > div').forEach((w, idx) => {
      const lid = w.querySelector<SVGGElement>('.lid');
      if (!lid) return;
      w.style.opacity = '0';
      lid.style.transform = SH;

      const life = (initialDelay?: number) =>
        setTimeout(() => {
          if (isClean()) {
            w.style.opacity = '0';
            life(rnd(2000, 5000));
            return;
          }
          const placed = placeOne(w);
          if (!placed) {
            w.style.opacity = '0';
            life(rnd(1500, 4000));
            return;
          }
          w.style.transform = `translate(${rnd(-6, 6).toFixed(1)}px,${rnd(-6, 6).toFixed(1)}px) scale(${rnd(0.85, 1.25).toFixed(2)})`;
          w.style.opacity = rnd(0.45, 0.95).toFixed(2);
          setTimeout(() => {
            lid.style.transform = 'translateY(0)';
            const hold = rnd(2000, 4600);
            if (Math.random() < 0.5) {
              setTimeout(() => {
                lid.style.transform = SH;
                setTimeout(() => {
                  lid.style.transform = 'translateY(0)';
                }, 240);
              }, hold * 0.5);
            }
            setTimeout(() => {
              lid.style.transform = SH;
              setTimeout(() => {
                w.style.opacity = '0';
                setTimeout(() => life(), 900);
              }, 500);
            }, hold);
          }, rnd(500, 1100));
        }, initialDelay ?? rnd(1200, 9000));

      // Stagger first wave so several eyes appear right away across the footer
      life(idx < 8 ? rnd(300, 2600) : rnd(2500, 11000));
    });
  }
}
