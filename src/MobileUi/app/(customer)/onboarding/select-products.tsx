import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Rect } from 'react-native-svg';
import { ProgressDots, SupplierPill } from '../../../src/components/ui';
import { productIllustrations } from '../../../src/components/icons/ProductIllustrations';
import { createSubscription } from '../../../src/api';
import { useOnboardingStore } from '../../../src/store';
import { Colors, FontFamilies, BorderRadius, Shadows, accentRotation } from '../../../src/theme';
import type { DeliveryDayOfWeek } from '../../../src/types';

const PRODUCTS = [
  { key: 'milk',    name: 'Whole milk',       unit: '1 pint',   price: 1.10, max: 6 },
  { key: 'semi',    name: 'Semi-skimmed',      unit: '1 pint',   price: 1.10, max: 6 },
  { key: 'skim',    name: 'Skimmed milk',      unit: '1 pint',   price: 1.10, max: 6 },
  { key: 'eggs',    name: 'Free-range eggs',   unit: 'box of 6', price: 2.40, max: 4 },
  { key: 'butter',  name: 'Salted butter',     unit: '250g',     price: 2.95, max: 3 },
  { key: 'yoghurt', name: 'Natural yoghurt',   unit: '500g',     price: 2.20, max: 4 },
  { key: 'cream',   name: 'Single cream',      unit: '284ml',    price: 1.80, max: 3 },
  { key: 'juice',   name: 'Orange juice',      unit: '1 litre',  price: 2.60, max: 3 },
] as const;

const DAY_SHORT: Record<string, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu',
  Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
};

export default function SelectProductsScreen() {
  const router = useRouter();
  const {
    supplierName, customerId, selectedDays,
    defaultBasket, dayOverrides, splitDays,
    setBasketQty, splitDay, unsplitDay,
  } = useOnboardingStore();

  const [activeKey, setActiveKey] = useState<string>('default');
  const [splitMenuOpen, setSplitMenuOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const allDayKeys = selectedDays.filter((d) => !splitDays.includes(d));

  // Tab list
  const tabs = useMemo(() => {
    const result: { key: string; label: string; isSplit: boolean }[] = [];
    if (allDayKeys.length > 0) {
      result.push({
        key: 'default',
        label: allDayKeys.length === selectedDays.length
          ? 'Every day'
          : allDayKeys.map((d) => DAY_SHORT[d] ?? d).join(', '),
        isSplit: false,
      });
    }
    splitDays.forEach((d) => {
      result.push({ key: d, label: d, isSplit: true });
    });
    return result;
  }, [allDayKeys, splitDays, selectedDays]);

  const activeBasket = activeKey === 'default' ? defaultBasket : (dayOverrides[activeKey] ?? defaultBasket);

  const weeklyTotal = useMemo(() => {
    let total = 0;
    selectedDays.forEach((day) => {
      const basket = splitDays.includes(day) ? (dayOverrides[day] ?? {}) : defaultBasket;
      Object.entries(basket).forEach(([productKey, qty]) => {
        const product = PRODUCTS.find((p) => p.key === productKey);
        if (product) total += product.price * qty;
      });
    });
    return total;
  }, [defaultBasket, dayOverrides, selectedDays, splitDays]);

  const itemCount = Object.values(activeBasket).reduce((a, b) => a + b, 0);
  const totalItemsInDefaultBasket = Object.values(defaultBasket).reduce((a, b) => a + b, 0);
  const canSubmit = totalItemsInDefaultBasket > 0 || splitDays.length > 0;

  const updateQty = (productKey: string, delta: number) => {
    const product = PRODUCTS.find((p) => p.key === productKey);
    if (!product) return;
    const cur = activeBasket[productKey] ?? 0;
    const next = Math.max(0, Math.min(product.max, cur + delta));
    setBasketQty(activeKey, productKey, next);
  };

  const handleSplit = (day: string) => {
    splitDay(day);
    setActiveKey(day);
    setSplitMenuOpen(false);
  };

  const handleUnsplit = (day: string) => {
    unsplitDay(day);
    if (activeKey === day) setActiveKey('default');
    setSplitMenuOpen(false);
  };

  const handleSubmit = async () => {
    if (!customerId) return;
    setSubmitting(true);
    try {
      const toItems = (basket: Record<string, number>) =>
        Object.entries(basket).map(([productId, quantity]) => ({ productId, quantity }));

      const overrides: Record<string, { productId: string; quantity: number }[]> = {};
      splitDays.forEach((day) => {
        if (dayOverrides[day]) overrides[day] = toItems(dayOverrides[day]);
      });

      await createSubscription(customerId, {
        deliveryDays: selectedDays as DeliveryDayOfWeek[],
        defaultBasket: toItems(defaultBasket),
        dayOverrides: Object.keys(overrides).length > 0 ? overrides : undefined,
      });

      router.replace('/(customer)/onboarding/done' as any);
    } catch {
      // TODO: show error toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M19 12H5M12 5l-7 7 7 7" />
          </Svg>
        </Pressable>
        <ProgressDots step={2} total={3} />
        <View style={{ width: 32 }} />
      </View>

      {/* Supplier + title */}
      <View style={styles.titleArea}>
        {supplierName && <SupplierPill name={supplierName} />}
        <Text style={styles.heading}>What would you like delivered?</Text>
        <Text style={styles.sub}>
          {splitDays.length > 0
            ? "Pick items for the day you're editing."
            : `These items arrive on ${allDayKeys.length > 1 ? `each of your ${allDayKeys.length} days` : 'your selected day'}.`}
        </Text>
      </View>

      {/* Day tabs */}
      <View style={styles.tabsArea}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, paddingHorizontal: 24, paddingBottom: 4 }}
        >
          {tabs.map((tab) => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveKey(tab.key)}
              style={[styles.tab, activeKey === tab.key && styles.tabActive]}
            >
              {tab.isSplit && (
                <View style={[styles.splitDot, activeKey === tab.key && styles.splitDotActive]} />
              )}
              <Text style={[styles.tabText, activeKey === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
          <Pressable onPress={() => setSplitMenuOpen(true)} style={styles.splitBtn}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={Colors.textSecondary} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M16 3h5v5M8 3H3v5M16 21h5v-5M8 21H3v-5M12 3v4M12 17v4" />
            </Svg>
            <Text style={styles.splitBtnText}>Different on a day</Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Product list */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
      >
        {PRODUCTS.map((product, idx) => {
          const qty = activeBasket[product.key] ?? 0;
          const tint = accentRotation[idx % accentRotation.length];
          const Illo = productIllustrations[product.key];

          return (
            <View
              key={product.key}
              style={[
                styles.productRow,
                idx < PRODUCTS.length - 1 && styles.productRowBorder,
              ]}
            >
              {/* Product icon */}
              <View style={[
                styles.productIcon,
                qty > 0 && { backgroundColor: `${tint}22`, borderColor: `${tint}55` },
              ]}>
                {Illo && <Illo size={40} />}
              </View>

              {/* Name + price */}
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productMeta}>£{product.price.toFixed(2)} · {product.unit}</Text>
              </View>

              {/* Stepper */}
              <Stepper
                qty={qty}
                max={product.max}
                onDec={() => updateQty(product.key, -1)}
                onInc={() => updateQty(product.key, +1)}
              />
            </View>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Text style={styles.footerItemCount}>
            {itemCount === 0 ? 'Empty basket' : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} · this delivery`}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
            <Text style={styles.footerTotal}>£{weeklyTotal.toFixed(2)}</Text>
            <Text style={styles.footerTotalSub}>/ week</Text>
          </View>
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit || submitting}
          style={[styles.submitBtn, (!canSubmit || submitting) && styles.submitBtnDisabled]}
        >
          {submitting ? (
            <ActivityIndicator color={Colors.primaryInk} />
          ) : (
            <Text style={[styles.submitBtnText, !canSubmit && styles.submitBtnTextDisabled]}>
              Start my subscription
            </Text>
          )}
        </Pressable>
      </View>

      {/* Split menu modal */}
      <Modal
        visible={splitMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSplitMenuOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSplitMenuOpen(false)}>
          <View style={styles.splitMenu}>
            <Text style={styles.splitMenuTitle}>CUSTOMISE A DAY</Text>
            {selectedDays.map((day) => {
              const isSplit = splitDays.includes(day);
              return (
                <Pressable
                  key={day}
                  onPress={() => isSplit ? handleUnsplit(day) : handleSplit(day)}
                  style={({ pressed }) => [styles.splitMenuItem, pressed && { backgroundColor: Colors.chipBg }]}
                >
                  <Text style={styles.splitMenuItemLabel}>{day}</Text>
                  <Text style={[styles.splitMenuItemAction, isSplit && { color: Colors.terracotta }]}>
                    {isSplit ? 'Custom · remove' : 'Split off'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

interface StepperProps {
  qty: number;
  max: number;
  onDec: () => void;
  onInc: () => void;
}

function Stepper({ qty, max, onDec, onInc }: StepperProps) {
  const canDec = qty > 0;
  const canInc = qty < max;

  if (qty === 0) {
    return (
      <Pressable
        onPress={onInc}
        style={styles.stepperAdd}
      >
        <Svg width={14} height={14} viewBox="0 0 14 14">
          <Rect x={6} y={1} width={2.2} height={12} rx={1.1} fill={Colors.primaryInk} />
          <Rect x={1} y={6} width={12} height={2.2} rx={1.1} fill={Colors.primaryInk} />
        </Svg>
      </Pressable>
    );
  }

  return (
    <View style={styles.stepperRow}>
      <Pressable
        onPress={canDec ? onDec : undefined}
        style={[styles.stepperBtn, !canDec && styles.stepperBtnDisabled]}
      >
        <Svg width={14} height={14} viewBox="0 0 14 14">
          <Rect x={1} y={6} width={12} height={2.2} rx={1.1} fill={canDec ? Colors.primaryInk : Colors.textMuted} />
        </Svg>
      </Pressable>
      <Text style={styles.stepperQty}>{qty}</Text>
      <Pressable
        onPress={canInc ? onInc : undefined}
        style={[styles.stepperBtn, !canInc && styles.stepperBtnDisabled]}
      >
        <Svg width={14} height={14} viewBox="0 0 14 14">
          <Rect x={6} y={1} width={2.2} height={12} rx={1.1} fill={canInc ? Colors.primaryInk : Colors.textMuted} />
          <Rect x={1} y={6} width={12} height={2.2} rx={1.1} fill={canInc ? Colors.primaryInk : Colors.textMuted} />
        </Svg>
      </Pressable>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleArea: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  heading: {
    fontFamily: FontFamilies.heading,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.3,
    color: Colors.textPrimary,
    marginTop: 14,
    marginBottom: 6,
  },
  sub: {
    fontFamily: FontFamilies.body,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  tabsArea: {
    paddingVertical: 14,
    paddingBottom: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  tabTextActive: {
    color: Colors.primaryInk,
  },
  splitDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.terracotta,
  },
  splitDotActive: {
    backgroundColor: Colors.primaryInk,
  },
  splitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
  },
  splitBtnText: {
    fontFamily: FontFamilies.body,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  productList: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 12,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
  },
  productRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  productIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  productName: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  productMeta: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 28,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  footerItemCount: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  footerTotal: {
    fontFamily: FontFamilies.heading,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  footerTotalSub: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  submitBtn: {
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  submitBtnDisabled: {
    backgroundColor: Colors.chipBg,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 16,
    color: Colors.primaryInk,
    letterSpacing: 0.1,
  },
  submitBtnTextDisabled: {
    color: Colors.textMuted,
  },
  // Stepper
  stepperAdd: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepperBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnDisabled: {
    backgroundColor: Colors.chipBg,
  },
  stepperQty: {
    fontFamily: FontFamilies.heading,
    fontSize: 18,
    color: Colors.textPrimary,
    minWidth: 20,
    textAlign: 'center',
  },
  // Split menu
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  splitMenu: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    padding: 8,
    paddingBottom: 32,
  },
  splitMenuTitle: {
    fontFamily: FontFamilies.bodyBold,
    fontSize: 11,
    letterSpacing: 0.4,
    color: Colors.textMuted,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  splitMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: BorderRadius.sm,
  },
  splitMenuItemLabel: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  splitMenuItemAction: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 12,
    color: Colors.textMuted,
  },
});
