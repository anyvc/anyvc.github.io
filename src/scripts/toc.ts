// Highlights the "On this page" link for the section in view.
const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-toc] a')];
const secs = [...document.querySelectorAll<HTMLElement>('[data-sec]')];
if ('IntersectionObserver' in window && links.length) {
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    links.forEach(l => l.toggleAttribute('aria-current', l.getAttribute('href') === `#${en.target.id}`));
  }), { rootMargin: '-20% 0px -65% 0px' });
  secs.forEach(s => io.observe(s));
}
