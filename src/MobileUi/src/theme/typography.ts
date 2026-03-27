import { TextStyle } from 'react-native';

export const Typography = {
  heading1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.3,
  } as TextStyle,

  heading2: {
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.2,
  } as TextStyle,

  heading3: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  } as TextStyle,

  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  } as TextStyle,

  bodyBold: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  } as TextStyle,

  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  } as TextStyle,

  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  } as TextStyle,

  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  } as TextStyle,
} as const;
