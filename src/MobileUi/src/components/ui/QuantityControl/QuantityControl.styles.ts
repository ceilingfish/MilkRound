import { StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.disabledBackground,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.textInverse,
    lineHeight: 22,
  },
  buttonTextDisabled: {
    color: Colors.disabled,
  },
  valueContainer: {
    minWidth: 40,
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  value: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
});
