import styled, { css } from 'styled-components';
import { colors, spacing, radius, timings, typography, fonts } from '../tokens';

export const Label = styled.label`
  font-family: ${fonts.body};
  color: ${colors.fadedGold};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.medium};
  margin-bottom: ${spacing['2']};
  display: block;
  line-height: ${typography.lineHeight.snug};

  /* Required field indicator */
  ${props => props.required && css`
    &::after {
      content: ' *';
      color: ${colors.error};
    }
  `}

  /* Error state */
  ${props => props.error && css`
    color: ${colors.error};
  `}

  /* Success state */
  ${props => props.success && css`
    color: ${colors.success};
  `}
`;

const inputBase = css`
  width: 100%;
  min-height: 44px;
  padding: ${spacing['3']} ${spacing['4']};
  border-radius: ${radius.md};
  border: 1px solid rgba(212,175,55,0.35);
  background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95));
  color: #e8c86a;
  font-family: ${fonts.body};
  font-size: ${typography.fontSize.base};
  line-height: ${typography.lineHeight.normal};
  transition: all ${timings.fast};
  backdrop-filter: blur(8px);

  &::placeholder {
    color: #9f8120;
    opacity: 0.7;
  }

  /* Focus state */
  &:focus {
    outline: none;
    border-color: ${colors.gold};
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1),
                0 2px 8px rgba(212, 175, 55, 0.15);
    background: linear-gradient(145deg, rgba(0,0,0,0.9), rgba(18,18,18,1));
  }

  /* Hover state */
  &:hover:not(:focus) {
    border-color: rgba(212,175,55,0.5);
  }

  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: rgba(0,0,0,0.3);
  }

  /* Error state */
  ${props => props.error && css`
    border-color: ${colors.error};
    background: linear-gradient(145deg, rgba(239,68,68,0.1), rgba(220,38,38,0.15));

    &:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1),
                  0 2px 8px rgba(239, 68, 68, 0.15);
    }
  `}

  /* Success state */
  ${props => props.success && css`
    border-color: ${colors.success};
    background: linear-gradient(145deg, rgba(34,197,94,0.1), rgba(22,163,74,0.15));

    &:focus {
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1),
                  0 2px 8px rgba(34, 197, 94, 0.15);
    }
  `}
`;

export const Input = styled.input`
  ${inputBase}
`;

export const Textarea = styled.textarea`
  ${inputBase}
  min-height: 120px;
  resize: vertical;
  line-height: ${typography.lineHeight.relaxed};
`;

export const Select = styled.select`
  ${inputBase}
  cursor: pointer;

  /* Custom arrow */
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23d4af37' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right ${spacing['3']} center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: calc(${spacing['4']} + 1.5em);

  &:focus {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23b8941f' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  }
`;

// Field wrapper component for better composition
export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing['2']};
  width: 100%;
`;

// Helper text component
export const HelperText = styled.div`
  font-size: ${typography.fontSize.sm};
  line-height: ${typography.lineHeight.normal};

  ${props => props.error && css`
    color: ${colors.error};
  `}

  ${props => props.success && css`
    color: ${colors.success};
  `}

  ${props => !props.error && !props.success && css`
    color: ${colors.gray400};
  `}
`;

// Icon wrapper for input icons
export const InputIcon = styled.div`
  position: absolute;
  ${props => props.left ? 'left' : 'right'}: ${spacing['3']};
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.fadedGold};
  pointer-events: none;
  font-size: ${typography.fontSize.lg};
`;

// Input wrapper for icon positioning
export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  ${props => props.hasLeftIcon && css`
    ${Input}, ${Textarea}, ${Select} {
      padding-left: calc(${spacing['4']} + 1.5em);
    }
  `}

  ${props => props.hasRightIcon && css`
    ${Input}, ${Textarea} {
      padding-right: calc(${spacing['4']} + 1.5em);
    }
  `}
`;

export default { Label, Input, Textarea, Select, FieldGroup, HelperText, InputIcon, InputWrapper };
