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
