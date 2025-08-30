import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

// Breathing glow effect for golden elements
const breathingGlow = keyframes`
  0%, 100% { 
    box-shadow: 
      0 0 20px rgba(212, 175, 55, 0.4),
      0 0 40px rgba(212, 175, 55, 0.2),
      inset 0 0 20px rgba(212, 175, 55, 0.1);
    border-color: rgba(212, 175, 55, 0.6);
  }
  50% { 
    box-shadow: 
      0 0 30px rgba(212, 175, 55, 0.7),
      0 0 60px rgba(212, 175, 55, 0.4),
      inset 0 0 30px rgba(212, 175, 55, 0.2);
    border-color: rgba(212, 175, 55, 0.9);
  }
`;

// Page flip animation with golden glow
const pageFlip = keyframes`
  0% { 
    transform: perspective(1000px) rotateY(0deg);
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
  }
  50% { 
    transform: perspective(1000px) rotateY(-15deg);
    box-shadow: 0 0 40px rgba(212, 175, 55, 0.6);
  }
  100% { 
    transform: perspective(1000px) rotateY(0deg);
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
  }
`;

// Golden energy flow effect
const energyFlow = keyframes`
  0% { 
    background-position: 0% 50%; 
  }
  50% { 
    background-position: 100% 50%; 
  }
  100% { 
    background-position: 200% 50%; 
  }
`;

// Tab activation glow
const tabGlow = keyframes`
  0%, 100% {
    background: linear-gradient(145deg, #d4af37, #ffd700);
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
  }
  50% {
    background: linear-gradient(145deg, #ffd700, #ffed4e);
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.7);
  }
`;

const JournalContainer = styled(motion.div)`
  background: 
    linear-gradient(145deg, rgba(10, 10, 10, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%);
  border: 3px solid #d4af37;
  border-radius: 12px;
  box-shadow: 
    0 15px 40px rgba(0, 0, 0, 0.8),
    0 0 40px rgba(212, 175, 55, 0.3),
    inset 0 1px 0 rgba(212, 175, 55, 0.2);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  animation: ${breathingGlow} 8s ease-in-out infinite;
  backdrop-filter: blur(10px);
  
  /* Ancient book binding decoration */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 10%;
    bottom: 10%;
    width: 10px;
    background: linear-gradient(to bottom, 
      #d4af37 0%, 
      #ffd700 25%, 
      #d4af37 50%, 
      #ffd700 75%, 
      #d4af37 100%
    );
    border-radius: 0 5px 5px 0;
    box-shadow: 
      inset 1px 0 2px rgba(0, 0, 0, 0.3),
      0 0 15px rgba(212, 175, 55, 0.6);
    z-index: 5;
  }
  
  /* Binding rivets with breathing glow */
  &::after {
    content: '';
    position: absolute;
    left: 3px;
    top: 20%;
    width: 4px;
    height: 4px;
    background: #ffd700;
    border-radius: 50%;
    box-shadow: 
      0 20% 0 #ffd700,
      0 40% 0 #ffd700,
      0 60% 0 #ffd700,
      0 0 10px rgba(255, 215, 0, 0.8);
    z-index: 6;
    animation: ${breathingGlow} 4s ease-in-out infinite;
  }
`;

const JournalHeader = styled.div`
  padding: var(--spacing-lg) var(--spacing-lg) 0;
  text-align: center;
  border-bottom: 2px solid #d4af37;
  margin-bottom: var(--spacing-md);
  position: relative;
  background: 
    linear-gradient(145deg, rgba(15, 15, 15, 0.9) 0%, rgba(5, 5, 5, 0.95) 100%);
  
  /* Decorative corner flourishes */
  &::before, &::after {
    content: '❦';
    position: absolute;
    top: var(--spacing-sm);
    font-size: 1rem;
    color: #d4af37;
    opacity: 0.7;
    animation: ${breathingGlow} 6s ease-in-out infinite;
  }
  
  &::before {
    left: var(--spacing-md);
    animation-delay: 0s;
  }
  
  &::after {
    right: var(--spacing-md);
    animation-delay: 3s;
  }
`;

const JournalTitle = styled.h2`
  font-family: var(--font-display);
  color: #d4af37;
  font-size: 1.8rem;
  margin-bottom: var(--spacing-md);
  text-shadow: 0 0 15px rgba(212, 175, 55, 0.6);
  
  &::before, &::after {
    content: '✦';
    color: #ffd700;
    font-size: 1rem;
    opacity: 0.8;
    margin: 0 var(--spacing-sm);
    animation: ${breathingGlow} 3s ease-in-out infinite;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: var(--spacing-md);
  background: 
    linear-gradient(145deg, rgba(0, 0, 0, 0.7) 0%, rgba(10, 10, 10, 0.9) 100%);
  border-radius: 8px;
  padding: var(--spacing-xs);
  margin: 0 var(--spacing-sm) var(--spacing-md);
  border: 1px solid rgba(212, 175, 55, 0.3);
`;

const Tab = styled(motion.button)`
  background: ${props => props.$active ? 
    'linear-gradient(145deg, #d4af37, #ffd700)' : 
    'transparent'};
  color: ${props => props.$active ? '#000' : '#d4af37'};
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 6px;
  font-family: var(--font-primary);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  ${props => props.$active && css`
    animation: ${tabGlow} 4s ease-in-out infinite;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  `}
  
  /* Golden energy sweep effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(212, 175, 55, 0.3), 
      transparent
    );
    transition: left 0.3s ease;
  }
  
  &:hover {
    background: ${props => props.$active ? 
      'linear-gradient(145deg, #ffd700, #ffed4e)' : 
      'rgba(212, 175, 55, 0.2)'};
    color: ${props => props.$active ? '#000' : '#ffd700'};
    text-shadow: ${props => props.$active ? 
      '1px 1px 2px rgba(0, 0, 0, 0.6)' : 
      '0 0 10px rgba(255, 215, 0, 0.6)'};
    
    &::before {
      left: 100%;
    }
  }
`;

const TabContent = styled(motion.div)`
  flex: 1;
  padding: 0 var(--spacing-lg) var(--spacing-lg);
  overflow-y: auto;
  position: relative;
  animation: ${pageFlip} 0.6s ease-in-out;
  
  /* Golden journal lines background */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: var(--spacing-xl);
    right: var(--spacing-lg);
    bottom: 0;
    background-image: repeating-linear-gradient(
      transparent,
      transparent 1.5rem,
      rgba(212, 175, 55, 0.15) 1.5rem,
      rgba(212, 175, 55, 0.15) calc(1.5rem + 1px)
    );
    pointer-events: none;
    z-index: 1;
    opacity: 0.6;
  }
  
  /* Golden scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.5);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #d4af37, #ffd700, #d4af37);
    border-radius: 3px;
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
`;

// Profile Tab Components
const ProfileSection = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-lg);
`;

const ProfileTitle = styled.h3`
  font-family: var(--font-display);
  color: #d4af37;
  font-size: 1.4rem;
  margin-bottom: var(--spacing-md);
  text-shadow: 0 0 15px rgba(212, 175, 55, 0.6);
`;

const TraitSummary = styled.div`
  background: 
    linear-gradient(145deg, rgba(212, 175, 55, 0.1) 0%, rgba(255, 107, 53, 0.05) 100%);
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 8px;
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  position: relative;
  backdrop-filter: blur(5px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      #d4af37 50%, 
      transparent 100%
    );
    animation: ${energyFlow} 4s linear infinite;
  }
`;

const TraitLabel = styled.p`
  font-family: var(--font-primary);
  color: #b8941f;
  font-weight: 600;
  margin: 0 0 var(--spacing-xs);
  font-size: 0.9rem;
  text-shadow: 0 0 5px rgba(184, 148, 31, 0.4);
`;

const TraitValue = styled.p`
  font-family: var(--font-display);
  color: #d4af37;
  margin: 0;
  font-size: 1.1rem;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
`;

// Objectives Tab Components
const ObjectivesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const ObjectiveItem = styled(motion.div)`
  background: 
    linear-gradient(145deg, rgba(0, 0, 0, 0.8) 0%, rgba(15, 15, 15, 0.9) 100%);
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 8px;
  padding: var(--spacing-md);
  position: relative;
  backdrop-filter: blur(5px);
  
  &::before {
    content: '📋';
    position: absolute;
    left: var(--spacing-sm);
    top: var(--spacing-sm);
    font-size: 1.1rem;
    filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.5));
  }
`;

const ObjectiveText = styled.p`
  font-family: var(--font-primary);
  color: #d4af37;
  margin: 0;
  margin-left: 30px;
  font-size: 0.95rem;
  line-height: 1.4;
  text-shadow: 0 0 8px rgba(212, 175, 55, 0.4);
`;

// Clues Tab Components
const CluesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const ClueItem = styled(motion.div)`
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
  padding-bottom: var(--spacing-md);
  position: relative;
  
  &:last-child {
    border-bottom: none;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 100%;
    background: linear-gradient(to bottom, 
      transparent, 
      #d4af37, 
      transparent
    );
    opacity: 0.5;
  }
`;

const ClueTitle = styled.h4`
  font-family: var(--font-display);
  color: #d4af37;
  font-size: 1.1rem;
  margin-bottom: var(--spacing-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
  margin-left: var(--spacing-sm);
  
  &::before {
    content: '🔍';
    font-size: 1rem;
    filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.6));
  }
`;

const ClueDescription = styled.p`
  font-family: var(--font-primary);
  color: #b8941f;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  font-style: italic;
  margin-left: var(--spacing-sm);
  text-shadow: 0 0 5px rgba(184, 148, 31, 0.3);
`;

const ClueSketch = styled.div`
  margin-top: var(--spacing-sm);
  margin-left: var(--spacing-sm);
  padding: var(--spacing-sm);
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 6px;
  background: 
    linear-gradient(145deg, rgba(212, 175, 55, 0.05) 0%, rgba(0, 0, 0, 0.8) 100%);
  text-align: center;
  font-size: 2rem;
  opacity: 0.8;
  filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.3));
`;

// Inventory Tab Components
const InventoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
`;

const InventorySlot = styled(motion.div)`
  aspect-ratio: 1;
  background: 
    linear-gradient(145deg, rgba(0, 0, 0, 0.8) 0%, rgba(15, 15, 15, 0.9) 100%);
  border: 2px solid ${props => props.$hasItem ? '#d4af37' : 'rgba(212, 175, 55, 0.3)'};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${props => props.$hasItem ? 'pointer' : 'default'};
  font-size: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  backdrop-filter: blur(5px);
  
  ${props => props.$hasItem && `
    animation: ${breathingGlow} 6s ease-in-out infinite;
    filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.4));
  `}
  
  &:hover {
    background: ${props => props.$hasItem ? 
      'linear-gradient(145deg, rgba(212, 175, 55, 0.2) 0%, rgba(255, 107, 53, 0.1) 100%)' : 
      'rgba(212, 175, 55, 0.1)'};
    transform: ${props => props.$hasItem ? 'scale(1.05)' : 'none'};
    border-color: ${props => props.$hasItem ? '#ffd700' : 'rgba(212, 175, 55, 0.5)'};
  }
`;

const ItemDetail = styled(motion.div)`
  background: 
    linear-gradient(145deg, rgba(5, 5, 5, 0.95) 0%, rgba(15, 15, 15, 0.9) 100%);
  border: 2px solid #d4af37;
  border-radius: 10px;
  padding: var(--spacing-lg);
  margin-top: var(--spacing-md);
  backdrop-filter: blur(10px);
  animation: ${breathingGlow} 4s ease-in-out infinite;
`;

const ItemName = styled.h4`
  font-family: var(--font-display);
  color: #d4af37;
  font-size: 1.2rem;
  margin-bottom: var(--spacing-sm);
  text-align: center;
  text-shadow: 0 0 15px rgba(212, 175, 55, 0.6);
`;

const ItemLore = styled.p`
  font-family: var(--font-primary);
  color: #b8941f;
  font-size: 0.9rem;
  line-height: 1.5;
  font-style: italic;
  margin: 0;
  text-shadow: 0 0 5px rgba(184, 148, 31, 0.3);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  opacity: 0.6;
`;

const EmptyText = styled.p`
  font-family: var(--font-primary);
  color: #d4af37;
  font-style: italic;
  margin: 0;
  text-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
`;

export default function Journal({ isVisible = true }) {
  const { state } = useGame();
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedItem, setSelectedItem] = useState(null);
  
  const { playerProfile, gameProgress, inventory } = state;

  const tabs = [
    { id: 'profile', label: 'Self', icon: '👤' },
    { id: 'objectives', label: 'Tasks', icon: '📋' },
    { id: 'clues', label: 'Clues', icon: '🔍' },
    { id: 'inventory', label: 'Items', icon: '🎒' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ContentWrapper>
            <ProfileSection>
              <ProfileTitle>Ātman Vivaraṇa</ProfileTitle>
              
              {playerProfile.primaryGuna && (
                <TraitSummary>
                  <TraitLabel>Primary Guṇa</TraitLabel>
                  <TraitValue>
                    {playerProfile.primaryGuna === 'SATTVA' ? 'Sattva (The Sage)' :
                     playerProfile.primaryGuna === 'RAJAS' ? 'Rajas (The Scion)' :
                     'Tamas (The Shadow)'}
                  </TraitValue>
                </TraitSummary>
              )}
              
              {playerProfile.primaryGana && (
                <TraitSummary>
                  <TraitLabel>Primary Gaṇa</TraitLabel>
                  <TraitValue>
                    {playerProfile.primaryGana === 'DEVA' ? 'Deva (The Divine)' :
                     playerProfile.primaryGana === 'MANUSHYA' ? 'Manushya (The Human)' :
                     'Rakshasa (The Fierce)'}
                  </TraitValue>
                </TraitSummary>
              )}
              
              {playerProfile.nakshatra && (
                <TraitSummary>
                  <TraitLabel>Janma Nakshatra</TraitLabel>
                  <TraitValue>{playerProfile.nakshatra.name}</TraitValue>
                </TraitSummary>
              )}
              
              {playerProfile.rashi && (
                <TraitSummary>
                  <TraitLabel>Rashi</TraitLabel>
                  <TraitValue>{playerProfile.rashi} ({playerProfile.nakshatra?.element})</TraitValue>
                </TraitSummary>
              )}
            </ProfileSection>
            
            {playerProfile.skills && playerProfile.skills.length > 0 && (
              <div>
                <ProfileTitle>Sacred Abilities</ProfileTitle>
                {playerProfile.skills.map((skill, index) => (
                  <TraitSummary key={index}>
                    <TraitLabel>{skill.name}</TraitLabel>
                    <ClueDescription>{skill.description}</ClueDescription>
                  </TraitSummary>
                ))}
              </div>
            )}
          </ContentWrapper>
        );
        
      case 'objectives':
        return (
          <ContentWrapper>
            <ObjectivesList>
              {gameProgress.currentObjectives.length > 0 ? (
                gameProgress.currentObjectives.map((objective, index) => (
                  <ObjectiveItem
                    key={objective.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <ObjectiveText>{objective.text}</ObjectiveText>
                  </ObjectiveItem>
                ))
              ) : (
                <EmptyState>
                  <EmptyText>Your sacred path awaits revelation...</EmptyText>
                </EmptyState>
              )}
            </ObjectivesList>
          </ContentWrapper>
        );
        
      case 'clues':
        return (
          <ContentWrapper>
            <CluesList>
              {inventory.clues.length > 0 ? (
                inventory.clues.map((clue, index) => (
                  <ClueItem
                    key={clue.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ClueTitle>{clue.title}</ClueTitle>
                    <ClueDescription>{clue.description}</ClueDescription>
                    {clue.sketch && (
                      <ClueSketch>{clue.sketch}</ClueSketch>
                    )}
                  </ClueItem>
                ))
              ) : (
                <EmptyState>
                  <EmptyText>The mysteries await your discovery...</EmptyText>
                </EmptyState>
              )}
            </CluesList>
          </ContentWrapper>
        );
        
      case 'inventory':
        return (
          <ContentWrapper>
            <InventoryGrid>
              {Array.from({ length: 12 }, (_, i) => {
                const item = inventory.items[i];
                return (
                  <InventorySlot
                    key={i}
                    $hasItem={!!item}
                    onClick={() => item && setSelectedItem(item)}
                    whileHover={{ scale: item ? 1.05 : 1 }}
                    whileTap={{ scale: item ? 0.95 : 1 }}
                  >
                    {item ? item.icon : '∅'}
                  </InventorySlot>
                );
              })}
            </InventoryGrid>
            
            <AnimatePresence>
              {selectedItem && (
                <ItemDetail
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <ItemName>{selectedItem.name}</ItemName>
                  <ItemLore>{selectedItem.lore}</ItemLore>
                </ItemDetail>
              )}
            </AnimatePresence>
            
            {inventory.items.length === 0 && (
              <EmptyState>
                <EmptyText>Sacred artifacts will manifest here...</EmptyText>
              </EmptyState>
            )}
          </ContentWrapper>
        );
        
      default:
        return null;
    }
  };

  if (!isVisible) return null;

  return (
    <JournalContainer
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <JournalHeader>
        <JournalTitle>Sacred Journal</JournalTitle>
        <TabsContainer>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedItem(null);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab.icon} {tab.label}
            </Tab>
          ))}
        </TabsContainer>
      </JournalHeader>
      
      <TabContent
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderTabContent()}
      </TabContent>
    </JournalContainer>
  );
}
