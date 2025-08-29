import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const SceneContainer = styled.div`
  height: 100%;
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
  color: var(--ink-black);
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
      
      <NarrativeText
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <p>
          You step from the sterile, man-made logic of <span className="highlight-mystical">Nyāya</span> into a vast, 
          breathing cavern that feels alive. The air is cool and damp, smelling of deep earth, wet stone, and 
          something else... potential. In the center stands a colossal, dormant machine of brass and stone, 
          like an orrery built by giants to map the cosmos.
        </p>
        
        <p>
          Nine empty pedestals circle the machine. This is a place of substance, of the fundamental, 
          tangible building blocks of reality. The <span className="highlight-mystical">Nine Dravyas</span> must be 
          gathered and placed: <span className="highlight-mystical">Pṛthvī</span> (Earth), 
          <span className="highlight-mystical">Ap</span> (Water), <span className="highlight-mystical">Tejas</span> (Fire), 
          <span className="highlight-mystical">Vāyu</span> (Air), <span className="highlight-mystical">Ākāśa</span> (Ether), 
          <span className="highlight-mystical">Kāla</span> (Time), <span className="highlight-mystical">Dik</span> (Direction), 
          <span className="highlight-mystical">Ātman</span> (Soul), and <span className="highlight-mystical">Manas</span> (Mind).
        </p>
        
        <p>
          Each substance must be found and understood before the great machine can awaken and reveal the next step 
          of your journey. The very atoms of reality await your discovery.
        </p>
      </NarrativeText>
    </SceneContainer>
  );
}
