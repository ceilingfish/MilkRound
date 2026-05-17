import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors, FontFamilies } from '../../theme';

interface LogoMarkProps {
  size?: number;
}

export function LogoMark({ size = 32 }: LogoMarkProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Bottle body */}
      <Path
        d="M13.5 11.5V9a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2.5l2 3.5v15a3 3 0 0 1-3 3H14.5a3 3 0 0 1-3-3v-15l2-3.5Z"
        fill={Colors.cream}
        stroke={Colors.textPrimary}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      {/* Cap */}
      <Path
        d="M13.8 9h12.4v-.6a1.4 1.4 0 0 0-1.4-1.4H15.2a1.4 1.4 0 0 0-1.4 1.4Z"
        fill={Colors.butter}
        stroke={Colors.textPrimary}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      {/* Milk line */}
      <Path
        d="M12 19.5c2.4 1.8 5 1.8 7.5 0 2.5-1.8 5.6-1.8 8.5 0"
        stroke={Colors.sky}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      {/* Drop */}
      <Circle cx={20} cy={26} r={1.4} fill={Colors.primary} opacity={0.9} />
    </Svg>
  );
}

interface LogoProps {
  size?: number;
}

export function Logo({ size = 28 }: LogoProps) {
  return (
    <View style={styles.row}>
      <LogoMark size={size} />
      <Text style={[styles.wordmark, { fontSize: size * 0.75 }]}>Milkround</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wordmark: {
    fontFamily: FontFamilies.heading,
    letterSpacing: -0.3,
    color: Colors.textPrimary,
  },
});
