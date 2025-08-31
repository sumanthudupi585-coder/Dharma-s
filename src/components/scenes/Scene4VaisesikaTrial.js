import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import GlossaryTerm from '../GlossaryTerm';
import ProgressiveNarrative from '../ProgressiveNarrative';

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

export default function Scene4VaisesikaTrial() {
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
    </SceneContainer>
  );
}
