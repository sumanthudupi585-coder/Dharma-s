import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import GlossaryTerm from '../GlossaryTerm';

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
  color: var(--parchment);
  font-size: 1.1rem;
  line-height: 1.8;
`;

export default function Scene3NyayaTrial() {
  return (
    <SceneContainer>
      <SceneTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Scene 3: The First Sage's Trial - The Logic of Nyāya
      </SceneTitle>
      
      <NarrativeText
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <p>
          You descend into perfect, suffocating silence. The chamber below is a flawless 
          circle of polished black stone that seems to drink the light from your torch, giving 
          nothing back. The architecture is stark, logical, minimalist, almost alien in its 
          perfection. This is not a place of worship, but a place of pure, cold intellect, a 
          sanctuary for the mind stripped of all distraction and emotion.
        </p>
        
        <p>
          Four alcoves are spaced at perfect ninety-degree intervals. In the center of the chamber, 
          a massive, iris-like stone door, sealed tight, bars your progress. As you approach the first 
          alcove, you feel a faint resonance in your mind, a memory of <span className="highlight-character">Thorne's</span> teachings. 
          It seems this chamber is designed not just to be solved, but to be understood, a living lesson 
          in the architecture of truth.
        </p>
        
        <p>
          The <span className="highlight-mystical">Four Pramāṇas</span> await your understanding:
          <GlossaryTerm className="highlight-mystical is-interactive" term="Pratyakṣa" /> (Perception),
          <GlossaryTerm className="highlight-mystical is-interactive" term="Anumāṇa" /> (Inference),
          <GlossaryTerm className="highlight-mystical is-interactive" term="Upamāna" /> (Comparison), and
          <GlossaryTerm className="highlight-mystical is-interactive" term="Śabda" /> (Testimony). Each must be proven before the way forward opens.
        </p>
      </NarrativeText>
    </SceneContainer>
  );
}
