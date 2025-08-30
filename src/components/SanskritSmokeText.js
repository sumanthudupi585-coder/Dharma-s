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

export default function SanskritSmokeText({ text, secondaryText = '', onComplete, durationMs = 6500, holdMs = 3200, quality = 'auto' }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    let disposed = false;

    function init() {
      const canvas = canvasRef.current;
      if (!canvas || disposed) return () => {};

      const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const cores = (typeof navigator !== 'undefined' && navigator.hardwareConcurrency) ? navigator.hardwareConcurrency : 4;
      const lowEnd = prefersReduced || cores <= 4;
      const qFactor = quality === 'low' ? 0.6 : quality === 'high' ? 1 : (lowEnd ? 0.75 : 1);
      const dpr = Math.max(1, Math.min(2, (window.devicePixelRatio || 1) * (qFactor < 0.85 ? 0.9 : 1)));
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

      // Sprites
      const glowSprite = document.createElement('canvas');
      const SPR = Math.floor(100 * qFactor);
      glowSprite.width = SPR; glowSprite.height = SPR;
      const gctx = glowSprite.getContext('2d');
      gctx.clearRect(0, 0, SPR, SPR);
      {
        const r = SPR / 2, c = r;
        const grad = gctx.createRadialGradient(c, c, 0, c, c, r);
        grad.addColorStop(0, 'rgba(255, 236, 170, 0.95)');
        grad.addColorStop(0.35, 'rgba(255, 218, 120, 0.75)');
        grad.addColorStop(1, 'rgba(255, 218, 120, 0)');
        gctx.fillStyle = grad; gctx.beginPath(); gctx.arc(c, c, r, 0, Math.PI * 2); gctx.fill();
      }

      // Typography and layout
      const fontPrimary = 'Noto Serif Devanagari, Noto Sans Devanagari, serif';
      const englishFont = 'Crimson Text, serif';
      const maxBlockWidth = w * 0.84;
      const baseSize = Math.min(126, Math.max(48, Math.floor((w / Math.max(4, (text || '').length)) * 1.7)));
      const smallSize = Math.max(18, Math.floor(baseSize * 0.34));
      const lineGap = Math.floor(baseSize * 1.06);
      const pairGap = Math.floor(baseSize * 0.44);

      function wrapLines(str, font, size) {
        bctx.font = `600 ${size}px ${font}`;
        const words = (str || '').trim().split(/\s+/);
        const lines = [];
        if (!words.length || (words.length === 1 && words[0] === '')) return lines;
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
      const blockHeight = (sansLines.length * lineGap) + (engLines.length ? pairGap + engLines.length * Math.floor(smallSize * 1.18) : 0);
      const yStartSans = cy - blockHeight / 2 + lineGap / 2;

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
            if (img[(py * w + px) * 4 + 3] > 120) {
              const jx = px + (Math.random() - 0.5) * step * 0.75;
              const jy = py + (Math.random() - 0.5) * step * 0.75;
              pts.push({ x: jx, y: jy });
            }
          }
        }
        return pts;
      }

      const pointsSans = sample(sansLines, `600 ${baseSize}px ${fontPrimary}`, baseSize, lineGap, yStartSans, qFactor < 0.9 ? 0.065 : 0.045);
      const engLineHeight = Math.floor(smallSize * 1.18);
      const pointsEng = engLines.length ? sample(engLines, `italic 500 ${smallSize}px ${englishFont}`, smallSize, engLineHeight, yStartSans + sansLines.length * lineGap + pairGap + engLineHeight / 2, qFactor < 0.9 ? 0.08 : 0.06) : [];
      const allPoints = pointsSans.concat(pointsEng);

      // Reduced motion: quick fade in of final text
      if (prefersReduced || allPoints.length === 0) {
        let alpha = 0;
        const start = performance.now();
        const fade = () => {
          if (disposed) return;
          const now = performance.now();
          const t = Math.min(1, (now - start) / Math.max(400, durationMs * 0.4));
          alpha = t;
          ctx.clearRect(0, 0, w, h);
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowBlur = Math.floor(18 * qFactor);
          let yy = yStartSans;
          for (let i = 0; i < sansLines.length; i++) {
            const grad = ctx.createLinearGradient(cx - 50, yy - 20, cx + 50, yy + 20);
            grad.addColorStop(0, 'rgba(255, 234, 150, 0.95)');
            grad.addColorStop(1, 'rgba(212, 175, 55, 0.95)');
            ctx.fillStyle = grad;
            ctx.font = `600 ${baseSize}px ${fontPrimary}`;
            ctx.fillText(sansLines[i], cx, yy);
            yy += lineGap;
          }
          if (engLines.length) {
            yy = yStartSans + sansLines.length * lineGap + pairGap + engLineHeight / 2;
            ctx.fillStyle = 'rgba(233, 214, 143, 0.92)';
            ctx.shadowBlur = Math.floor(12 * qFactor);
            ctx.font = `italic 500 ${smallSize}px ${englishFont}`;
            for (let i = 0; i < engLines.length; i++) { ctx.fillText(engLines[i], cx, yy); yy += engLineHeight; }
          }
          ctx.restore();
          if (t < 1) rafRef.current = requestAnimationFrame(fade); else setTimeout(() => onComplete && onComplete(), Math.max(400, holdMs));
        };
        rafRef.current = requestAnimationFrame(fade);
        const handleResize = () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); init(); };
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize', handleResize); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
      }

      // Precompute activation timings based on a spiral index (feels like uncovering a riddle)
      const Rmax = Math.hypot(w, h) * 0.5;
      const activations = new Float32Array(allPoints.length);
      const jitter = new Float32Array(allPoints.length);
      for (let i = 0; i < allPoints.length; i++) {
        const p = allPoints[i];
        const dx = p.x - cx, dy = p.y - cy;
        const r = Math.hypot(dx, dy) / Rmax; // 0..~1
        let a = Math.atan2(dy, dx); if (a < 0) a += Math.PI * 2; a /= Math.PI * 2; // 0..1
        const s = 0.62 * r + 0.38 * a; // spiral mix
        activations[i] = s;
        jitter[i] = (Math.sin((p.x + p.y) * 12.9898) * 43758.5453) % 1; // deterministic
      }

      // Spatial hash for ephemeral links
      const cell = Math.max(16, Math.floor(24 * qFactor));
      const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
      const grid = new Array(cols * rows).fill(0).map(() => []);
      function cellIndex(x, y) {
        const cxI = Math.min(cols - 1, Math.max(0, Math.floor(x / cell)));
        const cyI = Math.min(rows - 1, Math.max(0, Math.floor(y / cell)));
        return cyI * cols + cxI;
      }
      for (let i = 0; i < allPoints.length; i++) {
        grid[cellIndex(allPoints[i].x, allPoints[i].y)].push(i);
      }

      // A few orbiting sparks tracing hints
      const SPARKS = Math.floor((8 + (qFactor > 0.95 ? 4 : 0)) * (Math.min(1, allPoints.length / 800 + 0.2)));
      const sparks = new Array(SPARKS).fill(0).map((_, i) => ({
        r: Math.min(w, h) * (0.18 + (i % 5) * 0.06),
        a: Math.random() * Math.PI * 2,
        s: (0.35 + Math.random() * 0.25) * (Math.random() < 0.5 ? 1 : -1),
      }));

      let start = performance.now();
      let last = start;
      const dissolveMs = Math.max(900, Math.floor(durationMs * 0.5));

      function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
      function easeInOutSine(x) { return -(Math.cos(Math.PI * x) - 1) / 2; }

      function drawScan(progress) {
        const p = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
        const base = Math.max(0, easeOutCubic(p) * (Math.max(1, Math.min(w, h)) * 0.55));
        const a0 = p * Math.PI * 2 * 0.9; // rotating arc
        const a1 = a0 + Math.PI * 0.55;
        const rInner = Math.max(0, base - 2);
        const rOuter = Math.max(rInner + 0.001, base + 22);
        const grad = ctx.createRadialGradient(cx, cy, rInner, cx, cy, rOuter);
        grad.addColorStop(0, 'rgba(212,175,55,0)');
        grad.addColorStop(0.5, 'rgba(212,175,55,0.18)');
        grad.addColorStop(1, 'rgba(212,175,55,0)');
        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        const rStroke = Math.max(0.001, base);
        ctx.arc(cx, cy, rStroke, a0, a1);
        ctx.stroke();
        ctx.restore();
      }

      function tick(now) {
        if (disposed) return;
        const elapsed = now - start;
        const dt = Math.min(40, now - last) / 1000;
        last = now;

        const tReveal = Math.min(1, elapsed / durationMs);

        ctx.clearRect(0, 0, w, h);

        // Background faint grid to suggest investigation
        ctx.save();
        ctx.globalAlpha = 0.08;
        ctx.strokeStyle = 'rgba(255, 210, 120, 0.12)';
        ctx.lineWidth = 1;
        const gridStep = Math.max(20, Math.floor(28 * qFactor));
        for (let gx = Math.floor((w * 0.08) / gridStep) * gridStep; gx < w * 0.92; gx += gridStep) {
          ctx.beginPath(); ctx.moveTo(gx, h * 0.12); ctx.lineTo(gx, h * 0.88); ctx.stroke();
        }
        for (let gy = Math.floor((h * 0.18) / gridStep) * gridStep; gy < h * 0.82; gy += gridStep) {
          ctx.beginPath(); ctx.moveTo(w * 0.12, gy); ctx.lineTo(w * 0.88, gy); ctx.stroke();
        }
        ctx.restore();

        // Scan arc
        drawScan(tReveal);

        // Points reveal
        ctx.globalCompositeOperation = 'screen';
        ctx.filter = 'blur(0.5px)';

        const activeAlpha = new Float32Array(allPoints.length);
        for (let i = 0; i < allPoints.length; i++) {
          const base = activations[i];
          const j = jitter[i] * 0.06 * (1.1 - qFactor * 0.2);
          const threshold = base + j;
          const a = easeInOutSine(Math.min(1, Math.max(0, (tReveal - threshold) / 0.18)));
          activeAlpha[i] = a;
          if (a > 0) {
            const p = allPoints[i];
            const radius = 6 + 14 * a;
            ctx.globalAlpha = 0.25 + 0.7 * a;
            ctx.drawImage(glowSprite, p.x - radius, p.y - radius, radius * 2, radius * 2);
          }
        }

        ctx.filter = 'none';

        // Ephemeral links between freshly activated points (local neighborhood)
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineWidth = 1;
        for (let i = 0; i < allPoints.length; i++) {
          const a = activeAlpha[i];
          if (a <= 0.2) continue;
          const p = allPoints[i];
          const cxI = Math.min(cols - 1, Math.max(0, Math.floor(p.x / cell)));
          const cyI = Math.min(rows - 1, Math.max(0, Math.floor(p.y / cell)));
          let nearest = -1, nd2 = 1e9;
          for (let oy = -1; oy <= 1; oy++) {
            for (let ox = -1; ox <= 1; ox++) {
              const ni = (cyI + oy) * cols + (cxI + ox);
              if (ni < 0 || ni >= grid.length) continue;
              const arr = grid[ni];
              for (let k = 0; k < arr.length; k++) {
                const j = arr[k];
                if (j === i) continue;
                const aj = activeAlpha[j];
                if (aj <= 0.2) continue;
                const pj = allPoints[j];
                const dx = pj.x - p.x, dy = pj.y - p.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < nd2 && d2 < (cell * cell * 2.2)) { nd2 = d2; nearest = j; }
              }
            }
          }
          if (nearest >= 0) {
            const q = allPoints[nearest];
            const aj = activeAlpha[nearest];
            const dist = Math.sqrt(nd2);
            const linkAlpha = Math.max(0, 0.24 * (a + aj) * (1 - dist / (cell * Math.sqrt(2))) );
            if (linkAlpha > 0.02) {
              const grad = ctx.createLinearGradient(p.x, p.y, q.x, q.y);
              grad.addColorStop(0, `rgba(255, 220, 140, ${linkAlpha})`);
              grad.addColorStop(1, `rgba(212, 175, 55, ${linkAlpha})`);
              ctx.strokeStyle = grad;
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
            }
          }
        }

        // Orbiting sparks
        ctx.globalCompositeOperation = 'screen';
        for (let i = 0; i < sparks.length; i++) {
          const sp = sparks[i];
          sp.a += sp.s * dt * 0.9;
          const rx = cx + Math.cos(sp.a) * sp.r;
          const ry = cy + Math.sin(sp.a) * sp.r;
          ctx.globalAlpha = 0.22 + 0.2 * Math.sin(now * 0.002 + i);
          ctx.drawImage(glowSprite, rx - 7, ry - 7, 14, 14);
        }

        // Final text overlay sharpened as reveal progresses, then dissolve softly
        const appear = easeInOutSine(Math.min(1, tReveal * 1.15));
        const dissolve = Math.max(0, Math.min(1, (elapsed - durationMs - holdMs) / dissolveMs));
        const textAlpha = Math.max(0, Math.min(0.98, appear * (1 - dissolve)));
        if (textAlpha > 0) {
          ctx.save();
          ctx.globalAlpha = textAlpha;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowBlur = Math.floor(18 * qFactor);
          let yy = yStartSans;
          for (let i = 0; i < sansLines.length; i++) {
            const grad = ctx.createLinearGradient(cx - 50, yy - 20, cx + 50, yy + 20);
            grad.addColorStop(0, 'rgba(255, 234, 150, 0.96)');
            grad.addColorStop(1, 'rgba(212, 175, 55, 0.95)');
            ctx.fillStyle = grad;
            ctx.font = `600 ${baseSize}px ${fontPrimary}`;
            ctx.fillText(sansLines[i], cx, yy);
            yy += lineGap;
          }
          if (engLines.length) {
            yy = yStartSans + sansLines.length * lineGap + pairGap + engLineHeight / 2;
            ctx.globalAlpha = Math.min(0.9, textAlpha);
            ctx.fillStyle = 'rgba(233, 214, 143, 0.92)';
            ctx.shadowBlur = Math.floor(12 * qFactor);
            ctx.font = `italic 500 ${smallSize}px ${englishFont}`;
            for (let i = 0; i < engLines.length; i++) { ctx.fillText(engLines[i], cx, yy); yy += engLineHeight; }
          }
          ctx.restore();
        }

        // End or continue
        if (elapsed < durationMs + holdMs + dissolveMs) {
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
  }, [text, secondaryText, onComplete, durationMs, holdMs, quality]);

  return (
    <CanvasWrap>
      <Canvas ref={canvasRef} />
    </CanvasWrap>
  );
}
