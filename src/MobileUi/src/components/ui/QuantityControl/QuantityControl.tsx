import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from './QuantityControl.styles';

interface QuantityControlProps {
  quantity: number;
  min?: number;
  max?: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function QuantityControl({
  quantity,
  min = 1,
  max = 99,
  onIncrement,
  onDecrement,
}: QuantityControlProps) {
  const canDecrement = quantity > min;
  const canIncrement = quantity < max;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onDecrement}
        disabled={!canDecrement}
        style={[styles.button, !canDecrement && styles.buttonDisabled]}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, !canDecrement && styles.buttonTextDisabled]}>
          −
        </Text>
      </TouchableOpacity>

      <View style={styles.valueContainer}>
        <Text style={styles.value}>{quantity}</Text>
      </View>

      <TouchableOpacity
        onPress={onIncrement}
        disabled={!canIncrement}
        style={[styles.button, !canIncrement && styles.buttonDisabled]}
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, !canIncrement && styles.buttonTextDisabled]}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}
