import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import GlossaryTerm from '../GlossaryTerm';
import ProgressiveNarrative from '../ProgressiveNarrative';
import { useGame, ACTIONS, SCENES } from '../../context/GameContext';

const SceneContainer = styled.div`
  padding: var(--spacing-lg);
`;

const SceneTitle = styled(motion.h1)`
  font-family: var(--font-display);
  color: var(--gold);
  font-size: 2rem;
  margin-bottom: var(--spacing-lg);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  text-align: center;
  border-bottom: 2px solid var(--copper);
  padding-bottom: var(--spacing-md);
`;

const NarrativeText = styled(motion.div)`
  font-family: var(--font-primary);
  color: var(--parchment);
  font-size: 1.1rem;
  line-height: 1.8;
`;

const PuzzleWrap = styled.div`
  margin-top: var(--spacing-xl);
  border: 2px solid #d4af37;
  border-radius: 12px;
  background: linear-gradient(145deg, rgba(0,0,0,0.85), rgba(12,12,12,0.95));
  padding: var(--spacing-lg);
  box-shadow: 0 10px 26px rgba(0,0,0,0.7), 0 0 18px rgba(212,175,55,0.18);
`;
const Grid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--spacing-sm);
`;
const Opt = styled.button`
  padding: 10px 12px; border-radius: 10px; border: 1px solid #d4af37; background: linear-gradient(145deg, rgba(0,0,0,0.8), rgba(15,15,15,0.9)); color: #d4af37; cursor: pointer;
  &[aria-pressed="true"] { border-color: #ffd700; box-shadow: 0 0 0 2px rgba(255,215,0,0.15) inset; }
`;
const Actions = styled.div`
  margin-top: var(--spacing-md); display: flex; gap: var(--spacing-sm); justify-content: flex-end;
`;
const Btn = styled.button`
  padding: 10px 14px; border-radius: 10px; border: 1px solid #d4af37; background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95)); color: #e8c86a; cursor: pointer;
`;

export default function Scene4VaisesikaTrial() {
  const { dispatch } = useGame();
  const [sel, setSel] = useState(new Set());
  const [msg, setMsg] = useState('');
  const correct = new Set(['earth','water','fire','air','ether','time','direction','soul','mind']);
  const options = [
    { id: 'earth', label: 'Pṛthvī (Earth)' },
    { id: 'water', label: 'Ap (Water)' },
    { id: 'fire', label: 'Tejas (Fire)' },
    { id: 'air', label: 'Vāyu (Air)' },
    { id: 'ether', label: 'Ākāśa (Ether)' },
    { id: 'time', label: 'Kāla (Time)' },
    { id: 'direction', label: 'Dik (Direction)' },
    { id: 'soul', label: 'Ātman (Soul)' },
    { id: 'mind', label: 'Manas (Mind)' },
    { id: 'word', label: 'Śabda (Word/Testimony)' },
    { id: 'dharma', label: 'Dharma (Virtue)' },
    { id: 'atom', label: 'Paramāṇu (Atom)' }
  ];
  const toggle = (id) => setSel(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const submit = () => {
    const chosen = Array.from(sel);
    const ok = chosen.length === correct.size && chosen.every(id => correct.has(id));
    setMsg(ok ? 'The machine hums to life.' : 'Something is missing or extra.');
    if (ok) {
      dispatch({ type: ACTIONS.COMPLETE_SCENE, payload: SCENES.VAISESIKA_TRIAL });
      setTimeout(() => dispatch({ type: ACTIONS.SET_CURRENT_SCENE, payload: SCENES.THE_WARDEN }), 800);
    }
  };

  return (
    <SceneContainer>
      <SceneTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Scene 4: The Second Sage's Trial - The Atoms of Vaiśeṣika
      </SceneTitle>
      
      <NarrativeText initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}>
        <ProgressiveNarrative
          blocks={[
            (
              <p>
                You step from the sterile, man-made logic of <GlossaryTerm className="highlight-mystical is-interactive" term="Nyāya" /> into a vast,
                breathing cavern that feels alive. The air is cool and damp, smelling of deep earth, wet stone, and
                something else... potential. In the center stands a colossal, dormant machine of brass and stone,
                like an orrery built by giants to map the cosmos.
              </p>
            ),
            (
              <p>
                Nine empty pedestals circle the machine. This is a place of substance, of the fundamental,
                tangible building blocks of reality. The <GlossaryTerm className="highlight-mystical is-interactive" term="Nine Dravyas" /> must be
                gathered and placed: <GlossaryTerm className="highlight-mystical is-interactive" term="Pṛthvī" /> (Earth),
                <GlossaryTerm className="highlight-mystical is-interactive" term="Ap" /> (Water), <GlossaryTerm className="highlight-mystical is-interactive" term="Tejas" /> (Fire),
                <GlossaryTerm className="highlight-mystical is-interactive" term="Vāyu" /> (Air), <GlossaryTerm className="highlight-mystical is-interactive" term="Ākāśa" /> (Ether),
                <GlossaryTerm className="highlight-mystical is-interactive" term="Kāla" /> (Time), <GlossaryTerm className="highlight-mystical is-interactive" term="Dik" /> (Direction),
                <GlossaryTerm className="highlight-mystical is-interactive" term="Ātman" /> (Soul), and <GlossaryTerm className="highlight-mystical is-interactive" term="Manas" /> (Mind).
              </p>
            ),
            (
              <p>
                Each substance must be found and understood before the great machine can awaken and reveal the next step
                of your journey. The very atoms of reality await your discovery.
              </p>
            )
          ]}
        />
      </NarrativeText>

      <PuzzleWrap role="region" aria-label="Nine Dravyas selection">
        <Grid>
          {options.map(o => (
            <Opt key={o.id} className="is-interactive" aria-pressed={sel.has(o.id)} onClick={() => toggle(o.id)}>{o.label}</Opt>
          ))}
        </Grid>
        <Actions>
          <Btn className="is-interactive" onClick={() => { setSel(new Set()); setMsg(''); }}>Reset</Btn>
          <Btn className="is-interactive" onClick={submit}>Submit</Btn>
        </Actions>
        {msg && <p style={{ color: msg.includes('hums') ? '#a7e28a' : '#b8941f', marginTop: '8px' }}>{msg}</p>}
      </PuzzleWrap>
    </SceneContainer>
  );
}
