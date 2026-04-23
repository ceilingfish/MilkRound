import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AppText } from '../../src/components/ui/AppText';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { TextInput } from '../../src/components/ui/TextInput';
import { QuantityControl } from '../../src/components/ui/QuantityControl';
import {
  getNextDelivery,
  getSupplierItems,
  addItemToDelivery,
  removeItemFromDelivery,
} from '../../src/api';
import { useAuthStore, useCartStore } from '../../src/store';
import { Colors, Spacing, BorderRadius } from '../../src/theme';
import { formatDeliveryDate, formatPrice } from '../../src/utils';
import type { SupplierItem } from '../../src/types';

export default function EditOrderScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { supplierId } = useAuthStore();
  const { deliveryId } = useLocalSearchParams<{ deliveryId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [editScope, setEditScope] = useState<'single' | 'all'>('single');
  const [note, setNote] = useState('');

  const { data: delivery } = useQuery({
    queryKey: ['nextDelivery'],
    queryFn: getNextDelivery,
  });

  const { data: searchResults } = useQuery({
    queryKey: ['supplierItems', supplierId, searchQuery],
    queryFn: () => getSupplierItems(supplierId!, undefined, searchQuery),
    enabled: !!supplierId && searchQuery.length >= 2,
  });

  async function handleAddItem(item: SupplierItem) {
    if (!deliveryId) return;
    await addItemToDelivery(deliveryId, {
      productId: item.id,
      deliveryScheduleIds: delivery ? [delivery.deliverySlotId] : [],
      quantity: 1,
    });
    setSearchQuery('');
    queryClient.invalidateQueries({ queryKey: ['nextDelivery'] });
  }

  async function handleRemoveItem(itemId: string) {
    if (!deliveryId) return;
    await removeItemFromDelivery(deliveryId, itemId);
    queryClient.invalidateQueries({ queryKey: ['nextDelivery'] });
  }

  async function handleQuantityChange(itemId: string, newQuantity: number) {
    if (!deliveryId || !delivery) return;
    await addItemToDelivery(deliveryId, {
      productId: itemId,
      deliveryScheduleIds: [delivery.deliverySlotId],
      quantity: newQuantity,
    });
    queryClient.invalidateQueries({ queryKey: ['nextDelivery'] });
  }

  const deliveryDate = delivery
    ? formatDeliveryDate(delivery.scheduledTime)
    : '';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      {delivery && (
        <>
          <AppText variant="heading2">Edit order</AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            {deliveryDate}
          </AppText>

          <View style={styles.toggleRow}>
            <TouchableOpacity
              onPress={() => setEditScope('single')}
              style={[
                styles.toggleOption,
                editScope === 'single' && styles.toggleActive,
              ]}
            >
              <AppText
                variant="caption"
                color={
                  editScope === 'single' ? Colors.primary : Colors.textSecondary
                }
              >
                Just this order
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setEditScope('all')}
              style={[
                styles.toggleOption,
                editScope === 'all' && styles.toggleActive,
              ]}
            >
              <AppText
                variant="caption"
                color={
                  editScope === 'all' ? Colors.primary : Colors.textSecondary
                }
              >
                All orders on this day
              </AppText>
            </TouchableOpacity>
          </View>
        </>
      )}

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Add a product..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchResults && searchQuery.length >= 2 && (
          <Card style={styles.searchResults}>
            {searchResults.items.slice(0, 5).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.searchResultRow}
                onPress={() => handleAddItem(item)}
              >
                <AppText variant="body">{item.name}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>
                  {formatPrice(
                    item.price.amount,
                    item.price.precision,
                    item.price.symbol,
                  )}
                </AppText>
              </TouchableOpacity>
            ))}
          </Card>
        )}
      </View>

      {delivery?.items.map((di) => (
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

          <QuantityControl
            quantity={di.quantity}
            onIncrement={() =>
              handleQuantityChange(di.item.id, di.quantity + 1)
            }
            onDecrement={() => {
              if (di.quantity <= 1) return;
              handleQuantityChange(di.item.id, di.quantity - 1);
            }}
          />

          <TouchableOpacity
            onPress={() => handleRemoveItem(di.item.id)}
            style={styles.trashButton}
          >
            <AppText variant="body" color={Colors.error}>
              ✕
            </AppText>
          </TouchableOpacity>
        </View>
      ))}

      <TextInput
        label="Add a note"
        placeholder="Any special instructions..."
        value={note}
        onChangeText={setNote}
        multiline
        numberOfLines={3}
        containerStyle={styles.noteInput}
      />

      <Button
        title="Save changes"
        onPress={() => router.back()}
        style={styles.saveButton}
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
  toggleRow: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  toggleActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  searchContainer: {
    marginBottom: Spacing.md,
    zIndex: 1,
  },
  searchResults: {
    marginTop: Spacing.xs,
  },
  searchResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  itemInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  trashButton: {
    paddingLeft: Spacing.sm,
    padding: Spacing.sm,
  },
  noteInput: {
    marginTop: Spacing.lg,
  },
  saveButton: {
    marginTop: Spacing.lg,
  },
});
