import { useEffect, useRef } from 'react';

import { CURSOR_CONFIG } from './cursorConfig';

export default function CursorTrail() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const pointsRef = useRef([]);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2, t: performance.now() });
  const HOTSPOT_DX = CURSOR_CONFIG.HOTSPOT_DX;
  const HOTSPOT_DY = CURSOR_CONFIG.HOTSPOT_DY

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.zIndex = '3998';
    canvas.style.pointerEvents = 'none';
    canvas.style.mixBlendMode = 'screen';
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');
    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    resize();

    const onMove = (e) => {
      const x = e.clientX + HOTSPOT_DX, y = e.clientY + HOTSPOT_DY;
      const now = performance.now();
      mouseRef.current = { x, y, t: now };
      const prev = pointsRef.current[pointsRef.current.length - 1];
      const speed = prev ? Math.hypot(x - prev.x, y - prev.y) : 0;
      const count = Math.min(6, 2 + Math.floor(speed / 6));
      for (let i = 0; i < count; i++) {
        const type = Math.random() < 0.45 ? 'shard' : 'mote';
        pointsRef.current.push({ x, y, vx: (Math.random()-0.5)*0.8, vy: (Math.random()-0.5)*0.8, life: 500 + Math.random()*450, born: now, size: 1 + Math.random()*1.4, rot: Math.random()*Math.PI*2, type });
      }
      if (pointsRef.current.length > 400) pointsRef.current.splice(0, pointsRef.current.length - 400);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', resize);

    function tick() {
      const now = performance.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // emit a faint point periodically to keep alignment even without movement
      if (!pointsRef.current.length || now - mouseRef.current.t > 16) {
        const { x, y } = mouseRef.current;
        pointsRef.current.push({ x, y, vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4, life: 600 + Math.random()*300, born: now, size: 1 + Math.random()*1.2 });
      }

      const pts = pointsRef.current;
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        const t = (now - p.born) / p.life;
        if (t >= 1) { pts.splice(i, 1); continue; }
        p.x += p.vx; p.y += p.vy;
        const fade = Math.max(0, 1 - t);
        const alpha = 0.25 * fade;
        const r = Math.floor(212 + 30 * fade);
        const g = Math.floor(175 + 30 * fade);
        const b = 55;

        if (p.type === 'shard') {
          const w = 5 * p.size * fade;
          const h = 8 * p.size * fade;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = `rgba(${r},${g},${b},${0.7*alpha})`;
          ctx.beginPath();
          ctx.moveTo(0, -h/2);
          ctx.lineTo(w/2, 0);
          ctx.lineTo(0, h/2);
          ctx.lineTo(-w/2, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        } else {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8);
          grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
          grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI*2);
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      if (canvasRef.current && canvasRef.current.parentNode) canvasRef.current.parentNode.removeChild(canvasRef.current);
    };
  }, [HOTSPOT_DX, HOTSPOT_DY]);

  return null;
}
