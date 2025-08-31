import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame, ACTIONS } from '../context/GameContext';

const Wrap = styled.div`
  position: fixed;
  left: var(--spacing-lg);
  bottom: var(--spacing-lg);
  z-index: 4000;
  display: grid;
  gap: var(--spacing-sm);
`;

const Toast = styled(motion.div)`
  min-width: 260px;
  max-width: 92vw;
  border: 1px solid rgba(212,175,55,0.45);
  border-radius: 12px;
  background: linear-gradient(145deg, rgba(0,0,0,0.92), rgba(10,10,10,0.98));
  color: #e8c86a;
  box-shadow: 0 20px 50px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.25);
  padding: var(--spacing-md) var(--spacing-lg);
`;

const Title = styled.div`
  font-family: var(--font-display);
  color: var(--gold);
  font-size: var(--fs-md);
`;

const Desc = styled.div`
  font-family: var(--font-primary);
  color: #b8941f;
  font-size: var(--fs-sm);
`;

export default function AchievementsToast() {
  const { state, dispatch } = useGame();
  const [show, setShow] = useState(null);

  useEffect(() => {
    if (!show && state.uiState.recentAchievements.length > 0) {
      setShow(state.uiState.recentAchievements[0]);
      const t = setTimeout(() => {
        setShow(null);
        dispatch({ type: ACTIONS.CONSUME_RECENT_ACHIEVEMENT });
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [state.uiState.recentAchievements, show, dispatch]);

  return (
    <Wrap>
      <AnimatePresence>
        {show && (
          <Toast
            key={show.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            role="status"
            aria-live="polite"
          >
            <Title>✦ Siddhi Unlocked: {show.title}</Title>
            {show.description && <Desc>{show.description}</Desc>}
          </Toast>
        )}
      </AnimatePresence>
    </Wrap>
  );
}
