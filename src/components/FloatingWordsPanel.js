import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

const PanelWrap = styled.div`
  width: min(32vw, 360px);
  height: 360px;
  border: 1px solid rgba(212,175,55,0.28);
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(0,0,0,0.78), rgba(10,10,10,0.92));
  box-shadow: 0 16px 40px rgba(0,0,0,0.5);
  overflow: hidden;
`;

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border-bottom: 1px solid rgba(212,175,55,0.22);
  color: #e6c76a;
  font-family: var(--font-primary);
  font-weight: 700;
  letter-spacing: 0.02em;
  font-size: 0.95rem;
`;

const ToggleBtn = styled.button`
  appearance: none;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid rgba(212,175,55,0.35);
  background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95));
  color: #e8c86a;
  font-family: var(--font-primary);
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: calc(100% - 42px);
  display: block;
`;

const Tooltip = styled.div`
  position: absolute;
  transform: translate(-50%, -120%);
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(212,175,55,0.35);
  background: linear-gradient(145deg, rgba(0,0,0,0.88), rgba(12,12,12,0.96));
  color: #e8c86a;
  font-family: var(--font-primary);
  font-size: 0.85rem;
  pointer-events: none;
  white-space: nowrap;
`;

export default function FloatingWordsPanel({ pool, discovered }) {
  const [minimized, setMinimized] = useState(false);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const hoverRef = useRef({ x: 0, y: 0, active: false });
  const [hoverWord, setHoverWord] = useState(null);

  const words = useMemo(() => {
    const list = pool && pool.length ? pool.slice(0) : [];
    return list;
  }, [pool]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;

    const w = rect.width;
    const h = rect.height;

    const rng = (seed) => {
      let t = seed >>> 0;
      return () => (t = (t * 1664525 + 1013904223) >>> 0) / 4294967296;
    };
    const rand = rng(1234567);

    // Precompute glyph metrics
    const items = words.map((wrd, i) => {
      const depth = 0.6 + rand() * 0.8; // 0.6..1.4
      const speed = 12 + rand() * 22;
      const angle = rand() * Math.PI * 2;
      const sx = 40 + rand() * (w - 80);
      const sy = 40 + rand() * (h - 80);
      const rot = (rand() - 0.5) * 0.08;
      const s = 0.9 + (depth - 0.6) * 0.2;
      return {
        id: wrd.id,
        sk: wrd.sk,
        en: wrd.en,
        tr: wrd.tr,
        ann: wrd.ann,
        x: sx,
        y: sy,
        vx: Math.cos(angle) * speed * (0.15 + (1.6 - depth) * 0.3),
        vy: Math.sin(angle) * speed * (0.15 + (1.6 - depth) * 0.3),
        rot,
        depth,
        scale: s,
        glow: 0,
        discovered: !!discovered[wrd.id]
      };
    });

    const fontSk = '600 20px Noto Serif Devanagari, Noto Sans Devanagari, serif';
    const fontEn = 'italic 12px Crimson Text, serif';

    function measure(item) {
      ctx.save();
      ctx.font = fontSk;
      const w1 = ctx.measureText(item.sk).width;
      ctx.font = fontEn;
      const w2 = ctx.measureText(item.en).width;
      ctx.restore();
      const width = Math.max(w1, w2) + 16;
      const height = 28 + 16;
      return { width, height };
    }

    const bounds = items.map(measure);

    let last = performance.now();

    function tick(now) {
      const dt = Math.min(40, now - last) / 1000;
      last = now;
      ctx.clearRect(0, 0, w, h);

      // Interaction: hover - find nearest under cursor
      let hoveredIndex = -1;
      if (hoverRef.current.active) {
        const mx = hoverRef.current.x;
        const my = hoverRef.current.y - 42; // account for header height
        for (let i = 0; i < items.length; i++) {
          const b = bounds[i];
          const ix = items[i].x - b.width / 2;
          const iy = items[i].y - b.height / 2;
          if (mx >= ix && mx <= ix + b.width && my >= iy && my <= iy + b.height) { hoveredIndex = i; break; }
        }
      }

      // Separation force (simple collision avoidance)
      for (let i = 0; i < items.length; i++) {
        const a = items[i];
        for (let j = i + 1; j < items.length; j++) {
          const b = items[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d2 = dx*dx + dy*dy;
          const minDist = (bounds[i].width + bounds[j].width) * 0.25;
          if (d2 < minDist * minDist) {
            const d = Math.sqrt(d2) || 1;
            const ux = dx / d, uy = dy / d;
            const push = (minDist - d) * 0.4;
            a.x -= ux * push; a.y -= uy * push;
            b.x += ux * push; b.y += uy * push;
          }
        }
      }

      // Update and draw items
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const b = bounds[i];
        const speedScale = 0.6 + (1.6 - it.depth) * 0.4;
        it.x += it.vx * speedScale * dt;
        it.y += it.vy * speedScale * dt;
        it.rot += (Math.sin(now * 0.001 + i) * 0.0015);
        const osc = 0.92 + Math.sin(now * 0.0015 + i) * 0.06;
        it.scale = 0.85 + (it.depth - 0.6) * 0.22;
        const alpha = 0.55 + (1.6 - it.depth) * 0.25;

        // Boundary handling
        const halfW = b.width / 2, halfH = b.height / 2;
        if (it.x < halfW) { it.x = halfW; it.vx *= -1; }
        if (it.x > w - halfW) { it.x = w - halfW; it.vx *= -1; }
        if (it.y < halfH) { it.y = halfH; it.vy *= -1; }
        if (it.y > h - halfH) { it.y = h - halfH; it.vy *= -1; }

        // Hover highlight and discovered glow
        const isHover = i === hoveredIndex;
        it.glow += ((isHover ? 1 : 0) - it.glow) * Math.min(1, dt * 8);

        // Draw
        ctx.save();
        ctx.translate(it.x, it.y);
        ctx.rotate(it.rot);
        ctx.scale(it.scale * osc, it.scale * osc);
        ctx.globalAlpha = alpha;

        // Background pill
        ctx.fillStyle = 'rgba(20,20,20,0.65)';
        ctx.strokeStyle = `rgba(212,175,55,${0.25 + it.glow * 0.5 + (it.discovered ? 0.25 : 0)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const bw = b.width, bh = b.height;
        const r = 10;
        ctx.moveTo(-bw/2 + r, -bh/2);
        ctx.lineTo(bw/2 - r, -bh/2);
        ctx.quadraticCurveTo(bw/2, -bh/2, bw/2, -bh/2 + r);
        ctx.lineTo(bw/2, bh/2 - r);
        ctx.quadraticCurveTo(bw/2, bh/2, bw/2 - r, bh/2);
        ctx.lineTo(-bw/2 + r, bh/2);
        ctx.quadraticCurveTo(-bw/2, bh/2, -bw/2, bh/2 - r);
        ctx.lineTo(-bw/2, -bh/2 + r);
        ctx.quadraticCurveTo(-bw/2, -bh/2, -bw/2 + r, -bh/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Text
        ctx.shadowColor = 'rgba(255, 230, 140, 0.55)';
        ctx.shadowBlur = 8 * (0.5 + it.glow);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#f6e1a0';
        ctx.font = fontSk;
        ctx.fillText(it.sk, 0, -6);
        ctx.globalAlpha = alpha * 0.9;
        ctx.fillStyle = '#d7be73';
        ctx.font = fontEn;
        ctx.fillText(it.en, 0, 12);
        ctx.restore();
      }

      if (hoveredIndex >= 0) {
        const it = items[hoveredIndex];
        setHoverWord({ x: it.x, y: it.y + 10, tr: it.tr, ann: it.ann });
      } else if (hoverWord) {
        setHoverWord(null);
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    function handleMove(e) {
      const rect = canvas.getBoundingClientRect();
      hoverRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    }
    function handleLeave() { hoverRef.current.active = false; }
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseleave', handleLeave);

    function handleResize() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.floor(r.width * Math.min(2, window.devicePixelRatio || 1));
      canvas.height = Math.floor(r.height * Math.min(2, window.devicePixelRatio || 1));
      last = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseleave', handleLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [words, discovered, hoverWord]);

  return (
    <PanelWrap aria-label="Floating words panel">
      <HeaderBar>
        <span>Unfolding Lexicon</span>
        <ToggleBtn type="button" onClick={() => setMinimized(v => !v)} aria-pressed={minimized} aria-label={minimized ? 'Maximize panel' : 'Minimize panel'}>
          {minimized ? 'Show' : 'Hide'}
        </ToggleBtn>
      </HeaderBar>
      {!minimized && (
        <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 42px)' }}>
          <Canvas ref={canvasRef} />
          {hoverWord && (
            <Tooltip style={{ left: hoverWord.x, top: hoverWord.y }}>
              {hoverWord.tr || ''}{hoverWord.tr && hoverWord.ann ? ' — ' : ''}{hoverWord.ann || ''}
            </Tooltip>
          )}
        </div>
      )}
    </PanelWrap>
  );
}
