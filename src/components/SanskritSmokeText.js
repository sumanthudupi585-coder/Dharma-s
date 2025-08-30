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

export default function SanskritSmokeText({ text, secondaryText = '', onComplete, durationMs = 6500, holdMs = 3200 }) {
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

      // Offscreen buffers
      const buffer = document.createElement('canvas');
      buffer.width = Math.floor(w);
      buffer.height = Math.floor(h);
      const bctx = buffer.getContext('2d');

      // Sprites
      const goldSprite = document.createElement('canvas');
      const smokeSprite = document.createElement('canvas');
      const SPR_G = 96, SPR_S = 120;
      goldSprite.width = SPR_G; goldSprite.height = SPR_G;
      smokeSprite.width = SPR_S; smokeSprite.height = SPR_S;
      const gctx = goldSprite.getContext('2d');
      const sctx = smokeSprite.getContext('2d');

      function makeGoldSprite(a = 0.9) {
        gctx.clearRect(0, 0, SPR_G, SPR_G);
        const r = SPR_G / 2, c = r;
        const grad = gctx.createRadialGradient(c, c, 0, c, c, r);
        grad.addColorStop(0, `rgba(255, 236, 170, ${a})`);
        grad.addColorStop(1, 'rgba(255, 236, 170, 0)');
        gctx.fillStyle = grad; gctx.beginPath(); gctx.arc(c, c, r, 0, Math.PI * 2); gctx.fill();
      }
      function makeSmokeSprite() {
        sctx.clearRect(0, 0, SPR_S, SPR_S);
        const r = SPR_S / 2, c = r;
        const grad = sctx.createRadialGradient(c, c, 0, c, c, r);
        grad.addColorStop(0, 'rgba(10,10,14,0.35)');
        grad.addColorStop(0.6, 'rgba(10,10,14,0.18)');
        grad.addColorStop(1, 'rgba(10,10,14,0)');
        sctx.fillStyle = grad; sctx.beginPath(); sctx.arc(c, c, r, 0, Math.PI * 2); sctx.fill();
      }
      makeGoldSprite();
      makeSmokeSprite();

      // Layout and sampling
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
          if (bctx.measureText(test).width <= maxBlockWidth) cur = test; else { if (cur) lines.push(cur); cur = words[i]; }
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
              const jx = px + (Math.random() - 0.5) * step * 0.7;
              const jy = py + (Math.random() - 0.5) * step * 0.7;
              pts.push({ x: jx, y: jy });
            }
          }
        }
        return pts;
      }

      const pointsSans = sample(sansLines, `600 ${baseSize}px ${fontPrimary}`, baseSize, lineHeightSans, yStartSans, 0.04);
      const pointsEng = engLines.length ? sample(engLines, `italic 500 ${smallSize}px ${englishFont}`, smallSize, lineHeightEng, yStartSans + sansLines.length * lineHeightSans + pairGap + lineHeightEng / 2, 0.055) : [];

      let allPoints = pointsSans.concat(pointsEng);
      const maxParticles = 2200;
      let ratio = Math.min(1, maxParticles / Math.max(1, allPoints.length));
      let targets = allPoints.filter(() => Math.random() < ratio);
      if (targets.length === 0 && (sansLines.length || engLines.length)) {
        const pointsSansF = sample(sansLines, `600 ${baseSize}px ${fontPrimary}`, baseSize, lineHeightSans, yStartSans, 0.02);
        const pointsEngF = engLines.length ? sample(engLines, `italic 500 ${smallSize}px ${englishFont}`, smallSize, lineHeightEng, yStartSans + sansLines.length * lineHeightSans + pairGap + lineHeightEng / 2, 0.03) : [];
        allPoints = pointsSansF.concat(pointsEngF);
        ratio = Math.min(1, maxParticles / Math.max(1, allPoints.length));
        targets = allPoints.filter(() => Math.random() < ratio);
      }

      // Simple value-noise helpers for smoke advection
      function hash(x, y) { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); }
      function smoothstep(t) { return t * t * (3 - 2 * t); }
      function noise2(x, y) {
        const xi = Math.floor(x), yi = Math.floor(y);
        const xf = x - xi, yf = y - yi;
        const n00 = hash(xi, yi), n10 = hash(xi + 1, yi), n01 = hash(xi, yi + 1), n11 = hash(xi + 1, yi + 1);
        const u = smoothstep(xf), v = smoothstep(yf);
        return (n00 * (1 - u) + n10 * u) * (1 - v) + (n01 * (1 - u) + n11 * u) * v;
      }

      // Particles
      const gold = targets.map(t => ({
        x: cx + (Math.random() - 0.5) * Math.max(w, h) * 0.5,
        y: cy + (Math.random() - 0.5) * Math.max(w, h) * 0.5,
        vx: 0, vy: 0, tx: t.x, ty: t.y, depth: 0.7 + Math.random() * 0.8, seed: Math.random() * 1000
      }));

      // Volumetric smoke: back and front layers
      const bounds = { x: cx - maxBlockWidth / 2, y: yStartSans - lineHeightSans, w: maxBlockWidth, h: blockHeight + lineHeightSans * 2 };
      const SMOKE_COUNT = Math.floor(180 + Math.min(120, maxBlockWidth / 6));
      const smokeBack = new Array(SMOKE_COUNT).fill(0).map(() => ({
        x: bounds.x + Math.random() * bounds.w,
        y: bounds.y + Math.random() * bounds.h,
        vx: 0, vy: 0,
        r: 16 + Math.random() * 40,
        a: 0.12 + Math.random() * 0.12,
        z: 0.6 + Math.random() * 0.5,
        seed: Math.random() * 1000
      }));
      const smokeFront = smokeBack.slice(0, Math.floor(SMOKE_COUNT * 0.4)).map(p => ({ ...p, a: p.a * 0.7 }));

      let start = performance.now();
      let last = start;
      const dissipateMs = Math.max(1200, Math.floor(durationMs * 0.6));

      function easeInOutSine(x) { return -(Math.cos(Math.PI * x) - 1) / 2; }
      function easeOutExpo(x) { return x === 1 ? 1 : 1 - Math.pow(2, -10 * x); }
      function lerp(a, b, t) { return a + (b - a) * t; }

      function drawSmokeLayer(arr, alphaScale) {
        ctx.globalCompositeOperation = 'source-over';
        for (let i = 0; i < arr.length; i++) {
          const p = arr[i];
          ctx.globalAlpha = Math.max(0, p.a * alphaScale);
          const r = p.r * p.z;
          ctx.drawImage(smokeSprite, p.x - r, p.y - r, r * 2, r * 2);
        }
      }

      function updateSmoke(arr, dt, t) {
        const ns = 0.007;
        for (let i = 0; i < arr.length; i++) {
          const p = arr[i];
          const ang = (noise2(p.x * ns + t * 0.0005, p.y * ns - t * 0.0004) - 0.5) * Math.PI * 2;
          const speed = 12 * p.z;
          p.vx += Math.cos(ang) * speed * dt;
          p.vy += Math.sin(ang) * speed * dt - 6 * dt * p.z; // slight upward lift
          p.vx *= Math.pow(0.9, dt * 60); p.vy *= Math.pow(0.9, dt * 60);
          p.x += p.vx * dt; p.y += p.vy * dt;
        }
      }

      function tick(now) {
        if (disposed) return;
        const elapsed = now - start;
        const dt = Math.min(64, now - last) / 1000; // seconds
        last = now;

        ctx.clearRect(0, 0, w, h);

        // BACK SMOKE
        updateSmoke(smokeBack, dt, now);
        drawSmokeLayer(smokeBack, 1);

        // GOLD PARTICLES (text)
        const blend = Math.min(1, elapsed / (durationMs * 0.85));
        makeGoldSprite(0.9);

        ctx.globalCompositeOperation = 'screen';
        ctx.filter = 'blur(0.5px)';

        for (let i = 0; i < gold.length; i++) {
          const p = gold[i];
          const t = Math.min(1, elapsed / durationMs);
          const e = easeOutExpo(t);
          const ax = (p.tx - p.x) * 5.5;
          const ay = (p.ty - p.y) * 5.5;
          const curl = 8 * (1 - e) * p.depth;
          const fx = Math.sin(now * 0.0012 + p.seed + i * 0.01) * curl;
          const fy = Math.cos(now * 0.0011 + p.seed + i * 0.013) * curl;
          p.vx = (p.vx + (ax + fx) * dt) * Math.pow(0.62, dt * 60);
          p.vy = (p.vy + (ay + fy) * dt) * Math.pow(0.62, dt * 60);
          p.x += p.vx * dt; p.y += p.vy * dt;

          let alpha = 0.9 * (0.2 + e * 0.8);
          if (elapsed > durationMs + holdMs) {
            const tD = Math.min(1, (elapsed - durationMs - holdMs) / dissipateMs);
            alpha *= (1 - tD);
            p.y -= 10 * dt * p.depth;
          }
          const radius = 8 + 16 * p.depth;
          ctx.globalAlpha = Math.max(0, alpha);
          ctx.drawImage(goldSprite, p.x - radius, p.y - radius, radius * 2, radius * 2);
        }

        ctx.filter = 'none';
        ctx.globalCompositeOperation = 'source-over';

        // TEXT OVERLAY
        const rawAppear = Math.min(1, Math.max(0, (elapsed - durationMs * 0.45) / (durationMs * 0.55)));
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

        // FRONT SMOKE over text for depth
        let smokeAlpha = 1;
        if (elapsed > durationMs + holdMs) {
          const tD = Math.min(1, (elapsed - durationMs - holdMs) / dissipateMs);
          smokeAlpha = 1 - tD;
        }
        updateSmoke(smokeFront, dt, now);
        drawSmokeLayer(smokeFront, 0.8 * smokeAlpha);

        if (elapsed < durationMs + holdMs + dissipateMs) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          if (onComplete) onComplete();
        }
      }

      rafRef.current = requestAnimationFrame(tick);

      function handleResize() { if (rafRef.current) cancelAnimationFrame(rafRef.current); init(); }
      window.addEventListener('resize', handleResize);

      return () => { window.removeEventListener('resize', handleResize); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
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
