import { useEffect, useRef } from 'react';

// --- Configuration for easy tweaking ---
const CONFIG = {
  // Performance
  MAX_PARTICLES: 160,
  // Physics (more damping, lighter gravity)
  FRICTION: 0.9,
  GRAVITY: 0.02,
  // Emission (softer)
  EMISSION_RATE: 2,
  // Appearance
  PARTICLE_LIFE: 1000,
  PARTICLE_SIZE: 1.1,
  // Golden palette
  PALETTE: ['#fff3a0', '#ffe27a', '#ffd24d', '#ffc107', '#d4af37']
};

export default function CursorTrail() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -999, y: -999, vx: 0, vy: 0 });
  const emissionAccRef = useRef(0);

  // --- 1. Pre-render Sprites for Performance ---
  const moteSprite = useRef(null);
  const shardSprite = useRef(null);

  useEffect(() => {
    // Helper to create a pre-rendered sprite canvas
    const createSprite = (size, drawFn) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.height = size;
      drawFn(ctx, size);
      return canvas;
    };

    moteSprite.current = createSprite(32, (ctx, size) => {
      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, 'rgba(255, 224, 128, 0.9)');
      grad.addColorStop(1, 'rgba(255, 224, 128, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(size/2, size/2, size/2, 0, Math.PI*2);
      ctx.fill();
    });

    shardSprite.current = createSprite(16, (ctx, size) => {
      ctx.fillStyle = '#ffd24d';
      ctx.beginPath();
      ctx.moveTo(size / 2, 0); ctx.lineTo(size, size / 2);
      ctx.lineTo(size / 2, size); ctx.lineTo(0, size / 2);
      ctx.closePath();
      ctx.fill();
    });
  }, []);


  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.zIndex = '3998';
    canvas.style.pointerEvents = 'none';
    canvas.style.mixBlendMode = 'screen';
    canvas.style.filter = 'blur(1px)';
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = Math.floor(window.innerWidth);
      canvas.height = Math.floor(window.innerHeight);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    resize();

    const onMove = (e) => {
      const now = performance.now();
      const lastPos = mouseRef.current;
      const x = e.clientX;
      const y = e.clientY;

      // --- 2. Calculate mouse velocity and handle smooth emission ---
      const dx = x - lastPos.x;
      const dy = y - lastPos.y;
      const dist = Math.hypot(dx, dy);

      mouseRef.current = { x, y, vx: dx, vy: dy };

      emissionAccRef.current += dist * CONFIG.EMISSION_RATE;
      const particlesToEmit = Math.floor(emissionAccRef.current);
      if (particlesToEmit > 0) {
        emissionAccRef.current -= particlesToEmit;
        for (let i = 0; i < particlesToEmit; i++) {
          if (particlesRef.current.length >= CONFIG.MAX_PARTICLES) break;

          const type = Math.random() < 0.4 ? 'shard' : 'mote';
          const color = CONFIG.PALETTE[Math.floor(Math.random() * CONFIG.PALETTE.length)];

          particlesRef.current.push({
            x, y,
            // gentler initial velocity
            vx: -dx * (0.08 + Math.random() * 0.12) + (Math.random() - 0.5) * 0.4,
            vy: -dy * (0.08 + Math.random() * 0.12) + (Math.random() - 0.5) * 0.4,
            life: CONFIG.PARTICLE_LIFE * (0.9 + Math.random() * 0.3),
            born: now,
            size: CONFIG.PARTICLE_SIZE * (0.6 + Math.random() * 0.5),
            rot: Math.random() * Math.PI * 2,
            type,
            color,
          });
        }
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', resize);

    function tick(now) {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Filter out dead particles
      particlesRef.current = particlesRef.current.filter(p => now - p.born < p.life);

      for (const p of particlesRef.current) {
        // --- 4. Apply physics ---
        p.vx *= CONFIG.FRICTION;
        p.vy *= CONFIG.FRICTION;
        p.vy += CONFIG.GRAVITY;
        p.x += p.vx;
        p.y += p.vy;

        // --- 5. Beautiful lifecycle fade ---
        const t = (now - p.born) / p.life;
        // A sine curve makes a nice fade-in, fade-out
        const alpha = Math.sin(t * Math.PI);
        const size = p.size * (1 - t);

        ctx.globalAlpha = alpha;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.shadowColor = 'rgba(212,175,55,0.6)';
        ctx.shadowBlur = 10;
        const sprite = p.type === 'shard' ? shardSprite.current : moteSprite.current;
        const drawSize = size * (p.type === 'shard' ? 10 : 28);
        ctx.drawImage(sprite, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      document.body.removeChild(canvas);
    };
  }, []);

  return null; // This component doesn't render any DOM elements itself
}
