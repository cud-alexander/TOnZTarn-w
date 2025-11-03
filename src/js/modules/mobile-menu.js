/**
 * src/js/modules/mobile-menu.js
 * Obsługa mobilnego menu (drawer).
 */
import { $, on } from '../utils/dom.js';
import { trapFocus } from '../utils/a11y.js';

let hamburgerBtn = null;
let navMenu = null;
let cleanUpFocusTrap = () => {}; // Funkcja czyszcząca

/**
 * Otwiera lub zamyka menu
 * @param {boolean} [forceOpen] - Wymusza otwarcie lub zamknięcie
 */
function toggleMenu(forceOpen = null) {
    if (!hamburgerBtn || !navMenu) return;

    const isOpen = forceOpen !== null ? forceOpen : hamburgerBtn.getAttribute('aria-expanded') === 'false';

    hamburgerBtn.setAttribute('aria-expanded', isOpen);
    navMenu.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);

    if (isOpen) {
        // Ustawienie pułapki fokusu
        cleanUpFocusTrap = trapFocus(navMenu);
        // Ustawienie fokusu na pierwszym elemencie w menu
        navMenu.querySelector('a, button')?.focus();
    } else {
        // Czyszczenie pułapki fokusu
        cleanUpFocusTrap();
        // Zwrot fokusu na przycisk hamburgera
        hamburgerBtn.focus();
    }
}

/**
 * Inicjalizacja modułu menu mobilnego
 */
export function initMobileMenu() {
    hamburgerBtn = $('.site-header__hamburger');
    navMenu = $('#main-nav');

    if (!hamburgerBtn || !navMenu) {
        console.warn('Nie znaleziono elementów menu mobilnego.');
        return;
    }

    // Kliknięcie na hamburger
    on(hamburgerBtn, 'click', () => toggleMenu());

    // Zamykanie menu po kliknięciu linku wewnątrz
    on(navMenu, 'click', 'a', () => toggleMenu(false));

    // Zamykanie menu klawiszem Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
            toggleMenu(false);
        }
    });
}