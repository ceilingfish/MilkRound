import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { Logo } from '../../../src/components/icons/Logo';
import { Colors, FontFamilies, BorderRadius, Shadows } from '../../../src/theme';
import { useOnboardingStore } from '../../../src/store';

export default function DoneScreen() {
  const router = useRouter();
  const { supplierName, address, selectedDays } = useOnboardingStore();

  const dayList = selectedDays.slice(0, 3).join(', ') +
    (selectedDays.length > 3 ? ` +${selectedDays.length - 3} more` : '');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <Logo size={32} />
        </View>

        {/* Green check circle */}
        <View style={styles.checkCircle}>
          <Svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={Colors.primaryInk} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M20 6 9 17l-5-5" />
          </Svg>
        </View>

        <Text style={styles.heading}>You're all set.</Text>
        <Text style={styles.sub}>
          Your subscription with{' '}
          <Text style={{ color: Colors.textPrimary, fontFamily: FontFamilies.bodyMedium }}>
            {supplierName ?? 'your milkman'}
          </Text>{' '}
          is confirmed. Your first delivery is on its way.
        </Text>

        {/* Summary chips */}
        <View style={styles.chips}>
          {address && (
            <View style={styles.chip}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={Colors.primary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" />
                <Circle cx={12} cy={9} r={2.5} />
              </Svg>
              <Text style={styles.chipText}>{address.postcode}</Text>
            </View>
          )}
          {selectedDays.length > 0 && (
            <View style={styles.chip}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={Colors.primary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <Circle cx={12} cy={12} r={9} />
                <Path d="M12 7v5l3 2" />
              </Svg>
              <Text style={styles.chipText}>{dayList}</Text>
            </View>
          )}
        </View>

        <View style={{ flex: 1 }} />

        <Pressable
          onPress={() => router.replace('/(customer)/home')}
          style={styles.btn}
        >
          <Text style={styles.btnText}>Go to my account</Text>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={Colors.primaryInk} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
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
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 32,
    alignItems: 'center',
  },
  logoRow: {
    alignSelf: 'flex-start',
    marginBottom: 48,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    ...Shadows.elevated,
  },
  heading: {
    fontFamily: FontFamilies.heading,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.5,
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  sub: {
    fontFamily: FontFamilies.body,
    fontSize: 15,
    lineHeight: 23,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 24,
    justifyContent: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.cream,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.full,
  },
  chipText: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    ...Shadows.card,
  },
  btnText: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 16,
    color: Colors.primaryInk,
    letterSpacing: 0.1,
  },
});
