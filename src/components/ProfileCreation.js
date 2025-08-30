import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useGame, ACTIONS, GAME_STATES } from '../context/GameContext';
import { SURVEY_QUESTIONS, calculatePlayerProfile } from '../data/profileData';
import FloatingWordsPanel from './FloatingWordsPanel';

// Ambient animations kept aligned with the existing design language
const drift = keyframes`
  0%   { transform: translate(-4%, -4%) scale(1); opacity: 0.35; }
  50%  { transform: translate(4%, 4%) scale(1.04); opacity: 0.55; }
  100% { transform: translate(-4%, -4%) scale(1); opacity: 0.35; }
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

const SurveyShell = styled(motion.div)`
  width: min(92vw, 980px);
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(0,0,0,0.9), rgba(10,10,10,0.96));
  border: 1px solid rgba(212,175,55,0.28);
  box-shadow: 0 26px 80px rgba(0,0,0,0.75);
  position: relative;
  overflow: hidden;
  flex: 1 1 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
`;

const TitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h1`
  font-family: var(--font-display);
  color: #e6c76a;
  font-size: clamp(1.4rem, 3.6vw, 2rem);
  letter-spacing: 0.06em;
  margin: 0;
`;

const Subtitle = styled.p`
  font-family: var(--font-primary);
  color: #b8941f;
  opacity: 0.85;
  margin: 0;
  font-size: 0.95rem;
`;

const Progress = styled.div`
  width: 260px;
  height: 10px;
  background: linear-gradient(145deg, rgba(0,0,0,0.85), rgba(14,14,14,0.95));
  border: 1px solid rgba(212,175,55,0.35);
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${p => p.$value}%;
  background: linear-gradient(90deg, #d4af37, #ffd700, #d4af37);
  transition: width 300ms ease;
`;

const QuestionCard = styled(motion.div)`
  border: 1px solid rgba(212,175,55,0.22);
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(0,0,0,0.88), rgba(12,12,12,0.96));
  padding: var(--spacing-xl);
`;

const QTitle = styled.h2`
  font-family: var(--font-display);
  color: #e6c76a;
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  margin: 0 0 var(--spacing-sm);
`;

const QDesc = styled.p`
  font-family: var(--font-primary);
  color: #b8941f;
  opacity: 0.9;
  margin: 0 0 var(--spacing-lg);
`;

const Choices = styled.div`
  display: grid;
  gap: var(--spacing-sm);
`;

const Choice = styled(motion.button)`
  appearance: none;
  width: 100%;
  padding: 14px 22px;
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

const NavRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
`;

const NavButton = styled(motion.button)`
  appearance: none;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid rgba(212,175,55,0.35);
  background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95));
  color: #e8c86a;
  font-family: var(--font-primary);
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 0.25s ease, transform 0.18s ease, color 0.25s ease, border-color 0.25s ease;

  &:hover {
    color: #000;
    background: linear-gradient(145deg, #ffd95e, #ffc82e);
    border-color: #ffd95e;
    transform: translateY(-1px);
  }
`;

const FooterHint = styled.p`
  margin: 0;
  text-align: center;
  font-family: var(--font-primary);
  font-size: 0.9rem;
  color: #9f8120;
  opacity: 0.8;
`;

const ContentRow = styled.div`
  width: min(96vw, 1240px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
  position: relative;
  z-index: 1;

  @media (max-width: 1020px) {
    flex-direction: column;
    align-items: center;
  }
`;

export default function ProfileCreation() {
  const { dispatch } = useGame();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [inputLocked, setInputLocked] = useState(false);
  const [discovered, setDiscovered] = useState({});

  const total = SURVEY_QUESTIONS.length;
  const progress = useMemo(() => Math.round(((index) / total) * 100), [index, total]);

  const current = SURVEY_QUESTIONS[index];
  const listRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (inputLocked) return;
      const digit = parseInt(e.key, 10);
      if (!Number.isNaN(digit) && digit >= 1 && digit <= current.choices.length) {
        handleSelect(current.choices[digit - 1]);
      }
      if (e.key === 'Backspace') {
        handleBack();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, inputLocked, index]);

  const handleSelect = (choice) => {
    if (inputLocked) return;
    setInputLocked(true);

    const newAnswer = { questionId: current.id, choiceId: choice.id, guna: choice.guna, gana: choice.gana, points: choice.points };
    setAnswers((prev) => [...prev, newAnswer]);

    if (choice.seed) {
      const id = `${current.id}-${choice.id}`;
      setDiscovered((prev) => ({ ...prev, [id]: true }));
    }
    proceed();
  };

  const proceed = () => {
    setTimeout(() => {
      const next = index + 1;
      if (next < total) {
        setIndex(next);
        setInputLocked(false);
        if (listRef.current) listRef.current.scrollTop = 0;
      } else {
        finalize();
      }
    }, 150);
  };

  const handleBack = () => {
    if (index === 0 || inputLocked) return;
    setAnswers((prev) => prev.slice(0, -1));
    setIndex((i) => Math.max(0, i - 1));
  };

  const finalize = () => {
    const profile = calculatePlayerProfile(answers);
    dispatch({ type: ACTIONS.SET_PLAYER_PROFILE, payload: { ...profile, surveyAnswers: answers } });
    dispatch({ type: ACTIONS.SET_GAME_STATE, payload: GAME_STATES.PROFILE_RESULTS });
  };

  return (
    <ScreenRoot>
      <ContentRow>
        <SurveyShell
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          role="form"
          aria-labelledby="survey-title"
        >
          <Header>
            <TitleWrap>
              <Title id="survey-title">Ātman Resonance Survey</Title>
              <Subtitle>Question {index + 1} of {total}</Subtitle>
            </TitleWrap>
            <Progress aria-label={`Progress ${progress}%`}>
              <ProgressFill $value={progress} />
            </Progress>
          </Header>

          <QuestionCard
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            aria-live="polite"
          >
            <QTitle>{current.title}</QTitle>
            {current.description && <QDesc>{current.description}</QDesc>}

            <Choices ref={listRef}>
              {current.choices.map((choice, i) => (
                <Choice
                  key={choice.id}
                  className="is-interactive"
                  onClick={() => handleSelect(choice)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  aria-label={`Choice ${i + 1}: ${choice.text}`}
                  disabled={inputLocked}
                >
                  {i + 1}. {choice.text}
                </Choice>
              ))}
            </Choices>
          </QuestionCard>

          <NavRow>
            <NavButton className="is-interactive" onClick={handleBack} disabled={index === 0 || inputLocked} whileTap={{ scale: 0.98 }}>
              ← Back
            </NavButton>
            <FooterHint>Tip: Use 1–{current.choices.length} keys to pick instantly. Backspace to go back.</FooterHint>
          </NavRow>

          <FooterHint>The chamber is silent. Choose with stillness.</FooterHint>
        </SurveyShell>

        {/* Floating Words Panel (non-intrusive) */}
        <FloatingWordsPanel pool={useMemo(() => {
          // Only words discovered from answers
          const map = {};
          const list = [];
          answers.forEach(ans => {
            const q = SURVEY_QUESTIONS.find(qq => qq.id === ans.questionId);
            if (!q) return;
            const c = q.choices.find(cc => cc.id === ans.choiceId);
            if (!c || !c.seed) return;
            const id = `${q.id}-${c.id}`;
            if (!map[id]) {
              map[id] = true;
              list.push({ id, sk: c.seed, en: c.transliteration || c.annotation || '', tr: c.transliteration || '', ann: c.annotation || '' });
            }
          });
          return list;
        }, [answers])} discovered={discovered} />
      </ContentRow>
    </ScreenRoot>
  );
}
