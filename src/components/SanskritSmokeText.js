import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const CanvasWrap = styled.div`
  width: min(90vw, 1000px);
  height: min(46vh, 460px);
  display: grid;
  place-items: center;
  /* Add a subtle background to enhance the glow effect */
  background: radial-gradient(ellipse at center, #1c1a24 0%, #0d0c10 100%);
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`;

export default function SanskritSmokeText({
  text,
  secondaryText = '',
  onComplete,
  formationMs = 5000, // Renamed for clarity
  holdMs = 3000,
  dissipationMs = 4000 // New phase for particles drifting away
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    let disposed = false;

    function init() {
      const canvas = canvasRef.current;
      if (!canvas || disposed) return () => { };

      // --- 1. SETUP & SIZING (Largely similar, minor tweaks) ---
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);

      const ctx = canvas.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
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
      const SPR = 128; // Increased sprite resolution for more detail
      sprite.width = SPR;
      sprite.height = SPR;
      const sctx = sprite.getContext('2d');

      const fontPrimary = 'Noto Serif Devanagari, Noto Sans Devanagari, serif';
      const englishFont = 'Crimson Text, serif';

      // --- 2. TEXT LAYOUT & SAMPLING (Similar logic, slightly different sizing) ---
      const maxBlockWidth = w * 0.88;
      const baseSize = Math.min(132, Math.max(48, Math.floor((w / Math.max(5, (text || '').length)) * 1.5)));
      const smallSize = Math.max(18, Math.floor(baseSize * 0.33));
      const pairGap = Math.floor(baseSize * 0.4);

      function wrapLines(str, font, size) {
        bctx.font = `600 ${size}px ${font}`;
        const words = (str || '').trim().split(/\s+/);
        const lines = [];
        if (words.length === 0) return lines;
        let current = '';
        for (let i = 0; i < words.length; i++) {
          const test = current ? current + ' ' + words[i] : words[i];
          if (bctx.measureText(test).width <= maxBlockWidth) current = test;
          else {
            if (current) lines.push(current);
            current = words[i];
          }
        }
        if (current) lines.push(current);
        return lines;
      }

      const sansLines = wrapLines(text, fontPrimary, baseSize);
      const engLines = secondaryText ? wrapLines(secondaryText, englishFont, smallSize) : [];
      const lineHeightSans = Math.floor(baseSize * 1.05);
      const lineHeightEng = Math.floor(smallSize * 1.15);
      const blockHeight = (sansLines.length * lineHeightSans) + (engLines.length ? pairGap + engLines.length * lineHeightEng : 0);
      const yStartSans = cy - blockHeight / 2 + lineHeightSans / 2;

      function samplePointsFromText(lines, font, size, lineHeight, yStart, stepScale) {
        const points = [];
        bctx.clearRect(0, 0, w, h);
        bctx.fillStyle = '#fff';
        bctx.textAlign = 'center';
        bctx.textBaseline = 'middle';
        bctx.font = font;
        let y = yStart;
        for (const line of lines) {
          bctx.fillText(line, cx, y);
          y += lineHeight;
        }
        const imgData = bctx.getImageData(0, 0, w, h).data;
        const step = Math.max(1, Math.floor(size * stepScale));
        for (let py = 0; py < h; py += step) {
          for (let px = 0; px < w; px += step) {
            if (imgData[(py * w + px) * 4 + 3] > 128) {
              points.push({
                x: px + (Math.random() - 0.5) * step * 0.8,
                y: py + (Math.random() - 0.5) * step * 0.8
              });
            }
          }
        }
        return points;
      }

      const pointsSans = samplePointsFromText(sansLines, `600 ${baseSize}px ${fontPrimary}`, baseSize, lineHeightSans, yStartSans, 0.04);
      let pointsEng = [];
      if (engLines.length) {
        const yStartEng = yStartSans + sansLines.length * lineHeightSans + pairGap + lineHeightEng / 2;
        pointsEng = samplePointsFromText(engLines, `italic 500 ${smallSize}px ${englishFont}`, smallSize, lineHeightEng, yStartEng, 0.05);
      }

      const allPoints = pointsSans.concat(pointsEng);
      const maxParticles = 3000;
      const sampleRatio = Math.min(1, maxParticles / Math.max(1, allPoints.length));
      const targets = allPoints.filter(() => Math.random() < sampleRatio);

      // --- 3. IMPROVED PARTICLE INITIALIZATION ---
      const particles = targets.map((t) => {
        // Start from a central "ignition" point for a more magical feel
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * 80;
        const sx = cx + Math.cos(angle) * radius;
        const sy = cy + Math.sin(angle) * radius;
        const depth = 0.5 + Math.random() * 0.8; // Range 0.5 to 1.3

        return {
          x: sx, y: sy, // Current position
          px: sx, py: sy, // Previous position (for velocity)
          tx: t.x, ty: t.y, // Target position
          born: performance.now() + Math.random() * 400,
          life: formationMs * (0.9 + Math.random() * 0.5),
          depth,
          // FBM-like noise parameters for more organic drift
          phase1: Math.random() * Math.PI * 2,
          phase2: Math.random() * Math.PI * 2,
          freq1: (0.0005 + Math.random() * 0.001),
          freq2: (0.0002 + Math.random() * 0.0005),
          amp1: 1.0 + Math.random() * 0.8,
          amp2: 1.5 + Math.random(),
        };
      });

      let start = performance.now();
      let last = start;
      const totalDuration = formationMs + holdMs + dissipationMs;

      function easeInOutCubic(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
      function lerp(a, b, t) { return a + (b - a) * t; }

      // --- 4. ENHANCED SPRITE & COLOR ---
      function paintSprite(r, g, b, a) {
        sctx.clearRect(0, 0, SPR, SPR);
        const cxS = SPR / 2, cyS = SPR / 2;

        // Layered gradients for a more textured, "wispier" smoke puff
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
        const dt = Math.min(64, now - last);
        last = now;

        ctx.clearRect(0, 0, w, h);

        const phase = elapsed / totalDuration;
        const breath = 0.98 + 0.04 * Math.sin(now / 1200);

        // More vibrant color transition
        const blend = Math.min(1, elapsed / (formationMs * 0.9));
        const goldR = Math.floor(lerp(255, 212, blend));
        const goldG = Math.floor(lerp(245, 175, blend));
        const goldB = Math.floor(lerp(200, 55, blend));
        paintSprite(goldR, goldG, goldB, 0.9);

        ctx.globalCompositeOperation = 'lighter';
        // Dynamic blur: starts softer, gets sharper
        ctx.filter = `blur(${Math.max(0.2, 1.5 - blend * 1.5)}px)`;

        // --- 5. REFINED PARTICLE UPDATE & DRAW LOGIC ---
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const t = Math.min(1, Math.max(0, (elapsed - (p.born - start)) / p.life));
          const e = easeInOutCubic(t);

          // Calculate current velocity based on position change
          const vx = (p.x - p.px) * 0.95; // Damping
          const vy = (p.y - p.py) * 0.95;
          p.px = p.x;
          p.py = p.y;

          let targetX = p.tx;
          let targetY = p.ty;
          let forceFactor = lerp(0.04, 0.008, e); // Stronger pull initially

          // Dissipation phase: particles drift away upwards
          if (elapsed > formationMs + holdMs) {
            const dissipationT = (elapsed - formationMs - holdMs) / dissipationMs;
            targetY -= dissipationT * 150 * p.depth;
            forceFactor = 0.001; // Weaken the pull to let drift take over
          }

          // FBM-like drift using multiple sine waves
          p.phase1 += dt * p.freq1 * (1 + 0.2 * Math.sin(p.phase2));
          p.phase2 += dt * p.freq2;
          const driftX = Math.sin(p.phase1) * p.amp1 * (1.5 - e);
          const driftY = Math.cos(p.phase2) * p.amp2 * (1.5 - e);

          // Steering behavior: accelerate towards the target
          const ax = (targetX - p.x + driftX) * forceFactor;
          const ay = (targetY - p.y + driftY) * forceFactor;

          p.x += vx + ax;
          p.y += vy + ay;

          let finalAlpha, finalRadius;

          if (elapsed < formationMs + holdMs) {
            // Formation and Hold phase
            const fade = 1 - Math.max(0, (elapsed - (formationMs + holdMs * 0.5)) / (holdMs * 0.5));
            finalAlpha = (0.1 + e * 0.9) * Math.min(1, fade * 4) * breath;
            finalRadius = (p.depth * 3) + (e * 18 * (2.1 - p.depth));
          } else {
            // Dissipation phase
            const dissipationT = easeInOutCubic((elapsed - formationMs - holdMs) / dissipationMs);
            finalAlpha = (1 - dissipationT) * (0.1 + e * 0.9) * breath;
            finalRadius = (p.depth * 3) + (e * 18 * (2.1 - p.depth)) * (1 + dissipationT * 1.5);
          }

          ctx.globalAlpha = Math.max(0, finalAlpha / p.depth);
          ctx.drawImage(sprite, p.x - finalRadius, p.y - finalRadius, finalRadius * 2, finalRadius * 2);
        }

        // --- 6. OVERLAY TEXT (Largely similar, adjusted timing) ---
        ctx.filter = 'none';
        ctx.globalCompositeOperation = 'source-over';

        const rawAppear = Math.min(1, Math.max(0, (elapsed - formationMs * 0.6) / (formationMs * 0.4)));
        const appear = easeInOutCubic(rawAppear);
        if (appear > 0 && elapsed < formationMs + holdMs) {
          ctx.save();
          const fadeOut = 1 - Math.max(0, (elapsed - formationMs) / holdMs);
          ctx.globalAlpha = Math.min(0.95, appear * fadeOut);

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(255, 220, 150, 0.7)';
          ctx.shadowBlur = 24 * breath;

          let yy = yStartSans;
          for (const line of sansLines) {
            const grad = ctx.createLinearGradient(cx - 50, yy - 20, cx + 50, yy + 20);
            grad.addColorStop(0, 'rgba(255, 240, 180, 0.95)');
            grad.addColorStop(1, 'rgba(212, 175, 55, 0.95)');
            ctx.fillStyle = grad;
            ctx.font = `600 ${baseSize}px ${fontPrimary}`;
            ctx.fillText(line, cx, yy);
            yy += lineHeightSans;
          }

          if (engLines.length) {
            yy = yStartSans + sansLines.length * lineHeightSans + pairGap + lineHeightEng / 2;
            ctx.fillStyle = 'rgba(233, 214, 143, 0.92)';
            ctx.shadowBlur = 16 * breath;
            ctx.font = `italic 500 ${smallSize}px ${englishFont}`;
            for (const line of engLines) {
              ctx.fillText(line, cx, yy);
              yy += lineHeightEng;
            }
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
  }, [text, secondaryText, holdMs, onComplete, formationMs, dissipationMs]);

  return (
    <CanvasWrap>
      <Canvas ref={canvasRef} />
    </CanvasWrap>
  );
}