import styled, { css } from 'styled-components';
import { colors, spacing, radius, timings, typography, fonts, devices } from '../tokens';

export const Label = styled.label`
  font-family: ${fonts.body};
  color: ${colors.fadedGold};
  font-weight: ${typography.fontWeight.medium};
  margin-bottom: ${spacing['2']};
  display: block;
  line-height: ${typography.lineHeight.snug};

  /* Mobile: Larger text for readability */
  font-size: ${typography.fontSize.base};

  /* Touch-friendly if label is clickable */
  cursor: pointer;
  min-height: 44px;
  display: flex;
  align-items: center;

  /* Required field indicator */
  ${props => props.required && css`
    &::after {
      content: ' *';
      color: ${colors.error};
      margin-left: ${spacing['1']};
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

  /* Tablet and up: Smaller text */
  @media ${devices.tablet} {
    font-size: ${typography.fontSize.sm};
    min-height: auto;
    display: block;
  }
`;

const inputBase = css`
  /* MOBILE-FIRST: Optimized for touch input */
  width: 100%;
  border-radius: ${radius.md};
  border: 1px solid rgba(212,175,55,0.35);
  background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95));
  color: #e8c86a;
  font-family: ${fonts.body};
  font-size: ${typography.fontSize.base};
  line-height: ${typography.lineHeight.normal};
  transition: all ${timings.fast};
  backdrop-filter: blur(8px);

  /* Mobile: Larger touch targets and padding */
  min-height: 48px;
  padding: ${spacing['4']} ${spacing['4']};

  /* Prevent zoom on iOS */
  font-size: 16px; /* Minimum to prevent zoom */
  -webkit-text-size-adjust: 100%;

  /* Touch-friendly interactions */
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &::placeholder {
    color: #9f8120;
    opacity: 0.7;
  }

  /* Focus state - enhanced for mobile */
  &:focus {
    outline: none;
    border-color: ${colors.gold};
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2),
                0 4px 12px rgba(212, 175, 55, 0.15);
    background: linear-gradient(145deg, rgba(0,0,0,0.9), rgba(18,18,18,1));

    /* Ensure focus is very visible on mobile */
    border-width: 2px;
  }

  /* Hover only for mouse devices */
  @media ${devices.mouse} {
    &:hover:not(:focus) {
      border-color: rgba(212,175,55,0.5);
    }
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
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2),
                  0 4px 12px rgba(239, 68, 68, 0.15);
      border-color: ${colors.error};
    }
  `}

  /* Success state */
  ${props => props.success && css`
    border-color: ${colors.success};
    background: linear-gradient(145deg, rgba(34,197,94,0.1), rgba(22,163,74,0.15));

    &:focus {
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2),
                  0 4px 12px rgba(34, 197, 94, 0.15);
      border-color: ${colors.success};
    }
  `}

  /* Tablet: Slightly smaller */
  @media ${devices.tablet} {
    min-height: 44px;
    padding: ${spacing['3']} ${spacing['4']};
    font-size: ${typography.fontSize.base};
  }

  /* Desktop: Standard sizing */
  @media ${devices.desktop} {
    min-height: 40px;
    padding: ${spacing['3']} ${spacing['4']};
  }
`;

export const Input = styled.input`
  ${inputBase}
`;

export const Textarea = styled.textarea`
  ${inputBase}
  resize: vertical;
  line-height: ${typography.lineHeight.relaxed};

  /* Mobile: Larger initial size */
  min-height: 120px;

  @media ${devices.tablet} {
    min-height: 100px;
  }

  @media ${devices.desktop} {
    min-height: 80px;
  }
`;

export const Select = styled.select`
  ${inputBase}
  cursor: pointer;

  /* Mobile: Larger arrow and touch-friendly */
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23d4af37' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right ${spacing['4']} center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: calc(${spacing['5']} + 1.5em);

  /* Mobile appearance */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  &:focus {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23b8941f' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  }

  /* Tablet and up: Smaller arrow */
  @media ${devices.tablet} {
    background-position: right ${spacing['3']} center;
    padding-right: calc(${spacing['4']} + 1.5em);
  }
`;

// Field wrapper component for better composition
export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing['2']};
  width: 100%;

  /* Mobile: Extra margin between field groups */
  margin-bottom: ${spacing['4']};

  @media ${devices.tablet} {
    margin-bottom: ${spacing['3']};
  }

  @media ${devices.desktop} {
    margin-bottom: ${spacing['2']};
  }
`;

// Helper text component
export const HelperText = styled.div`
  line-height: ${typography.lineHeight.normal};
  margin-top: ${spacing['1']};

  /* Mobile: Larger text for readability */
  font-size: ${typography.fontSize.sm};

  ${props => props.error && css`
    color: ${colors.error};
    font-weight: ${typography.fontWeight.medium};
  `}

  ${props => props.success && css`
    color: ${colors.success};
    font-weight: ${typography.fontWeight.medium};
  `}

  ${props => !props.error && !props.success && css`
    color: ${colors.gray400};
  `}

  /* Tablet and up: Smaller text */
  @media ${devices.tablet} {
    font-size: ${typography.fontSize.xs};
  }
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
  width: 100%;

  ${props => props.hasLeftIcon && css`
    ${Input}, ${Textarea}, ${Select} {
      /* Mobile: More padding for icons */
      padding-left: calc(${spacing['5']} + 1.5em);

      @media ${devices.tablet} {
        padding-left: calc(${spacing['4']} + 1.5em);
      }
    }
  `}

  ${props => props.hasRightIcon && css`
    ${Input}, ${Textarea} {
      /* Mobile: More padding for icons */
      padding-right: calc(${spacing['5']} + 1.5em);

      @media ${devices.tablet} {
        padding-right: calc(${spacing['4']} + 1.5em);
      }
    }
  `}
`;

// Responsive form layout
export const FormGrid = styled.div`
  display: grid;
  gap: ${spacing['4']};
  width: 100%;

  /* Mobile: Single column */
  grid-template-columns: 1fr;

  /* Tablet: Two columns for side-by-side fields */
  @media ${devices.tablet} {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: ${spacing['6']};
  }

  /* Desktop: More flexible layout */
  @media ${devices.desktop} {
    gap: ${spacing['8']};
  }
`;

export default { Label, Input, Textarea, Select, FieldGroup, HelperText, InputIcon, InputWrapper };
