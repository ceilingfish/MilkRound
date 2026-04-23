import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../../src/components/ui/AppText';
import { Card } from '../../src/components/ui/Card';
import { StatusBadge } from '../../src/components/ui/StatusBadge';
import { Colors, Spacing } from '../../src/theme';
import { formatDeliveryDate } from '../../src/utils';
import type { Delivery, DeliveryStatus } from '../../src/types';

// Placeholder data — will be replaced with API calls once supplier endpoints exist
const PLACEHOLDER_STOPS: Array<{
  id: string;
  customerName: string;
  address: string;
  itemSummary: string;
  status: DeliveryStatus;
}> = [];

export default function DeliveryRunScreen() {
  const router = useRouter();
  const today = formatDeliveryDate(new Date().toISOString());
  const totalStops = PLACEHOLDER_STOPS.length;
  const totalItems = 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <AppText variant="heading2">Deliveries for {today}</AppText>

      <AppText variant="caption" color={Colors.textSecondary} style={styles.stats}>
        {totalStops} stops · {totalItems} items
      </AppText>

      {totalStops === 0 && (
        <View style={styles.empty}>
          <AppText variant="body" color={Colors.textMuted}>
            No deliveries scheduled for today.
          </AppText>
        </View>
      )}

      {PLACEHOLDER_STOPS.map((stop) => (
        <TouchableOpacity
          key={stop.id}
          onPress={() =>
            router.push({
              pathname: '/(supplier)/delivery-stop',
              params: { stopId: stop.id },
            })
          }
        >
          <Card style={styles.stopCard}>
            <View style={styles.stopHeader}>
              <AppText variant="bodyBold">{stop.customerName}</AppText>
              <StatusBadge status={stop.status} />
            </View>
            <AppText variant="caption" color={Colors.textSecondary}>
              {stop.address}
            </AppText>
            <AppText variant="caption" color={Colors.textMuted} style={styles.items}>
              {stop.itemSummary}
            </AppText>
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
  },
  stats: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  stopCard: {
    marginBottom: Spacing.sm,
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  items: {
    marginTop: Spacing.xs,
  },
});
