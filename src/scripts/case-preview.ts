// Inline expandable dossier drawer (#dp) placed right after the clicked card's grid row.
// Without JS, clicking the card heading navigates directly to /case/[id]/.
const grid = document.getElementById('pgrid');
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (grid) {
  const cards = () => [...grid.querySelectorAll<HTMLElement>('.pc')];
  let cur: HTMLElement | null = null;
  let panel: HTMLElement | null = null;

  const setState = (c: HTMLElement, on: boolean) => {
    c.setAttribute('aria-expanded', String(on));
    const gt = c.querySelector('.gt');
    const arr = c.querySelector('.go b');
    if (gt) gt.textContent = on ? '[ CLOSE CASE FILE ]' : '[ OPEN CASE FILE ]';
    if (arr) arr.textContent = on ? '↓' : '↗';
  };

  const place = (card: HTMLElement) => {
    if (!panel) return;
    const row = cards().filter(c => !c.hidden && Math.abs(c.offsetTop - card.offsetTop) < 4);
    const anchor = row[row.length - 1] ?? card;
    anchor.after(panel);
  };

  const close = (refocus: boolean) => {
    if (!panel || !cur) return;
    const p = panel;
    const c = cur;
    panel = null;
    cur = null;
    setState(c, false);
    if (RM || document.documentElement.dataset.mode === 'clean') {
      p.remove();
    } else {
      p.classList.remove('on');
      setTimeout(() => p.remove(), 360);
    }
    if (refocus) c.focus({ preventScroll: true });
  };

  const open = (card: HTMLElement) => {
    if (cur === card) return close(true);
    if (panel && cur) {
      panel.remove();
      setState(cur, false);
    }
    const id = card.dataset.case;
    const tpl = id ? document.querySelector<HTMLTemplateElement>(`template[data-preview="${id}"]`) : null;
    if (!tpl) {
      if (id) location.href = `/case/${id}/`;
      return;
    }
    cur = card;
    panel = document.createElement('section');
    panel.id = 'dp';
    panel.className = 'dp';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', `${tpl.dataset.title ?? 'Case'} case file`);
    panel.appendChild(tpl.content.cloneNode(true));
    place(card);
    setState(card, true);
    const pn = panel;
    requestAnimationFrame(() => requestAnimationFrame(() => pn.classList.add('on')));
    card.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
  };

  const copyCode = (btn: HTMLButtonElement) => {
    const code = btn.closest('.cd')?.querySelector('code')?.textContent ?? '';
    const done = () => {
      btn.textContent = 'Copied';
      setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
    };
    const fb = () => {
      const a = document.createElement('textarea');
      a.value = code;
      a.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(a);
      a.select();
      try { document.execCommand('copy'); done(); } catch { btn.textContent = 'Press Ctrl+C'; }
      a.remove();
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(code).then(done, fb);
    else fb();
  };

  grid.addEventListener('click', e => {
    const t = e.target as HTMLElement;
    if (panel && panel.contains(t)) {
      if (t.closest('[data-x]')) {
        close(true);
        return;
      }
      const copyBtn = t.closest<HTMLButtonElement>('[data-copy]');
      if (copyBtn) {
        copyCode(copyBtn);
        return;
      }
      return;
    }
    const me = e as MouseEvent;
    if (me.metaKey || me.ctrlKey || me.shiftKey || me.button !== 0) return;
    const card = t.closest<HTMLElement>('.pc');
    if (!card) return;
    const link = t.closest('a');
    if (link && !link.hasAttribute('data-case-open')) return;
    e.preventDefault();
    open(card);
  });

  grid.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const t = e.target as HTMLElement;
    if (t.classList.contains('pc')) {
      e.preventDefault();
      open(t);
    }
  });

  addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel) close(true);
  });

  // Close drawer when filter changes
  document.addEventListener('case-filter-change', () => close(false));

  let rt = 0;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = window.setTimeout(() => {
      if (panel && cur) {
        panel.remove();
        place(cur);
      }
    }, 120);
  });
}
