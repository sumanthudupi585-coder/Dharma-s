import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.06); }
  100% { transform: rotate(360deg) scale(1); }
`;

const pulse = keyframes`
  0%,100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const Wrap = styled.div`
  min-height: 100vh; display: grid; place-items: center; background: radial-gradient(ellipse at center, var(--ink-black) 0%, var(--deep-blue) 55%, var(--royal-blue) 100%);
  color: #e6c76a; position: relative; overflow: hidden;
`;

const Sigil = styled.div`
  width: 120px; height: 120px; border-radius: 50%; border: 2px solid #d4af37; position: relative; animation: ${spin} 5s linear infinite;
  box-shadow: 0 0 30px rgba(212,175,55,0.25);
  will-change: transform, opacity, filter;
  &::before, &::after { content: ''; position: absolute; inset: 10px; border-radius: 50%; border: 1px dashed rgba(212,175,55,0.5); }
  &::after { inset: 22px; border-style: solid; border-width: 1px; border-color: rgba(212,175,55,0.4); }
`;

const Title = styled.h1`
  font-family: var(--font-display);
  letter-spacing: 0.12em;
  margin-top: 18px;
  text-align: center;
  font-size: var(--fs-xxl);
  background: linear-gradient(180deg, #fff4b0, #d4af37);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  will-change: opacity, transform, filter;
`;

const Tip = styled.p`
  font-family: var(--font-primary);
  color: #b8941f;
  opacity: 0.9;
  margin-top: 12px;
  text-align: center;
  font-size: var(--fs-sm);
  animation: ${pulse} 3s ease-in-out infinite;
`;

const tips = [
  'Gunas reveal tendencies; choices reveal truth.',
  'Listen to the river; it remembers.',
  'Symbols whisper when the mind is still.',
  'Your journal preserves fragments of fate.',
  'Aether flows where attention rests.'
];

const Center = styled.div`
  display: grid;
  place-items: center;
`;

function LoadingScreen() {
  const [tip, setTip] = useState(tips[0]);
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => { i = (i + 1) % tips.length; setTip(tips[i]); }, 2800);
    return () => clearInterval(id);
  }, []);
  return (
    <Wrap role="status" aria-live="polite" aria-label="Loading">
      <Center>
        <Sigil aria-hidden />
        <Title>Dharma's Cipher</Title>
        <Tip>{tip}</Tip>
      </Center>
    </Wrap>
  );
}
export default React.memo(LoadingScreen);
