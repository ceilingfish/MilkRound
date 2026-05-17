import { TextStyle } from 'react-native';

// Fraunces is used for display headings; Nunito Sans for all body copy.
// The font families match the loaded font names from @expo-google-fonts.
export const FontFamilies = {
  heading: 'Fraunces_500Medium',
  headingSemiBold: 'Fraunces_600SemiBold',
  body: 'NunitoSans_400Regular',
  bodyMedium: 'NunitoSans_600SemiBold',
  bodyBold: 'NunitoSans_700Bold',
} as const;

export const Typography = {
  heading1: {
    fontFamily: FontFamilies.heading,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.3,
  } as TextStyle,

  heading2: {
    fontFamily: FontFamilies.heading,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.2,
  } as TextStyle,

  heading3: {
    fontFamily: FontFamilies.headingSemiBold,
    fontSize: 18,
    lineHeight: 24,
  } as TextStyle,

  body: {
    fontFamily: FontFamilies.body,
    fontSize: 15,
    lineHeight: 22,
  } as TextStyle,

  bodyBold: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 15,
    lineHeight: 22,
  } as TextStyle,

  caption: {
    fontFamily: FontFamilies.body,
    fontSize: 13,
    lineHeight: 18,
  } as TextStyle,

  label: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 14,
    lineHeight: 20,
  } as TextStyle,

  button: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 16,
    lineHeight: 22,
  } as TextStyle,
} as const;
