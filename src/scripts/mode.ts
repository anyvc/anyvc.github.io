// Mode toggle island. Initial mode is set before first paint by the inline script in Base.astro.
const KEY = 'watcher-mode';
const root = document.documentElement;
const write = (v: string) => { try { localStorage.setItem(KEY, v); } catch { /* storage unavailable */ } };

function syncButtons() {
  const clean = root.dataset.mode === 'clean';
  document.querySelectorAll<HTMLButtonElement>('[data-mode-toggle]').forEach(btn => {
    btn.setAttribute('aria-pressed', String(clean));
    const tip = clean ? btn.dataset.tipWatcher : btn.dataset.tipClean;
    if (tip) btn.setAttribute('data-tip', tip);
  });
}

document.querySelectorAll<HTMLButtonElement>('[data-mode-toggle]').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = root.dataset.mode === 'clean' ? 'watcher' : 'clean';
    root.dataset.mode = next;
    write(next);
    syncButtons();
  });
});
syncButtons();

// Print always uses Clean: switch for the print job, restore afterwards.
let before: string | null = null;
const toPrint = () => { if (before === null) { before = root.dataset.mode ?? 'watcher'; root.dataset.mode = 'clean'; syncButtons(); } };
const fromPrint = () => { if (before !== null) { root.dataset.mode = before; before = null; syncButtons(); } };
addEventListener('beforeprint', toPrint);
addEventListener('afterprint', fromPrint);
matchMedia('print').addEventListener('change', e => (e.matches ? toPrint() : fromPrint()));
