import { $ } from '../utils/dom.js';

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let headerEl = null;
let heroContentEl = null;

/**
 * Podmienia logotypy w nagłówku
 * @param {boolean} scrolled - Czy strona jest przewinięta (true = ciemne logo)
 */
function swapHeaderLogos(scrolled) {
  const tpz = document.querySelector('.site-header__logo--tpz');
  const epl = document.querySelector('.site-header__logo--epl');
  if (!tpz || !epl) return;

  const tpzLight = tpz.dataset.logoLight;
  const tpzDark  = tpz.dataset.logoDark;
  const eplLight = epl.dataset.logoLight;
  const eplDark  = epl.dataset.logoDark;

  // Używamy wyłącznie pełnych ścieżek z data-*
  if (!scrolled) {
    if (tpzLight) tpz.src = tpzLight;
    if (eplLight) epl.src = eplLight;
  } else {
    if (tpzDark) tpz.src = tpzDark;
    if (eplDark) epl.src = eplDark;
  }
}

/**
 * Obsługa scrolla (tylko dla strony głównej)
 */
function handleScroll() {
  if (!headerEl) return;

  const isScrolled = window.scrollY > 750;
  headerEl.classList.toggle('site-header--scrolled', isScrolled);

  // dopasuj logo do tła headera
  swapHeaderLogos(isScrolled);

  // efekt parallax na hero (bez zmian)
  if (heroContentEl && !motionQuery.matches) {
    window.requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroContentEl.style.transform = `translateY(${y * 0.3}px)`;
        heroContentEl.style.opacity = 1 - (y / (window.innerHeight / 1.5));
      }
    });
  }
}

/**
 * Inicjalizacja modułu nagłówka
 */
export function initHeader() {
  headerEl = $('#site-header');
  heroContentEl = $('#hero-content'); // Na podstronach to będzie null, i dobrze.

  if (!headerEl) return;

  // === POPRAWKA: Logika dla podstron ===
  // Sprawdzamy, czy <body> ma klasę .page (np. .page--contact)
  const isSubpage = document.body.classList.contains('page');

  if (isSubpage) {
    // Jesteśmy na podstronie. Wymuszamy stan "scrolled".
    headerEl.classList.add('site-header--scrolled');
    swapHeaderLogos(true); // Wymuś ciemne logo
    // WAŻNE: Nie dodajemy listenera scroll, bo nie jest potrzebny
    return; 
  }

  // === Logika dla strony głównej ===
  // Uruchamiamy normalne działanie (przezroczysty -> solidny)
  handleScroll(); // Ustaw stan początkowy (na hero będzie "not scrolled")
  window.addEventListener('scroll', handleScroll, { passive: true });
}