/**
 * src/js/modules/reveal.js
 * Animacje wejścia elementów przy scrollu (Intersection Observer).
 */
import { $$ } from '../utils/dom.js';

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let observer;

/**
 * Callback dla Intersection Observer
 * @param {IntersectionObserverEntry[]} entries
 */
function handleIntersect(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            
            // Pobranie opóźnienia z data-atrybutu
            const delay = entry.target.dataset.revealDelay || '0';
            entry.target.style.transitionDelay = `${delay}ms`;

            // Przestajemy obserwować element po animacji
            observer.unobserve(entry.target);
        }
    });
}

/**
 * Inicjalizacja obserwatora
 */
export function initReveal() {
    // Nie uruchamiaj animacji, jeśli użytkownik preferuje redukcję ruchu
    if (motionQuery.matches) {
        return;
    }

    const elementsToReveal = $$('.reveal-on-scroll');
    if (elementsToReveal.length === 0) {
        return;
    }

    observer = new IntersectionObserver(handleIntersect, {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% elementu musi być widoczne
    });

    elementsToReveal.forEach(el => {
        observer.observe(el);
    });
}