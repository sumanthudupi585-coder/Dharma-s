import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import GlossaryTerm from '../GlossaryTerm';

const SceneContainer = styled.div`
  height: 100%;
  padding: var(--spacing-lg);
`;

const SceneTitle = styled(motion.h1)`
  font-family: var(--font-display);
  color: var(--gold);
  font-size: 2rem;
  margin-bottom: var(--spacing-lg);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  text-align: center;
  border-bottom: 2px solid var(--copper);
  padding-bottom: var(--spacing-md);
`;

const NarrativeText = styled(motion.div)`
  font-family: var(--font-primary);
  color: var(--parchment);
  font-size: 1.1rem;
  line-height: 1.8;
`;

// Subtle chamber ambience: vignetting pulse
const chamberPulse = keyframes`
  0%, 100% { opacity: 0.18; }
  50% { opacity: 0.28; }
`;
const ChamberVignette = styled.div`
  position: absolute; inset: 0; pointer-events: none; z-index: 1;
  background:
    radial-gradient(60% 60% at 50% 50%, rgba(212, 175, 55, 0.04), transparent 60%),
    radial-gradient(80% 80% at 50% 50%, rgba(0, 0, 0, 0.6), rgba(0,0,0,0.9));
  mix-blend-mode: soft-light;
  animation: ${chamberPulse} 16s ease-in-out infinite;
`;

// Slow light sweep across stone
const sweepAnim = keyframes`
  0% { transform: translateX(-60%) rotate(12deg); opacity: 0.04; }
  50% { opacity: 0.09; }
  100% { transform: translateX(60%) rotate(12deg); opacity: 0.04; }
`;
const LightSweep = styled.div`
  position: absolute; top: 15%; left: -30%; width: 160%; height: 70%; z-index: 1; pointer-events: none;
  background: linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.06) 50%, transparent 100%);
  filter: blur(12px);
  animation: ${sweepAnim} 22s linear infinite;
`;

// Central iris-like mechanism with ultra-slow rotation
const irisRotate = keyframes`
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
`;
const IrisDoor = styled.div`
  position: absolute; top: 50%; left: 50%; width: 220px; height: 220px; z-index: 1; pointer-events: none;
  border-radius: 50%;
  background:
    radial-gradient(closest-side, rgba(212,175,55,0.08), rgba(0,0,0,0.85) 70%),
    conic-gradient(from 0deg,
      rgba(212,175,55,0.1) 0deg 6deg,
      transparent 6deg 18deg,
      rgba(212,175,55,0.08) 18deg 24deg,
      transparent 24deg 36deg,
      rgba(212,175,55,0.06) 36deg 42deg,
      transparent 42deg 54deg,
      rgba(212,175,55,0.06) 54deg 60deg,
      transparent 60deg 72deg,
      rgba(212,175,55,0.06) 72deg 78deg,
      transparent 78deg 90deg,
      rgba(212,175,55,0.06) 90deg 96deg,
      transparent 96deg 108deg,
      rgba(212,175,55,0.06) 108deg 114deg,
      transparent 114deg 126deg,
      rgba(212,175,55,0.06) 126deg 132deg,
      transparent 132deg 144deg,
      rgba(212,175,55,0.06) 144deg 150deg,
      transparent 150deg 162deg,
      rgba(212,175,55,0.06) 162deg 168deg,
      transparent 168deg 180deg,
      rgba(212,175,55,0.06) 180deg 186deg,
      transparent 186deg 198deg,
      rgba(212,175,55,0.06) 198deg 204deg,
      transparent 204deg 216deg,
      rgba(212,175,55,0.06) 216deg 222deg,
      transparent 222deg 234deg,
      rgba(212,175,55,0.06) 234deg 240deg,
      transparent 240deg 252deg,
      rgba(212,175,55,0.06) 252deg 258deg,
      transparent 258deg 270deg,
      rgba(212,175,55,0.06) 270deg 276deg,
      transparent 276deg 288deg,
      rgba(212,175,55,0.06) 288deg 294deg,
      transparent 294deg 306deg,
      rgba(212,175,55,0.06) 306deg 312deg,
      transparent 312deg 324deg,
      rgba(212,175,55,0.06) 324deg 330deg,
      transparent 330deg 342deg,
      rgba(212,175,55,0.06) 342deg 348deg,
      transparent 348deg 360deg
    );
  box-shadow: inset 0 0 30px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.08);
  transform: translate(-50%, -50%);
  animation: ${irisRotate} 180s linear infinite;
`;

// Alcove glows at cardinal points
const shimmer = keyframes`
  0%, 100% { opacity: 0.12; filter: blur(6px); }
  50% { opacity: 0.26; filter: blur(8px); }
`;
const AlcoveGlow = styled.div`
  position: absolute; width: 110px; height: 110px; border-radius: 50%; pointer-events: none; z-index: 1;
  background: radial-gradient(closest-side, rgba(212,175,55,0.18), rgba(212,175,55,0.06), transparent 70%);
  animation: ${shimmer} 7s ease-in-out infinite;
  ${({ $position }) => $position === 'north' && 'top: 8%; left: 50%; transform: translateX(-50%);'}
  ${({ $position }) => $position === 'east' && 'right: 8%; top: 50%; transform: translateY(-50%);'}
  ${({ $position }) => $position === 'south' && 'bottom: 8%; left: 50%; transform: translateX(-50%);'}
  ${({ $position }) => $position === 'west' && 'left: 8%; top: 50%; transform: translateY(-50%);'}
`;

export default function Scene3NyayaTrial() {
  return (
    <SceneContainer>
      <ChamberVignette />
      <LightSweep />
      <IrisDoor />
      <AlcoveGlow $position="north" />
      <AlcoveGlow $position="east" />
      <AlcoveGlow $position="south" />
      <AlcoveGlow $position="west" />
      <SceneTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Scene 3: The First Sage's Trial - The Logic of Nyāya
      </SceneTitle>

      <NarrativeText
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <p>
          You descend into perfect, suffocating silence. The chamber below is a flawless 
          circle of polished black stone that seems to drink the light from your torch, giving 
          nothing back. The architecture is stark, logical, minimalist, almost alien in its 
          perfection. This is not a place of worship, but a place of pure, cold intellect, a 
          sanctuary for the mind stripped of all distraction and emotion.
        </p>
        
        <p>
          Four alcoves are spaced at perfect ninety-degree intervals. In the center of the chamber, 
          a massive, iris-like stone door, sealed tight, bars your progress. As you approach the first 
          alcove, you feel a faint resonance in your mind, a memory of <span className="highlight-character">Thorne's</span> teachings. 
          It seems this chamber is designed not just to be solved, but to be understood, a living lesson 
          in the architecture of truth.
        </p>
        
        <p>
          The <span className="highlight-mystical">Four Pramāṇas</span> await your understanding:
          <GlossaryTerm className="highlight-mystical is-interactive" term="Pratyakṣa" /> (Perception),
          <GlossaryTerm className="highlight-mystical is-interactive" term="Anumāṇa" /> (Inference),
          <GlossaryTerm className="highlight-mystical is-interactive" term="Upamāna" /> (Comparison), and
          <GlossaryTerm className="highlight-mystical is-interactive" term="Śabda" /> (Testimony). Each must be proven before the way forward opens.
        </p>
      </NarrativeText>
    </SceneContainer>
  );
}
