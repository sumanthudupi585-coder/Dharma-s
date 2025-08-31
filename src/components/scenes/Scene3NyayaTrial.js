import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import GlossaryTerm from '../GlossaryTerm';
import { useGame } from '../../context/GameContext';
import ProgressiveNarrative from '../ProgressiveNarrative';
import useNyayaPuzzle from '../hooks/useNyayaPuzzle';

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
  position: relative;
  z-index: 2;
`;

const PuzzleWrap = styled.div`
  margin-top: var(--spacing-xl);
  border: 2px solid #d4af37;
  border-radius: 12px;
  background: linear-gradient(145deg, rgba(0,0,0,0.85), rgba(12,12,12,0.95));
  padding: var(--spacing-lg);
  box-shadow: 0 10px 26px rgba(0,0,0,0.7), 0 0 18px rgba(212,175,55,0.18);
`;

const CardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-md);
`;

const Card = styled.button`
  text-align: left;
  padding: var(--spacing-md);
  border-radius: 10px;
  border: 1px solid #d4af37;
  background: linear-gradient(145deg, rgba(0,0,0,0.8), rgba(15,15,15,0.9));
  color: #d4af37;
  min-height: 44px;
  touch-action: manipulation;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.2s ease;
  will-change: transform, opacity;
  outline-offset: 2px;
`;

const Slots = styled.div`
  margin-top: var(--spacing-lg);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-sm);
`;

const SlotRow = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr auto;
  gap: var(--spacing-sm);
  align-items: center;
`;

const SlotTitle = styled.div`
  color: #ffd700;
  font-family: var(--font-display);
`;

const SlotContent = styled.div`
  min-height: 48px;
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border: 1px dashed rgba(212,175,55,0.5);
  border-radius: 10px;
  color: #e8c86a;
  background: rgba(255,215,0,0.05);
`;

const PlaceBtn = styled.button`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #d4af37;
  background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95));
  color: #e8c86a;
  min-height: 44px;
  touch-action: manipulation;
`;

const Controls = styled.div`
  margin-top: var(--spacing-md);
  display: flex;
  gap: var(--spacing-sm);
`;

const Message = styled.div`
  margin-top: var(--spacing-sm);
  color: #b8941f;
  font-family: var(--font-primary);
`;

// Subtle chamber ambience: vignetting pulse
const chamberPulse = keyframes`
  0%, 100% { opacity: 0.18; }
  50% { opacity: 0.28; }
`;
const ChamberVignette = styled.div`
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(60% 60% at 50% 50%, rgba(212, 175, 55, 0.03), transparent 60%),
    radial-gradient(80% 80% at 50% 50%, rgba(0, 0, 0, 0.4), rgba(0,0,0,0.6));
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
  position: absolute; top: 15%; left: -30%; width: 160%; height: 70%; z-index: 0; pointer-events: none;
  background: linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.05) 50%, transparent 100%);
  filter: blur(12px);
  animation: ${sweepAnim} 22s linear infinite;
  @media (max-width: 768px) { display: none; }
`;

// Central iris-like mechanism with ultra-slow rotation
const irisRotate = keyframes`
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
`;
const IrisDoor = styled.div`
  position: absolute; top: 50%; left: 50%; width: 220px; height: 220px; z-index: 0; pointer-events: none;
  border-radius: 50%;
  background:
    radial-gradient(closest-side, rgba(212,175,55,0.06), rgba(0,0,0,0.6) 70%),
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
  box-shadow: inset 0 0 30px rgba(0,0,0,0.55), 0 0 40px rgba(212,175,55,0.06);
  transform: translate(-50%, -50%);
  animation: ${irisRotate} 180s linear infinite;
  @media (max-width: 768px) { display: none; }
`;

// Alcove glows at cardinal points
const shimmer = keyframes`
  0%, 100% { opacity: 0.12; filter: blur(6px); }
  50% { opacity: 0.26; filter: blur(8px); }
`;
const AlcoveGlow = styled.div`
  position: absolute; width: 110px; height: 110px; border-radius: 50%; pointer-events: none; z-index: 0;
  background: radial-gradient(closest-side, rgba(212,175,55,0.16), rgba(212,175,55,0.05), transparent 70%);
  animation: ${shimmer} 7s ease-in-out infinite;
  @media (max-width: 768px) { display: none; }
  ${({ $position }) => $position === 'north' && 'top: 8%; left: 50%; transform: translateX(-50%);'}
  ${({ $position }) => $position === 'east' && 'right: 8%; top: 50%; transform: translateY(-50%);'}
  ${({ $position }) => $position === 'south' && 'bottom: 8%; left: 50%; transform: translateX(-50%);'}
  ${({ $position }) => $position === 'west' && 'left: 8%; top: 50%; transform: translateY(-50%);'}
`;

export default function Scene3NyayaTrial() {
  useGame();
  const puzzle = useNyayaPuzzle();
  const [showPuzzle, setShowPuzzle] = useState(false);

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

      <NarrativeText initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
        <ProgressiveNarrative
          autoAdvance={false}
          delay={2400}
          onComplete={() => setShowPuzzle(true)}
          blocks={[
            (<div>Silent, circular chamber of obsidian. Reason over ritual.</div>),
            (<div>Four alcoves. A sealed iris door. The room demands clarity.</div>),
            (
              <div>
                Prove the Four Pramāṇas:
                <span>
                  <GlossaryTerm className="highlight-mystical is-interactive" term="Pratyakṣa" /> (Perception),
                  <GlossaryTerm className="highlight-mystical is-interactive" term="Anumāṇa" /> (Inference),
                  <GlossaryTerm className="highlight-mystical is-interactive" term="Upamāna" /> (Comparison),
                  <GlossaryTerm className="highlight-mystical is-interactive" term="Śabda" /> (Testimony).
                </span>
              </div>
            )
          ]}
        />
      </NarrativeText>

      {showPuzzle && (
      <PuzzleWrap role="region" aria-label="Nyāya syllogism puzzle">
        <CardsRow aria-label="Premise cards">
          {puzzle.cards.map((c) => (
            <Card
              key={c.id}
              className="is-interactive"
              aria-pressed={puzzle.selected === c.id}
              onClick={() => puzzle.pick(c.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); puzzle.pick(c.id); } }}
            >
              {c.text}
            </Card>
          ))}
        </CardsRow>

        <Slots>
          {puzzle.slots.map((s) => {
            const placedId = puzzle.placed[s.id];
            const placedCard = puzzle.cards.find(c => c.id === placedId);
            return (
              <SlotRow key={s.id}>
                <SlotTitle>{s.title}</SlotTitle>
                <SlotContent aria-live="polite">
                  {placedCard ? placedCard.text : 'Empty'}
                </SlotContent>
                <PlaceBtn
                  className="is-interactive"
                  aria-label={`Place selected card into ${s.title}`}
                  onClick={() => puzzle.placeOnSlot(s.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); puzzle.placeOnSlot(s.id); } }}
                >
                  Place
                </PlaceBtn>
              </SlotRow>
            );
          })}
        </Slots>

        <Controls>
          <PlaceBtn className="is-interactive" onClick={puzzle.submit} disabled={!puzzle.canSubmit} aria-disabled={!puzzle.canSubmit}>Submit</PlaceBtn>
          <PlaceBtn className="is-interactive" onClick={puzzle.reset}>Reset</PlaceBtn>
          <PlaceBtn className="is-interactive" onClick={() => {
            // allow unplacing from focused slot using button
            const firstFilled = Object.keys(puzzle.placed)[0];
            if (firstFilled) puzzle.unplaceFromSlot(firstFilled);
          }}>Unplace</PlaceBtn>
        </Controls>
        <Message role="status">{puzzle.message}</Message>
      </PuzzleWrap>
      )}
    </SceneContainer>
  );
}
