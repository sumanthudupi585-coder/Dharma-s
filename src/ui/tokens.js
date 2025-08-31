// Design tokens mapped to existing CSS variables to keep visual identity consistent
export const colors = {
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
  mutedGreen: 'var(--muted-green)'
};

export const fonts = {
  body: 'var(--font-primary)',
  display: 'var(--font-display)',
  devanagari: 'var(--font-devanagari)'
};

export const spacing = {
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  xxl: 'var(--spacing-xxl)'
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

export const z = {
  header: 100,
  overlay: 999,
  modal: 3000
};

export const tokens = { colors, fonts, spacing, radius, shadows, timings, z };
export default tokens;
