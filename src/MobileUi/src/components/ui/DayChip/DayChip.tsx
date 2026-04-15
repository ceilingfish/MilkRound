import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../../theme';

interface DayChipProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export function DayChip({
  label,
  selected,
  disabled = false,
  onPress,
}: DayChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.chip,
        selected && styles.chipSelected,
        disabled && styles.chipDisabled,
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.label,
          selected && styles.labelSelected,
          disabled && styles.labelDisabled,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    minWidth: 80,
  },
  chipSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}12`,
  },
  chipDisabled: {
    backgroundColor: Colors.disabledBackground,
    borderColor: Colors.disabledBackground,
  },
  label: {
    ...Typography.bodyBold,
    color: Colors.textPrimary,
  },
  labelSelected: {
    color: Colors.primary,
  },
  labelDisabled: {
    color: Colors.disabled,
  },
});
