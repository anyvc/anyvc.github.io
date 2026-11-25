// Scroll progress bar and active section link.
const bar = document.querySelector<HTMLElement>('[data-nav-progress]');
if (bar) {
  let raf = 0;
  const upd = () => {
    raf = 0;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
  upd();
}

const links = [...document.querySelectorAll<HTMLAnchorElement>('.site-nav .nav-links a[href^="#"]')];
const targets = links
  .map(l => document.querySelector<HTMLElement>(l.getAttribute('href')!))
  .filter((t): t is HTMLElement => !!t);
if (targets.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => {
    es.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(l => l.toggleAttribute('aria-current', l.getAttribute('href') === `#${en.target.id}`));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  targets.forEach(t => io.observe(t));
}
