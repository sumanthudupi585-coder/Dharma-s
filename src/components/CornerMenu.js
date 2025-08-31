import React, { lazy } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame, ACTIONS } from '../context/GameContext';
import SettingsModal from './SettingsModal';
const Journal = lazy(() => import('./Journal'));

const breathe = keyframes`
  0%,100% { box-shadow: 0 0 12px rgba(212,175,55,0.35), 0 0 24px rgba(212,175,55,0.2); }
  50% { box-shadow: 0 0 18px rgba(255,215,0,0.55), 0 0 36px rgba(255,215,0,0.35); }
`;

const Cluster = styled.div`
  position: fixed;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  z-index: 2500;
  display: grid;
  gap: 10px;
`;

const IconButton = styled(motion.button)`
  width: 48px; height: 48px; border-radius: 50%; border: 1px solid rgba(212,175,55,0.45);
  background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95));
  color: #e8c86a; cursor: pointer; display: grid; place-items: center;
  transition: all var(--transition-fast); backdrop-filter: blur(8px);
  animation: ${breathe} 6s ease-in-out infinite;
  &:hover { background: linear-gradient(145deg, #ffd95e, #ffc82e); color: #000; border-color: #ffd95e; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`;

const Tooltip = styled.div`
  position: absolute; right: 110%; top: 50%; transform: translateY(-50%);
  background: linear-gradient(145deg, rgba(0,0,0,0.92), rgba(15,15,15,0.98));
  color: #d4af37; border: 1px solid rgba(212,175,55,0.5); padding: 6px 8px; border-radius: 8px; font-size: var(--fs-xs);
  white-space: nowrap; pointer-events: none; opacity: 0; transition: opacity var(--transition-fast);
`;

const IconWrap = styled.div`
  position: relative;
  &:hover ${Tooltip} { opacity: 1; }
`;

const Overlay = styled(motion.div)`
  position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); z-index: 2600; display: grid; place-items: center; padding: var(--spacing-lg);
`;

const Panel = styled(motion.div)`
  width: min(92vw, 560px); height: 80vh; border-radius: 14px; border: 1px solid rgba(212,175,55,0.4);
  background: linear-gradient(145deg, rgba(0,0,0,0.92), rgba(10,10,10,0.98)); box-shadow: 0 30px 70px rgba(0,0,0,0.6);
`;

function DharmaWheel({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="#d4af37" strokeWidth="1.6"/>
      <circle cx="12" cy="12" r="2" fill="#d4af37"/>
      {[...Array(8)].map((_, i) => {
        const a = (i * Math.PI) / 4; const x = 12 + Math.cos(a) * 7; const y = 12 + Math.sin(a) * 7;
        return <line key={i} x1="12" y1="12" x2={x} y2={y} stroke="#d4af37" strokeWidth="1.2" />;
      })}
    </svg>
  );
}

function Lotus({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3c-2 2-3 4-3 6 0 2 1 3 3 3s3-1 3-3c0-2-1-4-3-6z" fill="#d4af37"/>
      <path d="M6 9c1.5 0 3 1 3 3s-1.5 3-3 3-3-1-3-3 1.5-3 3-3z" fill="#d4af37" opacity="0.8"/>
      <path d="M18 9c1.5 0 3 1 3 3s-1.5 3-3 3-3-1-3-3 1.5-3 3-3z" fill="#d4af37" opacity="0.8"/>
      <path d="M12 12c-4 0-6 2-6 4 2 2 4 3 6 3s4-1 6-3c0-2-2-4-6-4z" fill="#d4af37" opacity="0.6"/>
    </svg>
  );
}

function Book({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 5a3 3 0 0 1 3-3h13v18H7a3 3 0 0 0-3 3V5z" stroke="#d4af37" strokeWidth="1.6" fill="rgba(212,175,55,0.1)"/>
      <path d="M7 4h10v12H7" stroke="#ffd700" strokeWidth="1"/>
    </svg>
  );
}

export default function CornerMenu() {
  const { state, dispatch } = useGame();
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const openJournal = () => dispatch({ type: ACTIONS.TOGGLE_JOURNAL });
  const openGlossary = () => { dispatch({ type: ACTIONS.SET_JOURNAL_TAB, payload: 'glossary' }); dispatch({ type: ACTIONS.TOGGLE_JOURNAL }); };

  return (
    <>
      <Cluster role="navigation" aria-label="Quick access">
        <IconWrap>
          <IconButton className="is-interactive" aria-label="Open Journal" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} onClick={openJournal}>
            <Lotus />
          </IconButton>
          <Tooltip>Journal</Tooltip>
        </IconWrap>
        <IconWrap>
          <IconButton className="is-interactive" aria-label="Open Glossary" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} onClick={openGlossary}>
            <Book />
          </IconButton>
          <Tooltip>Glossary</Tooltip>
        </IconWrap>
        <IconWrap>
          <IconButton className="is-interactive" aria-label="Open Settings" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} onClick={() => setSettingsOpen(true)}>
            <DharmaWheel />
          </IconButton>
          <Tooltip>Settings</Tooltip>
        </IconWrap>
      </Cluster>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <AnimatePresence>
        {state.uiState.journalOpen && (
          <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => dispatch({ type: ACTIONS.TOGGLE_JOURNAL })}>
            <Panel initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
              <Journal isVisible={true} />
            </Panel>
          </Overlay>
        )}
      </AnimatePresence>
    </>
  );
}
