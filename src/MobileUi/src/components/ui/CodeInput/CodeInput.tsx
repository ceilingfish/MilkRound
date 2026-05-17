import React, { useRef } from 'react';
import { View, TextInput, StyleSheet, TextInputKeyPressEventData, NativeSyntheticEvent } from 'react-native';
import { Colors, FontFamilies, BorderRadius } from '../../../theme';

interface CodeInputProps {
  value: string;           // up to 6 chars
  onChange: (value: string) => void;
  error?: boolean;
}

const LENGTH = 6;

export function CodeInput({ value, onChange, error }: CodeInputProps) {
  const refs = useRef<(TextInput | null)[]>([]);
  const chars = value.padEnd(LENGTH, ' ').split('').slice(0, LENGTH);

  const handleChange = (index: number, text: string) => {
    const digit = text.replace(/\D/g, '').slice(-1);
    const next = chars.map((c, i) => (i === index ? digit || ' ' : c));
    const joined = next.join('').trimEnd();
    onChange(joined);
    if (digit && index < LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    index: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !chars[index].trim() && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {chars.map((c, i) => {
        const filled = c.trim().length > 0;
        return (
          <TextInput
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            value={c.trim()}
            onChangeText={(t) => handleChange(i, t)}
            onKeyPress={(e) => handleKeyPress(i, e)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            style={[
              styles.box,
              filled && styles.boxFilled,
              error && styles.boxError,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  box: {
    width: 44,
    height: 56,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    color: Colors.textPrimary,
    fontFamily: FontFamilies.headingSemiBold,
    fontSize: 26,
    textAlign: 'center',
  },
  boxFilled: {
    borderColor: Colors.primary,
  },
  boxError: {
    borderColor: Colors.error,
  },
});
