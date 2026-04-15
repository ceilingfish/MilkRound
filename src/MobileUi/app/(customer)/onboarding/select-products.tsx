import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { AppText } from '../../../src/components/ui/AppText';
import { Card } from '../../../src/components/ui/Card';
import { Button } from '../../../src/components/ui/Button';
import { QuantityControl } from '../../../src/components/ui/QuantityControl';
import { getSupplierItems } from '../../../src/api';
import { useAuthStore, useCartStore } from '../../../src/store';
import { Colors, Spacing } from '../../../src/theme';
import { formatPrice } from '../../../src/utils';

export default function SelectProductsScreen() {
  const router = useRouter();
  const { supplierId } = useAuthStore();
  const { entries, addItem, incrementQuantity, decrementQuantity } =
    useCartStore();

  const { data: itemsResponse, isLoading } = useQuery({
    queryKey: ['supplierItems', supplierId],
    queryFn: () => getSupplierItems(supplierId!),
    enabled: !!supplierId,
  });

  const total = entries.reduce(
    (sum, e) => sum + e.item.price.amount * e.quantity,
    0,
  );

  function handleConfirm() {
    // Submit the subscription — will wire up to API as follow-up
    router.replace('/(customer)/home');
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.progress}>
        <View style={styles.progressActive} />
        <View style={styles.progressActive} />
      </View>

      <AppText variant="heading1" style={styles.heading}>
        What would you like delivered?
      </AppText>
      <AppText variant="body" color={Colors.textSecondary}>
        These items will be delivered on all your selected days
      </AppText>

      {isLoading && (
        <AppText variant="body" color={Colors.textMuted} style={styles.loading}>
          Loading products...
        </AppText>
      )}

      {itemsResponse?.items.map((item) => {
        const cartEntry = entries.find((e) => e.item.id === item.id);
        const inCart = !!cartEntry;

        return (
          <Card key={item.id} style={styles.productCard}>
            <View style={styles.productRow}>
              <View style={styles.productInfo}>
                <AppText variant="bodyBold">{item.name}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>
                  {formatPrice(
                    item.price.amount,
                    item.price.precision,
                    item.price.symbol,
                  )}
                </AppText>
              </View>

              {inCart ? (
                <QuantityControl
                  quantity={cartEntry.quantity}
                  max={item.maximumQuantity}
                  onIncrement={() => incrementQuantity(item.id)}
                  onDecrement={() => decrementQuantity(item.id)}
                />
              ) : (
                <Button
                  title="Add"
                  variant="secondary"
                  onPress={() => addItem(item)}
                  style={styles.addButton}
                />
              )}
            </View>
          </Card>
        );
      })}

      {entries.length > 0 && (
        <View style={styles.summary}>
          <AppText variant="bodyBold">
            {entries.length} item{entries.length !== 1 ? 's' : ''} selected
          </AppText>
        </View>
      )}

      <Button
        title="Confirm subscription"
        onPress={handleConfirm}
        disabled={entries.length === 0}
        style={styles.confirmButton}
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
  heading: {
    marginBottom: Spacing.sm,
  },
  loading: {
    marginTop: Spacing.lg,
  },
  productCard: {
    marginTop: Spacing.sm,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  addButton: {
    minWidth: 70,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  summary: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  confirmButton: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xxl,
  },
});
