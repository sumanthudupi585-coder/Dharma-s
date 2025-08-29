import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const CanvasWrap = styled.div`
  width: min(90vw, 1000px);
  height: min(46vh, 460px);
  display: grid;
  place-items: center;
  background: radial-gradient(ellipse at center, #1c1a24 0%, #0d0c10 100%);
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`;

// --- Configuration Constants for easy tweaking ---
const CONFIG = {
  formationMs: 4500,    // Slightly faster assembly
  holdMs: 3000,
  dissipationMs: 3500,  // Slightly faster dissolve
  maxParticles: 2800,   // Slightly reduced for performance headroom
  springStiffness: 0.045, // How 'snappy' the spring is
  dampingFactor: 0.85,    // Air resistance, prevents oscillation
  particleMass: 1.2,      // Affects acceleration
  dissipationGravity: -0.01 // Gentle upward float during dissipation
};

export default function SanskritSmokeText({
  text,
  secondaryText = '',
  onComplete
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    let disposed = false;

    function init() {
      const canvas = canvasRef.current;
      if (!canvas || disposed) return () => {};

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;
      const cx = w / 2, cy = h / 2;

      // Offscreen buffers (no change)
      const buffer = document.createElement('canvas');
      buffer.width = Math.floor(w);
      buffer.height = Math.floor(h);
      const bctx = buffer.getContext('2d');
      const sprite = document.createElement('canvas');
      const SPR = 128;
      sprite.width = SPR;
      sprite.height = SPR;
      const sctx = sprite.getContext('2d');

      const fontPrimary = 'Noto Serif Devanagari, Noto Sans Devanagari, serif';
      const englishFont = 'Crimson Text, serif';
      
      // Text layout and sampling (no major change)
      const maxBlockWidth = w * 0.88;
      const baseSize = Math.min(132, Math.max(48, Math.floor((w / Math.max(5, (text || '').length)) * 1.5)));
      const smallSize = Math.max(18, Math.floor(baseSize * 0.33));
      const pairGap = Math.floor(baseSize * 0.4);

      // (Helper functions wrapLines and samplePointsFromText are unchanged from the previous version)
      function wrapLines(str, font, size) {
        bctx.font = `600 ${size}px ${font}`; const words = (str || '').trim().split(/\s+/); const lines = []; if (words.length === 0) return lines; let current = ''; for (let i = 0; i < words.length; i++) { const test = current ? current + ' ' + words[i] : words[i]; if (bctx.measureText(test).width <= maxBlockWidth) current = test; else { if (current) lines.push(current); current = words[i]; } } if (current) lines.push(current); return lines;
      }
      const sansLines = wrapLines(text, fontPrimary, baseSize);
      const engLines = secondaryText ? wrapLines(secondaryText, englishFont, smallSize) : [];
      const lineHeightSans = Math.floor(baseSize * 1.05);
      const lineHeightEng = Math.floor(smallSize * 1.15);
      const blockHeight = (sansLines.length * lineHeightSans) + (engLines.length ? pairGap + engLines.length * lineHeightEng : 0);
      const yStartSans = cy - blockHeight / 2 + lineHeightSans / 2;
      function samplePointsFromText(lines, font, size, lineHeight, yStart, stepScale) {
        const points = []; bctx.clearRect(0, 0, w, h); bctx.fillStyle = '#fff'; bctx.textAlign = 'center'; bctx.textBaseline = 'middle'; bctx.font = font; let y = yStart; for(const line of lines) { bctx.fillText(line, cx, y); y += lineHeight; } const imgData = bctx.getImageData(0, 0, w, h).data; const step = Math.max(1, Math.floor(size * stepScale)); for (let py = 0; py < h; py += step) { for (let px = 0; px < w; px += step) { if (imgData[(py * w + px) * 4 + 3] > 128) { points.push({ x: px + (Math.random() - 0.5) * step * 0.8, y: py + (Math.random() - 0.5) * step * 0.8 }); } } } return points;
      }
      const pointsSans = samplePointsFromText(sansLines, `600 ${baseSize}px ${fontPrimary}`, baseSize, lineHeightSans, yStartSans, 0.04);
      let pointsEng = [];
      if (engLines.length) { const yStartEng = yStartSans + sansLines.length * lineHeightSans + pairGap + lineHeightEng / 2; pointsEng = samplePointsFromText(engLines, `italic 500 ${smallSize}px ${englishFont}`, smallSize, lineHeightEng, yStartEng, 0.05); }
      const allPoints = pointsSans.concat(pointsEng);
      const sampleRatio = Math.min(1, CONFIG.maxParticles / Math.max(1, allPoints.length));
      const targets = allPoints.filter(() => Math.random() < sampleRatio);

      // Particle initialization with physics properties
      const particles = targets.map((t) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * 80;
        const depth = 0.5 + Math.random() * 0.8;
        return {
          x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius, // Current position
          vx: 0, vy: 0,                                                        // Velocity
          tx: t.x, ty: t.y,                                                    // Target position
          mass: CONFIG.particleMass + (1 - depth) * 2,                         // Heavier particles are 'further back' and move slower
          depth,
          phase1: Math.random() * Math.PI * 2, phase2: Math.random() * Math.PI * 2, // FBM noise
          freq1: (0.0005 + Math.random() * 0.001), freq2: (0.0002 + Math.random() * 0.0005),
          amp1: 1.0 + Math.random() * 0.8, amp2: 1.5 + Math.random(),
        };
      });

      let start = performance.now();
      let last = start;
      const totalDuration = CONFIG.formationMs + CONFIG.holdMs + CONFIG.dissipationMs;

      function easeInOutQuart(x) { return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2; }
      function lerp(a, b, t) { return a + (b - a) * t; }

      // Enhanced sprite paint function
      function paintSprite(r, g, b, a) {
        sctx.clearRect(0, 0, SPR, SPR);
        const cxS = SPR / 2, cyS = SPR / 2;
        const grad1 = sctx.createRadialGradient(cxS, cyS, 0, cxS, cyS, SPR / 2);
        grad1.addColorStop(0, `rgba(${r},${g},${b},${a * 0.8})`);
        grad1.addColorStop(0.6, `rgba(${r},${g},${b},${a * 0.2})`);
        grad1.addColorStop(1, `rgba(${r},${g},${b},0)`);
        sctx.fillStyle = grad1;
        sctx.fillRect(0, 0, SPR, SPR);
        const grad2 = sctx.createRadialGradient(cxS * 1.2, cyS * 0.8, 0, cxS, cyS, SPR * 0.7);
        grad2.addColorStop(0, `rgba(255,255,255,${a * 0.25})`);
        grad2.addColorStop(1, `rgba(255,255,255,0)`);
        sctx.fillStyle = grad2;
        sctx.fillRect(0, 0, SPR, SPR);
      }

      function tick(now) {
        if (disposed) return;
        const elapsed = now - start;
        const dt = Math.min(48, now - last); // Clamp delta time to avoid huge jumps
        last = now;
        const dtFactor = dt / 16.67; // Normalize for 60fps baseline

        // --- MOTION BLUR EFFECT ---
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(13, 12, 16, 0.4)'; // The alpha value controls trail length
        ctx.fillRect(0, 0, w, h);

        const blend = Math.min(1, elapsed / (CONFIG.formationMs * 0.9));
        const goldR = Math.floor(lerp(255, 212, blend));
        const goldG = Math.floor(lerp(245, 175, blend));
        const goldB = Math.floor(lerp(200, 55, blend));
        paintSprite(goldR, goldG, goldB, 0.9);

        ctx.globalCompositeOperation = 'lighter';

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const t = Math.min(1, elapsed / CONFIG.formationMs);
          const e = easeInOutQuart(t);

          // --- SPRING PHYSICS ---
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          const springForceX = dx * CONFIG.springStiffness;
          const springForceY = dy * CONFIG.springStiffness;
          const dampingForceX = -p.vx * CONFIG.dampingFactor;
          const dampingForceY = -p.vy * CONFIG.dampingFactor;

          // FBM Drift
          p.phase1 += dt * p.freq1;
          p.phase2 += dt * p.freq2;
          const driftX = Math.sin(p.phase1) * p.amp1 * (1.2 - e);
          const driftY = Math.cos(p.phase2) * p.amp2 * (1.2 - e);
          
          let totalForceX = springForceX + dampingForceX + driftX;
          let totalForceY = springForceY + dampingForceY + driftY;

          // Dissipation Phase: Reduce spring force and add upward drift
          if (elapsed > CONFIG.formationMs + CONFIG.holdMs) {
            const dissipationT = (elapsed - CONFIG.formationMs - CONFIG.holdMs) / CONFIG.dissipationMs;
            totalForceX *= (1 - dissipationT); // Weaken spring
            totalForceY *= (1 - dissipationT);
            totalForceY += CONFIG.dissipationGravity * p.mass; // Add upward float
          }

          const ax = totalForceX / p.mass;
          const ay = totalForceY / p.mass;

          p.vx += ax * dtFactor;
          p.vy += ay * dtFactor;
          p.x += p.vx * dtFactor;
          p.y += p.vy * dtFactor;
          
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          
          let finalAlpha, finalRadius;
          
          if (elapsed < CONFIG.formationMs + CONFIG.holdMs) {
            finalAlpha = (0.1 + e * 0.9);
            finalRadius = (p.depth * 2) + (e * 15 * (2.1 - p.depth)) * (1 + speed * 0.05);
          } else {
            const dissipationT = easeInOutQuart((elapsed - CONFIG.formationMs - CONFIG.holdMs) / CONFIG.dissipationMs);
            finalAlpha = (1 - dissipationT) * (0.1 + e * 0.9);
            finalRadius = (p.depth * 2) + (e * 15 * (2.1 - p.depth)) * (1 + dissipationT * 1.5);
          }

          ctx.globalAlpha = Math.max(0, finalAlpha / p.depth);
          ctx.drawImage(sprite, p.x - finalRadius, p.y - finalRadius, finalRadius * 2, finalRadius * 2);
        }
        
        // Crisp overlay text (no change to logic, just timing)
        // (This code block is the same as the previous version, just ensure timings are linked to CONFIG)
        const rawAppear = Math.min(1, Math.max(0, (elapsed - CONFIG.formationMs * 0.6) / (CONFIG.formationMs * 0.4)));
        const appear = easeInOutQuart(rawAppear);
        if (appear > 0 && elapsed < CONFIG.formationMs + CONFIG.holdMs) {
            ctx.save();
            const fadeOut = 1 - Math.max(0, (elapsed - CONFIG.formationMs) / CONFIG.holdMs);
            ctx.globalAlpha = Math.min(0.95, appear * fadeOut);
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.shadowColor = 'rgba(255, 220, 150, 0.7)'; ctx.shadowBlur = 24;
            let yy = yStartSans;
            for (const line of sansLines) {
                const grad = ctx.createLinearGradient(cx - 50, yy - 20, cx + 50, yy + 20);
                grad.addColorStop(0, 'rgba(255, 240, 180, 0.95)'); grad.addColorStop(1, 'rgba(212, 175, 55, 0.95)');
                ctx.fillStyle = grad; ctx.font = `600 ${baseSize}px ${fontPrimary}`; ctx.fillText(line, cx, yy); yy += lineHeightSans;
            }
            if (engLines.length) {
                yy = yStartSans + sansLines.length * lineHeightSans + pairGap + lineHeightEng / 2;
                ctx.fillStyle = 'rgba(233, 214, 143, 0.92)'; ctx.shadowBlur = 16; ctx.font = `italic 500 ${smallSize}px ${englishFont}`;
                for (const line of engLines) { ctx.fillText(line, cx, yy); yy += lineHeightEng; }
            }
            ctx.restore();
        }

        if (elapsed < totalDuration) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          if (onComplete) onComplete();
        }
      }

      rafRef.current = requestAnimationFrame(tick);

      function handleResize() {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        init();
      }
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    const cleanup = init();
    return () => {
      disposed = true;
      if (cleanup) cleanup();
    };
  }, [text, secondaryText, onComplete]);

  return (
    <CanvasWrap>
      <Canvas ref={canvasRef} />
    </CanvasWrap>
  );
}