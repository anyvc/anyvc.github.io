// Mode toggle island. The initial mode is set before first paint by the inline script in Base.astro.
const KEY = 'watcher-mode';
const root = document.documentElement;
const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const write = (v: string) => { try { localStorage.setItem(KEY, v); } catch { /* storage unavailable: mode still switches */ } };

document.querySelectorAll<HTMLButtonElement>('[data-mode-toggle]').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = root.dataset.mode === 'clean' ? 'watcher' : 'clean';
    root.dataset.mode = next;
    write(next);
  });
});
void read; // exported for later islands if needed

// Print always uses Clean: switch for the print job, restore afterwards (covers the mode-specific Watcher CSS, not only tokens).
let before: string | null = null;
const toPrint = () => { if (before === null) { before = root.dataset.mode ?? 'watcher'; root.dataset.mode = 'clean'; } };
const fromPrint = () => { if (before !== null) { root.dataset.mode = before; before = null; } };
addEventListener('beforeprint', toPrint); addEventListener('afterprint', fromPrint);
matchMedia('print').addEventListener('change', e => (e.matches ? toPrint() : fromPrint()));
