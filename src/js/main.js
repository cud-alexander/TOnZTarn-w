/**
 * src/js/main.js
 * Główny plik inicjalizujący skrypty
 */

// === Importy modułów (zawsze względnie względem tego pliku!) ===
@import url("/src/assets/css/base/reset.css");
@import url("/src/assets/css/base/variables.css");
@import url("/src/assets/css/base/helpers.css");

@import url("/src/assets/css/layout/main.css");
@import url("/src/assets/css/layout/header.css");
@import url("/src/assets/css/layout/footer.css");

@import url("/src/assets/css/components/nav.css");
@import url("/src/assets/css/components/cards.css");

@import url("/src/assets/css/sections.css");
@import url("/src/assets/css/animations.css");


console.debug('[main] boot');

/* =================================================================== */
/* Wyznaczenie BASE dla ścieżek dynamicznych (head/footer, favicony)
/* Działa dla:
   - index.html  -> <script src="src/js/main.js">    => BASE = "src/"
   - podstrony   -> <script src="../js/main.js">     => BASE = "../"
/* =================================================================== */
const _scriptEl = document.querySelector('script[type="module"][src*="js/main.js"]');
const BASE = _scriptEl
  ? _scriptEl.getAttribute('src').replace(/js\/main\.js.*$/, '')
  : 'src/'; // awaryjnie przyjmij "src/"

const ICONS_BASE = `${BASE}assets/images/icons/`;

/* =================================================================== */
/* Favicons – fallback (tylko jeśli nie przyjdą z head.html)
/* =================================================================== */
function ensureFavicons() {
  // jeśli już są ikony (np. z head.html) — nic nie rób
  if (document.head.querySelector('link[rel="icon"], link[rel="apple-touch-icon"]')) return;

  const v = `?v=${Date.now()}`;
  const links = [
    { rel: 'icon', type: 'image/x-icon', href: `${ICONS_BASE}favicon.ico${v}` },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${ICONS_BASE}favicon-32x32.png${v}` },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${ICONS_BASE}favicon-16x16.png${v}` },
    { rel: 'apple-touch-icon', sizes: '180x180', href: `${ICONS_BASE}apple-touch-icon.png${v}` },
    // { rel: 'icon', type: 'image/svg+xml', href: `${ICONS_BASE}favicon.svg${v}` }, // jeśli używasz SVG
  ];

  for (const cfg of links) {
    const link = document.createElement('link');
    Object.entries(cfg).forEach(([k, val]) => link.setAttribute(k, val));
    document.head.appendChild(link);
  }
}

/* =================================================================== */
/* Rok w stopce */
/* =================================================================== */
function initFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

/* =================================================================== */
/* Główna inicjalizacja skryptów */
/* =================================================================== */
function main() {
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
      palette: ['floater--accent', 'floater--accent2', 'floater--neutral'],
      shapes: ['paw', 'bone', 'heart']
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
/* Wspólny <head> (favicon/meta/linki) – dołączany dynamicznie
   Plik:  ${BASE}components/head.html
/* =================================================================== */
(async () => {
  try {
    const res = await fetch(`${BASE}components/head.html`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    // dołącz do <head> (nie usuwamy istniejącej zawartości)
    document.head.insertAdjacentHTML('beforeend', html);
  } catch (e) {
    console.error('Nie udało się wczytać head.html:', e);
  } finally {
    // jeśli head.html nie zawierał ikon lub w ogóle nie przyszedł – dołóż fallback
    ensureFavicons();
  }
})();

/* =================================================================== */
/* Wspólny loader komponentu stopki
   Plik:  ${BASE}components/footer.html
/* =================================================================== */
(async () => {
  const mount = document.getElementById('footer-placeholder');
  if (!mount) return;

  try {
    const res = await fetch(`${BASE}components/footer.html`, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    // wstrzykujemy gotowy footer (zastępuje placeholder)
    mount.outerHTML = html;

    // uzupełnij rok
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  } catch (e) {
    console.error('Nie udało się wczytać stopki:', e);
  }
})();
