/**
 * src/js/utils/clipboard.js
 * Moduł do kopiowania tekstu do schowka po kliknięciu.
 */
export function initCopyToClipboard() {
  // Znajdź wszystkie elementy, które mają trigger kopiowania
  const copyTriggers = document.querySelectorAll('[data-copy-target]');
  
  if (copyTriggers.length === 0) return; // Wyjdź, jeśli nie ma co robić

  copyTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const textToCopy = trigger.dataset.copyTarget;
      if (!textToCopy) return;

      // Nowoczesna asynchroniczna metoda kopiowania
      navigator.clipboard.writeText(textToCopy).then(() => {
        // SUKCES: Daj użytkownikowi feedback

        // Używamy ID, które dodaliśmy w HTML
        const label = trigger.querySelector('#krs-copy-label'); 
        if (!label) return;

        const originalText = label.textContent;
        trigger.classList.add('is-copied');
        label.textContent = 'Skopiowano!';

        // Wróć do oryginalnego tekstu po 2 sekundach
        setTimeout(() => {
          label.textContent = originalText;
          trigger.classList.remove('is-copied');
        }, 2000);

      }).catch(err => {
        // Błąd (np. brak uprawnień)
        console.error('Błąd: Nie udało się skopiować tekstu do schowka.', err);
      });
    });
  });
}