import React, { useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppText } from '../../src/components/ui/AppText';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { QuantityControl } from '../../src/components/ui/QuantityControl';
import { StatusBadge } from '../../src/components/ui/StatusBadge';
import {
  getNextDelivery,
  skipDelivery,
  addItemToDelivery,
  removeItemFromDelivery,
} from '../../src/api';
import { useAuthStore } from '../../src/store';
import { Colors, Spacing } from '../../src/theme';
import { formatDeliveryDate, formatPrice } from '../../src/utils';
import type { Delivery, DeliveryItem } from '../../src/types';

export default function CustomerHomeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: delivery,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['nextDelivery'],
    queryFn: getNextDelivery,
  });

  const skipMutation = useMutation({
    mutationFn: (id: string) => skipDelivery(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['nextDelivery'] }),
  });

  // For the landing page, we simplify and treat deadline as passed if status is not Pending
  const isEditable = delivery?.status === 'Pending';

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <AppText variant="body" color={Colors.textMuted}>
          Loading your next delivery...
        </AppText>
      </View>
    );
  }

  if (!delivery) {
    return (
      <View style={styles.centered}>
        <AppText variant="heading2">No deliveries scheduled</AppText>
        <AppText variant="body" color={Colors.textSecondary} style={styles.emptyText}>
          Get in touch with your supplier to set up deliveries.
        </AppText>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <AppText variant="heading2">
        {formatDeliveryDate(delivery.scheduledTime)}
      </AppText>

      {!isEditable && (
        <StatusBadge status={delivery.status} />
      )}

      {isEditable && (
        <AppText variant="caption" color={Colors.textMuted} style={styles.deadline}>
          You can still make changes to this order
        </AppText>
      )}

      <Card style={styles.orderCard}>
        {delivery.items.map((di: DeliveryItem) => (
          <View key={di.item.id} style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <AppText variant="body">{di.item.name}</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>
                {formatPrice(
                  di.item.price.amount,
                  di.item.price.precision,
                  di.item.price.symbol,
                )}
              </AppText>
            </View>

            {isEditable ? (
              <QuantityControl
                quantity={di.quantity}
                onIncrement={() =>
                  addItemToDelivery(delivery.id, {
                    productId: di.item.id,
                    deliveryScheduleIds: [delivery.deliverySlotId],
                    quantity: di.quantity + 1,
                  }).then(() =>
                    queryClient.invalidateQueries({ queryKey: ['nextDelivery'] }),
                  )
                }
                onDecrement={() => {
                  if (di.quantity <= 1) {
                    removeItemFromDelivery(delivery.id, di.item.id).then(() =>
                      queryClient.invalidateQueries({ queryKey: ['nextDelivery'] }),
                    );
                  } else {
                    addItemToDelivery(delivery.id, {
                      productId: di.item.id,
                      deliveryScheduleIds: [delivery.deliverySlotId],
                      quantity: di.quantity - 1,
                    }).then(() =>
                      queryClient.invalidateQueries({ queryKey: ['nextDelivery'] }),
                    );
                  }
                }}
              />
            ) : (
              <AppText variant="bodyBold">x{di.quantity}</AppText>
            )}
          </View>
        ))}

        {isEditable && (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/(customer)/edit-order',
                params: { deliveryId: delivery.id },
              })
            }
            style={styles.editLink}
          >
            <AppText variant="label" color={Colors.primary}>
              Edit full order
            </AppText>
          </TouchableOpacity>
        )}
      </Card>

      <Button
        title="Skip this delivery"
        variant={isEditable ? 'destructive' : 'secondary'}
        disabled={!isEditable || skipMutation.isPending}
        loading={skipMutation.isPending}
        onPress={() => skipMutation.mutate(delivery.id)}
        style={styles.skipButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  emptyText: {
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  deadline: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  orderCard: {
    marginTop: Spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  itemInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  editLink: {
    paddingTop: Spacing.md,
    alignItems: 'center',
  },
  skipButton: {
    marginTop: Spacing.lg,
  },
});
