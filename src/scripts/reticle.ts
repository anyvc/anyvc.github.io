// Custom reticle ring around the cursor. Fine pointers only, never under reduced motion. The native cursor is never hidden.
if (matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const r = document.createElement('div');
  r.className = 'w-reticle'; r.setAttribute('aria-hidden', 'true');
  document.body.append(r);
  let x = 0, y = 0, raf = 0;
  const paint = () => { raf = 0; r.style.transform = `translate3d(${x}px, ${y}px, 0)`; };
  addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    x = e.clientX; y = e.clientY; r.setAttribute('data-on', '');
    r.toggleAttribute('data-hot', !!(e.target as HTMLElement).closest?.('a, button, summary, [role="button"]'));
    if (!raf) raf = requestAnimationFrame(paint);
  }, { passive: true });
  document.addEventListener('pointerleave', () => r.removeAttribute('data-on'));
}
