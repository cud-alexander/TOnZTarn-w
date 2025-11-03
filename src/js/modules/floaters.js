/**
 * Lekkie floater’y dla sekcji.
 */

const ASSETS = {
  paw: `<svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
          <path d="M43.5 33.5c3.3 2.1 6.1 7.5 3.4 11.1-3.7 4.9-14.6 6.2-21.6 5.1-5.9-1-8-5.7-6.4-9.9 1.3-3.5 4-5.2 6.6-6.6 1.9-1 4.1-1.7 6.2-1.9 3.8-.4 7.6.4 11.8 2.2z"/>
          <circle cx="19" cy="21" r="6"/>
          <circle cx="30" cy="16" r="6.5"/>
          <circle cx="43" cy="18" r="6"/>
          <circle cx="51" cy="26" r="5.5"/>
        </svg>`,
  bone: `<svg viewBox="0 0 128 64" fill="currentColor" aria-hidden="true">
    <g transform="rotate(45 64 32)">
        <circle cx="20" cy="20" r="10"></circle>
        <circle cx="20" cy="44" r="10"></circle>
        <circle cx="108" cy="20" r="10"></circle>
        <circle cx="108" cy="44" r="10"></circle>
        <rect x="20" y="24" width="88" height="16" rx="8" ry="8"></rect>
    </g>
        </svg>`,
  heart: `<svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
            <path d="M32 55s-19-12.5-24-21C3 25 7 14 18 14c6 0 10 4 14 8 4-4 8-8 14-8 11 0 15 11 10 20-5 8.5-24 21-24 21z"/>
          </svg>`
};

function rand(min, max) { return Math.random() * (max - min) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export function attachFloaters(zoneEl, opts = {}) {
  const settings = {
    count: 10,
    speed: 1.0,
    density: 1.0,
    zindex: 0,
    palette: ['floater--accent', 'floater--accent2', 'floater--neutral'],
    shapes: ['paw', 'bone', 'heart'],
    ...opts
  };

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const layer = document.createElement('div');
  layer.className = 'floater-layer';
  layer.style.zIndex = String(settings.zindex);
  zoneEl.prepend(layer);

  const bounds = () => layer.getBoundingClientRect();

  const items = [];

  for (let i = 0; i < settings.count; i++) {
    const el = document.createElement('div');
    el.className = `floater ${pick(settings.palette)}`;
    el.innerHTML = ASSETS[pick(settings.shapes)];
    const size = Math.round(rand(36, 112));
    
    if (Math.random() < 0.6) {
        el.classList.add('floater--spin');
        el.style.setProperty('--spin', `${rand(18, 36)}s`);
        el.style.setProperty('--spin-start', `${rand(0, 360)}deg`);
    }

    el.style.setProperty('--size', `${size}px`);
    
    /* === POPRAWKA: Usunięto dwie błędne linie kodu === */
    // - el.style.left ; `${rand(0, 100)}%`;  <- BŁĘDNA LINIA
    // - el.style.top  ; `${rand(0, 100)}%`;  <- BŁĘDNA LINIA
    
    layer.appendChild(el);

    const phase = rand(0, Math.PI * 2);
    const ampX = rand(20, 120) * settings.density;
    const ampY = rand(10, 80) * settings.density;
    const baseX = rand(0.1, 0.9);
    const baseY = rand(0.1, 0.9);
    const vel = rand(0.3, 1.2) / settings.speed;

    items.push({ el, phase, ampX, ampY, baseX, baseY, vel });
  }

  let rafId = null;
  let t0 = performance.now();

  function frame(t) {
    const b = bounds();
    // Zapobiegaj błędom, jeśli element ma zerowy wymiar
    if (b.width === 0 || b.height === 0) {
      rafId = requestAnimationFrame(frame);
      return;
    }

    const dt = (t - t0) / 1000;
    t0 = t;

    for (const it of items) {
      it.phase += it.vel * dt;
      const x = it.baseX * b.width + Math.cos(it.phase * 0.9) * it.ampX;
      const y = it.baseY * b.height + Math.sin(it.phase * 1.3) * it.ampY;
      it.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    rafId = requestAnimationFrame(frame);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (reduced) {
        cancelAnimationFrame(rafId);
        items.forEach(it => it.el.style.opacity = .12);
        return;
      }
      if (e.isIntersecting) {
        cancelAnimationFrame(rafId);
        t0 = performance.now();
        rafId = requestAnimationFrame(frame);
        items.forEach(it => it.el.style.opacity = .25);
      } else {
        cancelAnimationFrame(rafId);
        items.forEach(it => it.el.style.opacity = .12);
      }
    });
  }, { threshold: 0.05 });

  io.observe(zoneEl);

  return () => {
    cancelAnimationFrame(rafId);
    io.disconnect();
    layer.remove();
  };
}
export default attachFloaters;