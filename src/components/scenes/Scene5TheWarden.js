import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
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

const WardenText = styled.div`
  background: linear-gradient(145deg, rgba(26, 26, 46, 0.1), rgba(22, 33, 62, 0.1));
  border: 2px solid var(--deep-red);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
  font-style: italic;
  color: var(--deep-red);
  
  &::before {
    content: '👁️ Silas: ';
    font-weight: bold;
    font-style: normal;
  }
`;

export default function Scene5TheWarden() {
  return (
    <SceneContainer>
      <SceneTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Scene 5: The Warden
      </SceneTitle>
      
      <NarrativeText initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}>
        <ProgressiveNarrative
          blocks={[
            (
              <p>
                You take the <span className="highlight-mystical">Cipher</span>. It feels warm, vibrating with a strange,
                harmonic energy. As your fingers close around it, a figure detaches from the cavern's deepest
                shadows, moving with a silence that is unnatural. He is clad in modern, grey tactical gear, a
                jarring anachronism in this ancient place. It is <span className="highlight-character">Silas</span>,
                an <span className="highlight-character">Axiom Conglomerate</span> agent.
              </p>
            ),
            (
              <WardenText>
                "Remarkable. <span className="highlight-character">Thorne</span> chose his protégé well. He always did have an eye for
                potential. That artifact you hold... you think it's a key to enlightenment, don't you?
                He was a romantic. It's a key to a prison."
              </WardenText>
            ),
            (
              <p>
                He continues, his voice calm and chillingly reasonable. "This reality is a delicate, chaotic system,
                a beautiful equation balanced on a knife's edge. The <span className="highlight-mystical">Yantra</span> doesn't
                liberate it; it unravels it. It's a system restore that wipes the drive. <span className="highlight-character">Thorne's</span>
                sentimentality, his grief for his family, would doom us all to oblivion. We prefer order. We prefer existence."
              </p>
            ),
            (
              <p>
                He activates a device on his wrist. A deep, grinding rumble shakes the cavern. Rocks begin to fall
                from the ceiling, blocking the entrance you came through. For a single, terrifying nanosecond,
                the cavern walls flicker, resolving into lines of glowing green code before becoming stone again.
              </p>
            ),
            (
              <WardenText>
                "The path to enlightenment is paved with ruin. You will see! Tell me, when you finally achieve
                total liberation from the system, what do you think will be left of you?"
              </WardenText>
            )
          ]}
        />
      </NarrativeText>
    </SceneContainer>
  );
}
