const wrap = document.querySelector<HTMLElement>('[data-case-filters]');
const grid = document.querySelector<HTMLElement>('[data-case-grid]');
const status = document.querySelector<HTMLElement>('[data-case-status]');

wrap?.addEventListener('click', e => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-filter]');
  if (!btn || !wrap || !grid) return;
  const f = btn.dataset.filter!;
  document.dispatchEvent(new CustomEvent('case-filter-change'));
  wrap.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
  let shown = 0;
  for (const card of grid.querySelectorAll<HTMLElement>('.pc')) {
    const on = f === 'All' || card.dataset.g === f;
    card.hidden = !on;
    if (on) shown++;
  }
  if (status) status.textContent = `Showing ${shown} case file${shown === 1 ? '' : 's'}${f === 'All' ? '' : ' in ' + f}`;
});
