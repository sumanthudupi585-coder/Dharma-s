import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { spacing } from '../ui/tokens';
import { ACTIONS, useGame } from '../context/GameContext';
import SettingsModal from './SettingsModal';

const Bar = styled.div`
  display: flex;
  gap: ${spacing['2']};
`;

const IconBtn = styled(motion.button)`
  height: 36px;
  min-width: 36px;
  padding: 0 ${spacing['2']};
  border-radius: 10px;
  border: 1px solid rgba(212, 175, 55, 0.35);
  background: linear-gradient(145deg, rgba(0, 0, 0, 0.82), rgba(18, 18, 18, 0.95));
  color: #e8c86a;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
`;

function IconJournal({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 5a3 3 0 0 1 3-3h11v20H8a3 3 0 0 0-3 3V5z"
        stroke="#d4af37"
        strokeWidth="1.4"
        fill="rgba(212,175,55,0.08)"
      />
      <path d="M8 4h9v12H8" stroke="#ffd700" strokeWidth="1" />
    </svg>
  );
}

function IconGlossary({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="#d4af37" strokeWidth="1.4" />
      <path d="M12 8v8M8 12h8" stroke="#ffd700" strokeWidth="1.2" />
    </svg>
  );
}

function IconSettings({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3" stroke="#ffd700" strokeWidth="1.2" />
      <path
        d="M4 12h3M17 12h3M12 4v3M12 17v3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2"
        stroke="#d4af37"
        strokeWidth="1"
      />
    </svg>
  );
}

export default function HeaderActions() {
  const { dispatch } = useGame();
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const openJournal = () => {
    dispatch({ type: ACTIONS.SET_JOURNAL_TAB, payload: 'profile' });
    dispatch({ type: ACTIONS.TOGGLE_JOURNAL });
  };
  const openGlossary = () => {
    dispatch({ type: ACTIONS.SET_JOURNAL_TAB, payload: 'glossary' });
    dispatch({ type: ACTIONS.TOGGLE_JOURNAL });
  };

  return (
    <>
      <Bar>
        <IconBtn
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          aria-label="Open Journal"
          onClick={openJournal}
        >
          <IconJournal />
          <span>Journal</span>
        </IconBtn>
        <IconBtn
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          aria-label="Open Glossary"
          onClick={openGlossary}
        >
          <IconGlossary />
          <span>Glossary</span>
        </IconBtn>
        <IconBtn
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          aria-label="Open Settings"
          onClick={() => setSettingsOpen(true)}
        >
          <IconSettings />
          <span>Settings</span>
        </IconBtn>
      </Bar>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
