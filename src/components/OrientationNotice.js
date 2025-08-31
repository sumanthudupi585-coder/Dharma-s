import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  position: fixed; inset: 0; display: none; z-index: 5000; place-items: center;
  background: rgba(0,0,0,0.9); color: #d4af37; padding: 24px; text-align: center;
  @media (orientation: landscape) and (max-width: 820px) {
    display: grid;
  }
`;

const Panel = styled.div`
  background: linear-gradient(145deg, rgba(0,0,0,0.92), rgba(10,10,10,0.98));
  border: 1px solid rgba(212,175,55,0.5);
  border-radius: 12px;
  padding: 18px 22px;
  max-width: 520px;
`;

const Title = styled.h3`
  font-family: var(--font-display);
  color: #ffd700;
  margin: 0 0 8px;
`;

const Body = styled.p`
  font-family: var(--font-primary);
  color: #e8c86a;
  margin: 0;
`;

export default function OrientationNotice() {
  return (
    <Wrap aria-live="polite" role="status">
      <Panel>
        <Title>Best viewed in portrait</Title>
        <Body>Rotate your device for the optimal experience.</Body>
      </Panel>
    </Wrap>
  );
}
