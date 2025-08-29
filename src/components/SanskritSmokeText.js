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

export default function SanskritSmokeText({ text, secondaryText = '', onComplete, durationMs = 5500, holdMs = 3000 }) {
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

      const w = rect.width, h = rect.height;
      const cx = w / 2, cy = h / 2;

      const buffer = document.createElement('canvas');
      buffer.width = Math.floor(w);
      buffer.height = Math.floor(h);
      const bctx = buffer.getContext('2d');

      const sprite = document.createElement('canvas');
      const SPR = 96;
      sprite.width = SPR; sprite.height = SPR;
      const sctx = sprite.getContext('2d');

      const fontPrimary = 'Noto Serif Devanagari, Noto Sans Devanagari, serif';
      const englishFont = 'Crimson Text, serif';

      const maxBlockWidth = w * 0.84;
      const baseSize = Math.min(128, Math.max(48, Math.floor((w / Math.max(4, (text || '').length)) * 1.6)));
      const smallSize = Math.max(18, Math.floor(baseSize * 0.36));
      const pairGap = Math.floor(baseSize * 0.38);

      function wrapLines(str, font, size) {
        bctx.font = `600 ${size}px ${font}`;
        const words = (str || '').trim().split(/\s+/);
        const lines = [];
        if (!words.length) return lines;
        let cur = '';
        for (let i = 0; i < words.length; i++) {
          const test = cur ? cur + ' ' + words[i] : words[i];
          if (bctx.measureText(test).width <= maxBlockWidth) cur = test; else {
            if (cur) lines.push(cur);
            cur = words[i];
          }
        }
        if (cur) lines.push(cur);
        return lines;
      }

      const sansLines = wrapLines(text, fontPrimary, baseSize);
      const engLines = secondaryText ? wrapLines(secondaryText, englishFont, smallSize) : [];
      const lineHeightSans = Math.floor(baseSize * 1.05);
      const lineHeightEng = Math.floor(smallSize * 1.15);
      const blockHeight = (sansLines.length * lineHeightSans) + (engLines.length ? pairGap + engLines.length * lineHeightEng : 0);
      const yStartSans = cy - blockHeight / 2 + lineHeightSans / 2;

      function sample(lines, font, size, lineHeight, yStart, stepFactor) {
        bctx.clearRect(0, 0, w, h);
        bctx.fillStyle = '#fff';
        bctx.textAlign = 'center';
        bctx.textBaseline = 'middle';
        bctx.font = font;
        let y = yStart;
        for (let i = 0; i < lines.length; i++) { bctx.fillText(lines[i], cx, y); y += lineHeight; }
        const img = bctx.getImageData(0, 0, w, h).data;
        const step = Math.max(1, Math.floor(size * stepFactor));
        const pts = [];
        for (let py = 0; py < h; py += step) {
          for (let px = 0; px < w; px += step) {
            if (img[(py * w + px) * 4 + 3] > 128) {
              const jx = px + (Math.random() - 0.5) * step * 0.6;
              const jy = py + (Math.random() - 0.5) * step * 0.6;
              pts.push({ x: jx, y: jy });
            }
          }
        }
        return pts;
      }

      const pointsSans = sample(sansLines, `600 ${baseSize}px ${fontPrimary}`, baseSize, lineHeightSans, yStartSans, 0.04);
      const pointsEng = engLines.length ? sample(engLines, `italic 500 ${smallSize}px ${englishFont}`, smallSize, lineHeightEng, yStartSans + sansLines.length * lineHeightSans + pairGap + lineHeightEng / 2, 0.055) : [];

      const allPoints = pointsSans.concat(pointsEng);
      const maxParticles = 2000;
      const ratio = Math.min(1, maxParticles / Math.max(1, allPoints.length));
      const targets = allPoints.filter(() => Math.random() < ratio);

      function paintSprite(r, g, b, a) {
        sctx.clearRect(0, 0, SPR, SPR);
        const cxS = SPR / 2, cyS = SPR / 2;
        const grad = sctx.createRadialGradient(cxS, cyS, 0, cxS, cyS, SPR / 2);
        grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        sctx.fillStyle = grad;
        sctx.beginPath(); sctx.arc(cxS, cyS, SPR / 2, 0, Math.PI * 2); sctx.fill();
      }

      const particles = targets.map((t) => {
        const edge = Math.floor(Math.random() * 4);
        const m = 80;
        let sx = 0, sy = 0;
        if (edge === 0) { sx = Math.random() * w; sy = -m; }
        else if (edge === 1) { sx = w + m; sy = Math.random() * h; }
        else if (edge === 2) { sx = Math.random() * w; sy = h + m; }
        else { sx = -m; sy = Math.random() * h; }
        return { x: sx, y: sy, vx: 0, vy: 0, tx: t.x, ty: t.y, depth: 0.7 + Math.random() * 0.8, seed: Math.random() * 1000 };
      });

      let start = performance.now();
      let last = start;
      const fadeOutMs = Math.max(900, Math.floor(durationMs * 0.35));

      function easeOutExpo(x) { return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); }
      function easeInOutSine(x) { return -(Math.cos(Math.PI * x) - 1) / 2; }
      function lerp(a, b, t) { return a + (b - a) * t; }

      function tick(now) {
        if (disposed) return;
        const elapsed = now - start;
        const dt = Math.min(64, now - last) / 1000; // seconds
        last = now;

        ctx.clearRect(0, 0, w, h);

        const blend = Math.min(1, elapsed / (durationMs * 0.8));
        const goldR = Math.floor(lerp(212, 255, blend));
        const goldG = Math.floor(lerp(175, 215, blend));
        const goldB = Math.floor(lerp(55, 0, blend * 0.15));
        paintSprite(goldR, goldG, goldB, 0.9);

        ctx.globalCompositeOperation = 'lighter';
        ctx.filter = 'blur(0.4px)';

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          const t = Math.min(1, elapsed / durationMs);
          const e = easeOutExpo(t);

          const ax = (p.tx - p.x) * 6.0; // attraction
          const ay = (p.ty - p.y) * 6.0;
          // gentle curl using time-based sines
          const curlA = (1 - e) * p.depth * 10;
          const curlX = Math.sin(now * 0.0012 + p.seed + i * 0.01) * curlA;
          const curlY = Math.cos(now * 0.0011 + p.seed + i * 0.013) * curlA;

          p.vx = (p.vx + (ax + curlX) * dt) * Math.pow(0.6, dt * 60);
          p.vy = (p.vy + (ay + curlY) * dt) * Math.pow(0.6, dt * 60);
          p.x += p.vx * dt; p.y += p.vy * dt;

          // alpha over lifetime + hold/dissipate
          let alpha = 0.85 * (0.2 + e * 0.8);
          if (elapsed > durationMs + holdMs) {
            const tD = Math.min(1, (elapsed - durationMs - holdMs) / fadeOutMs);
            alpha *= (1 - tD);
            p.y -= 12 * dt * p.depth; // float up
          }
          const radius = 7 + 14 * (0.8 + 0.2 * p.depth);

          ctx.globalAlpha = Math.max(0, alpha);
          ctx.drawImage(sprite, p.x - radius, p.y - radius, radius * 2, radius * 2);
        }

        ctx.filter = 'none';
        ctx.globalCompositeOperation = 'source-over';

        const rawAppear = Math.min(1, Math.max(0, (elapsed - durationMs * 0.5) / (durationMs * 0.5)));
        const appear = easeInOutSine(rawAppear);
        if (appear > 0) {
          ctx.save();
          ctx.globalAlpha = Math.min(0.95, appear);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowBlur = 18;

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

          if (engLines.length) {
            yy = yStartSans + sansLines.length * lineHeightSans + pairGap + lineHeightEng / 2;
            ctx.globalAlpha = Math.min(0.9, appear * 0.95);
            ctx.fillStyle = 'rgba(233, 214, 143, 0.92)';
            ctx.shadowBlur = 12;
            ctx.font = `italic 500 ${smallSize}px ${englishFont}`;
            for (let i = 0; i < engLines.length; i++) { ctx.fillText(engLines[i], cx, yy); yy += lineHeightEng; }
          }

          ctx.restore();
        }

        if (elapsed < durationMs + holdMs + fadeOutMs) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          if (onComplete) onComplete();
        }
      }

      rafRef.current = requestAnimationFrame(tick);

      function handleResize() { if (rafRef.current) cancelAnimationFrame(rafRef.current); init(); }
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    const cleanup = init();
    return () => { disposed = true; if (cleanup) cleanup(); };
  }, [text, secondaryText, onComplete, durationMs, holdMs]);

  return (
    <CanvasWrap>
      <Canvas ref={canvasRef} />
    </CanvasWrap>
  );
}
