import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useGame, ACTIONS, GAME_STATES } from '../context/GameContext';

const Screen = styled.div`
  min-height: 100vh;
  width: 100%;
  display: grid;
  place-items: center;
  background: radial-gradient(ellipse at center, #070707 0%, #0a0a0a 55%, #000 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: -20%;
    background: radial-gradient(60% 60% at 35% 40%, rgba(212,175,55,0.10) 0%, rgba(0,0,0,0) 60%),
                radial-gradient(45% 45% at 70% 65%, rgba(255,215,0,0.08) 0%, rgba(0,0,0,0) 70%);
    filter: blur(28px);
    pointer-events: none;
  }
`;

const Shell = styled(motion.div)`
  width: min(96vw, 1100px);
  border: 1px solid rgba(212,175,55,0.28);
  background: linear-gradient(145deg, rgba(0,0,0,0.9), rgba(10,10,10,0.96));
  border-radius: 24px;
  box-shadow: 0 26px 80px rgba(0,0,0,0.75);
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr auto;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  border-bottom: 1px solid rgba(212,175,55,0.25);
`;

const TitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.h1`
  font-family: var(--font-display);
  color: #e6c76a;
  letter-spacing: 0.06em;
  margin: 0;
  font-size: clamp(1.8rem, 3.8vw, 2.6rem);
`;

const Subtitle = styled.p`
  margin: 0;
  font-family: var(--font-primary);
  color: #b8941f;
  opacity: 0.9;
  font-size: 1.05rem;
`;

const SutraBanner = styled.div`
  align-self: center;
  justify-self: end;
  max-width: min(48vw, 520px);
  border: 1px solid rgba(212,175,55,0.28);
  border-radius: 999px;
  padding: 10px 14px;
  background: linear-gradient(145deg, rgba(212,175,55,0.10), rgba(255,215,0,0.08));
  text-align: center;
`;

const SutraPrimary = styled.div`
  font-family: var(--font-devanagari);
  color: #e8c86a;
`;

const SutraSecondary = styled.div`
  font-family: var(--font-primary);
  color: #b8941f;
  font-style: italic;
  font-size: 0.95rem;
`;

const Body = styled.div`
  padding: var(--spacing-xl);
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--spacing-xl);

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled(motion.section)`
  border: 1px solid rgba(212,175,55,0.22);
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(0,0,0,0.88), rgba(12,12,12,0.96));
  padding: var(--spacing-xl);
`;

const SectionTitle = styled.h2`
  margin: 0 0 var(--spacing-md);
  font-family: var(--font-display);
  font-size: 1.4rem;
  color: #e6c76a;
  letter-spacing: 0.04em;
`;

const PillRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(212,175,55,0.35);
  background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95));
  color: #e8c86a;
  font-family: var(--font-primary);
  font-weight: 700;
  letter-spacing: 0.02em;
  font-size: 0.95rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  border: 1px solid rgba(212,175,55,0.22);
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(0,0,0,0.88), rgba(12,12,12,0.96));
  padding: var(--spacing-lg);
`;

const CardTitle = styled.h3`
  margin: 0 0 6px;
  font-family: var(--font-display);
  color: #e6c76a;
  font-size: 1.2rem;
`;

const CardSub = styled.p`
  margin: 0 0 var(--spacing-sm);
  font-family: var(--font-primary);
  color: #b8941f;
  opacity: 0.9;
`;

const CardText = styled.p`
  margin: 0;
  font-family: var(--font-primary);
  color: #d7be73;
  line-height: 1.6;
`;

const SutrasWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-sm);
`;

const SutraChip = styled.div`
  border: 1px solid rgba(212,175,55,0.28);
  border-radius: 12px;
  background: linear-gradient(145deg, rgba(20,20,20,0.88), rgba(14,14,14,0.96));
  padding: 10px 12px;
`;

const SutraSk = styled.div`
  font-family: var(--font-devanagari);
  color: #e8c86a;
  margin: 0 0 2px;
`;

const SutraEn = styled.div`
  font-family: var(--font-primary);
  color: #b8941f;
  font-size: 0.9rem;
  font-style: italic;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: var(--spacing-lg);
  border-top: 1px solid rgba(212,175,55,0.25);
  position: sticky;
  bottom: 0;
  background: linear-gradient(145deg, rgba(0,0,0,0.92), rgba(12,12,12,0.96));
  backdrop-filter: blur(6px);
  z-index: 5;
`;

const CTA = styled(motion.button)`
  appearance: none;
  padding: 14px 22px;
  border-radius: 12px;
  border: 1px solid rgba(212,175,55,0.35);
  background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95));
  color: #e8c86a;
  font-family: var(--font-primary);
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 0.25s ease, transform 0.18s ease, color 0.25s ease, border-color 0.25s ease;

  &:hover {
    color: #000;
    background: linear-gradient(145deg, #ffd95e, #ffc82e);
    border-color: #ffd95e;
    transform: translateY(-1px);
  }
`;

export default function ProfileResults() {
  const { state, dispatch } = useGame();
  const { playerProfile } = state;
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (!playerProfile?.primaryGuna || !playerProfile?.primaryGana) {
    return null;
  }

  const romanVakya = (playerProfile.atmanVakya || []).map(s => s.transliteration).join(' · ');

  const gunaName = playerProfile.primaryGuna === 'SATTVA' ? 'Sattva' : playerProfile.primaryGuna === 'RAJAS' ? 'Rajas' : 'Tamas';
  const gunaArchetype = playerProfile.primaryGuna === 'SATTVA' ? 'The Sage' : playerProfile.primaryGuna === 'RAJAS' ? 'The Scion' : 'The Shadow';
  const ganaName = playerProfile.primaryGana === 'DEVA' ? 'Deva' : playerProfile.primaryGana === 'MANUSHYA' ? 'Manushya' : 'Rakshasa';
  const ganaArchetype = playerProfile.primaryGana === 'DEVA' ? 'The Divine' : playerProfile.primaryGana === 'MANUSHYA' ? 'The Human' : 'The Fierce';

  const handleContinue = () => {
    dispatch({ type: ACTIONS.SET_GAME_STATE, payload: GAME_STATES.GAMEPLAY });
  };

  return (
    <Screen>
      <Shell initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Header>
          <TitleWrap>
            <Title>Ātman Spanda</Title>
            <Subtitle>Revelation of your inner vibration</Subtitle>
          </TitleWrap>
          {(playerProfile.atmanVakyaText || romanVakya) && (
            <SutraBanner>
              {playerProfile.atmanVakyaText && <SutraPrimary>{playerProfile.atmanVakyaText}</SutraPrimary>}
              {romanVakya && <SutraSecondary>{romanVakya}</SutraSecondary>}
            </SutraBanner>
          )}
        </Header>

        {show && (
          <Body>
            <Section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <SectionTitle>Your Essence</SectionTitle>
              <PillRow>
                <Pill title="Primary Guna">
                  <strong>{gunaName}</strong>
                  <span>• {gunaArchetype}</span>
                </Pill>
                <Pill title="Primary Gana">
                  <strong>{ganaName}</strong>
                  <span>• {ganaArchetype}</span>
                </Pill>
              </PillRow>

              <Grid style={{ marginTop: '16px' }}>
                <Card>
                  <CardTitle>Nakshatra</CardTitle>
                  <CardSub>{playerProfile.nakshatra?.name}</CardSub>
                  <CardText>{playerProfile.nakshatra?.description}</CardText>
                </Card>
                <Card>
                  <CardTitle>Rāśi & Element</CardTitle>
                  <CardSub>{playerProfile.rashi} • {playerProfile.nakshatra?.element}</CardSub>
                  <CardText>Your soul resonates with {playerProfile.nakshatra?.element.toLowerCase()} and the sign of {playerProfile.rashi}.</CardText>
                </Card>
              </Grid>
            </Section>

            <Section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}>
              <SectionTitle>Innate Gifts</SectionTitle>
              <Grid>
                <Card>
                  <CardTitle>{playerProfile.skills[0]?.name}</CardTitle>
                  <CardText>{playerProfile.skills[0]?.description}</CardText>
                </Card>
                <Card>
                  <CardTitle>{playerProfile.skills[1]?.name}</CardTitle>
                  <CardText>{playerProfile.skills[1]?.description}</CardText>
                </Card>
              </Grid>
            </Section>

            {(playerProfile.atmanVakya || []).length > 0 && (
              <Section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <SectionTitle>Tattva Sūtras Discovered</SectionTitle>
                <SutrasWrap>
                  {(playerProfile.atmanVakya || []).map((s, i) => (
                    <SutraChip key={i}>
                      <SutraSk>{s.seed}</SutraSk>
                      <SutraEn>{s.transliteration || s.annotation}</SutraEn>
                    </SutraChip>
                  ))}
                </SutrasWrap>
              </Section>
            )}
          </Body>
        )}

        <Footer>
          <CTA className="is-interactive" onClick={handleContinue} whileTap={{ scale: 0.98 }}>Begin Your Sacred Journey</CTA>
        </Footer>
      </Shell>
    </Screen>
  );
}
