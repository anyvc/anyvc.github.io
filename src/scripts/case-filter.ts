const wrap = document.querySelector<HTMLElement>('[data-case-filters]');
const items = [...document.querySelectorAll<HTMLElement>('.case-item')];
const status = document.querySelector<HTMLElement>('[data-case-status]');
wrap?.addEventListener('click', e => {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-filter]');
  if (!btn || !wrap) return;
  const f = btn.dataset.filter!;
  wrap.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
  let shown = 0;
  for (const li of items) { const on = f === 'All' || li.dataset.group === f; li.hidden = !on; if (on) shown++; }
  if (status) status.textContent = `Showing ${shown} case file${shown === 1 ? '' : 's'}${f === 'All' ? '' : ' in ' + f}`;
});
