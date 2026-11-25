// Filter, "show more" and lightbox. Without JS every item is shown and images are plain.
const root = document.querySelector<HTMLElement>('#gallery');
if (root) {
  const LIMIT = 6;
  const items = [...root.querySelectorAll<HTMLElement>('.gi')];
  const filters = root.querySelector<HTMLElement>('[data-gal-filters]');
  const more = root.querySelector<HTMLButtonElement>('[data-gal-more]')!;
  const status = root.querySelector<HTMLElement>('[data-gal-status]');
  let cat = 'all', expanded = false;

  const render = () => {
    const match = items.filter(li => cat === 'all' || li.dataset.cat === cat);
    const shown = new Set(expanded ? match : match.slice(0, LIMIT));
    items.forEach(li => (li.hidden = !shown.has(li)));
    more.hidden = match.length <= LIMIT;
    more.textContent = expanded ? 'Show fewer' : `Show ${match.length - LIMIT} more`;
    if (status) status.textContent = `Showing ${shown.size} of ${match.length}`;
  };
  filters?.addEventListener('click', e => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-cat]');
    if (!b) return;
    cat = b.dataset.cat!; expanded = false;
    filters.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    render();
  });
  more.addEventListener('click', () => { expanded = !expanded; render(); });
  render();

  const dlg = root.querySelector<HTMLDialogElement>('[data-lb-dialog]')!;
  const img = dlg.querySelector<HTMLImageElement>('[data-lb-img]')!;
  const cap = dlg.querySelector<HTMLElement>('[data-lb-cap]')!;
  let opener: HTMLElement | null = null;
  root.addEventListener('click', e => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-lb]');
    if (!b) return;
    img.src = b.dataset.lb!; img.alt = b.dataset.alt ?? ''; cap.textContent = b.dataset.cap ?? '';
    opener = b; dlg.showModal();
  });
  dlg.addEventListener('click', e => { const t = e.target as HTMLElement; if (t === dlg || t.closest('[data-lb-close]')) dlg.close(); });
  dlg.addEventListener('close', () => { img.removeAttribute('src'); opener?.focus({ preventScroll: true }); });
}
