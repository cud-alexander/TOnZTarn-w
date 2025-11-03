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
import { initOrphanFix } from '/src/js/utils/orphans.js'; // <-- TWÓJ NOWY IMPORT
import { initCopyToClipboard } from '/src/js/utils/clipboard.js'; // <-- DODAJ TĘ LINIĘ

console.debug('[main] boot');

/* Funkcja: Rok w stopce */
function initFooterYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
}

/* =================================================================== */
/* Główna inicjalizacja skryptów
/* =================================================================== */
function main() {
  // Dostępność
  initSkipLink();

  // Typografia (naprawa sierotek)
  initOrphanFix(); // <-- TWOJE NOWE WYWOŁANIE
  initCopyToClipboard(); // <-- DODAJ TĘ LINIĘ
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
/* Start aplikacji
/* =================================================================== */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  // DOM jest już gotowy
  main();
}
