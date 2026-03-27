import { StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '../../../theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.card,
  },
});
