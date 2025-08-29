import { useEffect, useRef } from 'react';

// --- Configuration for easy tweaking ---
const CONFIG = {
  // Performance
  MAX_PARTICLES: 300,
  // Physics
  FRICTION: 0.96,
  GRAVITY: 0.08,
  // Emission
  EMISSION_RATE: 4, // Higher = more particles per distance moved
  // Appearance
  PARTICLE_LIFE: 800, // in milliseconds
  PARTICLE_SIZE: 1.2,
  // Colors for the particles, picked randomly
  PALETTE: ['#FFFFFF', '#F0E68C', '#FFD700', '#FFA500', '#FF8C00']
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
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
    });

    shardSprite.current = createSprite(16, (ctx, size) => {
      ctx.fillStyle = 'white';
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
    canvas.style.zIndex = '9999'; // High z-index to be on top
    canvas.style.pointerEvents = 'none';
    canvas.style.mixBlendMode = 'lighter'; // 'lighter' is often better for glow effects
    canvas.style.filter = 'blur(0.5px)';
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
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
          if (particlesRef.current.length >= CONFIG.MAX_PARTICLES) return;

          const type = Math.random() < 0.4 ? 'shard' : 'mote';
          const color = CONFIG.PALETTE[Math.floor(Math.random() * CONFIG.PALETTE.length)];

          particlesRef.current.push({
            x, y,
            // --- 3. Inherit velocity from the cursor for a "flick" effect ---
            vx: -dx * (0.2 + Math.random() * 0.4) + (Math.random() - 0.5),
            vy: -dy * (0.2 + Math.random() * 0.4) + (Math.random() - 0.5),
            life: CONFIG.PARTICLE_LIFE * (0.8 + Math.random() * 0.4),
            born: now,
            size: CONFIG.PARTICLE_SIZE * (0.5 + Math.random() * 0.5),
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
      ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));

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
        ctx.fillStyle = p.color; // Set color for shards
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        // --- 6. Draw the pre-rendered sprite ---
        const sprite = p.type === 'shard' ? shardSprite.current : moteSprite.current;
        const drawSize = size * (p.type === 'shard' ? 8 : 24);
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
  }, []); // Empty dependency array ensures this runs only once

  return null; // This component doesn't render any DOM elements itself
}