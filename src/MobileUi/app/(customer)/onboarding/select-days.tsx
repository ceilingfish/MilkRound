import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { AppText } from '../../../src/components/ui/AppText';
import { Button } from '../../../src/components/ui/Button';
import { DayChip } from '../../../src/components/ui/DayChip';
import { getDeliverySchedule } from '../../../src/api';
import { useAuthStore, useOrderStore } from '../../../src/store';
import { Colors, Spacing } from '../../../src/theme';

export default function SelectDaysScreen() {
  const router = useRouter();
  const { supplierId, supplier } = useAuthStore();
  const { availableSlots, selectedSlotIds, setAvailableSlots, toggleSlot } =
    useOrderStore();

  const { isLoading } = useQuery({
    queryKey: ['deliverySchedule', supplierId],
    queryFn: async () => {
      const res = await getDeliverySchedule(supplierId!);
      setAvailableSlots(res.slots);
      return res;
    },
    enabled: !!supplierId,
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.progress}>
        <View style={styles.progressActive} />
        <View style={styles.progressInactive} />
      </View>

      <AppText variant="heading1" style={styles.heading}>
        When would you like deliveries?
      </AppText>

      {supplier && (
        <AppText variant="body" color={Colors.textSecondary}>
          From {supplier.businessName}
        </AppText>
      )}

      <AppText variant="caption" color={Colors.textMuted} style={styles.helper}>
        Pick the days that suit you. You'll choose your items next.
      </AppText>

      <View style={styles.daysGrid}>
        {availableSlots.map((slot) => (
          <DayChip
            key={slot.id}
            label={slot.dayOfWeek}
            selected={selectedSlotIds.includes(slot.id)}
            onPress={() => toggleSlot(slot.id)}
          />
        ))}
      </View>

      {isLoading && (
        <AppText variant="body" color={Colors.textMuted}>
          Loading available days...
        </AppText>
      )}

      <Button
        title="Continue"
        onPress={() =>
          router.push('/(customer)/onboarding/select-products')
        }
        disabled={selectedSlotIds.length === 0}
        style={styles.continueButton}
      />
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
    paddingTop: Spacing.xxl,
  },
  progress: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  progressActive: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  progressInactive: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.divider,
  },
  heading: {
    marginBottom: Spacing.sm,
  },
  helper: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  continueButton: {
    marginTop: Spacing.xl,
  },
});
