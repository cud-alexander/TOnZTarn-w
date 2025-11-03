/**
 * src/js/utils/orphans.js
 * Moduł do naprawiania "wiszących spójników" (sierotek).
 * Wyszukuje krótkie słowa i zastępuje po nich spację
 * twardą spacją (&nbsp;), aby "przykleić" je do następnego słowa.
 */

// Lista selektorów, w których chcemy naprawiać tekst.
// Możesz ją rozszerzyć o inne klasy, np. '.card__text', '.footer p' itp.
const TARGET_SELECTORS = [
  '.section--mission p',
  '.card__text',
  '.help-option p',
  '.cta-banner__text',
  '.section--contact-preview p',
  '.site-footer__col--about p'
];

// Regex dopasowujący krótkie, wiszące słowa (z uwzględnieniem wielkości liter)
// \b = granica słowa (word boundary)
// (i|o|u|w|z|a|że|na|do|po|od|by|co|we|ze) = grupa pasujących słów
// \s+ = jeden lub więcej białych znaków (spacja, enter itp.)
// 'gi' = g (globalnie, wszystkie wystąpienia) i (ignoruj wielkość liter)
const ORPHAN_REGEX = /\b(i|o|u|w|z|a|że|na|do|po|od|by|co|we|ze)\b\s+/gi;

// Funkcja do inicjalizacji
export function initOrphanFix() {
  console.debug('[orphans] running');
  
  const elements = document.querySelectorAll(TARGET_SELECTORS.join(', '));
  
  if (elements.length === 0) {
    console.warn('[orphans] No target elements found.');
    return;
  }

  elements.forEach(element => {
    // Używamy innerHTML, ponieważ wstawiamy encję HTML (&nbsp;)
    // $1 odnosi się do dopasowanej grupy w regexie (czyli samego słowa)
    element.innerHTML = element.innerHTML.replace(ORPHAN_REGEX, '$1&nbsp;');
  });
}