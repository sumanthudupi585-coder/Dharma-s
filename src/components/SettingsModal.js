import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useGame, ACTIONS } from '../context/GameContext';
import { colors, spacing, radius, typography, timings, z } from '../ui/tokens';

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(8px);
  z-index: ${z.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing['4']};
`;

const Sheet = styled(motion.div)`
  width: min(90vw, 600px);
  max-height: 85vh;
  border-radius: ${radius.lg};
  border: 1px solid rgba(212,175,55,0.5);
  background: linear-gradient(145deg, rgba(0,0,0,0.95), rgba(10,10,10,1));
  color: #e8c86a;
  padding: ${spacing['8']};
  box-shadow:
    0 25px 60px rgba(0,0,0,0.8),
    0 0 30px rgba(212,175,55,0.2),
    inset 0 1px 0 rgba(255,255,255,0.1);
  backdrop-filter: blur(12px);
  overflow-y: auto;
`;

const Title = styled.h2`
  font-family: var(--font-display);
  color: ${colors.gold};
  margin: 0 0 ${spacing['6']};
  letter-spacing: 0.06em;
  font-size: ${typography.fontSize['2xl']};
  text-align: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -${spacing['2']};
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, ${colors.gold}, transparent);
  }
`;

const SectionTitle = styled.h3`
  font-family: var(--font-display);
  color: ${colors.fadedGold};
  font-size: ${typography.fontSize.lg};
  margin: ${spacing['6']} 0 ${spacing['4']} 0;
  padding-bottom: ${spacing['2']};
  border-bottom: 1px solid rgba(212,175,55,0.2);

  &:first-of-type {
    margin-top: 0;
  }
`;

const SettingsGrid = styled.div`
  display: grid;
  gap: ${spacing['6']};
`;

const SettingsSection = styled.div`
  display: grid;
  gap: ${spacing['4']};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${spacing['4']};
  align-items: center;
  padding: ${spacing['3']} 0;
  border-bottom: 1px dashed rgba(212,175,55,0.15);

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.label`
  font-family: var(--font-primary);
  color: ${colors.fadedGold};
  font-size: ${typography.fontSize.base};
  font-weight: ${typography.fontWeight.medium};
  line-height: ${typography.lineHeight.snug};
`;

const Slider = styled.input`
  width: 180px;
  accent-color: ${colors.gold};
  cursor: pointer;
  height: 6px;
  border-radius: 3px;
  background: rgba(212,175,55,0.2);

  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${colors.gold};
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    transition: transform ${timings.fast};
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }
`;

const Toggle = styled.input`
  width: 20px;
  height: 20px;
  accent-color: ${colors.gold};
  cursor: pointer;
  border-radius: 4px;
  transition: all ${timings.fast};

  &:hover {
    transform: scale(1.05);
  }

  &:checked {
    box-shadow: 0 0 8px rgba(212,175,55,0.5);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${spacing['3']};
  margin-top: ${spacing['6']};
  padding-top: ${spacing['4']};
  border-top: 1px solid rgba(212,175,55,0.2);
  justify-content: flex-end;
`;

const CloseBtn = styled(motion.button)`
  padding: ${spacing['3']} ${spacing['6']};
  border-radius: ${radius.md};
  border: 1px solid rgba(212,175,55,0.35);
  background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95));
  color: #e8c86a;
  font-weight: ${typography.fontWeight.semibold};
  font-size: ${typography.fontSize.base};
  cursor: pointer;
  transition: all ${timings.fast};

  &:hover {
    background: linear-gradient(145deg, ${colors.gold}, ${colors.fadedGold});
    color: #000;
    transform: translateY(-1px);
  }
`;

const DangerBtn = styled(motion.button)`
  padding: ${spacing['3']} ${spacing['6']};
  border-radius: ${radius.md};
  border: 1px solid ${colors.error};
  background: linear-gradient(145deg, rgba(239,68,68,0.1), rgba(220,38,38,0.15));
  color: ${colors.error};
  font-weight: ${typography.fontWeight.semibold};
  font-size: ${typography.fontSize.base};
  cursor: pointer;
  transition: all ${timings.fast};

  &:hover {
    background: linear-gradient(145deg, ${colors.error}, #dc2626);
    color: white;
    transform: translateY(-1px);
  }
`;

const Value = styled.span`
  font-family: var(--font-primary);
  color: ${colors.gold};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  min-width: 40px;
  text-align: right;
  margin-left: ${spacing['2']};
`;

const SelectField = styled.select`
  padding: ${spacing['2']} ${spacing['3']};
  border-radius: ${radius.sm};
  border: 1px solid rgba(212,175,55,0.35);
  background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95));
  color: #e8c86a;
  font-size: ${typography.fontSize.base};
  cursor: pointer;
  min-width: 120px;

  &:focus {
    outline: none;
    border-color: ${colors.gold};
    box-shadow: 0 0 0 2px rgba(212,175,55,0.2);
  }
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing['4']};
  padding: ${spacing['3']};
  background: rgba(212,175,55,0.05);
  border-radius: ${radius.md};
  border: 1px solid rgba(212,175,55,0.15);
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing['2']};
  font-size: ${typography.fontSize.sm};
  color: ${colors.fadedGold};
`;

export default function SettingsModal({ open, onClose }) {
  const { state, dispatch } = useGame();
  const sheetRef = useRef(null);
  // const [activeTab, setActiveTab] = useState('audio'); // Reserved for future tab functionality

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
  const onSoundEnabled = (e) => dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: { soundEnabled: e.target.checked } });
  const onTextSpeed = (e) => dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: { textSpeed: e.target.value } });
  const onReset = () => {
    if (window.confirm('Reset progress and return to Title? Settings will be kept.')) {
      dispatch({ type: ACTIONS.RESET_GAME });
      onClose();
    }
  };

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

            <SettingsGrid>
              <SettingsSection>
                <SectionTitle>🔊 Audio Settings</SectionTitle>
                <Row>
                  <Label htmlFor="soundEnabled">Enable Sound</Label>
                  <Toggle id="soundEnabled" type="checkbox" checked={state.settings.soundEnabled} onChange={onSoundEnabled} />
                </Row>
                <Row>
                  <Label htmlFor="master">Master Volume</Label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Slider id="master" type="range" min="0" max="1" step="0.01" value={state.settings.masterVolume ?? 0.9} onChange={onMaster} />
                    <Value>{Math.round((state.settings.masterVolume ?? 0.9) * 100)}%</Value>
                  </div>
                </Row>
                <Row>
                  <Label htmlFor="music">Music Volume</Label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Slider id="music" type="range" min="0" max="1" step="0.01" value={state.settings.musicVolume} onChange={onMusic} />
                    <Value>{Math.round((state.settings.musicVolume ?? 0) * 100)}%</Value>
                  </div>
                </Row>
                <Row>
                  <Label htmlFor="ambient">Ambient Volume</Label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Slider id="ambient" type="range" min="0" max="1" step="0.01" value={state.settings.ambientVolume ?? 0.6} onChange={onAmbient} />
                    <Value>{Math.round((state.settings.ambientVolume ?? 0.6) * 100)}%</Value>
                  </div>
                </Row>
                <Row>
                  <Label htmlFor="sfx">UI SFX Volume</Label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Slider id="sfx" type="range" min="0" max="1" step="0.01" value={state.settings.sfxVolume} onChange={onSfx} />
                    <Value>{Math.round((state.settings.sfxVolume ?? 0) * 100)}%</Value>
                  </div>
                </Row>
              </SettingsSection>

              <SettingsSection>
                <SectionTitle>♿ Accessibility</SectionTitle>
                <Row>
                  <Label htmlFor="largeText">Large Text</Label>
                  <Toggle id="largeText" type="checkbox" checked={state.settings.accessibility.largeText} onChange={onLarge} />
                </Row>
                <Row>
                  <Label htmlFor="highContrast">High Contrast</Label>
                  <Toggle id="highContrast" type="checkbox" checked={state.settings.accessibility.highContrast} onChange={onHigh} />
                </Row>
                <Row>
                  <Label htmlFor="reducedMotion">Reduced Motion</Label>
                  <Toggle id="reducedMotion" type="checkbox" checked={state.settings.accessibility.reducedMotion} onChange={onReduced} />
                </Row>
              </SettingsSection>

              <SettingsSection>
                <SectionTitle>🎮 Game Experience</SectionTitle>
                <Row>
                  <Label htmlFor="textSpeed">Text Speed</Label>
                  <SelectField id="textSpeed" value={state.settings.textSpeed} onChange={onTextSpeed}>
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                  </SelectField>
                </Row>
                <Row>
                  <Label htmlFor="cursorTrail">Cursor Trail</Label>
                  <Toggle id="cursorTrail" type="checkbox" checked={state.settings.effects?.cursorTrail !== false} onChange={onCursorTrail} />
                </Row>
              </SettingsSection>

              <SettingsSection>
                <SectionTitle>📊 Progress</SectionTitle>
                <StatsRow>
                  <StatItem>
                    <span>💡</span>
                    <span>Hint Points: {state.gameProgress.hintPoints || 0}</span>
                  </StatItem>
                  <StatItem>
                    <span>✦</span>
                    <span>Achievements: {(state.gameProgress.achievements || []).length}</span>
                  </StatItem>
                </StatsRow>
              </SettingsSection>
            </SettingsGrid>

            <ButtonRow>
              <DangerBtn
                className="is-interactive"
                type="button"
                aria-label="Reset Progress"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onReset}
              >
                Reset Progress
              </DangerBtn>
              <CloseBtn
                className="is-interactive"
                type="button"
                aria-label="Close Settings"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
              >
                Close
              </CloseBtn>
            </ButtonRow>
          </Sheet>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}
