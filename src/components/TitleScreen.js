import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import SettingsModal from './SettingsModal';
import DailyRiddle from './DailyRiddle';
import { useGame, ACTIONS, GAME_STATES } from '../context/GameContext';
import Button from '../ui/primitives/Button';
import { colors, spacing, radius, typography } from '../ui/tokens';

// Reserved breathing glow animation for future use
// const breath = keyframes`
//   0%, 100% {
//     text-shadow:
//       0 0 10px rgba(212,175,55,0.35),
//       0 0 20px rgba(212,175,55,0.25),
//       0 2px 0 rgba(0,0,0,0.35);
//   }
//   50% {
//     text-shadow:
//       0 0 16px rgba(255,215,0,0.65),
//       0 0 32px rgba(212,175,55,0.45),
//       0 2px 0 rgba(0,0,0,0.35);
//   }
// `;

// Slow ambient motion for background aura
const drift = keyframes`
  0%   { transform: translate(-5%, -5%) scale(1); opacity: 0.35; }
  50%  { transform: translate(5%, 5%) scale(1.05); opacity: 0.55; }
  100% { transform: translate(-5%, -5%) scale(1); opacity: 0.35; }
`;

// Floating particles animation
const float = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 1;
  }
`;

// Pulse animation for interactive elements
const pulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(212, 175, 55, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.6), 0 0 40px rgba(212, 175, 55, 0.3);
  }
`;

// Subtle text glow animation
const textGlow = keyframes`
  0%, 100% {
    text-shadow:
      0 0 10px rgba(212, 175, 55, 0.4),
      0 0 20px rgba(212, 175, 55, 0.2),
      0 2px 0 rgba(0, 0, 0, 0.3);
  }
  50% {
    text-shadow:
      0 0 20px rgba(255, 215, 0, 0.7),
      0 0 40px rgba(212, 175, 55, 0.5),
      0 2px 0 rgba(0, 0, 0, 0.3);
  }
`;

const slowSpin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const ScreenRoot = styled.div`
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse at center, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.95) 65%),
    linear-gradient(135deg, var(--ink-black) 0%, var(--deep-blue) 50%, var(--royal-blue) 100%);

  &::before {
    content: '';
    position: absolute;
    inset: -20%;
    background:
      radial-gradient(60% 60% at 50% 45%, rgba(212, 175, 55, 0.1) 0%, rgba(0, 0, 0, 0) 60%),
      radial-gradient(40% 40% at 70% 60%, rgba(255, 215, 0, 0.08) 0%, rgba(0, 0, 0, 0) 70%);
    filter: blur(26px);
    animation: ${drift} 18s ease-in-out infinite;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 3px 3px;
    opacity: 0.06;
    pointer-events: none;
  }
`;

const ParallaxLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  transform: translate(calc(var(--mx, 0) * -2%), calc(var(--my, 0) * -2%));
`;

const Particle = styled.div`
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(212, 175, 55, 0.6);
  filter: blur(0.3px);
  left: var(--x);
  top: var(--y);
  opacity: var(--o, 0.6);
  animation: ${float} ${(props) => 3 + Math.random() * 4}s ease-in-out infinite;
  animation-delay: ${(props) => Math.random() * 2}s;
`;

const FloatingElement = styled(motion.div)`
  position: absolute;
  font-size: ${(props) => props.size || typography.fontSize.lg};
  color: rgba(212, 175, 55, 0.3);
  pointer-events: none;
  left: var(--x);
  top: var(--y);
  animation: ${float} ${(props) => 5 + Math.random() * 5}s ease-in-out infinite;
  animation-delay: ${(props) => Math.random() * 3}s;
`;

const Sanskrit = styled.span`
  position: absolute;
  font-family: var(--font-devanagari);
  font-size: 18px;
  color: rgba(230, 199, 106, 0.6);
  opacity: 0.8;
  left: var(--x);
  top: var(--y);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
`;

const CenterStack = styled.div`
  position: relative;
  z-index: 1;
  max-width: 860px;
  margin: 0 auto;
  padding: var(--spacing-xxl) var(--spacing-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);

  /* Utility spacing */
  .spacer-8 { height: 8px; }
`;

const TitleHalo = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: clamp(280px, 60vw, 720px);
  height: clamp(120px, 22vw, 240px);
  transform: translate(-50%, calc(-50% - 40px));
  border-radius: 1000px;
  background:
    radial-gradient(65% 120% at 50% 50%, rgba(212, 175, 55, 0.16), rgba(212, 175, 55, 0) 70%),
    radial-gradient(100% 220% at 50% 100%, rgba(255, 215, 0, 0.08), rgba(0, 0, 0, 0) 60%);
  filter: blur(18px);
  pointer-events: none;
  position: relative;
  overflow: visible;

  &::before {
    content: '';
    position: absolute;
    inset: -12%;
    border-radius: inherit;
    background: conic-gradient(
      from 0deg,
      rgba(212, 175, 55, 0.08) 0deg,
      rgba(212, 175, 55, 0) 45deg,
      rgba(212, 175, 55, 0.1) 180deg,
      rgba(212, 175, 55, 0) 315deg,
      rgba(212, 175, 55, 0.08) 360deg
    );
    filter: blur(24px);
    animation: ${slowSpin} 30s linear infinite;
    will-change: transform, opacity, filter;
  }
`;

const Mandala = styled.div`
  position: absolute;
  top: calc(50% + 80px);
  left: 50%;
  transform: translate(-50%, -50%);
  width: clamp(160px, 32vw, 320px);
  height: clamp(160px, 32vw, 320px);
  border-radius: 50%;
  background:
    radial-gradient(closest-side, rgba(212, 175, 55, 0.12), rgba(0, 0, 0, 0) 70%),
    conic-gradient(
      from 0deg,
      rgba(212, 175, 55, 0.18) 0deg 6deg,
      transparent 6deg 12deg,
      rgba(212, 175, 55, 0.14) 12deg 18deg,
      transparent 18deg 24deg,
      rgba(212, 175, 55, 0.12) 24deg 30deg,
      transparent 30deg 36deg
    );
  filter: blur(0.2px);
  opacity: 0.6;
  pointer-events: none;
  animation: ${slowSpin} 120s linear infinite;
`;

const TitleWordmark = styled(motion.h1)`
  font-family: var(--font-display);
  font-size: clamp(3rem, 9vw, 6rem);
  letter-spacing: 0.12em;
  line-height: 1.05;
  margin: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 244, 176, 0.95) 0%,
    var(--gold) 35%,
    var(--faded-gold) 65%,
    var(--copper) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${textGlow} 4.2s ease-in-out infinite;
  position: relative;
  will-change: transform, opacity, filter;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    inset: -8px;
    background: radial-gradient(
      circle at 50% 55%,
      rgba(212, 175, 55, 0.16),
      rgba(212, 175, 55, 0) 60%
    );
    filter: blur(14px);
    z-index: -1;
    pointer-events: none;
  }

  &:hover {
    animation: ${textGlow} 2s ease-in-out infinite;
  }
`;

const Whisper = styled(motion.p)`
  font-family: var(--font-primary);
  color: ${colors.fadedGold};
  opacity: 0.8;
  margin-top: -6px;
  text-align: center;
  font-size: ${typography.fontSize.sm};
  animation: ${pulse} 3s ease-in-out infinite;
  animation-delay: 1s;
`;

const Menu = styled(motion.div)`
  display: grid;
  gap: var(--spacing-md);
  width: min(92vw, 520px);
`;

const ActionButton = styled(motion(Button))`
  width: 100%;
  padding: ${spacing['4']} ${spacing['6']};
  font-size: ${typography.fontSize.lg};
  border-radius: ${radius.pill};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
    transition: left 0.6s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

function TitleScreen() {
  const { dispatch } = useGame();
  const [openSettings, setOpenSettings] = useState(false);
  const [hasSave, setHasSave] = useState(false);
  const rootRef = useRef(null);
  const particles = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 4,
      })),
    []
  );

  const floatingElements = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        symbol: ['✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮'][i],
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        size: `${0.8 + Math.random() * 0.6}rem`,
        delay: Math.random() * 3,
        duration: 8 + Math.random() * 4,
      })),
    []
  );
  const glyphs = useMemo(
    () =>
      ['ॐ', 'अ', 'इ', 'उ', 'क', 'थ', 'ध', 'ज्ञ', 'श', 'ष', 'ह', 'ग', 'य', 'र', 'ल', 'व'].map(
        (g) => ({ g, x: Math.random() * 100, y: Math.random() * 100 })
      ),
    []
  );

  useEffect(() => {
    try {
      setHasSave(!!localStorage.getItem('dharmas-cipher-state-v1'));
    } catch (_) {}
    const el = rootRef.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const my = ((e.clientY - r.top) / r.height - 0.5) * 2;
      el.style.setProperty('--mx', String(mx));
      el.style.setProperty('--my', String(my));
    };
    const onKey = (e) => {
      if (e.key === 'Enter') {
        dispatch({ type: ACTIONS.SET_GAME_STATE, payload: GAME_STATES.PROFILE_CREATION });
      }
    };
    el.addEventListener('mousemove', onMove);
    window.addEventListener('keydown', onKey);
    return () => {
      el.removeEventListener('mousemove', onMove);
      window.removeEventListener('keydown', onKey);
    };
  }, [dispatch]);

  const handleNewGame = useCallback(() => {
    dispatch({ type: ACTIONS.SET_GAME_STATE, payload: GAME_STATES.PROFILE_CREATION });
  }, [dispatch]);

  const handleLoadGame = () => {
    try {
      const raw = localStorage.getItem('dharmas-cipher-state-v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        dispatch({ type: ACTIONS.LOAD_STATE, payload: parsed });
      } else {
        dispatch({ type: ACTIONS.SET_GAME_STATE, payload: GAME_STATES.PROFILE_CREATION });
      }
    } catch (e) {
      dispatch({ type: ACTIONS.SET_GAME_STATE, payload: GAME_STATES.PROFILE_CREATION });
    }
  };

  const handleSettings = () => {
    setOpenSettings(true);
  };

  return (
    <ScreenRoot ref={rootRef}>
      <ParallaxLayer aria-hidden="true">
        {particles.map((p, i) => (
          <Particle
            key={i}
            style={{
              '--x': `${p.x}%`,
              '--y': `${p.y}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
        {glyphs.map((s, i) => (
          <Sanskrit key={i} style={{ '--x': `${s.x}%`, '--y': `${s.y}%` }}>
            {s.g}
          </Sanskrit>
        ))}
        {floatingElements.map((el, i) => (
          <FloatingElement
            key={i}
            size={el.size}
            style={{
              '--x': `${el.x}%`,
              '--y': `${el.y}%`,
              animationDelay: `${el.delay}s`,
              animationDuration: `${el.duration}s`,
            }}
          >
            {el.symbol}
          </FloatingElement>
        ))}
      </ParallaxLayer>
      <CenterStack>
        <TitleHalo />
        <Mandala aria-hidden />
        <TitleWordmark
          className="shimmer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Dharma's Cipher
        </TitleWordmark>
        <Whisper
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Press Enter to begin.
        </Whisper>
        <Menu
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2, staggerChildren: 0.1 }}
        >
          <ActionButton
            className="is-interactive"
            type="button"
            aria-label="Start New Journey"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 1.3 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewGame}
          >
            Start New Journey
          </ActionButton>
          <ActionButton
            className="is-interactive"
            type="button"
            aria-label="Continue Path"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleLoadGame}
            disabled={!hasSave}
            aria-disabled={!hasSave}
          >
            Continue Path
          </ActionButton>
          <ActionButton
            className="is-interactive"
            type="button"
            aria-label="Open Sacred Settings"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSettings}
          >
            Sacred Settings
          </ActionButton>
        </Menu>
        <div className="spacer-8" />
        <React.Suspense fallback={null}>
          <DailyRiddle />
        </React.Suspense>
      </CenterStack>
      <SettingsModal open={openSettings} onClose={() => setOpenSettings(false)} />
    </ScreenRoot>
  );
}
export default React.memo(TitleScreen);
