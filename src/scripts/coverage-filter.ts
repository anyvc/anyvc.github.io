// Interactive stacked coverage bar + mobile legend + hover highlight sync + telemetry accordion.
const section = document.getElementById('coverage');
const bar = document.getElementById('bar');
const leg = document.getElementById('leg');
const statusEl = section?.querySelector<HTMLElement>('[data-cov-status]');

if (section && bar) {
  // Animate bar fill on scroll into view
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es, o) => {
      es.forEach(e => {
        if (e.isIntersecting) {
          bar.classList.add('go');
          o.disconnect();
        }
      });
    }, { threshold: 0.4 }).observe(bar);
  } else {
    bar.classList.add('go');
  }

  // Align diagonal hatch across bar segments
  const alignHatch = () => {
    const b0 = bar.getBoundingClientRect().left;
    bar.querySelectorAll<HTMLElement>('.grp.m .segs, .grp.f .segs').forEach(s => {
      s.style.backgroundPosition = `${-Math.round(s.getBoundingClientRect().left - b0)}px 0`;
    });
  };
  alignHatch();
  addEventListener('load', alignHatch);
  addEventListener('resize', alignHatch);

  // Filter click on bar groups (also proxied by mobile legend buttons)
  const applyFilter = (f: string | null) => {
    bar.querySelectorAll<HTMLButtonElement>('.grp').forEach(x => {
      const match = !!f && x.dataset.f === f;
      x.setAttribute('aria-pressed', String(match));
      x.classList.toggle('off', !!f && !match);
    });
    section.querySelectorAll<HTMLElement>('.cov-card, .cl-tbl tr').forEach(el => {
      el.classList.toggle('off', !!f && el.dataset.k !== f);
    });
    if (statusEl) {
      statusEl.textContent = f ? `Filtered coverage to ${f}` : 'Showing all techniques';
    }
  };

  bar.addEventListener('click', e => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('.grp');
    if (!b) return;
    const on = b.getAttribute('aria-pressed') !== 'true';
    applyFilter(on ? b.dataset.f ?? null : null);
  });

  leg?.addEventListener('click', e => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-f]');
    if (!b) return;
    const grp = bar.querySelector<HTMLButtonElement>(`.grp[data-f="${b.dataset.f}"]`);
    grp?.click();
  });

  // Hover sync between bar segments and matrix cards
  const hl = (id: string, on: boolean) => {
    bar.querySelectorAll<HTMLElement>('.segs i').forEach(i => i.classList.toggle('hl', on && i.dataset.tid === id));
    section.querySelectorAll<HTMLElement>('.cov-card').forEach(c => c.classList.toggle('hl', on && c.dataset.tid === id));
  };

  section.addEventListener('pointerover', e => {
    const t = e.target as HTMLElement;
    const c = t.closest<HTMLElement>('.cov-card');
    const seg = t.closest<HTMLElement>('.bar .segs i');
    if (c?.dataset.tid) hl(c.dataset.tid, true);
    else if (seg?.dataset.tid) hl(seg.dataset.tid, true);
    else hl('', false);
  });
  section.addEventListener('pointerleave', () => hl('', false));
}

// Lab telemetry expandable drawer
const labBtn = document.getElementById('labtg');
const labPanel = document.getElementById('labpn') as (HTMLElement & { inert?: boolean }) | null;
if (labBtn && labPanel) {
  labPanel.inert = true;
  labBtn.addEventListener('click', () => {
    const open = labBtn.getAttribute('aria-expanded') !== 'true';
    labBtn.setAttribute('aria-expanded', String(open));
    labPanel.classList.toggle('on', open);
    labPanel.inert = !open;
  });
}
