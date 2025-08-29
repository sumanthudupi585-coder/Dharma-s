import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const CanvasWrap = styled.div`
  width: min(90vw, 1000px);
  height: min(46vh, 460px);
  display: grid;
  place-items: center;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  display: block;
`;

export default function SanskritSmokeText({ text, secondaryText = '', onComplete, durationMs = 6000, holdMs = 3000 }) {
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
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.imageSmoothingEnabled = true;

      const w = rect.width;
      const h = rect.height;
      const cx = w / 2, cy = h / 2;

      // Offscreen buffer for text rasterization
      const buffer = document.createElement('canvas');
      buffer.width = Math.floor(w);
      buffer.height = Math.floor(h);
      const bctx = buffer.getContext('2d');

      // Pre-rendered soft sprite
      const sprite = document.createElement('canvas');
      const SPR = 96;
      sprite.width = SPR;
      sprite.height = SPR;
      const sctx = sprite.getContext('2d');

      // Fonts
      const fontPrimary = 'Noto Serif Devanagari, Noto Sans Devanagari, serif';
      const englishFont = 'Crimson Text, serif';

      // Layout and text wrapping
      const maxBlockWidth = w * 0.84;
      const baseSize = Math.min(128, Math.max(48, Math.floor((w / Math.max(4, (text || '').length)) * 1.6)));
      const smallSize = Math.max(18, Math.floor(baseSize * 0.36));
      const pairGap = Math.floor(baseSize * 0.38);

      function wrapLines(str, font, size) {
        bctx.font = `600 ${size}px ${font}`;
        const words = (str || '').trim().split(/\s+/);
        const lines = [];
        if (words.length === 0) return lines;
        let current = '';
        for (let i = 0; i < words.length; i++) {
          const test = current ? current + ' ' + words[i] : words[i];
          if (bctx.measureText(test).width <= maxBlockWidth) current = test; else {
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

      // Rasterize and sample points from text
      function samplePoints(lines, font, size, lineHeight, yStart, stepFactor) {
        bctx.clearRect(0, 0, w, h);
        bctx.fillStyle = '#ffffff';
        bctx.textAlign = 'center';
        bctx.textBaseline = 'middle';
        bctx.font = font;
        let y = yStart;
        for (let i = 0; i < lines.length; i++) {
          bctx.fillText(lines[i], cx, y);
          y += lineHeight;
        }
        const img = bctx.getImageData(0, 0, w, h).data;
        const step = Math.max(1, Math.floor(size * stepFactor));
        const pts = [];
        for (let py = 0; py < h; py += step) {
          for (let px = 0; px < w; px += step) {
            if (img[(py * w + px) * 4 + 3] > 128) {
              const jx = px + (Math.random() - 0.5) * step * 0.8;
              const jy = py + (Math.random() - 0.5) * step * 0.8;
              pts.push({ x: jx, y: jy });
            }
          }
        }
        return pts;
      }

      const pointsSans = samplePoints(sansLines, `600 ${baseSize}px ${fontPrimary}`, baseSize, lineHeightSans, yStartSans, 0.04);
      const pointsEng = engLines.length
        ? samplePoints(engLines, `italic 500 ${smallSize}px ${englishFont}`, smallSize, lineHeightEng, yStartSans + sansLines.length * lineHeightSans + pairGap + lineHeightEng / 2, 0.055)
        : [];

      const allPoints = pointsSans.concat(pointsEng);
      const maxParticles = 2400;
      const sampleRatio = Math.min(1, maxParticles / Math.max(1, allPoints.length));
      const targets = allPoints.filter(() => Math.random() < sampleRatio);

      // Simplex-like coherent noise (value noise + smoothstep)
      function hash(x, y) {
        const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
        return s - Math.floor(s);
      }
      function smoothstep(t) { return t * t * (3 - 2 * t); }
      function noise2(x, y) {
        const xi = Math.floor(x), yi = Math.floor(y);
        const xf = x - xi, yf = y - yi;
        const n00 = hash(xi, yi);
        const n10 = hash(xi + 1, yi);
        const n01 = hash(xi, yi + 1);
        const n11 = hash(xi + 1, yi + 1);
        const u = smoothstep(xf), v = smoothstep(yf);
        return (n00 * (1 - u) + n10 * u) * (1 - v) + (n01 * (1 - u) + n11 * u) * v; // 0..1
      }

      // Pre-render soft sprite
      function paintSprite(r, g, b, a) {
        sctx.clearRect(0, 0, SPR, SPR);
        const cxS = SPR / 2, cyS = SPR / 2;
        const grad = sctx.createRadialGradient(cxS, cyS, 0, cxS, cyS, SPR / 2);
        grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        sctx.fillStyle = grad;
        sctx.beginPath();
        sctx.arc(cxS, cyS, SPR / 2, 0, Math.PI * 2);
        sctx.fill();
      }

      // Initialize particles with velocity
      const particles = targets.map((t) => {
        const a = Math.random() * Math.PI * 2;
        const r = 80 + Math.random() * Math.max(w, h) * 0.25;
        return {
          x: cx + Math.cos(a) * r,
          y: cy + Math.sin(a) * r,
          vx: 0,
          vy: 0,
          tx: t.x,
          ty: t.y,
          depth: 0.7 + Math.random() * 0.8,
          seed: Math.random() * 1000
        };
      });

      let start = performance.now();
      let last = start;
      const dissipationMs = Math.max(800, Math.floor(durationMs * 0.6));

      function easeInOutSine(x) { return -(Math.cos(Math.PI * x) - 1) / 2; }
      function lerp(a, b, t) { return a + (b - a) * t; }

      function tick(now) {
        if (disposed) return;
        const elapsed = now - start;
        const dt = Math.min(64, now - last) / 1000; // seconds
        last = now;

        ctx.clearRect(0, 0, w, h);

        // Color progression
        const blend = Math.min(1, elapsed / (durationMs * 0.8));
        const goldR = Math.floor(lerp(212, 255, blend));
        const goldG = Math.floor(lerp(175, 215, blend));
        const goldB = Math.floor(lerp(55, 0, blend * 0.15));
        paintSprite(goldR, goldG, goldB, 0.9);

        ctx.globalCompositeOperation = 'lighter';
        ctx.filter = 'blur(0.6px)';

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Determine phase
          if (elapsed <= durationMs) {
            // Formation: attract to target with flow noise
            const k = 3.5; // attraction stiffness
            const dx = p.tx - p.x;
            const dy = p.ty - p.y;
            const ax = dx * k;
            const ay = dy * k;

            const ns = 0.006; // spatial scale
            const nt = 0.25;  // temporal scale
            const n1 = noise2(p.x * ns + now * 0.0005, p.y * ns - now * 0.00035);
            const n2 = noise2(p.x * ns * 1.3 - now * 0.0004, p.y * ns * 1.1 + now * 0.00055);
            const ang = (n1 + n2 - 1) * Math.PI; // -pi..pi
            const flow = 24 * (1 - elapsed / durationMs) * p.depth;
            const fx = Math.cos(ang) * flow;
            const fy = Math.sin(ang) * flow;

            // Integrate
            p.vx += (ax + fx) * dt;
            p.vy += (ay + fy) * dt;
            const damp = Math.pow(0.6, dt * 60);
            p.vx *= damp; p.vy *= damp;
            p.x += p.vx * dt; p.y += p.vy * dt;
          } else if (elapsed <= durationMs + holdMs) {
            // Hold: gentle breathing, strong damping
            const breath = 3 * Math.sin(now * 0.002 + p.seed) * 0.5;
            p.vx *= Math.pow(0.25, dt * 60);
            p.vy *= Math.pow(0.25, dt * 60);
            p.x += Math.cos(p.seed + now * 0.0009) * breath * dt;
            p.y += Math.sin(p.seed + now * 0.0007) * breath * dt;
          } else {
            // Dissipation: float up and disperse
            const tD = Math.min(1, (elapsed - durationMs - holdMs) / dissipationMs);
            const ns = 0.008;
            const ang = (noise2(p.x * ns + now * 0.0006, p.y * ns + now * 0.0005) - 0.5) * Math.PI * 2;
            const fx = Math.cos(ang) * 20 * (1 + tD) * p.depth;
            const fy = -18 * (1 + tD) * p.depth + Math.sin(ang) * 10;
            p.vx += fx * dt; p.vy += fy * dt;
            p.vx *= Math.pow(0.75, dt * 60); p.vy *= Math.pow(0.75, dt * 60);
            p.x += p.vx * dt; p.y += p.vy * dt;
          }

          // Alpha and size
          let alpha = 0.9;
          if (elapsed > durationMs + holdMs) {
            const tD = Math.min(1, (elapsed - durationMs - holdMs) / dissipationMs);
            alpha *= (1 - tD);
          }
          const radius = 8 + 18 * p.depth;

          ctx.globalAlpha = Math.max(0, alpha);
          ctx.drawImage(sprite, p.x - radius, p.y - radius, radius * 2, radius * 2);
        }

        // Clear filter for crisp text
        ctx.filter = 'none';
        ctx.globalCompositeOperation = 'source-over';

        // Text overlay fade-in
        const rawAppear = Math.min(1, Math.max(0, (elapsed - durationMs * 0.45) / (durationMs * 0.55)));
        const appear = easeInOutSine(rawAppear);
        if (appear > 0) {
          ctx.save();
          ctx.globalAlpha = Math.min(0.95, appear);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowBlur = 18;

          // Sanskrit lines
          let yy = yStartSans;
          for (let i = 0; i < sansLines.length; i++) {
            const grad = ctx.createLinearGradient(cx - 50, yy - 20, cx + 50, yy + 20);
            grad.addColorStop(0, 'rgba(255, 234, 150, 0.95)');
            grad.addColorStop(1, 'rgba(212, 175, 55, 0.95)');
            ctx.fillStyle = grad;
            ctx.font = `600 ${baseSize}px ${fontPrimary}`;
            ctx.fillText(sansLines[i], cx, yy);
            yy += lineHeightSans;
          }

          // English lines
          if (engLines.length) {
            yy = yStartSans + sansLines.length * lineHeightSans + pairGap + lineHeightEng / 2;
            ctx.globalAlpha = Math.min(0.9, appear * 0.95);
            ctx.fillStyle = 'rgba(233, 214, 143, 0.92)';
            ctx.shadowBlur = 12;
            ctx.font = `italic 500 ${smallSize}px ${englishFont}`;
            for (let i = 0; i < engLines.length; i++) {
              ctx.fillText(engLines[i], cx, yy);
              yy += lineHeightEng;
            }
          }

          ctx.restore();
        }

        if (elapsed < durationMs + holdMs + dissipationMs) {
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
  }, [text, secondaryText, onComplete, durationMs, holdMs]);

  return (
    <CanvasWrap>
      <Canvas ref={canvasRef} />
    </CanvasWrap>
  );
}
