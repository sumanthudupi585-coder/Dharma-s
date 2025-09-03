import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame, ACTIONS } from '../context/GameContext';
import { colors, spacing, radius, timings, typography, z } from '../ui/tokens';

// Achievement category icons
const achievementIcons = {
  wisdom: '🧠',
  courage: '🦁',
  compassion: '💝',
  discovery: '🔍',
  mastery: '⚡',
  enlightenment: '✨',
  knowledge: '📚',
  mystery: '🔮',
  progress: '🌟',
  default: '✦'
};

// Glow animation for the icon
const glow = keyframes`
  0%, 100% {
    filter: drop-shadow(0 0 4px rgba(212, 175, 55, 0.6));
    transform: scale(1);
  }
  50% {
    filter: drop-shadow(0 0 12px rgba(212, 175, 55, 0.9));
    transform: scale(1.05);
  }
`;

// Shimmer effect for the toast
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
`;

const Wrap = styled.div`
  position: fixed;
  left: ${spacing.lg};
  bottom: ${spacing.lg};
  z-index: ${z.toast};
  display: grid;
  gap: ${spacing.sm};
  pointer-events: none;

  @media (max-width: 768px) {
    left: ${spacing.md};
    right: ${spacing.md};
    bottom: ${spacing.md};
  }
`;

const Toast = styled(motion.div)`
  min-width: 280px;
  max-width: 400px;
  border: 1px solid rgba(212,175,55,0.6);
  border-radius: ${radius.lg};
  background: linear-gradient(145deg, rgba(0,0,0,0.95), rgba(10,10,10,1));
  color: #e8c86a;
  box-shadow:
    0 25px 60px rgba(0,0,0,0.7),
    0 0 30px rgba(212,175,55,0.3),
    inset 0 1px 0 rgba(255,255,255,0.1);
  padding: ${spacing.lg};
  backdrop-filter: blur(12px);
  pointer-events: auto;
  position: relative;
  overflow: hidden;

  /* Shimmer overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -200px;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(212, 175, 55, 0.1),
      transparent
    );
    animation: ${shimmer} 2s ease-in-out;
  }

  @media (max-width: 768px) {
    min-width: auto;
    max-width: none;
    width: 100%;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing['3']};
  margin-bottom: ${spacing['2']};
`;

const Icon = styled.div`
  font-size: ${typography.fontSize['2xl']};
  animation: ${glow} 2s ease-in-out infinite;
  flex-shrink: 0;
`;

const Title = styled.div`
  font-family: var(--font-display);
  color: ${colors.gold};
  font-size: ${typography.fontSize.lg};
  font-weight: ${typography.fontWeight.semibold};
  line-height: ${typography.lineHeight.snug};
`;

const Desc = styled.div`
  font-family: var(--font-primary);
  color: ${colors.fadedGold};
  font-size: ${typography.fontSize.sm};
  line-height: ${typography.lineHeight.relaxed};
  margin-top: ${spacing['1']};
  opacity: 0.9;
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, ${colors.gold}, ${colors.fadedGold});
  border-radius: 0 0 ${radius.lg} ${radius.lg};
  transform-origin: left;
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
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [state.uiState.recentAchievements, show, dispatch]);

  // Get appropriate icon for achievement category
  const getAchievementIcon = (achievement) => {
    const category = achievement.category?.toLowerCase() || 'default';
    return achievementIcons[category] || achievementIcons.default;
  };

  return (
    <Wrap>
      <AnimatePresence>
        {show && (
          <Toast
            key={show.id}
            initial={{
              opacity: 0,
              y: 50,
              scale: 0.8,
              filter: 'blur(4px)'
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)'
            }}
            exit={{
              opacity: 0,
              y: -20,
              scale: 0.9,
              filter: 'blur(2px)'
            }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
              filter: { duration: 0.3 }
            }}
            role="status"
            aria-live="polite"
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              setShow(null);
              dispatch({ type: ACTIONS.CONSUME_RECENT_ACHIEVEMENT });
            }}
            style={{ cursor: 'pointer' }}
          >
            <Header>
              <Icon role="img" aria-label="Achievement icon">
                {getAchievementIcon(show)}
              </Icon>
              <div>
                <Title>Siddhi Unlocked: {show.title}</Title>
                {show.description && <Desc>{show.description}</Desc>}
              </div>
            </Header>

            <ProgressBar
              as={motion.div}
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4, ease: 'linear' }}
            />
          </Toast>
        )}
      </AnimatePresence>
    </Wrap>
  );
}
