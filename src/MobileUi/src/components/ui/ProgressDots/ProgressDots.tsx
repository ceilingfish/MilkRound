import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../../theme';

interface ProgressDotsProps {
  step: number;   // 0-indexed current step
  total: number;
}

export function ProgressDots({ step, total }: ProgressDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === step ? styles.dotActive : i < step ? styles.dotPast : styles.dotFuture,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 18,
    backgroundColor: Colors.primary,
  },
  dotPast: {
    width: 6,
    backgroundColor: Colors.primary,
    opacity: 0.5,
  },
  dotFuture: {
    width: 6,
    backgroundColor: Colors.chipBg,
  },
});
