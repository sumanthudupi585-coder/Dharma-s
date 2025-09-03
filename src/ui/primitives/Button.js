import styled, { css, keyframes } from 'styled-components';
import { colors, fonts, radius, spacing, timings, typography } from '../tokens';

// Loading spinner animation
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Ripple effect animation
const ripple = keyframes`
  to {
    transform: scale(4);
    opacity: 0;
  }
`;

const base = css`
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing['2']};
  min-height: 44px;
  padding: ${spacing['3']} ${spacing['4']};
  border-radius: ${radius.md};
  border: 1px solid rgba(212,175,55,0.35);
  background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95));
  color: #e8c86a;
  font-family: ${fonts.body};
  font-weight: ${typography.fontWeight.semibold};
  font-size: ${typography.fontSize.base};
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all ${timings.fast};
  backdrop-filter: blur(8px);
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  position: relative;
  overflow: hidden;
  will-change: transform;

  /* Ripple effect container */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(212, 175, 55, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.3s, height 0.3s;
    z-index: 0;
  }

  /* Content wrapper for z-index */
  & > * {
    position: relative;
    z-index: 1;
  }

  &:hover {
    color: #000;
    background: linear-gradient(145deg, ${colors.gold}, ${colors.fadedGold});
    border-color: ${colors.gold};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:focus-visible {
    outline: 2px solid ${colors.focus};
    outline-offset: 2px;
  }

  &:active {
    transform: translateY(-1px);

    &::before {
      width: 300px;
      height: 300px;
      animation: ${ripple} 0.6s ease-out;
    }
  }

  &:disabled,
  &[aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;

    &:hover {
      background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95));
      color: #e8c86a;
      border-color: rgba(212,175,55,0.35);
      transform: none;
      box-shadow: none;
    }
  }

  /* Loading state */
  &[data-loading='true'] {
    cursor: wait;

    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: ${spin} 1s linear infinite;
      margin-left: ${spacing['2']};
    }
  }
`;

const pill = css`
  border-radius: ${radius.pill};
  padding: ${spacing['3']} ${spacing['6']};
`;

const ghost = css`
  background: rgba(244,241,222,0.08);
  border-color: rgba(212,175,55,0.2);
  color: ${colors.parchment};

  &:hover {
    background: rgba(244,241,222,0.15);
    border-color: ${colors.gold};
    color: ${colors.gold};
    transform: translateY(-1px);
  }
`;

const danger = css`
  border-color: ${colors.error};
  color: ${colors.error};
  background: linear-gradient(145deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.15));

  &:hover {
    background: linear-gradient(145deg, ${colors.error}, #dc2626);
    border-color: ${colors.error};
    color: white;
    transform: translateY(-1px);
  }
`;

const success = css`
  border-color: ${colors.success};
  color: ${colors.success};
  background: linear-gradient(145deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.15));

  &:hover {
    background: linear-gradient(145deg, ${colors.success}, #16a34a);
    border-color: ${colors.success};
    color: white;
    transform: translateY(-1px);
  }
`;

const secondary = css`
  background: linear-gradient(145deg, ${colors.gray700}, ${colors.gray600});
  border-color: ${colors.gray500};
  color: ${colors.gray100};

  &:hover {
    background: linear-gradient(145deg, ${colors.gray600}, ${colors.gray500});
    border-color: ${colors.gray400};
    color: white;
    transform: translateY(-1px);
  }
`;

export const Button = styled.button`
  ${base};
  ${p => p.$pill && pill};
  ${p => p.$ghost && ghost};
  ${p => p.$danger && danger};
  ${p => p.$success && success};
  ${p => p.$secondary && secondary};
  ${p => p.full && css`width: 100%;`}
  ${p => p.size === 'lg' && css`
    padding: ${spacing['4']} ${spacing['8']};
    font-size: ${typography.fontSize.lg};
    min-height: 52px;
  `}
  ${p => p.size === 'sm' && css`
    padding: ${spacing['2']} ${spacing['3']};
    font-size: ${typography.fontSize.sm};
    min-height: 36px;
  `}
  ${p => p.size === 'xs' && css`
    padding: ${spacing['1']} ${spacing['2']};
    font-size: ${typography.fontSize.xs};
    min-height: 28px;
  `}
`;

// Loading button wrapper component
export const LoadingButton = styled(Button).attrs(props => ({
  'data-loading': props.loading,
  disabled: props.disabled || props.loading,
  'aria-disabled': props.disabled || props.loading
}))`
  ${props => props.loading && css`
    padding-right: calc(${spacing['4']} + 20px);
  `}
`;

export default Button;
