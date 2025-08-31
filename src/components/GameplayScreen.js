import React, { useState, useEffect, Suspense, lazy, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame, SCENES, ACTIONS } from '../context/GameContext';
import { engine } from './AudioManager';
import SwipeNavigator from './SwipeNavigator';
import SceneProgressMap from './SceneProgressMap';
const Journal = lazy(() => import('./Journal'));

const Scene1DashashwamedhGhat = lazy(() => import('./scenes/Scene1DashashwamedhGhat'));
const Scene2LabyrinthGhats = lazy(() => import('./scenes/Scene2LabyrinthGhats'));
const Scene3NyayaTrial = lazy(() => import('./scenes/Scene3NyayaTrial'));
const Scene4VaisesikaTrial = lazy(() => import('./scenes/Scene4VaisesikaTrial'));
const Scene5TheWarden = lazy(() => import('./scenes/Scene5TheWarden'));

// Breathing glow effect for UI elements
const breathingGlow = keyframes`
  0%, 100% {
    box-shadow:
      0 0 20px rgba(212, 175, 55, 0.4),
      0 0 40px rgba(212, 175, 55, 0.2),
      inset 0 0 20px rgba(212, 175, 55, 0.1);
    border-color: rgba(212, 175, 55, 0.6);
  }
  50% {
    box-shadow:
      0 0 30px rgba(212, 175, 55, 0.7),
      0 0 60px rgba(212, 175, 55, 0.4),
      inset 0 0 30px rgba(212, 175, 55, 0.2);
    border-color: rgba(212, 175, 55, 0.9);
  }
`;

// Golden energy flow for status elements
const energyFlow = keyframes`
  0% {
    background-position: 0% 50%;
    opacity: 0.8;
  }
  50% {
    background-position: 100% 50%;
    opacity: 1;
  }
  100% {
    background-position: 200% 50%;
    opacity: 0.8;
  }
`;

// Trailing golden light effect
const trailEffect = keyframes`
  0% {
    transform: translateX(-100%) scaleX(0);
    opacity: 0;
  }
  50% {
    transform: translateX(0%) scaleX(1);
    opacity: 1;
  }
  100% {
    transform: translateX(100%) scaleX(0);
    opacity: 0;
  }
`;

// (removed filigreeGlow animation to simplify UI)

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.95);
  z-index: 999;
  padding: var(--spacing-lg);
  backdrop-filter: blur(10px);
`;

const OverlayContent = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  height: 80vh;
`;

const GameplayContainer = styled.div`
  min-height: 100vh;
  background:
    radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.95) 70%),
    linear-gradient(135deg, var(--ink-black) 0%, var(--deep-blue) 50%, var(--royal-blue) 100%);
  display: grid;
  grid-template-columns: 1.3fr 380px;
  grid-template-rows: 1fr auto;
  gap: var(--spacing-xl);
  padding: var(--spacing-lg);
  padding-bottom: calc(var(--spacing-lg) + 160px); /* safe area for hotbar */
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  max-width: 1280px;
  margin: 0 auto;

  /* Mystical background pattern */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.03) 1px, transparent 2px),
      radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.02) 1px, transparent 2px);
    background-size: 100px 100px, 150px 150px;
    animation: ${breathingGlow} 12s ease-in-out infinite;
    pointer-events: none;
    z-index: 1;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto 60px;
  }
`;

const MainContentArea = styled.div`
  grid-column: 1;
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  position: relative;
  z-index: 10;
  max-width: 980px;
  width: 100%;

  @media (max-width: 1024px) {
    grid-row: 1;
  }
`;

const NarrativeWindow = styled(motion.div)`
  background:
    linear-gradient(145deg, rgba(0, 0, 0, 0.9) 0%, rgba(15, 15, 15, 0.95) 100%);
  border: 2px solid #d4af37;
  border-radius: 14px;
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.75),
    0 0 24px rgba(212, 175, 55, 0.22);
  flex: 1;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(8px);

  /* Clean content background for readability */
  &::before { display: none; }
  &::after { display: none; }
`;

const NarrativeContent = styled.div`
  padding: var(--spacing-xl);
  position: relative;
  z-index: 10;
  height: 100%;
  overflow-y: auto;
  padding-bottom: calc(var(--spacing-xl) + 200px);
  max-width: 70ch;
  margin: 0 auto;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #d4af37, #ffd700); border-radius: 3px; }
`;

// Mini-map panel
const MiniMapPanel = styled.div`
  position: sticky;
  top: calc(var(--spacing-lg) + 70px);
  right: auto;
  width: 180px;
  height: 140px;
  background: linear-gradient(145deg, rgba(0,0,0,0.85), rgba(15,15,15,0.95));
  border: 3px solid #d4af37;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.7), 0 0 24px rgba(212,175,55,0.25);
  z-index: 150;

  @media (max-width: 1024px) {
    display: none;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 6px;
    border-radius: 10px;
    background:
      radial-gradient(circle at 15% 25%, rgba(212,175,55,0.12) 1px, transparent 2px),
      radial-gradient(circle at 65% 70%, rgba(212,175,55,0.08) 1px, transparent 2px),
      repeating-linear-gradient(90deg, rgba(212,175,55,0.08) 0 2px, transparent 2px 10px),
      repeating-linear-gradient(0deg, rgba(212,175,55,0.05) 0 2px, transparent 2px 10px);
    pointer-events: none;
  }
`;

// Hotbar / quick slots
const HotbarContainer = styled.div`
  position: sticky;
  bottom: 0;
  display: grid;
  grid-template-columns: repeat(6, 56px);
  gap: 10px;
  background: linear-gradient(145deg, rgba(0,0,0,0.85), rgba(15,15,15,0.95));
  border: 2px solid #d4af37;
  border-radius: 14px;
  padding: 10px 12px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.7), 0 0 20px rgba(212,175,55,0.25);
  z-index: 20;
  margin: var(--spacing-lg) auto 0;
`;

const HotbarSlot = styled.div`
  width: 56px;
  height: 56px;
  border: 2px solid ${p => (p.$active ? '#ffd700' : 'rgba(212, 175, 55, 0.4)')};
  border-radius: 10px;
  background: linear-gradient(145deg, rgba(0,0,0,0.7), rgba(10,10,10,0.85));
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d4af37;
  font-size: 1.4rem;
  position: relative;
  overflow: hidden;
  ${p => p.$active && css`animation: ${breathingGlow} 6s ease-in-out infinite;`}
`;

const SlotIndex = styled.span`
  position: absolute;
  bottom: 4px;
  right: 6px;
  font-family: var(--font-display);
  font-size: 0.7rem;
  background: linear-gradient(145deg, #d4af37, #ffd700);
  color: #000;
  padding: 1px 4px;
  border-radius: 6px;
`;

// Sticky page header containing objective and HUD
const HeaderBar = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--spacing-md);
  align-items: center;
  position: sticky;
  top: var(--spacing-lg);
  z-index: 30;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
`;

// Tooltip
const TooltipBubble = styled.div`
  position: fixed;
  transform: translate(-50%, calc(-100% - 10px));
  background: linear-gradient(145deg, rgba(0,0,0,0.92), rgba(15,15,15,0.98));
  border: 1px solid rgba(212,175,55,0.6);
  color: #d4af37;
  font-family: var(--font-primary);
  font-size: var(--fs-sm);
  padding: 6px 10px;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.6), 0 0 16px rgba(212,175,55,0.25);
  pointer-events: none;
  z-index: 2000;
  left: ${p => p.$x}px;
  top: ${p => p.$y}px;
`;

// HUD components
const DecoHUD = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: var(--spacing-sm);
  justify-content: end;
  align-items: center;
  @media (max-width: 1024px) {
    grid-auto-flow: row;
    justify-content: stretch;
  }
`;

const HintButton = styled(motion.button)`
  appearance: none;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(212,175,55,0.45);
  background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95));
  color: #e8c86a;
  font-family: var(--font-primary);
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.2s ease, background 0.2s ease;
  &:hover { border-color: #ffd700; background: linear-gradient(145deg, #ffd95e, #ffc82e); color: #000; transform: translateY(-1px); }
`;

const HintBanner = styled(motion.div)`
  background: linear-gradient(145deg, rgba(212, 175, 55, 0.12), rgba(255, 215, 0, 0.08));
  border: 1px solid #d4af37;
  border-radius: 10px;
  padding: var(--spacing-md);
  color: #e8c86a;
  margin-top: var(--spacing-sm);
`;

const Gauge = styled.div`
  width: 220px;
  height: 22px;
  background: linear-gradient(145deg, rgba(0,0,0,0.85), rgba(20,20,20,0.95));
  border: 2px solid #d4af37;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.6), 0 0 16px rgba(212,175,55,0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 9px;
    background: repeating-linear-gradient(90deg, rgba(212,175,55,0.15) 0 4px, transparent 4px 10px);
    pointer-events: none;
  }
`;

const Fill = styled.div`
  height: 100%;
  width: ${props => props.$value}%;
  background: linear-gradient(90deg, #d4af37, #ffd700, #d4af37);
  background-size: 200% 100%;
  animation: ${energyFlow} 3s linear infinite;
  border-radius: 10px;
  transition: width 500ms ease;
  will-change: transform, opacity;
`;

const GaugeLabel = styled.span`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  font-family: var(--font-display);
  color: #000;
  background: linear-gradient(145deg, #d4af37, #ffd700);
  padding: 2px 8px;
  border-radius: 8px;
  font-size: var(--fs-sm);
`;

const ObjectivesBanner = styled(motion.div)`
  background:
    linear-gradient(145deg, rgba(212, 175, 55, 0.1) 0%, rgba(255, 107, 53, 0.05) 100%);
  border: 2px solid #d4af37;
  border-radius: 10px;
  padding: var(--spacing-md) var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  position: relative;
  backdrop-filter: blur(5px);
  animation: ${breathingGlow} 6s ease-in-out infinite;
  will-change: transform, opacity, box-shadow;

  /* Objective icon with golden glow */
  &::before {
    content: '🎯';
    position: absolute;
    left: var(--spacing-md);
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.3rem;
    filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.6));
  }

  /* Golden energy trail */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      transparent 0%,
      #d4af37 50%,
      transparent 100%
    );
    animation: ${trailEffect} 3s ease-in-out infinite;
  }
`;

const ObjectiveText = styled.h3`
  font-family: var(--font-primary);
  color: #d4af37;
  margin: 0;
  margin-left: 45px;
  font-size: var(--fs-lg);
  font-weight: 700;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
`;

const ChoicesPanel = styled(motion.div)`
  background:
    linear-gradient(145deg, rgba(0, 0, 0, 0.92) 0%, rgba(10, 10, 10, 0.96) 100%);
  border: 2px solid #d4af37;
  border-radius: 12px;
  padding: var(--spacing-lg);
  min-height: 150px;
  backdrop-filter: blur(10px);
  box-shadow:
    0 10px 26px rgba(0, 0, 0, 0.7),
    0 0 18px rgba(212, 175, 55, 0.18);
  position: relative;

  /* Decorative corner ornaments */
  &::before, &::after {
    content: '❦';
    position: absolute;
    top: var(--spacing-sm);
    font-size: 1.2rem;
    color: #d4af37;
    opacity: 0.7;
    animation: ${breathingGlow} 4s ease-in-out infinite;
  }

  &::before {
    left: var(--spacing-sm);
    animation-delay: 0s;
  }

  &::after {
    right: var(--spacing-sm);
    animation-delay: 2s;
  }
`;

const ChoicesTitle = styled.h3`
  font-family: var(--font-display);
  color: #d4af37;
  font-size: var(--fs-xl);
  margin-bottom: var(--spacing-md);
  text-align: center;
  text-shadow: 0 0 15px rgba(212, 175, 55, 0.6);
`;

const ChoicesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const ChoiceButton = styled(motion.button)`
  background:
    linear-gradient(145deg, rgba(0, 0, 0, 0.8) 0%, rgba(15, 15, 15, 0.9) 100%);
  border: 1px solid #d4af37;
  border-radius: 8px;
  padding: var(--spacing-md) var(--spacing-lg);
  color: #d4af37;
  font-family: var(--font-primary);
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
  will-change: transform, opacity, box-shadow;
  min-height: 48px;
  -webkit-tap-highlight-color: transparent;

  /* Golden energy bar on the left */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(to bottom, transparent, #d4af37, transparent);
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }

  /* Golden trail effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
      transparent,
      rgba(212, 175, 55, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  .choice-text {
    background: linear-gradient(180deg, #d4af37, #ffd700);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
  }
  &.inking .choice-text::after {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 0%;
    background: linear-gradient(90deg, rgba(0,0,0,0), rgba(212,175,55,0.35), rgba(0,0,0,0));
    animation: inking 700ms ease forwards;
  }
  @keyframes inking {
    to { width: 100%; }
  }

  &:hover {
    background:
      linear-gradient(145deg, rgba(212, 175, 55, 0.1) 0%, rgba(255, 215, 0, 0.2) 100%);
    border-color: #ffd700;
    color: #ffd700;
    animation: ${breathingGlow} 2s infinite;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);

    &::before {
      transform: scaleY(1);
    }

    &::after {
      left: 100%;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      animation: none;
      border-color: #d4af37;
      color: #d4af37;
      text-shadow: none;

      &::before {
        transform: scaleY(0);
      }

      &::after {
        left: -100%;
      }
    }
  }
`;

const JournalSidebar = styled(motion.div)`
  grid-column: 2;
  grid-row: 1 / -1;
  position: sticky;
  top: var(--spacing-lg);
  align-self: start;
  z-index: 10;
  height: calc(100vh - 2 * var(--spacing-lg));
  overflow: hidden;

  @media (max-width: 1024px) {
    grid-column: 1;
    grid-row: 2;
    height: 300px;
  }
`;

const JournalToggle = styled(motion.button)`
  position: fixed;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  width: 60px;
  height: 60px;
  background:
    radial-gradient(circle, #d4af37 0%, #ffd700 50%, #d4af37 100%);
  border: 2px solid #d4af37;
  border-radius: 50%;
  color: #000;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow:
    0 6px 20px rgba(212, 175, 55, 0.4),
    0 0 30px rgba(212, 175, 55, 0.3);
  z-index: 1000;
  display: none;
  backdrop-filter: blur(10px);
  animation: ${breathingGlow} 4s ease-in-out infinite;
  will-change: transform, opacity, box-shadow;

  @media (max-width: 1024px) {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &:hover {
    background:
      radial-gradient(circle, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
    transform: scale(1.1);
    box-shadow:
      0 8px 25px rgba(255, 215, 0, 0.6),
      0 0 40px rgba(255, 215, 0, 0.5);
  }
`;

const MapToggle = styled(JournalToggle)`
  top: auto;
  bottom: var(--spacing-lg);
  will-change: transform, opacity, box-shadow;
`;

const SkillIndicator = styled(motion.div)`
  position: fixed;
  bottom: var(--spacing-lg);
  left: var(--spacing-lg);
  background:
    linear-gradient(145deg, rgba(0, 0, 0, 0.95) 0%, rgba(15, 15, 15, 0.98) 100%);
  border: 2px solid #d4af37;
  border-radius: 10px;
  padding: var(--spacing-md);
  backdrop-filter: blur(15px);
  z-index: 100;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.8),
    0 0 20px rgba(212, 175, 55, 0.3);
  animation: ${breathingGlow} 3s ease-in-out infinite;
  will-change: transform, opacity, box-shadow;
`;

const SkillText = styled.p`
  font-family: var(--font-primary);
  color: #d4af37;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.6);
`;

const LazyFallback = styled.div`
  padding: var(--spacing-xl);
  color: #d4af37;
`;

const EdgeNavButton = styled(motion.button)`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid rgba(212,175,55,0.45);
  background: linear-gradient(145deg, rgba(0,0,0,0.6), rgba(15,15,15,0.85));
  color: #e8c86a;
  display: grid;
  place-items: center;
  z-index: 1200;
  box-shadow: 0 8px 20px rgba(0,0,0,0.6), 0 0 16px rgba(212,175,55,0.2);
  -webkit-tap-highlight-color: transparent;
  @media (min-width: 1024px) {
    display: none;
  }
`;

// Scene routing component
function SceneRenderer({ currentScene }) {
  switch (currentScene) {
    case SCENES.DASHASHWAMEDH_GHAT:
      return <Scene1DashashwamedhGhat />;
    case SCENES.LABYRINTH_GHATS:
      return <Scene2LabyrinthGhats />;
    case SCENES.NYAYA_TRIAL:
      return <Scene3NyayaTrial />;
    case SCENES.VAISESIKA_TRIAL:
      return <Scene4VaisesikaTrial />;
    case SCENES.THE_WARDEN:
      return <Scene5TheWarden />;
    default:
      return <Scene1DashashwamedhGhat />;
  }
}

export default function GameplayScreen() {
  const { state, dispatch } = useGame();
  const [mobileJournalOpen, setMobileJournalOpen] = useState(false);
  const [activeSkill, setActiveSkill] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });
  const [hintText, setHintText] = useState('');

  const { currentScene, sceneData, playerProfile, inventory } = state;
  const [mobileMapOpen, setMobileMapOpen] = useState(false);

  const prevClues = React.useRef(inventory.clues.length);
  const prevObjectives = React.useRef(state.gameProgress.currentObjectives.length);
  useEffect(() => {
    if (inventory.clues.length > prevClues.current) {
      engine.playSfx('journal');
      prevClues.current = inventory.clues.length;
    }
  }, [inventory.clues.length]);
  useEffect(() => {
    if (state.gameProgress.currentObjectives.length > prevObjectives.current) {
      engine.playSfx('objective');
      prevObjectives.current = state.gameProgress.currentObjectives.length;
    }
  }, [state.gameProgress.currentObjectives.length]);

  // Show skill indicator when skill is triggered
  useEffect(() => {
    if (playerProfile.skills && playerProfile.skills.length > 0) {
      const timer = setTimeout(() => {
        setActiveSkill(playerProfile.skills[0]);
        setTimeout(() => setActiveSkill(null), 4000);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [currentScene, playerProfile.skills]);

  const [inkingId, setInkingId] = useState(null);
  const handleChoiceSelect = (choice) => {
    setInkingId(choice.id);
    setTimeout(() => setInkingId(null), 800);
  };

  const toggleMobileJournal = () => {
    setMobileJournalOpen(!mobileJournalOpen);
  };

  const showTooltip = (text, e) => {
    const pad = 16;
    const x = Math.max(pad, Math.min(window.innerWidth - pad, e.clientX));
    const y = Math.max(pad, Math.min(window.innerHeight - pad, e.clientY));
    setTooltip({ visible: true, text, x, y });
  };
  const hideTooltip = () => setTooltip(prev => ({ ...prev, visible: false }));

  const contentRef = useRef(null);
  const sceneOrder = [
    SCENES.DASHASHWAMEDH_GHAT,
    SCENES.LABYRINTH_GHATS,
    SCENES.NYAYA_TRIAL,
    SCENES.VAISESIKA_TRIAL,
    SCENES.THE_WARDEN
  ];
  const goToSceneIndex = (idx) => {
    const clamped = Math.max(0, Math.min(sceneOrder.length - 1, idx));
    dispatch({ type: ACTIONS.SET_CURRENT_SCENE, payload: sceneOrder[clamped] });
  };
  const i = sceneOrder.indexOf(currentScene);
  const canPrev = i > 0;
  const canNext = state.gameProgress.completedScenes.includes(currentScene) && i < sceneOrder.length - 1;
  const goNextScene = () => { if (canNext) goToSceneIndex(i + 1); };
  const goPrevScene = () => { if (canPrev) goToSceneIndex(i - 1); };

  const HINTS = {
    [SCENES.DASHASHWAMEDH_GHAT]: 'Observe the seven movements; the circled flames are 2, 5, and 7 in order.',
    [SCENES.LABYRINTH_GHATS]: 'Solemn landmarks guide you; after reading, the path leads onward.',
    [SCENES.NYAYA_TRIAL]: 'Nyāya’s five: Pratijñā → Hetu → Udāharaṇa → Upanaya → Nigamana. Smoke → Fire (kitchen).',
    [SCENES.VAISESIKA_TRIAL]: 'Nine dravyas: Earth, Water, Fire, Air, Ether, Time, Direction, Soul, Mind.',
    [SCENES.THE_WARDEN]: 'Heed warnings; prepare before advancing.'
  };
  const useHint = () => {
    const n = state.gameProgress.hintPoints || 0;
    if (n <= 0) return;
    const msg = HINTS[state.currentScene] || 'Trust the journal: your last clue points the way.';
    dispatch({ type: ACTIONS.ADD_HINT_POINTS, payload: -1 });
    setHintText(msg);
    engine.playSfx('objective');
  };

  return (
    <GameplayContainer>
      <MainContentArea>
        <HeaderBar>
          {state.gameProgress?.currentObjectives && state.gameProgress.currentObjectives[0] && (
            <ObjectivesBanner role="status" aria-live="polite" initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
              <ObjectiveText>{state.gameProgress.currentObjectives[0].text}</ObjectiveText>
              {hintText && (
                <HintBanner initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Hint: {hintText}</HintBanner>
              )}
            </ObjectivesBanner>
          )}
          <DecoHUD>
            <Gauge>
              <Fill $value={82} />
              <GaugeLabel>VITAL</GaugeLabel>
            </Gauge>
            <Gauge>
              <Fill $value={65} />
              <GaugeLabel>AETHER</GaugeLabel>
            </Gauge>
            <HintButton className="is-interactive" onClick={useHint} whileTap={{ scale: 0.96 }} aria-label={`Use hint. ${state.gameProgress.hintPoints || 0} remaining`} disabled={(state.gameProgress.hintPoints || 0) <= 0}>
              💡 Hint × {(state.gameProgress.hintPoints || 0)}
            </HintButton>
          </DecoHUD>
        </HeaderBar>
        <NarrativeWindow
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <NarrativeContent ref={contentRef}>
            <Suspense fallback={<LazyFallback>Summoning scene…</LazyFallback>}>
              <SceneRenderer currentScene={currentScene} />
            </Suspense>
            <SwipeNavigator containerRef={contentRef} onPrev={goPrevScene} onNext={goNextScene} />
          </NarrativeContent>
        </NarrativeWindow>

        {canPrev && (
          <EdgeNavButton
            className="is-interactive"
            style={{ left: 'var(--spacing-lg)' }}
            onTouchStart={goPrevScene}
            onClick={goPrevScene}
            whileTap={{ scale: 0.92 }}
            aria-label="Previous"
          >
            ◀
          </EdgeNavButton>
        )}
        {canNext && (
          <EdgeNavButton
            className="is-interactive"
            style={{ right: 'var(--spacing-lg)' }}
            onTouchStart={goNextScene}
            onClick={goNextScene}
            whileTap={{ scale: 0.92 }}
            aria-label="Next"
          >
            ▶
          </EdgeNavButton>
        )}

        <HotbarContainer>
          {Array.from({ length: 6 }, (_, i) => {
            const item = inventory.items[i];
            const label = item ? `Hotbar slot ${i + 1}: ${item.name}` : `Hotbar slot ${i + 1}: empty`;
            const onActivate = () => { /* reserved for future item use */ };
            return (
              <HotbarSlot
                key={i}
                $active={!!item}
                className={item ? 'is-interactive' : ''}
                role={item ? 'button' : undefined}
                tabIndex={item ? 0 : -1}
                aria-label={label}
                onKeyDown={(e) => { if (item && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onActivate(); } }}
                onMouseEnter={(e) => item && showTooltip(item.name, e)}
                onMouseLeave={hideTooltip}
              >
                {item ? item.icon : '∅'}
                <SlotIndex>{i + 1}</SlotIndex>
              </HotbarSlot>
            );
          })}
        </HotbarContainer>

        {sceneData.choices.length > 0 && (
          <ChoicesPanel
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ChoicesTitle>Choose Your Path</ChoicesTitle>
            <ChoicesContainer>
              <AnimatePresence>
                {sceneData.choices.map((choice, index) => (
                  <ChoiceButton
                    className="is-interactive"
                    key={choice.id}
                    onClick={() => handleChoiceSelect(choice)}
                    onMouseEnter={(e) => showTooltip('Select to proceed', e)}
                    onMouseLeave={hideTooltip}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {choice.text}
                  </ChoiceButton>
                ))}
              </AnimatePresence>
            </ChoicesContainer>
          </ChoicesPanel>
        )}
      </MainContentArea>


      {tooltip.visible && (
        <TooltipBubble $x={tooltip.x} $y={tooltip.y}>
          {tooltip.text}
        </TooltipBubble>
      )}

      <JournalSidebar>
        <Journal isVisible={!mobileJournalOpen} />
        <MiniMapPanel>
          <SceneProgressMap
            scenes={sceneOrder}
            current={currentScene}
            completed={state.gameProgress.completedScenes}
            onSelect={(s) => dispatch({ type: ACTIONS.SET_CURRENT_SCENE, payload: s })}
          />
        </MiniMapPanel>
      </JournalSidebar>

      <JournalToggle
        className="is-interactive"
        onClick={toggleMobileJournal}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        📖
      </JournalToggle>

      <MapToggle
        className="is-interactive"
        onClick={() => setMobileMapOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        🗺️
      </MapToggle>

      <AnimatePresence>
        {activeSkill && (
          <SkillIndicator
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <SkillText>
              ✨ {activeSkill.name} Awakened
            </SkillText>
          </SkillIndicator>
        )}
      </AnimatePresence>

      {/* Mobile overlay for journal */}
      <AnimatePresence>
        {mobileJournalOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobileJournal}
          >
            <OverlayContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Journal isVisible={true} />
            </OverlayContent>
          </Overlay>
        )}
      </AnimatePresence>

      {/* Mobile overlay for journey map */}
      <AnimatePresence>
        {mobileMapOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMapOpen(false)}
          >
            <OverlayContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <SceneProgressMap
                scenes={sceneOrder}
                current={currentScene}
                completed={state.gameProgress.completedScenes}
                onSelect={(s) => { dispatch({ type: ACTIONS.SET_CURRENT_SCENE, payload: s }); setMobileMapOpen(false); }}
              />
            </OverlayContent>
          </Overlay>
        )}
      </AnimatePresence>
    </GameplayContainer>
  );
}

// Export enhanced styled components for use in scenes
export {
  ObjectivesBanner,
  ObjectiveText,
  ChoiceButton
};
