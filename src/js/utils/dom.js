/**
 * src/js/utils/dom.js
 * Narzędzia pomocnicze DOM
 */

/**
 * Skrót dla querySelector
 * @param {string} selector - Selektor CSS
 * @param {Element|Document} [context=document] - Kontekst wyszukiwania
 * @returns {Element|null}
 */
export const $ = (selector, context = document) => context.querySelector(selector);

/**
 * Skrót dla querySelectorAll
 * @param {string} selector - Selektor CSS
 * @param {Element|Document} [context=document] - Kontekst wyszukiwania
 * @returns {Element[]}
 */
export const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

/**
 * Delegacja zdarzeń
 * @param {Element} targetElement - Element, na którym nasłuchujemy
 * @param {string} eventType - Typ zdarzenia (np. 'click')
 * @param {string} selector - Selektor dla elementów docelowych
 * @param {function} handler - Funkcja obsługi zdarzenia
 */
export function on(targetElement, eventType, selector, handler) {
    targetElement.addEventListener(eventType, (e) => {
        if (e.target.closest(selector)) {
            handler(e, e.target.closest(selector));
        }
    });
}