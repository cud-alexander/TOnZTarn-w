/**
 * src/js/main.js
 * Główny plik inicjalizujący skrypty
 */

// === Importy modułów ===
import { initHeader } from '/src/js/modules/header.js';
import { initMobileMenu } from '/src/js/modules/mobile-menu.js';
import { initReveal } from '/src/js/modules/reveal.js';
import { initCalculator } from '/src/js/modules/calculator.js';
import { attachFloaters } from '/src/js/modules/floaters.js';

// === Importy utility (narzędzi) ===
import { initSkipLink } from '/src/js/utils/a11y.js';
import { initOrphanFix } from '/src/js/utils/orphans.js';
import { initCopyToClipboard } from '/src/js/utils/clipboard.js';

console.debug('[main] boot');

/* =================================================================== */
/* FAVICONS – globalna inicjalizacja (dla wszystkich stron)
/* =================================================================== */
function initFavicons() {
  const HEAD = document.head;
  const BASE = '/src/assets/images/icons/';

  // Usuwamy duplikaty (np. przy przeładowaniu)
  [...HEAD.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]')].forEach(el => el.remove());

  // Querystring z timestampem, żeby przeglądarka nie cache’owała starego favicon.ico
  const v = `?v=${Date.now()}`;

  const links = [
    { rel: 'icon', type: 'image/x-icon', href: `${BASE}favicon.ico${v}` },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${BASE}favicon-32x32.png${v}` },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${BASE}favicon-16x16.png${v}` },
    { rel: 'apple-touch-icon', sizes: '180x180', href: `${BASE}apple-touch-icon.png${v}` },
    // Opcjonalnie nowoczesny SVG (jeśli chcesz):
    // { rel: 'icon', type: 'image/svg+xml', href: `${BASE}favicon.svg${v}` },
  ];

  for (const cfg of links) {
    const link = document.createElement('link');
    Object.entries(cfg).forEach(([k, val]) => link.setAttribute(k, val));
    HEAD.appendChild(link);
  }
}

/* =================================================================== */
/* Rok w stopce */
/* =================================================================== */
function initFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
}

/* =================================================================== */
/* Główna inicjalizacja skryptów */
/* =================================================================== */
function main() {

  // === Favicons – dodane na wszystkich stronach ===
  initFavicons();

  // Dostępność
  initSkipLink();

  // Typografia (naprawa sierotek)
  initOrphanFix();
  initCopyToClipboard();

  // Komponenty
  initHeader();
  initMobileMenu();

  // Moduły stron
  initReveal();
  initCalculator();

  // Inicjalizacja Floaterów
  document.querySelectorAll('[data-floater-zone]').forEach(zone => {
    attachFloaters(zone, {
      count: 16,
      speed: 1.3,
      density: 1.5,
      zindex: 0,
      palette: ['floater--accent','floater--accent2','floater--neutral'],
      shapes: ['paw','bone','heart']
    });
  });

  // Inne
  initFooterYear();
}

/* =================================================================== */
/* Start aplikacji */
/* =================================================================== */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}

/* =================================================================== */
/*  WSPÓLNY LOADER DLA HEAD (favicon, meta, style)
    Plik: /src/components/head.html
/* =================================================================== */
(async () => {
  try {
    const res = await fetch('/src/components/head.html', { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    // wstrzykujemy do <head> bez usuwania jego obecnej zawartości
    document.head.insertAdjacentHTML('beforeend', html);
  } catch (e) {
    console.error('Nie udało się wczytać head.html:', e);
  }
})();

/* =================================================================== */
/* Wspólny loader komponentu stopki */
/* =================================================================== */
(async () => {
  const mount = document.getElementById('footer-placeholder');
  if (!mount) return;

  const url = '/src/components/footer.html';
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const html = await res.text();

    mount.outerHTML = html;

    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  } catch (e) {
    console.error('Nie udało się wczytać stopki:', e);
  }
})();
