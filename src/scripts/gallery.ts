// Evidence gallery: category filter, incremental "Show more", and Prev/Next accessible lightbox.
const grid = document.getElementById('ggrid');
const more = document.getElementById('gmore') as HTMLButtonElement | null;
const flt = document.getElementById('gflt');
const lb = document.getElementById('lb');
const statusEl = document.querySelector<HTMLElement>('[data-gal-status]');

if (grid && more && flt && lb) {
  const all = [...grid.querySelectorAll<HTMLButtonElement>('.gi')];
  const pad = (n: number) => String(n + 1).padStart(2, '0');
  const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

  let cat = 'all';
  let shown = 6;
  let cur = -1;
  let opener: HTMLElement | null = null;

  const matching = () => all.filter(b => cat === 'all' || b.dataset.cat === cat);

  const render = () => {
    const list = matching();
    const visible = new Set(list.slice(0, shown));
    all.forEach(b => { b.hidden = !visible.has(b); });
    more.hidden = list.length <= shown;
    more.textContent = `Show more (${list.length - shown})`;
    if (statusEl) statusEl.textContent = `Showing ${visible.size} of ${list.length} exhibits`;
  };

  const view = (idx: number) => {
    cur = idx;
    const item = all[idx];
    if (!item) return;
    const list = matching();
    const pos = list.indexOf(item);
    const src = item.dataset.src ?? '';
    const cap = item.dataset.cap ?? '';
    const alt = item.dataset.alt ?? cap;
    const tag = item.dataset.tag ?? '';

    const frame = lb.querySelector<HTMLElement>('.lbf')!;
    frame.innerHTML = src
      ? `<img class="lbi" src="${esc(src)}" alt="${esc(alt)}">`
      : `<div class="lbm"><div class="gph" role="img" aria-label="${esc(cap)}">IMAGE SLOT</div></div>`;

    const p = lb.querySelector<HTMLElement>('.lbp')!;
    p.innerHTML = `<b>EXHIBIT-${pad(idx)}</b> · ${esc(tag)} — ${esc(cap)}`;
    const k = lb.querySelector<HTMLElement>('.lbk')!;
    k.textContent = `${pos + 1} / ${list.length}`;
  };

  const step = (delta: number) => {
    const list = matching();
    const pos = list.findIndex(b => Number(b.dataset.n) === cur);
    if (pos < 0 || !list.length) return;
    const next = list[(pos + delta + list.length) % list.length];
    view(Number(next.dataset.n));
  };

  const open = (idx: number, from: HTMLElement) => {
    opener = from;
    view(idx);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lb.querySelector<HTMLButtonElement>('.lbx')?.focus();
  };

  const close = () => {
    lb.hidden = true;
    document.body.style.overflow = '';
    cur = -1;
    const target = opener && opener.isConnected ? opener : grid.querySelector<HTMLElement>('.gi:not([hidden])');
    target?.focus();
    opener = null;
  };

  grid.addEventListener('click', e => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('.gi');
    if (b) open(Number(b.dataset.n), b);
  });

  more.addEventListener('click', () => {
    const prevCount = all.filter(b => !b.hidden).length;
    shown += 6;
    render();
    const nextFocus = matching()[prevCount];
    nextFocus?.focus({ preventScroll: false });
  });

  flt.addEventListener('click', e => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-c]');
    if (!b) return;
    cat = b.dataset.c!;
    shown = 6;
    flt.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    render();
  });

  lb.addEventListener('click', e => {
    const t = e.target as HTMLElement;
    if (t === lb || t.closest('[data-x]')) {
      close();
      return;
    }
    const nav = t.closest<HTMLButtonElement>('[data-d]');
    if (nav) step(Number(nav.dataset.d));
  });

  addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') {
      e.stopPropagation();
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowLeft') {
      step(-1);
    } else if (e.key === 'ArrowRight') {
      step(1);
    } else if (e.key === 'Tab') {
      const f = [...lb.querySelectorAll<HTMLButtonElement>('button')];
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, true);

  render();
}
