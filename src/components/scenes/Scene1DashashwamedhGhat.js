import React, { useState, useEffect } from 'react';
import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';
import { useGame, ACTIONS, SCENES } from '../../context/GameContext';

// Ritual movements animation
const ritualGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 30px rgba(212, 175, 55, 0.7);
    transform: scale(1.05);
  }
`;

const flameFlicker = keyframes`
  0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
  25% { opacity: 0.8; transform: scale(1.1) rotate(1deg); }
  50% { opacity: 0.9; transform: scale(0.95) rotate(-1deg); }
  75% { opacity: 1.1; transform: scale(1.05) rotate(0.5deg); }
`;

const SceneContainer = styled.div`
  height: 100%;
  padding: var(--spacing-lg);
  position: relative;
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
  
  .highlight-place { color: var(--deep-red); font-weight: 600; }
  .highlight-character { color: var(--muted-green); font-weight: 600; }
  .highlight-object { color: var(--copper); font-weight: 600; }
  .highlight-mystical { color: var(--gold); font-weight: 600; }
`;

const ObjectiveBox = styled(motion.div)`
  background: linear-gradient(145deg, rgba(212, 175, 55, 0.1), rgba(255, 107, 53, 0.1));
  border: 2px solid var(--gold);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
  text-align: center;
`;

const ObjectiveTitle = styled.h3`
  font-family: var(--font-display);
  color: var(--gold);
  margin-bottom: var(--spacing-sm);
  font-size: 1.3rem;
`;

const ObjectiveText = styled.p`
  font-family: var(--font-primary);
  color: var(--ink-black);
  margin: 0;
  font-weight: 600;
`;

const PuzzleSection = styled(motion.div)`
  background: linear-gradient(145deg, rgba(26, 26, 46, 0.05), rgba(22, 33, 62, 0.05));
  border: 2px solid var(--copper);
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
  margin-top: var(--spacing-xl);
`;

const PuzzleTitle = styled.h3`
  font-family: var(--font-display);
  color: var(--gold);
  text-align: center;
  margin-bottom: var(--spacing-lg);
  font-size: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const PuzzleIntro = styled.p`
  font-family: var(--font-primary);
  color: var(--ink-black);
  text-align: center;
  margin-bottom: var(--spacing-lg);
  font-style: italic;
`;

const RitualDisplay = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: rgba(212, 175, 55, 0.05);
  border-radius: var(--border-radius);
  border: 1px dashed var(--copper);
`;

const RitualMovement = styled(motion.div)`
  background: linear-gradient(145deg, var(--parchment), var(--dark-parchment));
  border: 2px solid ${props => props.$highlighted ? 'var(--gold)' : 'var(--copper)'};
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  text-align: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--gold);
    transform: translateY(-2px);
  }

  ${props => props.$highlighted && css`animation: ${ritualGlow} 2s infinite;`}
  ${props => props.$flicker && css`animation: ${flameFlicker} 2s infinite;`}
`;

const MovementNumber = styled.div`
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background: ${props => props.$highlighted ? 'var(--gold)' : 'var(--copper)'};
  color: var(--parchment);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  font-weight: bold;
`;

const MovementIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: var(--spacing-xs);
`;

const MovementLabel = styled.div`
  font-family: var(--font-primary);
  color: var(--ink-black);
  font-size: 0.8rem;
  font-weight: 600;
`;

const JournalClue = styled(motion.div)`
  background: linear-gradient(145deg, var(--parchment), var(--dark-parchment));
  border: 2px solid var(--copper);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
  position: relative;
  
  &::before {
    content: '📖';
    position: absolute;
    top: var(--spacing-sm);
    left: var(--spacing-sm);
    font-size: 1.2rem;
  }
`;

const ClueText = styled.p`
  font-family: var(--font-primary);
  color: var(--ink-black);
  margin: 0;
  margin-left: 30px;
  font-style: italic;
  line-height: 1.5;
`;

const OfferingBowl = styled(motion.div)`
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(22, 33, 62, 0.8), rgba(26, 26, 46, 0.9));
  border: 3px solid var(--gold);
  border-radius: 50%;
  margin: var(--spacing-xl) auto;
  position: relative;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  
  &:hover {
    box-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
  }
`;

const Water = styled.div`
  width: 80%;
  height: 80%;
  background: radial-gradient(circle, rgba(22, 33, 62, 0.6), rgba(15, 52, 96, 0.8));
  border-radius: 50%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Petal = styled(motion.div)`
  width: 20px;
  height: 10px;
  background: var(--sacred-orange);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  position: absolute;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.2);
  }
`;

const WaterRipple = styled(motion.div)`
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(212, 175, 55, 0.6);
  border-radius: 50%;
  pointer-events: none;
`;

const ChoiceSection = styled(motion.div)`
  margin-top: var(--spacing-xl);
  text-align: center;
`;

const ChoiceHeading = styled.h3`
  font-family: var(--font-display);
  color: var(--gold);
  margin-bottom: var(--spacing-lg);
  text-align: center;
`;

const ChoiceButton = styled(motion.button)`
  background: linear-gradient(145deg, rgba(244, 241, 222, 0.1), rgba(230, 220, 198, 0.1));
  border: 2px solid var(--copper);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg) var(--spacing-xl);
  color: var(--parchment);
  font-family: var(--font-primary);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin: var(--spacing-sm);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(145deg, rgba(244, 241, 222, 0.2), rgba(230, 220, 198, 0.2));
    border-color: var(--gold);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      border-color: var(--copper);
      box-shadow: none;
    }
  }
`;

const CenteredText = styled.p`
  text-align: center;
  margin-bottom: var(--spacing-lg);
  font-family: var(--font-primary);
  color: var(--ink-black);
  font-weight: 600;
`;

const NarrativePara = styled.p`
  font-family: var(--font-primary);
  color: var(--ink-black);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
`;

const EmphasisHeading = styled.p`
  font-family: var(--font-display);
  color: var(--gold);
  font-size: 1.2rem;
  margin-bottom: var(--spacing-lg);
  text-align: center;
`;

const HintText = styled.p`
  font-family: var(--font-primary);
  color: var(--copper);
  font-style: italic;
  font-size: 0.9rem;
  text-align: center;
`;

// Ritual movements data
const RITUAL_MOVEMENTS = [
  { id: 1, icon: '🔺', label: 'Raise Upwards', description: 'Towards the sky' },
  { id: 2, icon: '🔻', label: 'Lower Down', description: 'Towards the river' },
  { id: 3, icon: '🔄', label: 'Sweep Clockwise', description: 'Following the sun' },
  { id: 4, icon: '🔃', label: 'Sweep Counter', description: 'Against the sun' },
  { id: 5, icon: '➡️', label: 'Towards Crowd', description: 'Sharing the light' },
  { id: 6, icon: '⬅️', label: 'Pull Back', description: 'Drawing within' },
  { id: 7, icon: '⚪', label: 'Hold Center', description: 'Perfect balance' }
];

// The sequence from the journal: flames 2, 5, 7 are circled
const CORRECT_SEQUENCE = [2, 5, 7]; // Lower, Towards Crowd, Center

export default function Scene1DashashwamedhGhat() {
  const { dispatch } = useGame();
  const [gamePhase, setGamePhase] = useState('arrival'); // arrival, observation, puzzle, solution
  const [highlightedMovements, setHighlightedMovements] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [puzzleSolved, setPuzzleSolved] = useState(false);

  useEffect(() => {
    // Add initial objective
    dispatch({
      type: ACTIONS.ADD_OBJECTIVE,
      payload: { id: 'find_contact', text: 'Find Dr. Thorne\'s contact at Dashashwamedh Ghat' }
    });

    // Simulate priests performing ritual with highlighted movements
    const timer = setTimeout(() => {
      setHighlightedMovements(CORRECT_SEQUENCE);
      setShowPuzzle(true);
      
      dispatch({
        type: ACTIONS.ADD_CLUE,
        payload: {
          id: 'ritual_cipher',
          title: 'The Ritual Cipher',
          description: 'Seven priestly movements observed. Flames 2, 5, and 7 are circled in red ink in Thorne\'s journal.',
          sketch: '🕯️🕯️🔥🕯️🔥🕯️🔥'
        }
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleMovementClick = (movementId) => {
    if (puzzleSolved) return;
    
    const newSequence = [...playerSequence, movementId];
    setPlayerSequence(newSequence);
    
    // Check if sequence matches
    if (newSequence.length === CORRECT_SEQUENCE.length) {
      const isCorrect = newSequence.every((id, index) => id === CORRECT_SEQUENCE[index]);
      
      if (isCorrect) {
        setPuzzleSolved(true);
        dispatch({
          type: ACTIONS.COMPLETE_OBJECTIVE,
          payload: 'find_contact'
        });
        dispatch({
          type: ACTIONS.ADD_OBJECTIVE,
          payload: { id: 'trace_pattern', text: 'Trace the ritual pattern on the offering bowl' }
        });
        setGamePhase('solution');
      } else {
        // Reset sequence
        setTimeout(() => {
          setPlayerSequence([]);
        }, 1000);
      }
    }
  };

  const handleBowlInteraction = (event) => {
    if (!puzzleSolved) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const newRipple = {
      id: Date.now(),
      x: event.clientX - centerX,
      y: event.clientY - centerY
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 1000);
    
    // Progress after tracing the pattern
    if (playerSequence.length === 3) {
      setTimeout(() => {
        handleSceneComplete();
      }, 2000);
    }
  };

  const handleSceneComplete = () => {
    dispatch({
      type: ACTIONS.COMPLETE_OBJECTIVE,
      payload: 'trace_pattern'
    });
    
    dispatch({
      type: ACTIONS.ADD_ITEM,
      payload: {
        id: 'clay_pot',
        name: 'Sealed Clay Pot',
        icon: '🏺',
        lore: 'A mysterious clay pot given by the silent boatman. Its surface is cool and rough, and something shifts within.'
      }
    });
    
    dispatch({
      type: ACTIONS.COMPLETE_SCENE,
      payload: SCENES.DASHASHWAMEDH_GHAT
    });
    
    dispatch({
      type: ACTIONS.SET_CURRENT_SCENE,
      payload: SCENES.LABYRINTH_GHATS
    });
  };

  const handleChoiceFocus = (choice) => {
    setGamePhase('observation');
    
    switch (choice) {
      case 'ritual':
        dispatch({
          type: ACTIONS.ADD_CLUE,
          payload: {
            id: 'focus_ritual',
            title: 'Ritual Focus',
            description: 'Your analytical mind takes over. The spectacle resolves into data points and repeating variables. The dance is a pattern, a complex algorithm of faith.',
            sketch: '🔄📊🔄'
          }
        });
        break;
      case 'crowd':
        dispatch({
          type: ACTIONS.ADD_CLUE,
          payload: {
            id: 'focus_crowd',
            title: 'Crowd Wisdom',
            description: 'You overhear whispers about "men in grey suits" who have been asking questions near the temples. A dangerous, modern tension coiled beneath ancient faith.',
            sketch: '👥💭👥'
          }
        });
        break;
      case 'river':
        dispatch({
          type: ACTIONS.ADD_CLUE,
          payload: {
            id: 'focus_river',
            title: 'River\'s Wisdom',
            description: 'Thorne\'s voice echoes: "The river carries everything, forgives everything. Find that stillness in yourself." You feel profound peace.',
            sketch: '🌊🕉️🌊'
          }
        });
        break;
      default:
        break;
    }
  };

  return (
    <SceneContainer>
      <SceneTitle
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Scene 1: Dashashwamedh Ghat
      </SceneTitle>
      
      <NarrativeText
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <p>
          You materialize not with a sound, but with a gasp, as if you've just surfaced from a 
          deep, dark water. The air is thick, a heady, almost overwhelming cocktail of 
          <span className="highlight-object"> sandalwood incense</span>, crushed <span className="highlight-object">marigolds</span>, 
          <span className="highlight-object">ghee-fed flames</span>, and the damp, ancient scent of the 
          <span className="highlight-place">river</span>. A wall of sound crashes over you: a thousand voices murmuring 
          in a dozen languages, the percussive, insistent clang of <span className="highlight-object">temple bells</span>, 
          and the deep, resonant drone of <span className="highlight-mystical">Sanskrit chanting</span> that seems to 
          vibrate in your very bones, shaking loose the dust of your former reality.
        </p>
        
        <p>
          You stand on the worn stone steps of <span className="highlight-place">Dashashwamedh Ghat</span>. 
          It is dusk, the hour of smoke and fire. Before you, the <span className="highlight-place">Ganga river</span> 
          is a sheet of dark, rippling silk, shattered into a million pieces by the reflections of countless flames.
        </p>
        
        <p>
          <span className="highlight-character">Saffron-robed priests</span>, their movements honed by generations of ritual, 
          move in a mesmerizing, synchronized dance. They wield massive, tiered <span className="highlight-object">oil lamps</span>, 
          painting the twilight in broad, sweeping strokes of fire, their shadows stretching and 
          capering like ancient gods. The ghat is packed with an ocean of humanity, their 
          faces upturned, a tapestry of awe, faith, and quiet desperation, all bathed in the 
          sacred glow.
        </p>
        
        <p>
          Your senses are overwhelmed, a symphony on the verge of becoming a cacophony. Your purpose, 
          however, is a single, clear note in the chaos. <span className="highlight-character">Dr. Thorne</span> sent you here. 
          You need to find his contact. But first, you must find your own focus in this beautiful, 
          terrifying storm of existence.
        </p>
      </NarrativeText>

      <ObjectiveBox
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <ObjectiveTitle>🎯 Current Objective</ObjectiveTitle>
        <ObjectiveText>Find your contact by observing the ritual pattern</ObjectiveText>
      </ObjectiveBox>

      {gamePhase === 'arrival' && (
        <ChoiceSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <ChoiceHeading>How do you center yourself?</ChoiceHeading>
          
          <div>
            <ChoiceButton
              className="is-interactive"
              onClick={() => handleChoiceFocus('ritual')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🔥 Focus on the Ritual
            </ChoiceButton>
            
            <ChoiceButton
              className="is-interactive"
              onClick={() => handleChoiceFocus('crowd')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              👥 Focus on the Crowd
            </ChoiceButton>
            
            <ChoiceButton
              className="is-interactive"
              onClick={() => handleChoiceFocus('river')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🌊 Focus on the River
            </ChoiceButton>
          </div>
        </ChoiceSection>
      )}

      {gamePhase === 'observation' && (
        <JournalClue
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ClueText>
            You pull out Dr. Thorne's leather-bound journal. The page is bookmarked. It shows a 
            hurried but precise sketch of a priest holding a <span className="highlight-mystical">diya</span>, 
            a ceremonial lamp with <span className="highlight-mystical">seven flames</span>. 
            Beneath it, a note: "The ritual is the key." Flames numbered 
            <span className="highlight-mystical"> 2, 5, and 7</span> are circled in stark red ink.
          </ClueText>
        </JournalClue>
      )}

      {showPuzzle && (
        <PuzzleSection
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <PuzzleTitle>🔍 The Ritual Cipher</PuzzleTitle>
          
          <PuzzleIntro>
            Observe the seven movements of the priests and decode the sequence from the journal.
          </PuzzleIntro>
          
          <RitualDisplay>
            {RITUAL_MOVEMENTS.map((movement) => (
              <RitualMovement
                key={movement.id}
                $highlighted={highlightedMovements.includes(movement.id)}
                onClick={() => handleMovementClick(movement.id)}
                onMouseEnter={() => document.body.classList.add('cursor-examine')}
                onMouseLeave={() => document.body.classList.remove('cursor-examine')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                $flicker={highlightedMovements.includes(movement.id)}
              >
                <MovementNumber $highlighted={highlightedMovements.includes(movement.id)}>
                  {movement.id}
                </MovementNumber>
                <MovementIcon>{movement.icon}</MovementIcon>
                <MovementLabel>{movement.label}</MovementLabel>
              </RitualMovement>
            ))}
          </RitualDisplay>
          
          {playerSequence.length > 0 && (
            <CenteredText>
              Your sequence: {playerSequence.join(' → ')}
              {puzzleSolved && ' ✅ Correct!'}
            </CenteredText>
          )}
        </PuzzleSection>
      )}

      {puzzleSolved && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}
        >
          <NarrativePara>
            A shadow falls over you. A simple wooden boat has poled silently to the steps. 
            The boatman extends a weathered hand, offering you a small, sealed clay pot. 
            He gestures toward a small offering bowl at the water's edge.
          </NarrativePara>
          
          <EmphasisHeading>
            Trace the ritual pattern on the water's surface
          </EmphasisHeading>
          
          <OfferingBowl
            onClick={handleBowlInteraction}
            onMouseEnter={() => document.body.classList.add('cursor-examine')}
            onMouseLeave={() => document.body.classList.remove('cursor-examine')}
            whileHover={{ scale: 1.05 }}
          >
            <Water>
              <Petal
                style={{ top: '30%', left: '40%' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              />
              <Petal
                style={{ bottom: '30%', right: '35%' }}
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
              
              {ripples.map((ripple) => (
                <WaterRipple
                  key={ripple.id}
                  style={{ left: ripple.x, top: ripple.y }}
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 3, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                />
              ))}
            </Water>
          </OfferingBowl>
          
          <HintText>
            Click on the offering bowl to trace the pattern: Lower → Towards Crowd → Center
          </HintText>
        </motion.div>
      )}
    </SceneContainer>
  );
}
