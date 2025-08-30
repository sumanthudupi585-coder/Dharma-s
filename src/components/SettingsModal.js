import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame, ACTIONS } from '../context/GameContext';

const Backdrop = styled(motion.div)`
  position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(6px); z-index: 3000;
`;

const Sheet = styled(motion.div)`
  position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: min(92vw, 560px); border-radius: 16px; border: 1px solid rgba(212,175,55,0.35);
  background: linear-gradient(145deg, rgba(0,0,0,0.92), rgba(10,10,10,0.98));
  color: #e8c86a; padding: 22px; z-index: 3001; box-shadow: 0 30px 70px rgba(0,0,0,0.6);
`;

const Title = styled.h2`
  font-family: var(--font-display); color: #e6c76a; margin: 0 0 8px; letter-spacing: 0.06em;
`;

const Row = styled.div`
  display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center; padding: 10px 0; border-bottom: 1px dashed rgba(212,175,55,0.2);
`;

const Label = styled.label`
  font-family: var(--font-primary); color: #b8941f;
`;

const Slider = styled.input`
  width: 200px; accent-color: #d4af37; cursor: pointer;
`;

const Toggle = styled.input`
  width: 20px; height: 20px; accent-color: #d4af37; cursor: pointer;
`;

const CloseBtn = styled(motion.button)`
  margin-top: 14px; padding: 10px 16px; border-radius: 10px; border: 1px solid rgba(212,175,55,0.35);
  background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95)); color: #e8c86a; font-weight: 700;
`;

export default function SettingsModal({ open, onClose }) {
  const { state, dispatch } = useGame();

  const setBodyClass = (cls, on) => {
    const body = document.body;
    if (!body) return;
    if (on) body.classList.add(cls); else body.classList.remove(cls);
  };

  const onMusic = (e) => dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: { musicVolume: parseFloat(e.target.value) } });
  const onSfx = (e) => dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: { sfxVolume: parseFloat(e.target.value) } });
  const onLarge = (e) => { setBodyClass('large-text', e.target.checked); dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: { accessibility: { ...state.settings.accessibility, largeText: e.target.checked } } }); };
  const onReduced = (e) => { setBodyClass('force-reduced-motion', e.target.checked); dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: { accessibility: { ...state.settings.accessibility, reducedMotion: e.target.checked } } }); };
  const onHigh = (e) => { setBodyClass('high-contrast', e.target.checked); dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: { accessibility: { ...state.settings.accessibility, highContrast: e.target.checked } } }); };

  return (
    <AnimatePresence>
      {open && (
        <Backdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <Sheet initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
            <Title>Sacred Settings</Title>

            <Row>
              <Label htmlFor="music">Music Volume</Label>
              <Slider id="music" type="range" min="0" max="1" step="0.01" value={state.settings.musicVolume} onChange={onMusic} />
            </Row>
            <Row>
              <Label htmlFor="sfx">SFX Volume</Label>
              <Slider id="sfx" type="range" min="0" max="1" step="0.01" value={state.settings.sfxVolume} onChange={onSfx} />
            </Row>
            <Row>
              <Label htmlFor="largeText">Large Text</Label>
              <Toggle id="largeText" type="checkbox" checked={state.settings.accessibility.largeText} onChange={onLarge} />
            </Row>
            <Row>
              <Label htmlFor="reducedMotion">Reduced Motion</Label>
              <Toggle id="reducedMotion" type="checkbox" checked={state.settings.accessibility.reducedMotion} onChange={onReduced} />
            </Row>
            <Row style={{ borderBottom: 'none' }}>
              <Label htmlFor="highContrast">High Contrast</Label>
              <Toggle id="highContrast" type="checkbox" checked={state.settings.accessibility.highContrast} onChange={onHigh} />
            </Row>

            <CloseBtn className="is-interactive" whileTap={{ scale: 0.98 }} onClick={onClose}>Close</CloseBtn>
          </Sheet>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}
