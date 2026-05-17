import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontFamilies } from '../../../theme';

interface SupplierPillProps {
  name: string;
}

export function SupplierPill({ name }: SupplierPillProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <View style={styles.pill}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <Text style={styles.name}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingLeft: 5,
    paddingRight: 12,
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 999,
  },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.butter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FontFamilies.headingSemiBold,
    fontSize: 10,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  name: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 12,
    color: Colors.textSecondary,
    letterSpacing: 0.2,
  },
});
