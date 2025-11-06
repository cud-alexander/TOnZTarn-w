// /src/js/modules/mobile-menu.js
export function initMobileMenu() {
  const btn = document.querySelector('.site-header__hamburger');
  const nav = document.getElementById('main-nav');
  if (!btn || !nav) return;

  const OPEN_CLASS = 'is-open';

  // Create overlay once
  let overlay = document.querySelector('.mobile-nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    document.body.appendChild(overlay);
  }

  // Prepare for portaling nav out of the header so header can be hidden
  const originalParent = nav.parentNode;
  const originalNextSibling = nav.nextSibling;

  const focusableSelectors = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled])',
    'select:not([disabled])', 'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  const getFocusables = () => Array.from(nav.querySelectorAll(focusableSelectors));

  let headerWasScrolled = false;

  function openMenu() {
    if (nav.classList.contains(OPEN_CLASS)) return;
    // Lock scroll without repositioning the page (prevents jump on close)
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');

    // Move panel to body so we can hide header entirely
    if (nav.parentNode !== document.body) {
      document.body.appendChild(nav);
    }

    nav.classList.add(OPEN_CLASS);
    overlay.classList.add('is-active');
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');

    // Reset internal scroll and focus after render
    try { nav.scrollTop = 0; } catch {}
    requestAnimationFrame(() => { try { nav.scrollTop = 0; } catch {} });
    const [first] = getFocusables();
    if (first) first.focus();
    document.addEventListener('keydown', onKeyDown);
    const header = document.getElementById('site-header');
    if (header) {
      header.classList.add('menu-open');
      headerWasScrolled = header.classList.contains('site-header--scrolled');
      // While menu is open we display a solid light header bar,
      // so we want dark logos for contrast.
      header.classList.add('site-header--scrolled');
      const tpz = document.querySelector('.site-header__logo--tpz');
      const epl = document.querySelector('.site-header__logo--epl');
      if (tpz && tpz.dataset.logoDark) tpz.src = tpz.dataset.logoDark;
      if (epl && epl.dataset.logoDark) epl.src = epl.dataset.logoDark;
    }
  }

  function closeMenu() {
    if (!nav.classList.contains(OPEN_CLASS)) return;
    nav.classList.remove(OPEN_CLASS);
    btn.setAttribute('aria-expanded', 'false');
    // Start overlay fade, then completely unlock and restore DOM
    requestAnimationFrame(() => overlay.classList.remove('is-active'));

    const finish = () => {
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKeyDown);
      btn.focus();
      const header = document.getElementById('site-header');
      if (header) {
        header.classList.remove('menu-open');
        // Restore header scrolled state and logos
        const tpz = document.querySelector('.site-header__logo--tpz');
        const epl = document.querySelector('.site-header__logo--epl');
        if (!headerWasScrolled) {
          header.classList.remove('site-header--scrolled');
          if (tpz && tpz.dataset.logoLight) tpz.src = tpz.dataset.logoLight;
          if (epl && epl.dataset.logoLight) epl.src = epl.dataset.logoLight;
        } else {
          header.classList.add('site-header--scrolled');
          if (tpz && tpz.dataset.logoDark) tpz.src = tpz.dataset.logoDark;
          if (epl && epl.dataset.logoDark) epl.src = epl.dataset.logoDark;
        }
      }
      if (originalParent && nav.parentNode === document.body) {
        if (originalNextSibling) originalParent.insertBefore(nav, originalNextSibling);
        else originalParent.appendChild(nav);
      }
      overlay.removeEventListener('transitionend', finish);
    };
    overlay.addEventListener('transitionend', finish);
    // Fallback in case transitionend doesn't fire
    setTimeout(finish, 350);
  }

  function toggleMenu() {
    if (nav.classList.contains(OPEN_CLASS)) closeMenu();
    else openMenu();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
      return;
    }

    if (e.key === 'Tab') {
      const focusables = getFocusables();
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  btn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // Close on nav link click
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu();
  });

  // Close if viewport switches to desktop
  const mql = window.matchMedia('(min-width: 992px)');
  const onChange = () => { if (mql.matches) closeMenu(); };
  try { mql.addEventListener('change', onChange); } catch { mql.addListener(onChange); }
}
