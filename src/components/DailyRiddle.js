import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useGame, ACTIONS } from '../context/GameContext';
import { colors, spacing, radius, typography, timings } from '../ui/tokens';

const Wrap = styled(motion.div)`
  width: min(92vw, 520px);
  border: 1px solid rgba(212,175,55,0.3);
  border-radius: ${radius.lg};
  background: linear-gradient(145deg, rgba(0,0,0,0.85), rgba(12,12,12,0.95));
  padding: ${spacing.lg};
  color: #e8c86a;
  box-shadow: 0 18px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05);
  backdrop-filter: blur(8px);
`;

const Title = styled.h3`
  margin: 0 0 ${spacing.sm};
  font-family: var(--font-display);
  color: ${colors.gold};
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
`;

const Text = styled.p`
  margin: 0 0 ${spacing.md};
  font-family: var(--font-primary);
  color: ${colors.fadedGold};
  line-height: ${typography.lineHeight.relaxed};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${spacing.sm};
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  min-height: 44px;
  padding: ${spacing['3']} ${spacing['4']};
  border-radius: ${radius.md};
  border: 1px solid rgba(212,175,55,0.35);
  background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95));
  color: #e8c86a;
  font-size: ${typography.fontSize.base};
  transition: all ${timings.fast};

  &:focus {
    outline: none;
    border-color: ${colors.gold};
    box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
  }

  &::placeholder {
    color: ${colors.fadedGold};
    opacity: 0.6;
  }
`;

const Button = styled(motion.button)`
  appearance: none;
  padding: ${spacing['3']} ${spacing['4']};
  border-radius: ${radius.md};
  border: 1px solid rgba(212,175,55,0.35);
  background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95));
  color: #e8c86a;
  font-weight: ${typography.fontWeight.semibold};
  font-size: ${typography.fontSize.base};
  cursor: pointer;
  transition: all ${timings.fast};
  min-height: 44px;

  &:hover {
    color: #000;
    background: linear-gradient(145deg, ${colors.gold}, ${colors.fadedGold});
    border-color: ${colors.gold};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Hint = styled.p`
  margin: ${spacing.sm} 0 0;
  color: ${colors.gold};
  font-family: var(--font-primary);
  font-size: ${typography.fontSize.sm};
  line-height: ${typography.lineHeight.relaxed};
  opacity: 0.9;
`;

function normalize(s) {
  return (s || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

const RIDDLES = [
  { q: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?', a: ['echo'] },
  { q: 'What can run but never walks, has a mouth but never talks?', a: ['river'] },
  { q: 'I have cities, but no houses; mountains, but no trees; and water, but no fish. What am I?', a: ['map'] },
  { q: 'I am not alive, yet I grow; I have no lungs, yet I need air. What am I?', a: ['fire'] },
  { q: 'The more of me there is, the less you see. What am I?', a: ['darkness'] }
];

function todayKey() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${d.getUTCMonth()+1}-${d.getUTCDate()}`;
}

export default function DailyRiddle() {
  const { state, dispatch } = useGame();
  const [answer, setAnswer] = useState('');
  const key = todayKey();
  const solvedKey = `dc-daily-solved-${key}`;
  const already = typeof window !== 'undefined' ? localStorage.getItem(solvedKey) === '1' : false;
  const [solved, setSolved] = useState(already);

  const idx = useMemo(() => {
    const d = new Date();
    const day = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
    return day % RIDDLES.length;
  }, []);
  const riddle = RIDDLES[idx];

  const submit = () => {
    const ok = riddle.a.some((acc) => normalize(answer) === normalize(acc));
    if (ok) {
      if (!solved) {
        dispatch({ type: ACTIONS.ADD_HINT_POINTS, payload: 1 });
        try { localStorage.setItem(solvedKey, '1'); } catch (_) {}
        setSolved(true);
      }
    }
  };

  return (
    <Wrap initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Title>Daily Koan</Title>
      <Text>{riddle.q}</Text>
      <Row>
        <Input
          type="text"
          placeholder={solved ? 'Solved' : 'Your answer'}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={solved}
          aria-label="Daily riddle answer"
        />
        <Button whileTap={{ scale: 0.98 }} onClick={submit} disabled={solved} aria-disabled={solved}>Answer</Button>
      </Row>
      <Hint>{solved ? `+1 Hint awarded • Total: ${state.gameProgress.hintPoints}` : 'Reward: +1 Hint'}</Hint>
    </Wrap>
  );
}
