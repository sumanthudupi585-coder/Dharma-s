import React, { useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';

const Frame = styled.div`
  position: relative;
  width: clamp(160px, 32vw, 320px);
  height: clamp(160px, 32vw, 320px);
  margin: 0 auto;
  border-radius: 50%;
  border: 2px solid #d4af37;
  box-shadow:
    0 18px 60px rgba(0, 0, 0, 0.55),
    0 0 28px rgba(212, 175, 55, 0.25);
  background: radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1), rgba(0, 0, 0, 0) 65%);
  overflow: hidden;
`;

const Canvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

// Deterministic PRNG
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStr(str = '') {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

export default function MandalaSigil({ profile }) {
  const ref = useRef(null);
  const seed = useMemo(() => {
    const key = [
      profile?.primaryGuna,
      profile?.primaryGana,
      profile?.rashi,
      profile?.nakshatra?.name,
      (profile?.skills || []).map((s) => s.name).join('-'),
    ].join('|');
    return hashStr(key);
  }, [profile]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const rnd = mulberry32(seed || 1);

    function drawRing(cx, cy, r, n, rot, color) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(a + rot);
        const w = 6 + r * 0.02;
        const h = 14 + r * 0.05;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6 + 0.4 * rnd();
        ctx.beginPath();
        ctx.moveTo(-w / 2, -h / 2);
        ctx.lineTo(w / 2, -h / 2);
        ctx.lineTo(0, h / 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }

    function drawGlyph(cx, cy, r, n, rot, color) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.8;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        ctx.beginPath();
        ctx.arc(x, y, 6 + rnd() * 8, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    function draw() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const base = Math.min(w, h) / 2 - 16;

      // Color mapping by profile
      const gunaHue =
        profile?.primaryGuna === 'SATTVA' ? 48 : profile?.primaryGuna === 'RAJAS' ? 30 : 12;
      const ganaHue =
        profile?.primaryGana === 'DEVA' ? 50 : profile?.primaryGana === 'MANUSHYA' ? 42 : 20;
      const gold = `hsla(${gunaHue}, 78%, 62%, 0.85)`;
      const copper = `hsla(${ganaHue}, 64%, 55%, 0.65)`;

      // Background radial
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, base);
      rg.addColorStop(0, 'rgba(212,175,55,0.12)');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(cx, cy, base + 12, 0, Math.PI * 2);
      ctx.fill();

      // Rings derived from profile traits
      const rings = [
        { r: base * 0.25, n: 6 + Math.floor(rnd() * 6), rot: rnd() * Math.PI, col: gold },
        { r: base * 0.42, n: 8 + Math.floor(rnd() * 6), rot: rnd() * Math.PI, col: copper },
        { r: base * 0.62, n: 10 + Math.floor(rnd() * 6), rot: rnd() * Math.PI, col: gold },
      ];

      rings.forEach((ring, i) => {
        drawRing(cx, cy, ring.r, ring.n, ring.rot, ring.col);
        drawGlyph(
          cx,
          cy,
          ring.r * (0.84 + 0.08 * rnd()),
          Math.max(4, Math.floor(ring.n / 2)),
          ring.rot * -1.2,
          ring.col
        );
      });

      // Central symbol: star polygon parameterized by skills length
      const k = Math.max(5, (profile?.skills || []).length + 4);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rnd() * Math.PI);
      ctx.strokeStyle = 'rgba(255, 232, 160, 0.95)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let i = 0; i <= k; i++) {
        const a = (i / k) * Math.PI * 2;
        const rr = base * 0.18 * (1 + 0.05 * Math.sin(i));
        const x = Math.cos(a) * rr;
        const y = Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    draw();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [seed, profile]);

  return (
    <Frame aria-label="Personalized mandala sigil">
      <Canvas ref={ref} />
    </Frame>
  );
}
