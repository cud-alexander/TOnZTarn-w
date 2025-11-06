// /src/js/modules/mobile-menu.js
export function initMobileMenu() {
  const btn = document.querySelector('.site-header__hamburger');
  const nav = document.getElementById('main-nav');
  if (!btn || !nav) return;

  const OPEN = 'is-nav-open';

  const toggle = () => {
    const isOpen = nav.classList.toggle(OPEN);
    btn.setAttribute('aria-expanded', String(isOpen));
    document.documentElement.classList.toggle('no-scroll', isOpen);
  };

  btn.addEventListener('click', toggle);

  // zamknij po kliknięciu w link
  nav.addEventListener('click', e => {
    if (e.target.closest('a')) {
      nav.classList.remove(OPEN);
      btn.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('no-scroll');
    }
  });
}
