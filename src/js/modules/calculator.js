/**
 * src/js/modules/calculator.js
 * Prosty kalkulator 1.5% PIT.
 */
// === ZMIANA: Usunęliśmy import 'on', ponieważ nie był tu potrzebny ===
import { $ } from '../utils/dom.js';

let calculatorForm = null;
let amountInput = null;
let resultOutput = null;

const formatter = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
});

/**
 * Przelicza kwotę i aktualizuje widok
 */
function calculate() {
    if (!amountInput || !resultOutput) return;

    const rawValue = parseFloat(amountInput.value);
    
    if (isNaN(rawValue) || rawValue < 0) {
        resultOutput.textContent = formatter.format(0);
        return;
    }

    const calculatedAmount = rawValue * 0.015; // 1.5%
    resultOutput.textContent = formatter.format(calculatedAmount);
}

/**
 * Inicjalizacja kalkulatora
 */
export function initCalculator() {
    calculatorForm = $('#calculator-1-5');
    if (!calculatorForm) {
        // Jesteśmy na innej stronie, zakończ
        return;
    }

    amountInput = $('#pit-amount');
    resultOutput = $('#pit-result');

    if (!amountInput || !resultOutput) {
        console.warn('Nie znaleziono elementów kalkulatora 1.5%');
        return;
    }

    // === ZMIANA: Używamy standardowego 'addEventListener' zamiast błędnego 'on' ===
    amountInput.addEventListener('input', calculate);
    
    // === ZMIANA: Używamy standardowego 'addEventListener' zamiast błędnego 'on' ===
    calculatorForm.addEventListener('submit', (e) => e.preventDefault());

    // Inicjalna kalkulacja (jeśli jest jakaś wartość)
    calculate();
}