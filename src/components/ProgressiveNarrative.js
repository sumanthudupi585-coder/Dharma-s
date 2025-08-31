import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

const Wrap = styled.div`
  width: 100%;
`;

const Block = styled(motion.div)`
  margin-bottom: var(--spacing-lg);
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
`;

const NextBtn = styled.button`
  min-height: 44px;
  touch-action: manipulation;
`;

const Progress = styled.div`
  flex: 1;
  height: 6px;
  background: rgba(212, 175, 55, 0.2);
  border-radius: 4px;
  overflow: hidden;
`;

const Bar = styled.div`
  height: 100%;
  width: ${p => p.$pct}%;
  background: linear-gradient(90deg, var(--copper), var(--gold));
`;

const variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

export default function ProgressiveNarrative({ blocks = [], autoAdvance = false, delay = 1200, onComplete }) {
  const { state } = useGame();
  const [idx, setIdx] = useState(0);
  const total = blocks.length;
  const pct = useMemo(() => (total ? ((idx + 1) / total) * 100 : 0), [idx, total]);
  const timerRef = useRef(null);

  const speed = state.settings?.textSpeed || 'normal';
  const speedFactor = speed === 'fast' ? 0.7 : speed === 'slow' ? 1.6 : 1;
  const effectiveDelay = Math.max(200, Math.round(delay * speedFactor));

  const goNext = useCallback(() => {
    setIdx(i => {
      const n = i + 1;
      return n >= total ? i : n;
    });
  }, [total]);

  useEffect(() => {
    if (!autoAdvance) return;
    if (idx >= total - 1) return;
    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = setTimeout(goNext, effectiveDelay);
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [idx, total, autoAdvance, effectiveDelay, goNext]);

  // Fire onComplete after the final block is shown (post-render), once
  const completedRef = useRef(false);
  useEffect(() => {
    if (!onComplete || completedRef.current) return;
    if (total > 0 && idx >= total - 1) {
      completedRef.current = true;
      onComplete();
    }
  }, [idx, total, onComplete]);

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goNext();
    }
  };

  return (
    <Wrap>
      <AnimatePresence mode="wait">
        <Block
          key={idx}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4 }}
          role="group"
          aria-roledescription="narrative block"
        >
          {blocks[idx]}
        </Block>
      </AnimatePresence>

      <Controls>
        <NextBtn
          className="btn-manuscript is-interactive"
          onClick={goNext}
          onKeyDown={handleKey}
          aria-label={idx >= total - 1 ? 'Done' : 'Next'}
        >
          {idx >= total - 1 ? 'Done' : 'Next'}
        </NextBtn>
        <Progress aria-label={`Progress ${Math.round(pct)} percent`}>
          <Bar $pct={pct} />
        </Progress>
      </Controls>
    </Wrap>
  );
}
