import React, { useEffect, useRef, useState } from 'react';
import { CURSOR_CONFIG } from './cursorConfig';

export default function NavigatorSigilCursor() {
  const ref = useRef(null);
  const [state, setState] = useState('idle'); // 'idle' | 'hover' | 'loading'
  const posRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.left = '0';
    el.style.top = '0';
    el.style.width = '0';
    el.style.height = '0';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '3999';
    ref.current = el;

    const svgNS = 'http://www.w3.org/2000/svg';
    const size = CURSOR_CONFIG.SIZE;
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.setAttribute('viewBox', '0 0 48 48');
    svg.style.transform = `translate(-24px, -24px)`; // center on mouse
    svg.style.filter = 'drop-shadow(0 0 8px rgba(212,175,55,0.45))';

    // defs
    const defs = document.createElementNS(svgNS, 'defs');
    const grad = document.createElementNS(svgNS, 'linearGradient');
    grad.setAttribute('id', 'gold');
    grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
    grad.setAttribute('x2', '0'); grad.setAttribute('y2', '1');
    const s1 = document.createElementNS(svgNS, 'stop'); s1.setAttribute('offset', '0%'); s1.setAttribute('stop-color', '#fff3a0');
    const s2 = document.createElementNS(svgNS, 'stop'); s2.setAttribute('offset', '100%'); s2.setAttribute('stop-color', '#d4af37');
    grad.appendChild(s1); grad.appendChild(s2);

    const dark = document.createElementNS(svgNS, 'radialGradient');
    dark.setAttribute('id', 'darkBody');
    dark.setAttribute('cx', '50%'); dark.setAttribute('cy', '50%'); dark.setAttribute('r', '60%');
    const d1 = document.createElementNS(svgNS, 'stop'); d1.setAttribute('offset', '0%'); d1.setAttribute('stop-color', '#222');
    const d2 = document.createElementNS(svgNS, 'stop'); d2.setAttribute('offset', '100%'); d2.setAttribute('stop-color', '#0b0b0b');
    dark.appendChild(d1); dark.appendChild(d2);

    defs.appendChild(grad); defs.appendChild(dark);
    svg.appendChild(defs);

    // Root group to allow whole-cursor rotation
    const gRoot = document.createElementNS(svgNS, 'g');

    // Outer dark disc
    const disc = document.createElementNS(svgNS, 'circle');
    disc.setAttribute('cx', '24'); disc.setAttribute('cy', '24'); disc.setAttribute('r', '15');
    disc.setAttribute('fill', 'url(#darkBody)');
    disc.setAttribute('stroke', 'url(#gold)');
    disc.setAttribute('stroke-width', '1.2');
    gRoot.appendChild(disc);

    // Art Nouveau outer swirl ring
    const swirl = document.createElementNS(svgNS, 'path');
    swirl.setAttribute('d', 'M24 8 C18 10 16 14 16 18 C16 22 20 24 24 24 C28 24 32 26 32 30 C32 34 30 38 24 40');
    swirl.setAttribute('fill', 'none');
    swirl.setAttribute('stroke', 'url(#gold)');
    swirl.setAttribute('stroke-width', '1');
    swirl.setAttribute('stroke-linecap', 'round');
    gRoot.appendChild(swirl);

    // Art Deco cardinal pointers
    const pointers = document.createElementNS(svgNS, 'g');
    pointers.setAttribute('id', 'pointers');
    const north = document.createElementNS(svgNS, 'path');
    north.setAttribute('d', 'M24 6 L27 12 L24 10 L21 12 Z');
    north.setAttribute('fill', 'url(#gold)');
    const east = document.createElementNS(svgNS, 'path'); east.setAttribute('d', 'M42 24 L36 21 L38 24 L36 27 Z'); east.setAttribute('fill', 'url(#gold)');
    const south = document.createElementNS(svgNS, 'path'); south.setAttribute('d', 'M24 42 L27 36 L24 38 L21 36 Z'); south.setAttribute('fill', 'url(#gold)');
    const west = document.createElementNS(svgNS, 'path'); west.setAttribute('d', 'M6 24 L12 27 L10 24 L12 21 Z'); west.setAttribute('fill', 'url(#gold)');
    pointers.appendChild(north); pointers.appendChild(east); pointers.appendChild(south); pointers.appendChild(west);
    gRoot.appendChild(pointers);

    // Central gem
    const gem = document.createElementNS(svgNS, 'circle');
    gem.setAttribute('cx', '24'); gem.setAttribute('cy', '24'); gem.setAttribute('r', '2.6');
    gem.setAttribute('fill', '#ffeaa0');
    gRoot.appendChild(gem);

    svg.appendChild(gRoot);
    el.appendChild(svg);
    document.body.appendChild(el);

    function onMove(e) {
      posRef.current = { x: e.clientX + CURSOR_CONFIG.HOTSPOT_DX, y: e.clientY + CURSOR_CONFIG.HOTSPOT_DY };
      el.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;

      const target = document.elementFromPoint(e.clientX, e.clientY);
      const interactive = target && (target.classList.contains('is-interactive') || target.tagName === 'BUTTON' || target.tagName === 'A' || target.getAttribute('role') === 'button');
      setState(interactive ? 'hover' : (document.body.classList.contains('cursor-loading') ? 'loading' : 'idle'));
    }

    window.addEventListener('mousemove', onMove);

    // breathing animation via raf
    let raf;
    function tick() {
      const t = performance.now();
      const breath = 0.95 + 0.05 * Math.sin(t / 900);
      const glow = state === 'hover' ? 1 : state === 'loading' ? 1 : 0.75;
      gem.setAttribute('r', String(2.4 * breath + (state === 'hover' ? 0.6 : 0)));
      svg.style.filter = `drop-shadow(0 0 ${state==='hover'?10:8}px rgba(212,175,55,${glow}))`;
      // loading: counter rotations
      if (state === 'loading') {
        const rot = (t / 40) % 360;
        pointers.setAttribute('transform', `rotate(${rot} 24 24)`);
        swirl.setAttribute('transform', `rotate(${-rot} 24 24)`);
        gRoot.setAttribute('transform', '');
      } else if (state === 'hover') {
        const rotAll = (t / 12) % 360; // rotate whole cursor on hover
        gRoot.setAttribute('transform', `rotate(${rotAll} 24 24)`);
        swirl.setAttribute('transform', '');
        pointers.setAttribute('transform', '');
      } else {
        gRoot.setAttribute('transform', '');
        pointers.setAttribute('transform', '');
        swirl.setAttribute('transform', '');
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    // Activate custom cursor hide
    document.body.classList.add('custom-cursor-active');

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.body.classList.remove('custom-cursor-active');
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, [state]);

  return null;
}
