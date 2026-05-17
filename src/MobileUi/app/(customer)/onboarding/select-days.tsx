import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { ProgressDots, SupplierPill } from '../../../src/components/ui';
import { useOnboardingStore } from '../../../src/store';
import { Colors, FontFamilies, BorderRadius, Shadows, accentRotation } from '../../../src/theme';

const DAYS = [
  { key: 'Monday',    short: 'Mon', available: true  },
  { key: 'Tuesday',   short: 'Tue', available: true  },
  { key: 'Wednesday', short: 'Wed', available: true  },
  { key: 'Thursday',  short: 'Thu', available: false },
  { key: 'Friday',    short: 'Fri', available: true  },
  { key: 'Saturday',  short: 'Sat', available: true  },
  { key: 'Sunday',    short: 'Sun', available: false },
];

export default function SelectDaysScreen() {
  const router = useRouter();
  const { supplierName, selectedDays, toggleDay } = useOnboardingStore();

  const canContinue = selectedDays.length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M19 12H5M12 5l-7 7 7 7" />
          </Svg>
        </Pressable>
        <ProgressDots step={1} total={3} />
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {supplierName && <SupplierPill name={supplierName} />}

        <Text style={styles.heading}>When would you like deliveries?</Text>
        <Text style={styles.sub}>Pick the days that suit you. You'll choose your items next.</Text>

        <View style={{ marginTop: 24, gap: 8 }}>
          {DAYS.map((day, idx) => {
            const selected = selectedDays.includes(day.key);
            const disabled = !day.available;
            const tint = accentRotation[idx % accentRotation.length];
            const isButtery = tint === Colors.butter;

            return (
              <Pressable
                key={day.key}
                onPress={() => !disabled && toggleDay(day.key)}
                disabled={disabled}
                style={[
                  styles.dayRow,
                  selected && { borderColor: tint, backgroundColor: `${tint}14` },
                  selected && Shadows.card,
                  disabled && styles.dayRowDisabled,
                ]}
              >
                {/* Day badge */}
                <View style={[
                  styles.badge,
                  selected
                    ? { backgroundColor: tint }
                    : { backgroundColor: `${tint}1F` },
                ]}>
                  <Text style={[
                    styles.badgeText,
                    selected
                      ? { color: isButtery ? Colors.textPrimary : Colors.primaryInk }
                      : { color: tint },
                  ]}>
                    {day.short}
                  </Text>
                </View>

                {/* Label */}
                <View style={{ flex: 1 }}>
                  <Text style={[styles.dayName, disabled && { color: Colors.textMuted }]}>
                    {day.key}
                  </Text>
                  <Text style={styles.daySub}>
                    {disabled ? 'Not available in your area' : 'Delivered before 7am'}
                  </Text>
                </View>

                {/* Checkmark */}
                {selected && (
                  <View style={[styles.check, { backgroundColor: tint }]}>
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={isButtery ? Colors.textPrimary : Colors.primaryInk} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                      <Path d="M20 6 9 17l-5-5" />
                    </Svg>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Unavailable note */}
        <View style={styles.unavailableNote}>
          <Text style={styles.unavailableNoteText}>
            Thursdays and Sundays aren't available in your area yet. We'll let you know when they open up.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.summaryText}>
          {selectedDays.length === 0 ? (
            <Text style={{ color: Colors.textMuted }}>Pick at least one day to continue</Text>
          ) : (
            <>
              <Text style={{ color: Colors.textPrimary, fontFamily: FontFamilies.bodyMedium }}>
                {selectedDays.length} {selectedDays.length === 1 ? 'day' : 'days'} selected
              </Text>
              <Text style={{ color: Colors.textMuted }}>{'  ·  '}</Text>
              {DAYS.filter((d) => selectedDays.includes(d.key)).map((d) => d.short).join(', ')}
            </>
          )}
        </Text>

        <Pressable
          onPress={() => router.push('/(customer)/onboarding/select-products')}
          disabled={!canContinue}
          style={[styles.continueBtn, !canContinue && styles.continueBtnDisabled]}
        >
          <Text style={[styles.continueBtnText, !canContinue && styles.continueBtnTextDisabled]}>
            Continue
          </Text>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={canContinue ? Colors.primaryInk : Colors.textMuted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="m9 18 6-6-6-6" />
          </Svg>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

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
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  heading: {
    fontFamily: FontFamilies.heading,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.3,
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 6,
  },
  sub: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    lineHeight: 21,
    color: Colors.textSecondary,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
  },
  dayRowDisabled: {
    opacity: 0.4,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  badgeText: {
    fontFamily: FontFamilies.headingSemiBold,
    fontSize: 13,
    letterSpacing: 0.3,
  },
  dayName: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  daySub: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableNote: {
    marginTop: 16,
    padding: 12,
    backgroundColor: `${Colors.chipBg}88`,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
  },
  unavailableNoteText: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  summaryText: {
    fontFamily: FontFamilies.body,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    ...Shadows.card,
  },
  continueBtnDisabled: {
    backgroundColor: Colors.chipBg,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueBtnText: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 16,
    color: Colors.primaryInk,
    letterSpacing: 0.1,
  },
  continueBtnTextDisabled: {
    color: Colors.textMuted,
  },
});
