import { StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../../theme';

export const styles = StyleSheet.create({
  base: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  destructive: {
    backgroundColor: Colors.error,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    backgroundColor: Colors.disabledBackground,
  },
  text: {
    ...Typography.button,
    color: Colors.textInverse,
  },
  primaryText: {
    color: Colors.textInverse,
  },
  secondaryText: {
    color: Colors.textPrimary,
  },
  destructiveText: {
    color: Colors.textInverse,
  },
  ghostText: {
    color: Colors.primary,
  },
  disabledText: {
    color: Colors.disabled,
  },
});
