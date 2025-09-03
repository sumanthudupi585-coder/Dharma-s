import React from 'react';
import { createGlobalStyle, keyframes } from 'styled-components';

// Animation keyframes
const shimmer = keyframes`
  0% { opacity: 0.6; transform: translateX(-100%); }
  50% { opacity: 1; }
  100% { opacity: 0.6; transform: translateX(100%); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const inkBleed = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const paperTurn = keyframes`
  0% { transform: rotateY(0deg); opacity: 1; }
  50% { transform: rotateY(-90deg); opacity: 0.3; }
  100% { transform: rotateY(0deg); opacity: 1; }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(212, 175, 55, 0.5); }
  50% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.8), 0 0 30px rgba(212, 175, 55, 0.4); }
`;

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    /* Color Palette - Manuscript/Temple Theme */
    --parchment: #f4f1de;
    --dark-parchment: #e6dcc6;
    --ink-black: #1a1a2e;
    --deep-blue: #16213e;
    --royal-blue: #0f3460;
    --gold: #d4af37;
    --faded-gold: #b8941f;
    --copper: #b87333;
    --deep-red: #8b0000;
    --sacred-orange: #ff6b35;
    --muted-green: #6b8e23;

    /* Secondary UI Colors */
    --success-green: #22c55e;
    --warning-amber: #f59e0b;
    --error-red: #ef4444;
    --info-blue: #3b82f6;

    /* Neutral Grays for Better Contrast */
    --gray-900: #111827;
    --gray-800: #1f2937;
    --gray-700: #374151;
    --gray-600: #4b5563;
    --gray-500: #6b7280;
    --gray-400: #9ca3af;
    --gray-300: #d1d5db;
    --gray-200: #e5e7eb;
    --gray-100: #f3f4f6;
    --gray-50: #f9fafb;

    /* Interactive States */
    --hover-overlay: rgba(212, 175, 55, 0.1);
    --focus-ring: #d4af37;
    --active-state: rgba(212, 175, 55, 0.2);

    /* Typography */
    --font-primary: 'Crimson Text', serif;
    --font-display: 'Cinzel', serif;
    --font-devanagari: 'Noto Serif Devanagari', 'Noto Sans Devanagari', serif;

    /* Improved Modular Typography Scale */
    --fs-xs: clamp(0.75rem, 0.5vw + 0.7rem, 0.875rem);
    --fs-sm: clamp(0.875rem, 0.6vw + 0.8rem, 1rem);
    --fs-base: clamp(1rem, 0.8vw + 0.9rem, 1.125rem); /* Minimum 16px */
    --fs-md: clamp(1.125rem, 1vw + 1rem, 1.25rem);
    --fs-lg: clamp(1.25rem, 1.2vw + 1.1rem, 1.5rem);
    --fs-xl: clamp(1.5rem, 1.5vw + 1.25rem, 2rem);
    --fs-2xl: clamp(1.875rem, 2vw + 1.5rem, 2.5rem);
    --fs-3xl: clamp(2.25rem, 2.5vw + 1.75rem, 3rem);
    --fs-4xl: clamp(2.75rem, 3vw + 2rem, 4rem);

    /* Improved Line Heights */
    --lh-tight: 1.25;
    --lh-snug: 1.375;
    --lh-normal: 1.5;
    --lh-relaxed: 1.625;
    --lh-loose: 1.75;

    /* Consistent 4px-based Spacing System */
    --spacing-1: 0.25rem; /* 4px */
    --spacing-2: 0.5rem;  /* 8px */
    --spacing-3: 0.75rem; /* 12px */
    --spacing-4: 1rem;    /* 16px */
    --spacing-5: 1.25rem; /* 20px */
    --spacing-6: 1.5rem;  /* 24px */
    --spacing-8: 2rem;    /* 32px */
    --spacing-10: 2.5rem; /* 40px */
    --spacing-12: 3rem;   /* 48px */
    --spacing-16: 4rem;   /* 64px */
    --spacing-20: 5rem;   /* 80px */
    --spacing-24: 6rem;   /* 96px */

    /* Legacy spacing (for backwards compatibility) */
    --spacing-xs: var(--spacing-1);
    --spacing-sm: var(--spacing-2);
    --spacing-md: var(--spacing-4);
    --spacing-lg: var(--spacing-6);
    --spacing-xl: var(--spacing-8);
    --spacing-xxl: var(--spacing-12);

    /* Borders & Shadows */
    --border-radius: 8px;
    --manuscript-shadow: 0 4px 20px rgba(26, 26, 46, 0.3);
    --inner-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);

    /* Transitions */
    --transition-fast: 0.2s ease;
    --transition-medium: 0.4s ease;
    --transition-slow: 0.8s ease;

    /* Custom cursors (SVG data URIs) */
    --cursor-default: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23fff3a0'/%3E%3Cstop offset='100%25' stop-color='%23d4af37'/%3E%3C/linearGradient%3E%3CradialGradient id='halo' cx='24' cy='38' r='16' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0%25' stop-color='%23ffeaa0' stop-opacity='0.8'/%3E%3Cstop offset='100%25' stop-color='%23ffd700' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Cg%3E%3Cpolygon points='24,6 30,14 27,14 24,10 21,14 18,14' fill='url(%23g)' stroke='%23e6c76a' stroke-width='0.8'/%3E%3Cpolygon points='24,12 27,16 24,20 21,16' fill='%23ffe27a' stroke='%23e6c76a' stroke-width='0.6'/%3E%3Crect x='23' y='20' width='2' height='16' fill='url(%23g)'/%3E%3Cpolygon points='24,46 28,38 20,38' fill='url(%23g)'/%3E%3Ccircle cx='24' cy='36' r='14' fill='url(%23halo)'/%3E%3C/g%3E%3C/svg%3E") 24 44, auto;
    --cursor-hover: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23fff7b8'/%3E%3Cstop offset='100%25' stop-color='%23ffd24d'/%3E%3C/linearGradient%3E%3CradialGradient id='halo' cx='24' cy='38' r='18' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0%25' stop-color='%23fff4bf' stop-opacity='0.95'/%3E%3Cstop offset='100%25' stop-color='%23ffd700' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Cg%3E%3Cpolygon points='24,6 31,15 27.5,15 24,10.5 20.5,15 17,15' fill='url(%23g)' stroke='%23ffe8a6' stroke-width='0.9'/%3E%3Cpolygon points='24,12 27.5,16.5 24,21 20.5,16.5' fill='%23fff2a0' stroke='%23ffe8a6' stroke-width='0.7'/%3E%3Crect x='22.8' y='21' width='2.4' height='17' rx='1.2' fill='url(%23g)'/%3E%3Cpolygon points='24,46 28.5,38.5 19.5,38.5' fill='url(%23g)'/%3E%3Ccircle cx='24' cy='36.5' r='16' fill='url(%23halo)'/%3E%3C/g%3E%3C/svg%3E") 24 44, pointer;
    --cursor-hover-active: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23fffacb'/%3E%3Cstop offset='100%25' stop-color='%23ffdf70'/%3E%3C/linearGradient%3E%3CradialGradient id='halo' cx='24' cy='38' r='18' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0%25' stop-color='%23fffacb' stop-opacity='1'/%3E%3Cstop offset='100%25' stop-color='%23ffd700' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Cg%3E%3Cpolygon points='24,6 31.5,15.5 27.7,15.5 24,10.8 20.3,15.5 16.5,15.5' fill='url(%23g)' stroke='%23fff1a0' stroke-width='1'/%3E%3Cpolygon points='24,12 27.8,16.8 24,21.4 20.2,16.8' fill='%23fff6b8' stroke='%23fff1a0' stroke-width='0.8'/%3E%3Crect x='22.6' y='21.2' width='2.8' height='17.6' rx='1.4' fill='url(%23g)'/%3E%3Cpolygon points='24,46 29,39 19,39' fill='url(%23g)'/%3E%3Ccircle cx='24' cy='36.8' r='17' fill='url(%23halo)'/%3E%3C/g%3E%3C/svg%3E") 24 44, pointer;
    --cursor-inactive: url("data:image/svg+xml;utf8,<?xml version='1.0' encoding='UTF-8'?><svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 26 26'><g opacity='0.55'><path d='M4 2 L12 15 L10.3 16 L8.6 23 L6.6 24 L7.9 16.4 L5.1 17.6 Z' fill='%23888888' stroke='%23666666' stroke-width='0.9'/></g></svg>") 5 3, not-allowed;
    --cursor-loading: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'%3E%3Cdefs%3E%3ClinearGradient id='lg' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23ffd700'/%3E%3Cstop offset='100%25' stop-color='%23d4af37'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg%3E%3Ccircle cx='22' cy='22' r='14' fill='none' stroke='url(%23lg)' stroke-width='3' stroke-dasharray='20 10'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 22 22' to='360 22 22' dur='1.2s' repeatCount='indefinite'/%3E%3C/circle%3E%3Ccircle cx='22' cy='22' r='4' fill='%23ffd700'%3E%3Canimate attributeName='r' values='3;4;3' dur='1.2s' repeatCount='indefinite'/%3E%3C/circle%3E%3C/g%3E%3C/svg%3E") 22 22, progress;
    --cursor-attack: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'%3E%3Cg%3E%3Ccircle cx='22' cy='22' r='12' fill='none' stroke='%23ffd700' stroke-width='1.4'/%3E%3Cpath d='M22 8 L24 12 L30 14 L24 16 L22 22 L20 16 L14 14 L20 12 Z' fill='%23ffd700'/%3E%3C/g%3E%3C/svg%3E") 22 22, crosshair;
    --cursor-examine: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'%3E%3Cg stroke='%23ffd700' stroke-width='1.6' fill='none' stroke-linecap='round'%3E%3Ccircle cx='20' cy='20' r='8'/%3E%3Cpath d='M26 26 L34 34'/%3E%3C/g%3E%3C/svg%3E") 22 22, zoom-in;
  }

  body {
    font-family: var(--font-primary);
    background: linear-gradient(135deg, var(--ink-black) 0%, var(--deep-blue) 50%, var(--royal-blue) 100%);
    color: var(--gray-100); /* Softer than pure white for better readability */
    min-height: 100vh;
    line-height: var(--lh-relaxed); /* Improved readability with 1.625 */
    overflow-x: hidden;
    overflow-y: auto;
    font-size: var(--fs-base); /* Ensures minimum 16px for accessibility */
  }

  /* Improved Typography Hierarchy */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    color: var(--gold);
    letter-spacing: 0.02em;
    text-shadow: 0 2px 6px rgba(0,0,0,0.35);
    line-height: var(--lh-tight);
    font-weight: 600;
    margin-bottom: var(--spacing-4);
  }

  h1 { font-size: var(--fs-4xl); }
  h2 { font-size: var(--fs-3xl); }
  h3 { font-size: var(--fs-2xl); }
  h4 { font-size: var(--fs-xl); }
  h5 { font-size: var(--fs-lg); }
  h6 { font-size: var(--fs-md); }

  /* Improved body text readability */
  p {
    line-height: var(--lh-relaxed);
    margin-bottom: var(--spacing-4);
    max-width: 75ch; /* Optimal reading line length */
  }

  /* Better link styling */
  a {
    color: var(--gold);
    text-decoration: underline;
    text-decoration-color: rgba(212, 175, 55, 0.5);
    transition: color var(--transition-fast), text-decoration-color var(--transition-fast);
  }

  a:hover {
    color: var(--faded-gold);
    text-decoration-color: var(--faded-gold);
  }

  .emoji-icon { filter: drop-shadow(0 0 8px rgba(212,175,55,0.4)); }

  body:not(.custom-cursor-active) {
    cursor: var(--cursor-default);

    /* Subtle paper texture */
    background-image:
      radial-gradient(circle at 25% 25%, rgba(244, 241, 222, 0.01) 1px, transparent 1px),
      radial-gradient(circle at 75% 75%, rgba(244, 241, 222, 0.01) 1px, transparent 1px);
    background-size: 50px 50px;
  }

  body.cursor-loading {
    cursor: var(--cursor-loading);
  }

  body.cursor-attack {
    cursor: var(--cursor-attack);
  }

  body.cursor-examine {
    cursor: var(--cursor-examine);
  }

  body.large-text { font-size: 1.25rem; /* 20px minimum for large text */ }
  body.force-reduced-motion *, body.force-reduced-motion *::before, body.force-reduced-motion *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  body.high-contrast {
    --parchment: #ffffff;
    --ink-black: #000000;
    --gold: #ffff00;
    --copper: #ff8800;
    --dark-parchment: #e5e5e5;
    --gray-100: #ffffff;
    --gray-900: #000000;
  }

  #root {
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
    padding-left: env(safe-area-inset-left, 0px);
    padding-right: env(safe-area-inset-right, 0px);
  }

  .app {
    min-height: 100vh;
    width: 100%;
    position: relative;
    overflow: visible;
  }

  /* Improved Typography Classes */
  .devanagari-text {
    font-family: var(--font-devanagari);
  }

  .text-display {
    font-family: var(--font-display);
    font-weight: 600;
    color: var(--gold);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    line-height: var(--lh-tight);
  }

  .text-body {
    font-family: var(--font-primary);
    line-height: var(--lh-relaxed);
    color: var(--gray-100);
    font-size: var(--fs-base);
  }

  .text-manuscript {
    font-family: var(--font-primary);
    font-style: italic;
    color: var(--dark-parchment);
    font-size: var(--fs-sm);
    line-height: var(--lh-normal);
  }

  /* Additional utility typography classes */
  .text-xs { font-size: var(--fs-xs); }
  .text-sm { font-size: var(--fs-sm); }
  .text-base { font-size: var(--fs-base); }
  .text-md { font-size: var(--fs-md); }
  .text-lg { font-size: var(--fs-lg); }
  .text-xl { font-size: var(--fs-xl); }
  .text-2xl { font-size: var(--fs-2xl); }
  .text-3xl { font-size: var(--fs-3xl); }
  .text-4xl { font-size: var(--fs-4xl); }

  .leading-tight { line-height: var(--lh-tight); }
  .leading-snug { line-height: var(--lh-snug); }
  .leading-normal { line-height: var(--lh-normal); }
  .leading-relaxed { line-height: var(--lh-relaxed); }
  .leading-loose { line-height: var(--lh-loose); }

  /* Make interactive elements intensify the cursor */
  body:not(.custom-cursor-active) .is-interactive:hover,
  body:not(.custom-cursor-active) .is-interactive:focus {
    cursor: var(--cursor-hover);
  }
  body:not(.custom-cursor-active) .is-interactive:active {
    cursor: var(--cursor-hover-active);
  }
  [disabled],
  .is-disabled,
  .is-interactive[aria-disabled='true'] {
    cursor: var(--cursor-inactive) !important;
  }

  /* Keyboard focus visibility */
  :focus-visible {
    outline: 3px solid var(--gold);
    outline-offset: 2px;
  }

  /* Hint GPU acceleration for frequently animated elements */
  .is-interactive,
  .btn-manuscript,
  .btn-choice {
    will-change: transform, opacity;
  }

  /* Interactive Elements */
  .btn-manuscript {
    background: linear-gradient(145deg, var(--parchment), var(--dark-parchment));
    color: var(--ink-black);
    border: 2px solid var(--copper);
    padding: var(--spacing-sm) var(--spacing-lg);
    min-height: 44px;
    touch-action: manipulation;
    border-radius: var(--border-radius);
    font-family: var(--font-primary);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-medium);
    box-shadow: var(--manuscript-shadow);
    position: relative;
    overflow: hidden;

    &:hover {
      background: linear-gradient(145deg, var(--dark-parchment), var(--parchment));
      border-color: var(--gold);
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(26, 26, 46, 0.4);
    }

    &:active {
      transform: translateY(0);
      box-shadow: var(--inner-shadow);
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent);
      transition: left var(--transition-medium);
    }

    &:hover::before {
      left: 100%;
    }
  }

  .btn-choice {
    background: rgba(244, 241, 222, 0.1);
    border: 1px solid var(--copper);
    color: var(--parchment);
    padding: var(--spacing-md) var(--spacing-lg);
    min-height: 44px;
    touch-action: manipulation;
    border-radius: var(--border-radius);
    font-family: var(--font-primary);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: left;
    width: 100%;
    margin-bottom: var(--spacing-sm);

    &:hover {
      background: rgba(244, 241, 222, 0.2);
      border-color: var(--gold);
      animation: ${glowPulse} 2s infinite;
    }
  }

  /* Layout Components */
  .manuscript-container {
    background: linear-gradient(145deg, var(--parchment), var(--dark-parchment));
    color: var(--ink-black);
    border-radius: var(--border-radius);
    box-shadow: var(--manuscript-shadow);
    padding: var(--spacing-xl);
    margin: var(--spacing-lg);
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image:
        linear-gradient(0deg, transparent 24%, rgba(139, 0, 0, 0.05) 25%, rgba(139, 0, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(139, 0, 0, 0.05) 75%, rgba(139, 0, 0, 0.05) 76%, transparent 77%);
      background-size: 100% 1.5rem;
      pointer-events: none;
      border-radius: var(--border-radius);
    }
  }

  .journal-page {
    background: var(--parchment);
    color: var(--ink-black);
    padding: var(--spacing-xl);
    border-radius: var(--border-radius);
    box-shadow: var(--manuscript-shadow);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: var(--spacing-xl);
      width: 2px;
      background: linear-gradient(to bottom, var(--deep-red), var(--sacred-orange));
      opacity: 0.3;
    }
  }

  /* Animation Classes */
  .fade-in {
    animation: ${fadeIn} var(--transition-slow) ease-out;
  }

  .ink-bleed {
    animation: ${inkBleed} 1.5s ease-out;
  }

  .paper-turn {
    animation: ${paperTurn} var(--transition-slow) ease-in-out;
  }

  .shimmer {
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.4), transparent);
      animation: ${shimmer} 3s infinite;
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .manuscript-container,
    .journal-page {
      margin: var(--spacing-sm);
      padding: var(--spacing-lg);
    }

    .btn-manuscript,
    .btn-choice {
      padding: var(--spacing-md);
    }
  }

  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    :root {
      --parchment: #ffffff;
      --ink-black: #000000;
      --gold: #ffff00;
      --copper: #ff8800;
    }
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--ink-black);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--copper);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--gold);
  }
`;

export default function GlobalStyles() {
  return <GlobalStyle />;
}

export {
  shimmer,
  fadeIn,
  inkBleed,
  paperTurn,
  glowPulse
};
