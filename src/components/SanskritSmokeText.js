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

      const w = rect.width;
      const h = rect.height;
      const cx = w / 2, cy = h / 2;

      // Offscreen buffer for text rasterization
      const buffer = document.createElement('canvas');
      buffer.width = Math.floor(w);
      buffer.height = Math.floor(h);
      const bctx = buffer.getContext('2d');

      const fontPrimary = 'Noto Serif Devanagari, Noto Sans Devanagari, serif';
      const englishFont = 'Crimson Text, serif';

      // Compute sizes and multi-line layout
      const maxBlockWidth = w * 0.84;
      const baseSize = Math.min(128, Math.max(48, Math.floor(w / Math.max(4, (text || '').length) * 1.6)));
      const smallSize = Math.max(18, Math.floor(baseSize * 0.36));
      const lineGap = Math.floor(baseSize * 0.18);
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

      // Rasterize Sanskrit lines and sample points
      bctx.clearRect(0, 0, w, h);
      bctx.fillStyle = '#ffffff';
      bctx.textAlign = 'center';
      bctx.textBaseline = 'middle';
      let y = yStartSans;
      bctx.font = `600 ${baseSize}px ${fontPrimary}`;
      for (let i = 0; i < sansLines.length; i++) {
        bctx.fillText(sansLines[i], cx, y);
        y += lineHeightSans;
      }
      const imgSans = bctx.getImageData(0, 0, w, h);
      const dataSans = imgSans.data;
      const stepSans = Math.max(1, Math.floor(baseSize / 26));
      const pointsSans = [];
      for (let py = 0; py < h; py += stepSans) {
        for (let px = 0; px < w; px += stepSans) {
          const idx = (py * w + px) * 4 + 3;
          if (dataSans[idx] > 128) {
            const jx = px + (Math.random() - 0.5) * stepSans * 0.6;
            const jy = py + (Math.random() - 0.5) * stepSans * 0.6;
            pointsSans.push({ x: jx, y: jy });
          }
        }
      }

      // Rasterize English lines and sample points
      let pointsEng = [];
      if (engLines.length) {
        bctx.clearRect(0, 0, w, h);
        y = yStartSans + sansLines.length * lineHeightSans + pairGap + lineHeightEng / 2;
        bctx.font = `italic 500 ${smallSize}px ${englishFont}`;
        for (let i = 0; i < engLines.length; i++) {
          bctx.fillText(engLines[i], cx, y);
          y += lineHeightEng;
        }
        const imgEng = bctx.getImageData(0, 0, w, h);
        const dataEng = imgEng.data;
        const stepEng = Math.max(1, Math.floor(smallSize / 20));
        for (let py = 0; py < h; py += stepEng) {
          for (let px = 0; px < w; px += stepEng) {
            const idx = (py * w + px) * 4 + 3;
            if (dataEng[idx] > 128) {
              const jx = px + (Math.random() - 0.5) * stepEng * 0.6;
              const jy = py + (Math.random() - 0.5) * stepEng * 0.6;
              pointsEng.push({ x: jx, y: jy });
            }
          }
        }
      }

      // Combine and cap
      const allPoints = pointsSans.concat(pointsEng);
      const maxParticles = 2600;
      const sampleRatio = Math.min(1, maxParticles / Math.max(1, allPoints.length));
      const targets = allPoints.filter(() => Math.random() < sampleRatio);

      // Initialize layered particles
      const particles = targets.map(t => {
        const edge = Math.floor(Math.random() * 4);
        const margin = 60;
        let sx = 0, sy = 0;
        if (edge === 0) { sx = Math.random() * w; sy = -margin; }
        else if (edge === 1) { sx = w + margin; sy = Math.random() * h; }
        else if (edge === 2) { sx = Math.random() * w; sy = h + margin; }
        else { sx = -margin; sy = Math.random() * h; }
        const depth = 0.7 + Math.random() * 0.8; // 0.7..1.5
        const life = durationMs * (0.8 + Math.random() * 0.8) * (0.92 + (1.6 - depth) * 0.08);
        return {
          x: sx, y: sy,
          tx: t.x, ty: t.y,
          born: performance.now() + Math.random() * 300,
          life,
          size: (0.8 + Math.random() * 1.6) * (1.2 - (depth - 0.7) * 0.3),
          phase: Math.random() * Math.PI * 2,
          depth
        };
      });

      let start = performance.now();
      const fadeOutMs = Math.max(900, Math.floor(durationMs * 0.3));

      function easeOutExpo(x) { return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); }
      function easeInOutSine(x) { return -(Math.cos(Math.PI * x) - 1) / 2; }
      function lerp(a, b, t) { return a + (b - a) * t; }

      function tick(now) {
        if (disposed) return;
        const elapsed = now - start;
        ctx.clearRect(0, 0, w, h);

        // No background: text forms in space.
        const breath = 0.97 + 0.05 * Math.sin((now - start) / 1100);

        ctx.globalCompositeOperation = 'lighter';

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const t = Math.min(1, Math.max(0, (elapsed - (p.born - start)) / p.life));
          const e = Math.pow(easeOutExpo(t), 0.85 + (p.depth - 0.7) * 0.15);
          const nx = p.x + (p.tx - p.x) * e;
          const ny = p.y + (p.ty - p.y) * e;

          // gentle curl noise with persistent drift
          const curl = 0.6 + Math.sin(p.phase + now * 0.0016 + i * 0.009) * 0.5;
          const driftA = 6 * (1 - e) + 1.5; // residual drift when formed
          const px = nx + Math.sin((now + i * 17) * 0.0018) * curl * driftA;
          const py = ny + Math.cos((now + i * 11) * 0.0017) * curl * driftA;

          // warm gold to bright gold transition
          const blend = Math.min(1, (elapsed / (durationMs * 0.8)));
          const goldR = Math.floor(lerp(212, 255, blend));
          const goldG = Math.floor(lerp(175, 215, blend));
          const goldB = Math.floor(lerp(55, 0, blend * 0.15));

          const fade = 1 - Math.max(0, (elapsed - durationMs) / fadeOutMs);
          const alpha = Math.min(0.92, (0.18 + e * 0.82) * fade) * (0.96 + 0.04 * breath);

          // soft radial puff
          const g = ctx.createRadialGradient(px, py, 0, px, py, 10 + e * 12 * (2 - p.depth));
          g.addColorStop(0, `rgba(${goldR},${goldG},${goldB},${alpha})`);
          g.addColorStop(1, `rgba(${goldR},${goldG},${goldB},0)`);
          ctx.fillStyle = g;
          ctx.shadowColor = `rgba(${goldR},${goldG},${goldB},0.55)`;
          ctx.shadowBlur = (8 + e * 16) * (2 - p.depth) * (0.95 + 0.05 * breath);
          ctx.beginPath();
          ctx.arc(px, py, p.size * (1 + e * 1.25) + 6 * (2 - p.depth), 0, Math.PI * 2);
          ctx.fill();
        }

        // Crisp overlay to ensure legibility as particles converge (multi-line, centered)
        const rawAppear = Math.min(1, Math.max(0, (elapsed - durationMs * 0.5) / (durationMs * 0.5)));
        const appear = easeInOutSine(rawAppear);
        if (appear > 0) {
          ctx.save();
          ctx.globalCompositeOperation = 'screen';
          ctx.globalAlpha = Math.min(0.95, appear);

          // Sanskrit lines
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowBlur = 18 * (0.95 + 0.05 * breath);
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
            ctx.shadowBlur = 12 * (0.95 + 0.05 * breath);
            ctx.font = `italic 500 ${smallSize}px ${englishFont}`;
            for (let i = 0; i < engLines.length; i++) {
              ctx.fillText(engLines[i], cx, yy);
              yy += lineHeightEng;
            }
          }

          // Subtle breathing halo
          const halo = ctx.createRadialGradient(cx, cy, 8, cx, cy, Math.max(w, h) * 0.25);
          halo.addColorStop(0, `rgba(212,175,55,${0.05 * appear})`);
          halo.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = halo;
          ctx.fillRect(0, 0, w, h);

          ctx.restore();
        }

        ctx.globalCompositeOperation = 'source-over';

        if (elapsed < durationMs + fadeOutMs + holdMs) {
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
  }, [text, secondaryText, holdMs, onComplete, durationMs]);

  return (
    <CanvasWrap>
      <Canvas ref={canvasRef} />
    </CanvasWrap>
  );
}
