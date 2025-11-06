// src/js/modules/lightbox.js

function createLightboxShell() {
  let overlay = document.querySelector('.modal-overlay');
  let dialog = document.querySelector('.modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
  }
  if (!dialog) {
    dialog = document.createElement('div');
    dialog.className = 'modal';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.innerHTML = `
      <button class="modal__close" aria-label="Zamknij okno">✕</button>
      <div class="modal__body"></div>
    `;
    document.body.appendChild(dialog);
  }
  return { overlay, dialog };
}

function lockScroll(lock) {
  document.documentElement.classList.toggle('no-scroll', lock);
  document.body.classList.toggle('no-scroll', lock);
}

function fillDialogFromCard(dialog, card) {
  const body = dialog.querySelector('.modal__body');
  const tpl = card.querySelector('template.story-template');
  if (tpl && tpl.content) {
    body.innerHTML = '';
    body.appendChild(tpl.content.cloneNode(true));
    return;
  }

  // Fallback to simple extraction from the card
  const img = card.querySelector('img');
  const title = card.querySelector('.card__title');
  const text = card.querySelector('p');

  const src = img?.getAttribute('src') || '';
  const alt = img?.getAttribute('alt') || '';
  const heading = title?.textContent?.trim() || '';
  const paragraph = text?.textContent?.trim() || '';

  body.innerHTML = `
    <figure class="modal__figure">
      <img src="${src}" alt="${alt}">
    </figure>
    <div class="modal__content">
      <h3 class="modal__title">${heading}</h3>
      <p class="modal__text">${paragraph}</p>
    </div>
  `;
}

export function initLightboxStories() {
  const { overlay, dialog } = createLightboxShell();

  const focusableSel = [
    'a[href]','button:not([disabled])','input:not([disabled])',
    'select:not([disabled])','textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  let lastActive = null;

  const open = (card) => {
    fillDialogFromCard(dialog, card);
    overlay.classList.add('is-active');
    dialog.classList.add('is-open');
    lockScroll(true);
    lastActive = document.activeElement;
    // focus first focusable or close
    const first = dialog.querySelector(focusableSel) || dialog.querySelector('.modal__close');
    if (first) first.focus();
    document.addEventListener('keydown', onKeyDown);
  };

  const close = () => {
    overlay.classList.remove('is-active');
    dialog.classList.remove('is-open');
    lockScroll(false);
    document.removeEventListener('keydown', onKeyDown);
    if (lastActive && lastActive.focus) lastActive.focus();
  };

  function onKeyDown(e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'Tab') {
      const nodes = Array.from(dialog.querySelectorAll(focusableSel));
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  overlay.addEventListener('click', close);
  dialog.addEventListener('click', (e) => {
    if (e.target.closest('.modal__close')) close();
  });

  // Bind on cards
  document.querySelectorAll('.story-card .card__link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const card = e.currentTarget.closest('.story-card');
      if (card) open(card);
    });
  });
}
