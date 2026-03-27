import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { Typography } from '../../../theme';
import { Colors } from '../../../theme';

type TextVariant = keyof typeof Typography;

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
}

export function AppText({
  variant = 'body',
  color = Colors.textPrimary,
  style,
  children,
  ...props
}: AppTextProps) {
  return (
    <Text style={[Typography[variant] as TextStyle, { color }, style]} {...props}>
      {children}
    </Text>
  );
}
