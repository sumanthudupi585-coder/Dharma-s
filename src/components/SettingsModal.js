import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
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
  font-family: var(--font-display);
  color: #e6c76a;
  margin: 0 0 8px;
  letter-spacing: 0.06em;
  font-size: var(--fs-xl);
`;

const Row = styled.div`
  display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center; padding: 10px 0; border-bottom: 1px dashed rgba(212,175,55,0.2);
`;

const Label = styled.label`
  font-family: var(--font-primary);
  color: #b8941f;
  font-size: var(--fs-sm);
`;

const Slider = styled.input`
  width: 200px;
  accent-color: #d4af37;
  cursor: pointer;
`;

const Toggle = styled.input`
  width: 20px;
  height: 20px;
  accent-color: #d4af37;
  cursor: pointer;
`;

const CloseBtn = styled(motion.button)`
  margin-top: 14px;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid rgba(212,175,55,0.35);
  background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95));
  color: #e8c86a;
  font-weight: 700;
`;

const DangerBtn = styled(motion.button)`
  margin-top: 14px;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid rgba(139,0,0,0.6);
  background: linear-gradient(145deg, rgba(20,0,0,0.82), rgba(40,0,0,0.95));
  color: #ffb3b3;
  font-weight: 700;
`;

const Value = styled.span`
  font-family: var(--font-primary);
  color: #d4af37;
  font-size: var(--fs-sm);
`;

export default function SettingsModal({ open, onClose }) {
  const { state, dispatch } = useGame();
  const sheetRef = useRef(null);

  const setBodyClass = (cls, on) => {
    const body = document.body;
    if (!body) return;
    if (on) body.classList.add(cls); else body.classList.remove(cls);
  };

  const onMaster = (e) => dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: { masterVolume: parseFloat(e.target.value) } });
  const onMusic = (e) => dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: { musicVolume: parseFloat(e.target.value) } });
  const onAmbient = (e) => dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: { ambientVolume: parseFloat(e.target.value) } });
  const onSfx = (e) => dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: { sfxVolume: parseFloat(e.target.value) } });
  const onLarge = (e) => { setBodyClass('large-text', e.target.checked); dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: { accessibility: { ...state.settings.accessibility, largeText: e.target.checked } } }); };
  const onReduced = (e) => { setBodyClass('force-reduced-motion', e.target.checked); dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: { accessibility: { ...state.settings.accessibility, reducedMotion: e.target.checked } } }); };
  const onHigh = (e) => { setBodyClass('high-contrast', e.target.checked); dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: { accessibility: { ...state.settings.accessibility, highContrast: e.target.checked } } }); };
  const onCursorTrail = (e) => dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: { effects: { ...(state.settings.effects || {}), cursorTrail: e.target.checked } } });

  // Focus trap and Escape handling
  useEffect(() => {
    if (!open || !sheetRef.current) return;
    const root = sheetRef.current;
    const focusables = root.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first && first.focus();

    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
      if (e.key === 'Tab' && focusables.length) {
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <Backdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <Sheet
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Title id="settings-title">Sacred Settings</Title>

            <Row>
              <Label htmlFor="master">Master Volume</Label>
              <div>
                <Slider id="master" type="range" min="0" max="1" step="0.01" value={state.settings.masterVolume ?? 0.9} onChange={onMaster} aria-valuemin={0} aria-valuemax={1} aria-valuenow={state.settings.masterVolume ?? 0.9} />
                <Value>{Math.round((state.settings.masterVolume ?? 0.9) * 100)}%</Value>
              </div>
            </Row>
            <Row>
              <Label htmlFor="music">Music Volume</Label>
              <div>
                <Slider id="music" type="range" min="0" max="1" step="0.01" value={state.settings.musicVolume} onChange={onMusic} aria-valuemin={0} aria-valuemax={1} aria-valuenow={state.settings.musicVolume} />
                <Value>{Math.round((state.settings.musicVolume ?? 0) * 100)}%</Value>
              </div>
            </Row>
            <Row>
              <Label htmlFor="ambient">Ambient Volume</Label>
              <div>
                <Slider id="ambient" type="range" min="0" max="1" step="0.01" value={state.settings.ambientVolume ?? 0.6} onChange={onAmbient} aria-valuemin={0} aria-valuemax={1} aria-valuenow={state.settings.ambientVolume ?? 0.6} />
                <Value>{Math.round((state.settings.ambientVolume ?? 0.6) * 100)}%</Value>
              </div>
            </Row>
            <Row>
              <Label htmlFor="sfx">UI SFX Volume</Label>
              <div>
                <Slider id="sfx" type="range" min="0" max="1" step="0.01" value={state.settings.sfxVolume} onChange={onSfx} aria-valuemin={0} aria-valuemax={1} aria-valuenow={state.settings.sfxVolume} />
                <Value>{Math.round((state.settings.sfxVolume ?? 0) * 100)}%</Value>
              </div>
            </Row>
            <Row>
              <Label htmlFor="largeText">Large Text</Label>
              <Toggle id="largeText" type="checkbox" checked={state.settings.accessibility.largeText} onChange={onLarge} />
            </Row>
            <Row>
              <Label htmlFor="reducedMotion">Reduced Motion</Label>
              <Toggle id="reducedMotion" type="checkbox" checked={state.settings.accessibility.reducedMotion} onChange={onReduced} />
            </Row>
            <Row>
              <Label htmlFor="cursorTrail">Cursor Trail</Label>
              <Toggle id="cursorTrail" type="checkbox" checked={state.settings.effects?.cursorTrail !== false} onChange={onCursorTrail} />
            </Row>
            <Row style={{ borderBottom: 'none' }}>
              <Label htmlFor="highContrast">High Contrast</Label>
              <Toggle id="highContrast" type="checkbox" checked={state.settings.accessibility.highContrast} onChange={onHigh} />
            </Row>

            <CloseBtn className="is-interactive" type="button" aria-label="Close Settings" whileTap={{ scale: 0.98 }} onClick={onClose}>Close</CloseBtn>
          </Sheet>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}
