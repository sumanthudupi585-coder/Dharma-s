import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useGame } from '../context/GameContext';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2000;
  background:
    radial-gradient(120px 80px at 20% 20%, rgba(0,0,0,0.85), transparent 70%),
    radial-gradient(160px 120px at 70% 30%, rgba(0,0,0,0.75), transparent 70%),
    radial-gradient(180px 140px at 40% 70%, rgba(0,0,0,0.8), transparent 70%),
    radial-gradient(120px 100px at 80% 80%, rgba(0,0,0,0.7), transparent 70%),
    radial-gradient(220px 160px at 30% 50%, rgba(0,0,0,0.9), transparent 70%);
  mix-blend-mode: multiply;
`;

export default function InkDissolve() {
  const { state } = useGame();
  const [key, setKey] = React.useState(state.gameState);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    if (state.gameState !== key) {
      setKey(state.gameState);
      setActive(true);
      const id = setTimeout(() => setActive(false), 550);
      return () => clearTimeout(id);
    }
  }, [state.gameState, key]);

  return (
    <AnimatePresence>
      {active && (
        <Overlay
          initial={{ opacity: 0, filter: 'blur(0px)' }}
          animate={{ opacity: 1, filter: 'blur(2px)' }}
          exit={{ opacity: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
        />
      )}
    </AnimatePresence>
  );
}
