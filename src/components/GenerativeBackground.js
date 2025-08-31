import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Layer = styled.canvas`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: 0.25;
`;

export default function GenerativeBackground() {
  const ref = useRef(null);
  const rafRef = useRef(0);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth);
      canvas.height = Math.floor(window.innerHeight);
    };
    resize();

    const N = Math.min(140, Math.floor((window.innerWidth * window.innerHeight) / 24000));
    particlesRef.current = Array.from({ length: N }, (_, i) => {
      const t = Math.random() * Math.PI * 2;
      const r = 40 + Math.random() * Math.min(canvas.width, canvas.height) * 0.5;
      return {
        x: canvas.width / 2 + Math.cos(t) * r,
        y: canvas.height / 2 + Math.sin(t) * r,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        life: 0.5 + Math.random() * 0.5,
        hue: 45 + Math.random() * 20,
        alpha: 0.2 + Math.random() * 0.35,
      };
    });

    const draw = (now) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const toMouse = 0.0008;

      for (const p of particlesRef.current) {
        // Drift toward mouse subtly
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        p.vx += dx * toMouse * p.life;
        p.vy += dy * toMouse * p.life;

        // Gentle curl
        const curl = 0.003;
        const vx = p.vx - p.vy * curl;
        const vy = p.vy + p.vx * curl;
        p.vx = vx * 0.995;
        p.vy = vy * 0.995;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap at edges to avoid hard bounces
        if (p.x < -20) p.x = w + 20;
        else if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        else if (p.y > h + 20) p.y = -20;

        const size = 0.8 + p.life * 2.2;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 10);
        grad.addColorStop(0, `rgba(255, 228, 128, ${0.22 * p.alpha})`);
        grad.addColorStop(1, 'rgba(255, 228, 128, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 10, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <Layer ref={ref} aria-hidden />;
}
