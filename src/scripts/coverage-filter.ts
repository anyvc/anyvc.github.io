// Legend buttons highlight one status and dim the rest. Without JS they stay disabled and everything is shown.
const root = document.querySelector<HTMLElement>('#coverage');
const buttons = [...(root?.querySelectorAll<HTMLButtonElement>('[data-cov-filter]') ?? [])];
const status = root?.querySelector<HTMLElement>('[data-cov-status]');
buttons.forEach(b => (b.disabled = false));
let current = 'all';
function apply(f: string) {
  current = f;
  buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.covFilter === f)));
  root?.querySelectorAll<HTMLElement>('.tech, .seg').forEach(el => el.toggleAttribute('data-dim', f !== 'all' && el.dataset.status !== f));
  if (status) {
    const n = f === 'all' ? root!.querySelectorAll('.tech').length : root!.querySelectorAll(`.tech[data-status="${f}"]`).length;
    status.textContent = f === 'all' ? 'Showing all techniques' : `Highlighting ${n} technique${n === 1 ? '' : 's'}`;
  }
}
root?.addEventListener('click', e => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-cov-filter]');
  if (!b || b.disabled) return;
  const f = b.dataset.covFilter!;
  apply(f === current ? 'all' : f); // clicking the active status again clears it
});
