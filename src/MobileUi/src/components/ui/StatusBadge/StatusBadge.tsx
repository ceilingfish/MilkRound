import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import type { DeliveryStatus } from '../../../types';
import { Colors, Typography, Spacing, BorderRadius } from '../../../theme';

const STATUS_COLORS: Record<DeliveryStatus, string> = {
  Pending: Colors.statusPending,
  Packed: Colors.statusPacked,
  Shipped: Colors.statusShipped,
  Delivered: Colors.statusDelivered,
  Cancelled: Colors.statusCancelled,
};

interface StatusBadgeProps {
  status: DeliveryStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = STATUS_COLORS[status];
  return (
    <View style={[styles.badge, { backgroundColor: `${color}18` }]}>
      <Text style={[styles.text, { color }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    ...Typography.caption,
    fontWeight: '600',
  },
});
