/**
 * src/js/utils/a11y.js
 * Narzędzia dostępności (Accessibility)
 */
import { $ } from './dom.js';

/**
 * Inicjalizuje link "Pomiń do treści"
 */
export function initSkipLink() {
    const skipLink = $('.skip-link');
    if (!skipLink) return;

    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = skipLink.getAttribute('href');
        const target = $(targetId);
        if (target) {
            target.setAttribute('tabindex', '-1');
            target.focus();
            target.addEventListener('blur', () => {
                target.removeAttribute('tabindex');
            }, { once: true });
        }
    });
}

/**
 * Selektory elementów fokusowalnych
 */
const FOCUSABLE_SELECTORS = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
].join(', ');

/**
 * Implementuje "pułapkę na fokus" wewnątrz danego elementu.
 * Niezbędne dla modalów i menu mobilnego.
 * * @param {HTMLElement} element - Element, w którym ma działać pułapka
 * @returns {function} Funkcja czyszcząca (usuwająca event listener)
 */
export function trapFocus(element) {
    const focusableElements = [...element.querySelectorAll(FOCUSABLE_SELECTORS)];
    if (focusableElements.length === 0) return () => {};

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    /**
     * @param {KeyboardEvent} e
     */
    const handleKeyDown = (e) => {
        if (e.key !== 'Tab' || e.code !== 'Tab') {
            return;
        }

        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else { // Tab
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    };

    element.addEventListener('keydown', handleKeyDown);

    // Zwraca funkcję do usunięcia listenera
    return () => {
        element.removeEventListener('keydown', handleKeyDown);
    };
}