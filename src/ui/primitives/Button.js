import styled, { css } from 'styled-components';
import { colors, fonts, radius, spacing, timings } from '../tokens';

const base = css`
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 10px 16px;
  border-radius: ${radius.md};
  border: 1px solid rgba(212,175,55,0.35);
  background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95));
  color: #e8c86a;
  font-family: ${fonts.body};
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background ${timings.fast}, transform ${timings.fast}, color ${timings.fast}, border-color ${timings.fast}, box-shadow ${timings.fast};
  backdrop-filter: blur(8px);
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    color: #000;
    background: linear-gradient(145deg, ${colors.gold}, ${colors.fadedGold});
    border-color: ${colors.gold};
    transform: translateY(-1px);
  }
  &:disabled,
  &[aria-disabled='true'] {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const pill = css`
  border-radius: ${radius.pill};
  padding: 12px 22px;
`;

const ghost = css`
  background: rgba(244,241,222,0.08);
  color: ${colors.parchment};
  &:hover { color: #000; }
`;

const danger = css`
  border-color: ${colors.deepRed};
  color: ${colors.deepRed};
  &:hover {
    background: linear-gradient(145deg, #ffb3b3, #ff8080);
    border-color: ${colors.deepRed};
  }
`;

export const Button = styled.button`
  ${base};
  ${p => p.$pill && pill};
  ${p => p.$ghost && ghost};
  ${p => p.$danger && danger};
  ${p => p.full && css`width: 100%;`}
  ${p => p.size === 'lg' && css`padding: ${spacing.md} ${spacing.xl}; font-size: 1rem;`}
  ${p => p.size === 'sm' && css`padding: ${spacing.xs} ${spacing.sm}; font-size: 0.85rem;`}
`;

export default Button;
