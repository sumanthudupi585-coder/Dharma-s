// Design tokens mapped to existing CSS variables to keep visual identity consistent
export const colors = {
  // Primary palette
  parchment: 'var(--parchment)',
  darkParchment: 'var(--dark-parchment)',
  ink: 'var(--ink-black)',
  deepBlue: 'var(--deep-blue)',
  royalBlue: 'var(--royal-blue)',
  gold: 'var(--gold)',
  fadedGold: 'var(--faded-gold)',
  copper: 'var(--copper)',
  deepRed: 'var(--deep-red)',
  sacredOrange: 'var(--sacred-orange)',
  mutedGreen: 'var(--muted-green)',

  // Secondary palette for UI elements
  success: 'var(--success-green)',
  warning: 'var(--warning-amber)',
  error: 'var(--error-red)',
  info: 'var(--info-blue)',

  // Neutral grays for better text contrast
  gray900: 'var(--gray-900)',
  gray800: 'var(--gray-800)',
  gray700: 'var(--gray-700)',
  gray600: 'var(--gray-600)',
  gray500: 'var(--gray-500)',
  gray400: 'var(--gray-400)',
  gray300: 'var(--gray-300)',
  gray200: 'var(--gray-200)',
  gray100: 'var(--gray-100)',
  gray50: 'var(--gray-50)',

  // Interactive states
  hover: 'var(--hover-overlay)',
  focus: 'var(--focus-ring)',
  active: 'var(--active-state)'
};

export const fonts = {
  body: 'var(--font-primary)',
  display: 'var(--font-display)',
  devanagari: 'var(--font-devanagari)'
};

// Typography scale with improved hierarchy
export const typography = {
  // Font sizes
  fontSize: {
    xs: 'var(--fs-xs)',
    sm: 'var(--fs-sm)',
    base: 'var(--fs-base)',
    md: 'var(--fs-md)',
    lg: 'var(--fs-lg)',
    xl: 'var(--fs-xl)',
    '2xl': 'var(--fs-2xl)',
    '3xl': 'var(--fs-3xl)',
    '4xl': 'var(--fs-4xl)'
  },
  // Line heights
  lineHeight: {
    none: '1',
    tight: 'var(--lh-tight)',
    snug: 'var(--lh-snug)',
    normal: 'var(--lh-normal)',
    relaxed: 'var(--lh-relaxed)',
    loose: 'var(--lh-loose)'
  },
  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  }
};

// Consistent 8px-based spacing system
export const spacing = {
  '0': '0',
  '1': 'var(--spacing-1)', // 4px
  '2': 'var(--spacing-2)', // 8px
  '3': 'var(--spacing-3)', // 12px
  '4': 'var(--spacing-4)', // 16px
  '5': 'var(--spacing-5)', // 20px
  '6': 'var(--spacing-6)', // 24px
  '8': 'var(--spacing-8)', // 32px
  '10': 'var(--spacing-10)', // 40px
  '12': 'var(--spacing-12)', // 48px
  '16': 'var(--spacing-16)', // 64px
  '20': 'var(--spacing-20)', // 80px
  '24': 'var(--spacing-24)', // 96px
  // Legacy names for backwards compatibility
  xs: 'var(--spacing-1)',
  sm: 'var(--spacing-2)',
  md: 'var(--spacing-4)',
  lg: 'var(--spacing-6)',
  xl: 'var(--spacing-8)',
  xxl: 'var(--spacing-12)'
};

export const radius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  pill: '999px'
};

export const shadows = {
  manuscript: 'var(--manuscript-shadow)',
  inner: 'var(--inner-shadow)'
};

export const timings = {
  fast: 'var(--transition-fast)',
  medium: 'var(--transition-medium)',
  slow: 'var(--transition-slow)'
};

// Centralized z-index management
export const z = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
  // Legacy names
  header: 100,
  achievementToast: 4000
};

export const tokens = { colors, fonts, typography, spacing, radius, shadows, timings, z };
export default tokens;
