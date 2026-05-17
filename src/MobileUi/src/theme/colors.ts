export const Colors = {
  // Backgrounds
  background: '#F7F1E3',
  surface: '#FFFDF7',
  surfaceElevated: '#FFFDF7',
  cream: '#FFF6E0',

  // Text
  textPrimary: '#2C3A2A',
  textSecondary: '#6B7A65',
  textMuted: '#9AA396',
  textInverse: '#FFFDF7',

  // Brand green
  primary: '#4A7C59',
  primaryLight: '#6B9E7A',
  primaryDark: '#2E4B33',
  primaryInk: '#FFFDF7',

  // Accents
  accent: '#C97B4A',
  accentLight: '#E9B949',
  butter: '#E9B949',
  butterSoft: '#F6E4B2',
  terracotta: '#C97B4A',
  terraSoft: '#F1D7C4',
  sky: '#6F9DB8',
  skySoft: '#D5E3EB',
  berry: '#A84D5A',
  forest: '#2E4B33',

  // UI chrome
  border: 'rgba(74, 92, 65, 0.14)',
  borderStrong: 'rgba(74, 92, 65, 0.25)',
  divider: 'rgba(74, 92, 65, 0.08)',
  chipBg: '#EFE6CF',

  // Semantic
  success: '#4A7C59',
  warning: '#E9B949',
  error: '#A33333',
  errorBg: '#FDECEC',
  errorBorder: '#F4C6C6',
  info: '#6F9DB8',

  // Status chips
  statusPending: '#E9B949',
  statusPacked: '#6F9DB8',
  statusShipped: '#4A7C59',
  statusDelivered: '#4A7C59',
  statusCancelled: '#A33333',

  // Disabled
  disabled: '#9AA396',
  disabledBackground: '#EFE6CF',
} as const;

// Cycles through for day badges and product tiles
export const accentRotation = [
  '#4A7C59', '#E9B949', '#C97B4A', '#6F9DB8', '#A84D5A', '#2E4B33', '#7A8B5A',
];
