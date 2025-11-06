/**
 * src/js/main.js
 * Główny plik inicjalizujący skrypty
 */

// === Importy modułów (zawsze względnie względem tego pliku!) ===
import { initHeader } from './modules/header.js';
import { initMobileMenu } from './modules/mobile-menu.js';
import { initReveal } from './modules/reveal.js';
import { initCalculator } from './modules/calculator.js';
import { attachFloaters } from './modules/floaters.js';
import { initLightboxStories } from './modules/lightbox.js';

// === Importy utility ===
import { initSkipLink } from './utils/a11y.js';
import { initOrphanFix } from './utils/orphans.js';
import { initCopyToClipboard } from './utils/clipboard.js';

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

/* Naprawa: zły ALT/tekst w hero na mobile (błędne cudzysłowy w HTML)
   Usuwa zbłąkane węzły tekstowe z <picture.hero__bg> i ustawia poprawny alt. */
function sanitizeHeroPicture() {
  const picture = document.querySelector('picture.hero__bg');
  if (!picture) return;
  // Remove stray text nodes inside <picture>
  Array.from(picture.childNodes).forEach(node => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
      node.parentNode.removeChild(node);
    }
  });
  // Ensure <img> has safe alt text
  const img = picture.querySelector('img');
  if (img) {
    img.alt = 'Dłoń człowieka i łapa psa symbolizujące zaufanie i pomoc';
    try { img.loading = 'eager'; } catch {}
    try { img.decoding = 'sync'; } catch {}
  }
}

// Usuwa twarde spacje i nadmiarowe odstępy w sekcji "Misja"
function normalizeMissionParagraphs() {
  const section = document.getElementById('misja');
  if (!section) return;
  section.querySelectorAll('p').forEach(p => {
    // Replace both the NBSP character and &nbsp; entity, plus collapse multi-spaces
    const cleaned = p.innerHTML
      .replace(/&nbsp;+/gi, ' ')
      .replace(/\u00A0+/g, ' ')
      .replace(/[ \t\n\r]{2,}/g, ' ')
      .trim();
    p.innerHTML = cleaned;
  });
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
  initLightboxStories();

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
  sanitizeHeroPicture();
  normalizeMissionParagraphs();
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
