document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = btn.closest('figure')?.querySelector('code')?.textContent ?? '';
    const done = (label: string) => { btn.textContent = label; setTimeout(() => (btn.textContent = 'Copy'), 1500); };
    try { await navigator.clipboard.writeText(text); done('Copied'); }
    catch {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done('Copied'); } catch { done('Press Ctrl+C'); }
      ta.remove();
    }
  });
});
