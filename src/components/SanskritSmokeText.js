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

// --- New configuration for ultimate smoothness ---
const CONFIG = {
  formationMs: 4500,
  holdMs: 3000,
  dissipationMs: 3500,
  maxParticles: 2200,      // Reduced for guaranteed performance
  // This is the key to the new physics model. Higher value = faster, smoother convergence.
  damping: 0.08,
  driftFactor: 0.8,        // Controls the 'smokey' drift
  dissipationSpeed: 0.5,   // How fast particles float away
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

      const dpr = Math.min(1.5, window.devicePixelRatio || 1); // Capping DPR can also help performance
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;
      const cx = w / 2, cy = h / 2;

      // Offscreen buffers
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
      
      // Text layout and sampling (unchanged)
      const maxBlockWidth = w * 0.88;
      const baseSize = Math.min(132, Math.max(48, Math.floor((w / Math.max(5, (text || '').length)) * 1.5)));
      const smallSize = Math.max(18, Math.floor(baseSize * 0.33));
      const pairGap = Math.floor(baseSize * 0.4);
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
      const pointsSans = samplePointsFromText(sansLines, `600 ${baseSize}px ${fontPrimary}`, baseSize, lineHeightSans, yStartSans, 0.045);
      let pointsEng = [];
      if (engLines.length) { const yStartEng = yStartSans + sansLines.length * lineHeightSans + pairGap + lineHeightEng / 2; pointsEng = samplePointsFromText(engLines, `italic 500 ${smallSize}px ${englishFont}`, smallSize, lineHeightEng, yStartEng, 0.055); }
      const allPoints = pointsSans.concat(pointsEng);
      const sampleRatio = Math.min(1, CONFIG.maxParticles / Math.max(1, allPoints.length));
      const targets = allPoints.filter(() => Math.random() < sampleRatio);

      // Particle initialization
      const particles = targets.map((t) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 100;
        const depth = 0.4 + Math.random() * 0.6;
        return {
          x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius,
          tx: t.x, ty: t.y,
          depth,
          phase: Math.random() * Math.PI * 2,
        };
      });

      let start = performance.now();
      const totalDuration = CONFIG.formationMs + CONFIG.holdMs + CONFIG.dissipationMs;

      function easeInOutCubic(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
      function lerp(a, b, t) { return a + (b - a) * t; }

      // Softer, simpler sprite
      function paintSprite(r, g, b, a) {
        sctx.clearRect(0, 0, SPR, SPR);
        const cxS = SPR / 2, cyS = SPR / 2;
        const grad = sctx.createRadialGradient(cxS, cyS, 0, cxS, cyS, SPR / 2);
        grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        sctx.fillStyle = grad;
        sctx.fillRect(0, 0, SPR, SPR);
      }

      function tick(now) {
        if (disposed) return;
        const elapsed = now - start;

        // Start with a clean slate every frame
        ctx.clearRect(0, 0, w, h);
        
        const blend = Math.min(1, elapsed / (CONFIG.formationMs * 0.9));
        const goldR = Math.floor(lerp(255, 212, blend));
        const goldG = Math.floor(lerp(245, 175, blend));
        const goldB = Math.floor(lerp(200, 55, blend));
        paintSprite(goldR, goldG, goldB, 0.5); // Softer alpha on the sprite itself

        ctx.globalCompositeOperation = 'lighter';

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const t = Math.min(1, elapsed / CONFIG.formationMs);
          const e = easeInOutCubic(t);

          // --- LIGHTWEIGHT LERP PHYSICS ---
          // This is the core of the new smooth motion.
          let targetX = p.tx;
          let targetY = p.ty;
          
          p.x += (targetX - p.x) * CONFIG.damping;
          p.y += (targetY - p.y) * CONFIG.damping;
          
          // Simplified drift
          p.phase += 0.01 * p.depth;
          const driftX = Math.sin(i + p.phase) * CONFIG.driftFactor * (1 - e);
          const driftY = Math.cos(i + p.phase) * CONFIG.driftFactor * (1 - e);
          p.x += driftX;
          p.y += driftY;

          // Dissipation Phase
          if (elapsed > CONFIG.formationMs + CONFIG.holdMs) {
            const dissipationT = (elapsed - CONFIG.formationMs - CONFIG.holdMs) / CONFIG.dissipationMs;
            p.y -= CONFIG.dissipationSpeed * p.depth * (1 + dissipationT);
          }

          let finalAlpha, finalRadius;

          // Combined logic for alpha and radius
          if (elapsed < CONFIG.formationMs + CONFIG.holdMs) {
             finalAlpha = (0.2 + e * 0.8);
          } else {
            const dissipationT = easeInOutCubic((elapsed - CONFIG.formationMs - CONFIG.holdMs) / CONFIG.dissipationMs);
            finalAlpha = (1 - dissipationT) * (0.2 + e * 0.8);
          }
          
          // Larger, softer particles
          finalRadius = 25 * p.depth * (1 + e);

          ctx.globalAlpha = Math.max(0, finalAlpha);
          ctx.drawImage(sprite, p.x - finalRadius, p.y - finalRadius, finalRadius * 2, finalRadius * 2);
        }
        
        // Crisp overlay text (no change)
        const rawAppear = Math.min(1, Math.max(0, (elapsed - CONFIG.formationMs * 0.6) / (CONFIG.formationMs * 0.4)));
        const appear = easeInOutCubic(rawAppear);
        if (appear > 0 && elapsed < CONFIG.formationMs + CONFIG.holdMs) {
            ctx.globalCompositeOperation = 'source-over'; // Switch back for text
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