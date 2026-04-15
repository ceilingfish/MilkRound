import React from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  TextInputProps as RNTextInputProps,
  ViewStyle,
} from 'react-native';
import { styles } from './TextInput.styles';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function TextInput({
  label,
  error,
  containerStyle,
  ...props
}: TextInputProps) {
  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#8A9B8A"
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}
