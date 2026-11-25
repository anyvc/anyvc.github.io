// Card -> preview panel (native <dialog>: focus trap, Esc, inert background). Without JS the card title is a plain link to /case/[id].
const dlg = document.querySelector<HTMLDialogElement>('#case-preview');
const body = dlg?.querySelector<HTMLElement>('[data-pv-body]');
const cat = dlg?.querySelector<HTMLElement>('[data-pv-cat]');
let opener: HTMLElement | null = null;

function open(id: string, from: HTMLElement) {
  const t = document.querySelector<HTMLTemplateElement>(`template[data-preview="${id}"]`);
  if (!dlg || !body || !t) { location.href = `/case/${id}/`; return; } // fall back to the full page
  body.replaceChildren(t.content.cloneNode(true));
  if (cat) cat.textContent = t.dataset.cat ?? '';
  dlg.setAttribute('aria-label', t.dataset.title ?? 'Case preview');
  opener = from;
  dlg.showModal();
}

document.querySelectorAll<HTMLElement>('[data-case]').forEach(card => {
  card.addEventListener('click', e => {
    const me = e as MouseEvent;
    if (me.metaKey || me.ctrlKey || me.shiftKey || me.button !== 0) return; // keep "open in new tab" working
    const link = (e.target as HTMLElement).closest('a');
    if (link && !link.hasAttribute('data-case-open')) return;
    e.preventDefault();
    open(card.dataset.case!, card.querySelector<HTMLElement>('[data-case-open]')!);
  });
});

dlg?.addEventListener('click', e => {
  const t = e.target as HTMLElement;
  if (t === dlg || t.closest('[data-close]')) dlg.close(); // backdrop click, Close button, in-page jump links
});
dlg?.addEventListener('close', () => { body?.replaceChildren(); opener?.focus({ preventScroll: true }); opener = null; });
