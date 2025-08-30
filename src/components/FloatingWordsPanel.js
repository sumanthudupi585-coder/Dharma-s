import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

const PanelWrap = styled.div`
  width: min(32vw, 360px);
  height: ${p => (p.$min ? '42px' : '360px')};
  border: 1px solid rgba(212,175,55,0.28);
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(0,0,0,0.78), rgba(10,10,10,0.92));
  box-shadow: 0 16px 40px rgba(0,0,0,0.5);
  overflow: hidden;
  transition: height 220ms ease, width 220ms ease, transform 220ms ease;
  position: ${p => (p.$min ? 'absolute' : 'static')};
  top: ${p => (p.$min ? '14px' : 'auto')};
  right: ${p => (p.$min ? '14px' : 'auto')};
  width: ${p => (p.$min ? 'auto' : 'min(32vw, 360px)')};
  z-index: ${p => (p.$min ? 5 : 2)};
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
  height: 100%;
  display: block;
`;

const InnerArea = styled.div`
  position: relative;
  width: 100%;
  height: ${p => (p.$min ? '0px' : 'calc(100% - 42px)')};
  overflow: hidden;
  transition: height 200ms ease;
`;

const Tooltip = styled.div`
  position: absolute;
  transform: translate(-50%, -120%);
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(212,175,55,0.5);
  background: linear-gradient(145deg, rgba(0,0,0,0.94), rgba(12,12,12,0.99));
  color: #f3dfa0;
  font-family: var(--font-primary);
  font-size: 0.94rem;
  line-height: 1.32;
  pointer-events: none;
  white-space: normal;
  max-width: 420px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.55);
  opacity: 0;
  transition: opacity 160ms ease;
  backdrop-filter: blur(6px);

  &.visible { opacity: 1; }

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -6px;
    transform: translateX(-50%);
    width: 0; height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid rgba(212,175,55,0.5);
  }

  .tip-sk { font-family: var(--font-display); font-weight: 700; color: #f6e7b5; display: block; margin-bottom: 2px; }
  .tip-tr { opacity: 0.95; color: #e9d68f; font-style: italic; display: block; }
  .tip-ann { opacity: 0.88; color: #d7be73; display: block; margin-top: 2px; }
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

      // Interaction: enlarged hover area with proximity fallback
      let hoveredIndex = -1;
      if (hoverRef.current.active) {
        const mx = hoverRef.current.x;
        const my = hoverRef.current.y - 42; // account for header height
        let best = -1; let bestD2 = Infinity;
        for (let i = 0; i < items.length; i++) {
          const it = items[i];
          const b = bounds[i];
          const osc = 0.92 + Math.sin(now * 0.0015 + i) * 0.06;
          const s = it.scale * osc;
          const dx = mx - it.x;
          const dy = my - it.y;
          const cos = Math.cos(it.rot);
          const sin = Math.sin(it.rot);
          const lx = (cos * dx + sin * dy) / s;
          const ly = (-sin * dx + cos * dy) / s;
          const padX = 26, padY = 18; // larger forgiving hitbox
          if (Math.abs(lx) <= b.width / 2 + padX && Math.abs(ly) <= b.height / 2 + padY) { hoveredIndex = i; break; }
          const d2 = dx * dx + dy * dy;
          if (d2 < bestD2) { bestD2 = d2; best = i; }
        }
        if (hoveredIndex === -1 && best >= 0 && bestD2 <= 75 * 75) hoveredIndex = best; // proximity snap
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

        // No box/outline; render only text with glow

        // Text
        ctx.shadowColor = 'rgba(255, 230, 140, 0.55)';
        ctx.shadowBlur = 8 * (0.5 + it.glow + (it.discovered ? 0.6 : 0));
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
        const tx = Math.max(14, Math.min(w - 14, it.x));
        const ty = Math.max(14, Math.min(h - 14, it.y + 14));
        setHoverWord({ x: tx, y: ty, sk: it.sk, tr: it.tr, ann: it.ann });
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
    <PanelWrap aria-label="Tattva Sūtras panel" $min={minimized}>
      <HeaderBar>
        <span>Tattva Sūtras</span>
        <ToggleBtn type="button" onClick={() => setMinimized(v => !v)} aria-pressed={minimized} aria-label={minimized ? 'Expand panel' : 'Collapse panel'}>
          {minimized ? 'Show' : 'Hide'}
        </ToggleBtn>
      </HeaderBar>
      <InnerArea $min={minimized} aria-hidden={minimized}>
        <Canvas ref={canvasRef} />
        {hoverWord && (
          <Tooltip style={{ left: hoverWord.x, top: hoverWord.y }} className="visible">
            {hoverWord.sk && <span className="tip-sk">{hoverWord.sk}</span>}
            {hoverWord.tr && <span className="tip-tr">{hoverWord.tr}</span>}
            {hoverWord.ann && <span className="tip-ann">{hoverWord.ann}</span>}
          </Tooltip>
        )}
      </InnerArea>
    </PanelWrap>
  );
}
