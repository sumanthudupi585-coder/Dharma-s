import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame, ACTIONS, GAME_STATES } from '../context/GameContext';
import { SURVEY_QUESTIONS, calculatePlayerProfile } from '../data/profileData';
import SanskritSmokeText from './SanskritSmokeText';

// Ambient auras
const drift = keyframes`
  0%   { transform: translate(-4%, -4%) scale(1); opacity: 0.35; }
  50%  { transform: translate(4%, 4%) scale(1.04); opacity: 0.55; }
  100% { transform: translate(-4%, -4%) scale(1); opacity: 0.35; }
`;

const breath = keyframes`
  0%,100% { box-shadow: 0 0 18px rgba(212,175,55,0.22); }
  50%     { box-shadow: 0 0 28px rgba(255,215,0,0.35); }
`;

const rotateSlow = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const ScreenRoot = styled.div`
  min-height: 100vh;
  height: 100vh;
  width: 100%;
  display: grid;
  place-items: center;
  background: radial-gradient(ellipse at center, #070707 0%, #0a0a0a 55%, #000 100%);
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: -20%;
    background: radial-gradient(60% 60% at 35% 40%, rgba(212,175,55,0.10) 0%, rgba(0,0,0,0) 60%),
                radial-gradient(45% 45% at 70% 65%, rgba(255,215,0,0.08) 0%, rgba(0,0,0,0) 70%);
    filter: blur(26px);
    animation: ${drift} 22s ease-in-out infinite;
    pointer-events: none;
  }
`;

const Chamber = styled(motion.div)`
  width: min(92vw, 1080px);
  height: 86vh;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);
  padding: var(--spacing-xl);
  border-radius: 28px;
  background: linear-gradient(145deg, rgba(0,0,0,0.88), rgba(12,12,12,0.96));
  border: 1px solid rgba(212,175,55,0.2);
  box-shadow: 0 26px 80px rgba(0,0,0,0.75);
  position: relative;
  overflow: hidden;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    height: auto;
    min-height: 86vh;
  }
`;

const SigilWall = styled.div`
  position: relative;
  border-radius: 22px;
  background: radial-gradient(ellipse at center, rgba(212,175,55,0.12), rgba(0,0,0,0.76) 70%);
  border: 1px solid rgba(212,175,55,0.25);
  display: grid;
  place-items: center;
  overflow: hidden;
  animation: ${breath} 6s ease-in-out infinite;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 30% 20%, rgba(212,175,55,0.06), transparent 60%),
      conic-gradient(from 0deg, rgba(212,175,55,0.08) 0 6deg, transparent 6deg 24deg);
    opacity: 0.3;
    pointer-events: none;
  }

  @media (max-width: 900px) {
    min-height: 32vh;
  }
`;

const Sigil = styled.div`
  position: relative;
  width: clamp(200px, 36vmin, 320px);
  height: clamp(200px, 36vmin, 320px);
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(212,175,55,0.14) 0%, transparent 62%);
  box-shadow: inset 0 0 40px rgba(212,175,55,0.18);

  &::before, &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    inset: 10%;
    border: 2px solid rgba(212,175,55,0.45);
  }
  &::after { inset: 26%; border: 1px dashed rgba(212,175,55,0.42); }
`;

const RuneRing = styled.div`
  position: absolute;
  width: 84%;
  height: 84%;
  border-radius: 50%;
  border: 1px solid rgba(212,175,55,0.35);
  mask: conic-gradient(from 0deg, transparent 0 12deg, white 12deg 20deg, transparent 20deg 60deg,
                      white 60deg 68deg, transparent 68deg 120deg, white 120deg 128deg,
                      transparent 128deg 180deg, white 180deg 188deg, transparent 188deg 360deg);
  animation: ${rotateSlow} 24s linear infinite;
`;

const Orbit = styled.div`
  position: absolute;
  width: 110%;
  height: 110%;
  border-radius: 50%;
  border: 1px dashed rgba(212,175,55,0.25);
  animation: ${rotateSlow} 32s linear infinite;
`;

const SigilCaption = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-primary);
  font-size: 0.85rem;
  color: #b8941f;
  opacity: 0.8;
`;

const Scroll = styled.div`
  position: relative;
  border-radius: 22px;
  background: linear-gradient(145deg, rgba(10,10,10,0.92), rgba(4,4,4,0.96));
  border: 1px solid rgba(212,175,55,0.18);
  padding: var(--spacing-xxl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(60% 120% at 0% 0%, rgba(212,175,55,0.06), transparent 60%);
    pointer-events: none;
  }
`;

const Prompt = styled.h2`
  font-family: var(--font-display);
  color: #e6c76a;
  font-size: clamp(1.6rem, 3.4vw, 2.2rem);
  letter-spacing: 0.06em;
  margin: 0;
`;

const Whisper = styled.p`
  font-family: var(--font-primary);
  color: #b8941f;
  opacity: 0.82;
  font-size: clamp(0.95rem, 2.5vw, 1.05rem);
  margin: 0;
`;

const InkBleed = keyframes`
  0% { opacity: 0; filter: blur(3px); transform: translateY(6px); }
  50% { opacity: 0.7; filter: blur(1.5px); }
  100% { opacity: 1; filter: blur(0); transform: translateY(0); }
`;

const Choices = styled.div`
  display: grid;
  gap: var(--spacing-md);
`;

const SeedLine = styled.div`
  margin-top: 6px;
  padding-left: 18px;
  border-left: 2px solid #d4af37;
  animation: ${InkBleed} 500ms ease-out;
`;

const SeedDeva = styled.div`
  font-family: var(--font-devanagari);
  color: #d4af37;
  letter-spacing: 0.02em;
  text-shadow: 0 0 10px rgba(212,175,55,0.5);
`;

const SeedRoman = styled.div`
  font-family: var(--font-primary);
  color: #b8941f;
  font-style: italic;
  font-size: 0.9rem;
`;

const SeedAnno = styled.div`
  font-family: var(--font-primary);
  color: #9f8120;
  opacity: 0.85;
  font-size: 0.85rem;
`;

const VakyaAccumulator = styled.div`
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px dashed rgba(212,175,55,0.35);
`;

const VakyaTitle = styled.h4`
  margin: 0 0 6px;
  font-family: var(--font-display);
  color: #d4af37;
  font-size: 1.1rem;
`;

const VakyaText = styled.p`
  margin: 0;
  font-family: var(--font-devanagari);
  color: #d4af37;
  opacity: 0.9;
`;

const FooterHint = styled.p`
  margin-top: auto;
  text-align: center;
  font-family: var(--font-primary);
  font-size: 0.9rem;
  color: #9f8120;
  opacity: 0.75;
`;

const Choice = styled(motion.button)`
  appearance: none;
  width: 100%;
  padding: 14px 26px;
  border-radius: 999px;
  border: 1px solid rgba(212,175,55,0.35);
  background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95));
  color: #e8c86a;
  font-family: var(--font-primary);
  font-weight: 700;
  font-size: 1.02rem;
  letter-spacing: 0.02em;
  text-align: left;
  cursor: pointer;
  transition: background 0.25s ease, transform 0.18s ease, color 0.25s ease, border-color 0.25s ease;
  backdrop-filter: blur(8px);

  &:hover {
    color: #000;
    background: linear-gradient(145deg, #ffd95e, #ffc82e);
    border-color: #ffd95e;
    transform: translateY(-2px);
  }
`;

const SmokeCurtain = styled(motion.div)`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  z-index: 3000;
  pointer-events: none;
`;

export default function ProfileCreation() {
  const { dispatch } = useGame();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [smokeText, setSmokeText] = useState('');
  const [romanText, setRomanText] = useState('');
  const [showSmoke, setShowSmoke] = useState(false);
  const [pendingAnswer, setPendingAnswer] = useState(null);

  const question = SURVEY_QUESTIONS[currentQuestion];

  const proceed = (newAnswer) => {
    const next = currentQuestion + 1;
    if (next < SURVEY_QUESTIONS.length) {
      setCurrentQuestion(next);
    } else {
      const profile = calculatePlayerProfile([...answers, newAnswer]);
      dispatch({ type: ACTIONS.SET_PLAYER_PROFILE, payload: profile });
      dispatch({ type: ACTIONS.SET_GAME_STATE, payload: GAME_STATES.PROFILE_RESULTS });
    }
  };

  const handleAnswer = (choice) => {
    if (isTransitioning) return;
    const newAnswer = { questionId: question.id, choiceId: choice.id, guna: choice.guna, gana: choice.gana, points: choice.points };
    if (choice.seed) {
      setSmokeText(choice.seed);
      setRomanText(choice.transliteration || choice.annotation || '');
      setShowSmoke(true);
    }
    setAnswers((prev) => [...prev, newAnswer]);
    setPendingAnswer(newAnswer);
    dispatch({ type: ACTIONS.SET_SURVEY_ANSWER, payload: newAnswer });
    setIsTransitioning(true);
  };

  return (
    <ScreenRoot>
      <Chamber initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Scroll>
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <Prompt>{question.title}</Prompt>
              {question.description && <Whisper>{question.description}</Whisper>}

              <Choices>
                {question.choices.map((choice) => (
                  <div key={choice.id}>
                    <Choice
                      className="is-interactive"
                      onClick={() => handleAnswer(choice)}
                      disabled={isTransitioning}
                      initial={{ x: 12, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {choice.text}
                    </Choice>
                  </div>
                ))}
              </Choices>
            </motion.div>
          </AnimatePresence>

          <FooterHint>The chamber is silent. Choose with stillness.</FooterHint>
        </Scroll>
      </Chamber>
      <AnimatePresence>
        {showSmoke && (
          <SmokeCurtain
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <SanskritSmokeText
              text={smokeText}
              secondaryText={romanText}
              durationMs={3500}
              holdMs={3500}
              onComplete={() => {
                if (pendingAnswer) {
                  proceed(pendingAnswer);
                }
                setShowSmoke(false);
                setIsTransitioning(false);
              }}
            />
          </SmokeCurtain>
        )}
      </AnimatePresence>
    </ScreenRoot>
  );
}
