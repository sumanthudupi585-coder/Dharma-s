import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import ProgressiveNarrative from '../ProgressiveNarrative';
import { useGame, ACTIONS, SCENES } from '../../context/GameContext';

const SceneContainer = styled.div`
  padding: var(--spacing-lg);
  position: relative;
`;

const fogDrift = keyframes`
  0% { transform: translateX(-10%) translateY(0); opacity: 0.12; }
  50% { opacity: 0.2; }
  100% { transform: translateX(10%) translateY(-6%); opacity: 0.12; }
`;
const FogLayer = styled.div`
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(60% 40% at 20% 80%, rgba(255,215,0,0.04), transparent 60%),
    radial-gradient(50% 35% at 70% 20%, rgba(255,165,0,0.03), transparent 60%),
    linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0));
  filter: blur(8px);
  animation: ${fogDrift} 24s linear infinite;
  will-change: transform, opacity;
`;

const flicker = keyframes`
  0%, 100% { opacity: 0.25; }
  40% { opacity: 0.35; }
  60% { opacity: 0.22; }
`;
const TorchGlow = styled.div`
  position: absolute; top: 10%; left: 8%; width: 180px; height: 180px; z-index: 0; pointer-events: none;
  background: radial-gradient(closest-side, rgba(255, 140, 0, 0.25), rgba(255,140,0,0.08), transparent 70%);
  filter: blur(10px);
  animation: ${flicker} 2.6s ease-in-out infinite;
  will-change: opacity;
`;

const SceneTitle = styled(motion.h1)`
  position: relative;
  z-index: 2;
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
  position: relative;
  z-index: 2;
  font-family: var(--font-primary);
  color: var(--parchment);
  font-size: 1.1rem;
  line-height: 1.8;
`;

const PuzzleWrap = styled.div`
  margin-top: var(--spacing-xl);
  border: 2px solid #d4af37;
  border-radius: 12px;
  background: linear-gradient(145deg, rgba(0,0,0,0.85), rgba(12,12,12,0.95));
  padding: var(--spacing-lg);
  box-shadow: 0 10px 26px rgba(0,0,0,0.7), 0 0 18px rgba(212,175,55,0.18);
`;
const Q = styled.p`
  color: #e8c86a; text-align: center; margin: 0 0 var(--spacing-md);
`;
const Options = styled.div`
  display: grid; gap: var(--spacing-sm);
`;
const OptionBtn = styled.button`
  text-align: left; padding: 10px 12px; border-radius: 10px; border: 1px solid #d4af37; background: linear-gradient(145deg, rgba(0,0,0,0.8), rgba(15,15,15,0.9)); color: #d4af37; cursor: pointer;
  &:hover { border-color: #ffd700; transform: translateY(-1px); }
`;
const ContinueBtn = styled.button`
  margin-top: var(--spacing-md); padding: 10px 14px; border-radius: 10px; border: 1px solid #d4af37; background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95)); color: #e8c86a; cursor: pointer;
`;

export default function Scene2LabyrinthGhats() {
  const { dispatch } = useGame();
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const handleAnswer = (id) => {
    setAnswered(true);
    const ok = id === 'conch_right_smoke';
    setCorrect(ok);
    if (ok) {
      dispatch({ type: ACTIONS.ADD_CLUE, payload: { id: 'maze_rule', title: 'Labyrinth Rule', description: 'Follow the conch-call, keep right at the smoke.', tags: ['labyrinth','rule'], scene: SCENES.LABYRINTH_GHATS } });
    }
  };
  const goNext = () => {
    dispatch({ type: ACTIONS.COMPLETE_SCENE, payload: SCENES.LABYRINTH_GHATS });
    dispatch({ type: ACTIONS.SET_CURRENT_SCENE, payload: SCENES.NYAYA_TRIAL });
  };
  return (
    <SceneContainer>
      <FogLayer />
      <TorchGlow />
      <SceneTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Scene 2: The Labyrinth of the Ghats
      </SceneTitle>
      
      <NarrativeText initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}>
        <ProgressiveNarrative
          blocks={[
            (
              <p>
                You leave the vibrant, communal chaos of the <span className="highlight-mystical">Aarti</span> behind.
                Turning your back on the river is a physical wrench, like stepping out of a warm room into a cold night.
                You step into the labyrinth. The alleys are narrow, suffocating veins of stone, lit by
                the sputtering, unreliable orange glow of torches that cast dancing, monstrous shadows.
              </p>
            ),
            (
              <p>
                The glorious sounds of the city become a muffled, distant echo, replaced by the intimate,
                unsettling noises of the maze: the scuttling of unseen things in the drains, the mournful
                lowing of a stray cow, and the faint, haunting cry of a <span className="highlight-object">conch shell</span>
                from a hidden temple. Buildings, centuries old, lean against each other as if for support,
                their upper floors almost touching, creating a canopy of stone that hides the sky.
              </p>
            ),
            (
              <p>
                The air grows heavier, thick with the unmistakable, cloying smell of woodsmoke. You are
                approaching <span className="highlight-place">Manikarnika Ghat</span>, the great cremation ground.
                The atmosphere is not frightening, but profoundly, intensely somber. You see a family at the edge
                of the ghat, offering prayers as a shrouded body is prepared for its final journey.
                This is a place of passage, and you feel like an intruder.
              </p>
            )
          ]}
        />
      </NarrativeText>

      <PuzzleWrap role="region" aria-label="Labyrinth riddle">
        <Q>Which path leads you onward through the ghats?</Q>
        <Options>
          <OptionBtn className="is-interactive" onClick={() => handleAnswer('toward_crowd')}>Head toward the loudest crowd; follow the noise.</OptionBtn>
          <OptionBtn className="is-interactive" onClick={() => handleAnswer('conch_right_smoke')}>Follow the conch-call; keep right when the smoke thickens.</OptionBtn>
          <OptionBtn className="is-interactive" onClick={() => handleAnswer('random_turns')}>Take random turns to confuse any tail.</OptionBtn>
        </Options>
        {answered && (
          <Q style={{ color: correct ? '#a7e28a' : '#b8941f' }}>{correct ? 'The alleys open; you feel the way is true.' : 'The way narrows; that was not it.'}</Q>
        )}
        {correct && <ContinueBtn className="is-interactive" onClick={goNext}>Continue</ContinueBtn>}
      </PuzzleWrap>
    </SceneContainer>
  );
}
