import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { ProgressDots, SupplierPill } from '../../../src/components/ui';
import { checkServiceArea, createCustomer } from '../../../src/api';
import { useOnboardingStore } from '../../../src/store';
import { Colors, FontFamilies, BorderRadius, Shadows } from '../../../src/theme';
import type { OnboardingAddress } from '../../../src/store/useOnboardingStore';

// Sample address data (in a real app, this would come from a postcode lookup service)
const SAMPLE_ADDRESSES = [
  { line1: '14 Orchard Lane', line2: 'Clifton', postcode: 'BS8 2AB', inRange: true, eta: 'Mon–Sat before 7am' },
  { line1: '42 Long Ashton Road', line2: 'North Somerset', postcode: 'BS41 9LS', inRange: true, eta: 'Mon, Wed, Fri before 7am' },
  { line1: '7 Jericho Road', line2: 'Oxford', postcode: 'OX1 2BN', inRange: false, eta: null },
  { line1: '3 Redland Road', line2: 'Redland', postcode: 'BS6 6TF', inRange: true, eta: 'Tue, Thu, Sat before 7am' },
  { line1: '88 Whiteladies Road', line2: 'Clifton', postcode: 'BS8 2QN', inRange: true, eta: 'Mon–Sat before 7am' },
];

type ScreenMode = 'search' | 'confirmed';

export default function AddressScreen() {
  const router = useRouter();
  const { supplierId, supplierName, supplierCode, setAddress, setCustomerId } = useOnboardingStore();

  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<typeof SAMPLE_ADDRESSES[0] | null>(null);
  const [mode, setMode] = useState<ScreenMode>('search');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ flat: '', line1: '', line2: '', postcode: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [checkingRange, setCheckingRange] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().replace(/\s/g, '');
    return SAMPLE_ADDRESSES.filter((a) =>
      (a.postcode + a.line1 + a.line2).toLowerCase().replace(/\s/g, '').includes(q),
    );
  }, [query]);

  const pick = async (addr: typeof SAMPLE_ADDRESSES[0]) => {
    setCheckingRange(true);
    let inRange = addr.inRange;
    let eta = addr.eta;

    try {
      if (supplierId) {
        const res = await checkServiceArea(supplierId, addr.postcode);
        inRange = res.inRange;
        eta = res.eta ?? addr.eta ?? null;
      }
    } catch {
      // fall back to sample data if API unavailable
    } finally {
      setCheckingRange(false);
    }

    const resolved = { ...addr, inRange, eta: eta ?? null };
    setPicked(resolved);
    setDraft({
      flat: '',
      line1: resolved.line1,
      line2: resolved.line2,
      postcode: resolved.postcode,
      notes: '',
    });
    setMode('confirmed');
  };

  const reset = () => {
    setPicked(null);
    setMode('search');
    setQuery('');
    setEditing(false);
  };

  const useCurrentLocation = () => {
    // Simulate picking the first sample address for MVP
    pick(SAMPLE_ADDRESSES[0]);
  };

  const confirmAndContinue = async () => {
    if (!picked || !picked.inRange) return;
    setLoading(true);
    try {
      const confirmedAddress: OnboardingAddress = {
        flat: draft.flat || undefined,
        line1: draft.line1,
        line2: draft.line2,
        postcode: draft.postcode,
        notes: draft.notes || undefined,
        inRange: true,
        eta: picked.eta ?? undefined,
      };
      setAddress(confirmedAddress);

      const res = await createCustomer({
        supplierCode,
        address: {
          flat: draft.flat || undefined,
          line1: draft.line1,
          line2: draft.line2,
          postcode: draft.postcode,
          notes: draft.notes || undefined,
        },
      });
      setCustomerId(res.customerId);
      router.push('/(customer)/onboarding/select-days');
    } catch {
      // TODO: show error
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={Colors.textPrimary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M19 12H5M12 5l-7 7 7 7" />
            </Svg>
          </Pressable>
          <ProgressDots step={0} total={3} />
          <View style={{ width: 32 }} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Supplier pill */}
          {supplierName && <SupplierPill name={supplierName} />}

          <Text style={styles.heading}>Where do you want your deliveries?</Text>
          <Text style={styles.sub}>We'll confirm your address is on the route before you subscribe.</Text>

          <View style={{ marginTop: 22 }}>
            {mode === 'search' && (
              checkingRange
                ? <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
                : <AddressSearch
                    query={query}
                    setQuery={setQuery}
                    results={results}
                    onPick={pick}
                    onUseLocation={useCurrentLocation}
                  />
            )}
            {mode === 'confirmed' && picked && picked.inRange && (
              <ConfirmedCard
                address={picked}
                draft={draft}
                setDraft={setDraft}
                editing={editing}
                setEditing={setEditing}
                onReset={reset}
                onContinue={confirmAndContinue}
                loading={loading}
                supplierFirst={supplierName?.split(' ')[0] ?? 'your milkman'}
              />
            )}
            {mode === 'confirmed' && picked && !picked.inRange && (
              <OutOfRangeCard
                address={picked}
                onReset={reset}
                supplierName={supplierName ?? 'your milkman'}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Address search ───────────────────────────────────────────────────────────

interface AddressSearchProps {
  query: string;
  setQuery: (q: string) => void;
  results: typeof SAMPLE_ADDRESSES;
  onPick: (a: typeof SAMPLE_ADDRESSES[0]) => void;
  onUseLocation: () => void;
}

function AddressSearch({ query, setQuery, results, onPick, onUseLocation }: AddressSearchProps) {
  return (
    <View>
      {/* Search box */}
      <View style={styles.searchBox}>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={Colors.textSecondary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx={11} cy={11} r={7} />
          <Path d="m20 20-3.5-3.5" />
        </Svg>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Start typing your address or postcode"
          placeholderTextColor={Colors.textMuted}
          autoFocus
          autoCorrect={false}
          autoCapitalize="characters"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={Colors.textMuted} strokeWidth={2} strokeLinecap="round">
              <Path d="M18 6 6 18M6 6l12 12" />
            </Svg>
          </Pressable>
        )}
      </View>

      {/* Use current location (shown when no query) */}
      {!query && (
        <View>
          <View style={styles.orDivider}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>
          <Pressable onPress={onUseLocation} style={({ pressed }) => [styles.locationBtn, pressed && { borderColor: Colors.primary }]}>
            <View style={styles.locationIcon}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={Colors.sky} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <Circle cx={12} cy={12} r={3} />
                <Path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </Svg>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.locationBtnText}>Use my current location</Text>
              <Text style={styles.locationBtnSub}>We'll only use this for delivery</Text>
            </View>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={Colors.textMuted} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <Path d="m9 18 6-6-6-6" />
            </Svg>
          </Pressable>
        </View>
      )}

      {/* Results */}
      {query.length > 0 && (
        <View style={{ marginTop: 10 }}>
          {results.length === 0 ? (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                No matches — try a postcode like{' '}
                <Text style={{ color: Colors.textPrimary, fontFamily: FontFamilies.bodyMedium }}>BS8 2AB</Text>
              </Text>
            </View>
          ) : (
            results.map((a) => (
              <Pressable
                key={a.postcode}
                onPress={() => onPick(a)}
                style={({ pressed }) => [styles.resultRow, pressed && { borderColor: Colors.primary }]}
              >
                <View style={styles.resultIcon}>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={Colors.terracotta} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" />
                    <Circle cx={12} cy={9} r={2.5} />
                  </Svg>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultLine1}>{a.line1}</Text>
                  <Text style={styles.resultLine2}>{a.line2} · {a.postcode}</Text>
                </View>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={Colors.textMuted} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <Path d="m9 18 6-6-6-6" />
                </Svg>
              </Pressable>
            ))
          )}
        </View>
      )}
    </View>
  );
}

// ─── Confirmed card ───────────────────────────────────────────────────────────

interface ConfirmedCardProps {
  address: typeof SAMPLE_ADDRESSES[0];
  draft: { flat: string; line1: string; line2: string; postcode: string; notes: string };
  setDraft: React.Dispatch<React.SetStateAction<{ flat: string; line1: string; line2: string; postcode: string; notes: string }>>;
  editing: boolean;
  setEditing: (v: boolean) => void;
  onReset: () => void;
  onContinue: () => void;
  loading: boolean;
  supplierFirst: string;
}

function ConfirmedCard({ address, draft, setDraft, editing, setEditing, onReset, onContinue, loading, supplierFirst }: ConfirmedCardProps) {
  return (
    <View style={styles.confirmedCard}>
      <MapSketch />
      <View style={styles.confirmedBody}>
        {/* Badge row */}
        <View style={styles.confirmedBadgeRow}>
          <View style={styles.inRangeBadge}>
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={Colors.primary} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M20 6 9 17l-5-5" />
            </Svg>
            <Text style={styles.inRangeBadgeText}>IN RANGE</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 14 }}>
            {!editing && (
              <Pressable onPress={() => setEditing(true)}>
                <Text style={styles.linkText}>Edit</Text>
              </Pressable>
            )}
            <Pressable onPress={editing ? onReset : onReset}>
              <Text style={styles.linkText}>{editing ? 'Start over' : 'Change'}</Text>
            </Pressable>
          </View>
        </View>

        {!editing ? (
          <>
            <Text style={styles.confirmedLine1}>
              {draft.flat ? <Text style={{ color: Colors.textSecondary }}>{draft.flat}, </Text> : null}
              {draft.line1}
            </Text>
            <Text style={styles.confirmedLine2}>{draft.line2} · {draft.postcode}</Text>

            {draft.notes ? (
              <View style={styles.infoChip}>
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </Svg>
                <Text style={styles.infoChipText}>
                  <Text style={{ color: Colors.textPrimary, fontFamily: FontFamilies.bodyMedium }}>Note for {supplierFirst}:</Text>
                  {' '}{draft.notes}
                </Text>
              </View>
            ) : null}

            <View style={styles.infoChip}>
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={Colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <Circle cx={12} cy={12} r={9} />
                <Path d="M12 7v5l3 2" />
              </Svg>
              <Text style={styles.infoChipText}>
                <Text style={{ color: Colors.textPrimary, fontFamily: FontFamilies.bodyMedium }}>{supplierFirst}</Text>
                {' '}delivers here {address.eta}
              </Text>
            </View>

            <Pressable
              onPress={onContinue}
              disabled={loading}
              style={[styles.continueBtn, loading && styles.continueBtnDisabled]}
            >
              {loading ? (
                <ActivityIndicator color={Colors.primaryInk} />
              ) : (
                <>
                  <Text style={styles.continueBtnText}>Continue</Text>
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={Colors.primaryInk} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <Path d="m9 18 6-6-6-6" />
                  </Svg>
                </>
              )}
            </Pressable>
          </>
        ) : (
          <EditForm
            draft={draft}
            setDraft={setDraft}
            onCancel={() => setEditing(false)}
            onSave={() => setEditing(false)}
            onSaveAndContinue={() => { setEditing(false); onContinue(); }}
          />
        )}
      </View>
    </View>
  );
}

// ─── Edit form ────────────────────────────────────────────────────────────────

interface EditFormProps {
  draft: { flat: string; line1: string; line2: string; postcode: string; notes: string };
  setDraft: React.Dispatch<React.SetStateAction<{ flat: string; line1: string; line2: string; postcode: string; notes: string }>>;
  onCancel: () => void;
  onSave: () => void;
  onSaveAndContinue: () => void;
}

function EditForm({ draft, setDraft, onCancel, onSave, onSaveAndContinue }: EditFormProps) {
  return (
    <View style={{ gap: 10 }}>
      <FormField
        label="Flat / unit (optional)"
        value={draft.flat}
        onChange={(v) => setDraft((d) => ({ ...d, flat: v }))}
        placeholder="e.g. Flat 2"
      />
      <FormField
        label="House number & street"
        value={draft.line1}
        onChange={(v) => setDraft((d) => ({ ...d, line1: v }))}
      />
      <FormField
        label="Area / town"
        value={draft.line2}
        onChange={(v) => setDraft((d) => ({ ...d, line2: v }))}
      />
      <FormField
        label="Postcode"
        value={draft.postcode}
        onChange={(v) => setDraft((d) => ({ ...d, postcode: v.toUpperCase() }))}
        autoCapitalize="characters"
      />
      <FormField
        label="Delivery notes (optional)"
        value={draft.notes}
        onChange={(v) => setDraft((d) => ({ ...d, notes: v }))}
        placeholder="e.g. Leave in the side porch, mind the cat"
        multiline
      />

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
        <Pressable onPress={onCancel} style={styles.editCancelBtn}>
          <Text style={styles.editCancelBtnText}>Cancel</Text>
        </Pressable>
        <Pressable onPress={onSave} style={styles.editSaveBtn}>
          <Text style={styles.editSaveBtnText}>Save</Text>
        </Pressable>
      </View>
      <Pressable onPress={onSaveAndContinue} style={{ alignItems: 'center', paddingVertical: 10 }}>
        <Text style={styles.linkText}>Save and continue</Text>
      </Pressable>
    </View>
  );
}

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

function FormField({ label, value, onChange, placeholder, multiline, autoCapitalize = 'sentences' }: FormFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, multiline && styles.fieldInputMultiline, focused && styles.fieldInputFocused]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        multiline={multiline}
        numberOfLines={multiline ? 2 : 1}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

// ─── Out-of-range card ────────────────────────────────────────────────────────

interface OutOfRangeCardProps {
  address: typeof SAMPLE_ADDRESSES[0];
  onReset: () => void;
  supplierName: string;
}

function OutOfRangeCard({ address, onReset, supplierName }: OutOfRangeCardProps) {
  return (
    <View style={styles.outOfRangeCard}>
      {/* Mini map with pin off-route */}
      <View style={styles.outOfRangeMap}>
        <Svg width="100%" height="100%" viewBox="0 0 300 120" preserveAspectRatio="none">
          <Path d="M0 70 Q 80 40 150 70 T 300 80" stroke={Colors.primary} strokeWidth={2} strokeDasharray="4 5" fill="none" opacity={0.45} />
          <Circle cx={60} cy={66} r={5} fill={Colors.primary} />
          <Circle cx={140} cy={68} r={5} fill={Colors.primary} />
          <Circle cx={220} cy={76} r={5} fill={Colors.primary} />
          <G transform="translate(255 22)">
            <Circle r={16} fill={Colors.surface} />
            <Path d="M0 -10 C -6 -10 -9 -6 -9 -1 c 0 6 9 14 9 14 s 9 -8 9 -14 c 0 -5 -3 -9 -9 -9 Z" fill={Colors.terracotta} />
            <Circle cy={-2} r={3} fill={Colors.surface} />
          </G>
        </Svg>
      </View>

      <View style={styles.confirmedBody}>
        <View style={styles.confirmedBadgeRow}>
          <View style={styles.outOfRangeBadge}>
            <Text style={styles.outOfRangeBadgeText}>OUT OF RANGE</Text>
          </View>
          <Pressable onPress={onReset}>
            <Text style={styles.linkText}>Try another</Text>
          </Pressable>
        </View>

        <Text style={styles.outOfRangeHeading}>
          Sorry, {supplierName} doesn't cover {address.postcode} yet.
        </Text>
        <Text style={styles.outOfRangeSub}>
          We'll let you know as soon as the route expands. No spam — just a quick note if things change.
        </Text>

        <Pressable style={styles.notifyBtn}>
          <Text style={styles.notifyBtnText}>Notify me when it's available</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Map sketch ───────────────────────────────────────────────────────────────

function MapSketch() {
  return (
    <View style={styles.mapSketch}>
      <Svg width="100%" height="100%" viewBox="0 0 300 130" preserveAspectRatio="none">
        <Path d="M0 80 Q 80 100 160 85 T 300 90 L 300 130 L 0 130 Z" fill={Colors.butterSoft} opacity={0.5} />
        <Path d="M 10 90 Q 80 40 160 70 T 290 50" stroke={Colors.primary} strokeWidth={2.5} strokeDasharray="5 5" fill="none" />
        <Circle cx={40} cy={78} r={4} fill={Colors.primary} opacity={0.55} />
        <Circle cx={110} cy={62} r={4} fill={Colors.primary} opacity={0.55} />
        <Circle cx={220} cy={58} r={4} fill={Colors.primary} opacity={0.55} />
        <G transform="translate(160 68)">
          <Circle r={18} fill={Colors.surface} stroke={Colors.primary} strokeWidth={1.5} />
          <Path d="M0 -10 C -6 -10 -9 -6 -9 -1 c 0 6 9 14 9 14 s 9 -8 9 -14 c 0 -5 -3 -9 -9 -9 Z" fill={Colors.terracotta} />
          <Circle cy={-2} r={3} fill={Colors.surface} />
        </G>
      </Svg>
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
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
  },
  searchInput: {
    flex: 1,
    fontFamily: FontFamilies.body,
    fontSize: 15,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    marginBottom: 14,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  orText: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 11,
    letterSpacing: 0.4,
    color: Colors.textMuted,
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.sky}22`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationBtnText: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  locationBtnSub: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  noResults: {
    padding: 18,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  noResultsText: {
    fontFamily: FontFamilies.body,
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    marginBottom: 6,
  },
  resultIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.terracotta}22`,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  resultLine1: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  resultLine2: {
    fontFamily: FontFamilies.body,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  confirmedCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.card,
  },
  mapSketch: {
    height: 130,
    backgroundColor: Colors.skySoft,
  },
  confirmedBody: {
    padding: 16,
    paddingBottom: 18,
  },
  confirmedBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inRangeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: `${Colors.primary}1A`,
    borderRadius: BorderRadius.full,
  },
  inRangeBadgeText: {
    fontFamily: FontFamilies.bodyBold,
    fontSize: 11,
    letterSpacing: 0.3,
    color: Colors.primary,
  },
  linkText: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 13,
    color: Colors.primary,
  },
  confirmedLine1: {
    fontFamily: FontFamilies.heading,
    fontSize: 18,
    lineHeight: 24,
    color: Colors.textPrimary,
  },
  confirmedLine2: {
    fontFamily: FontFamilies.body,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.cream,
    borderRadius: BorderRadius.sm,
  },
  infoChipText: {
    flex: 1,
    fontFamily: FontFamilies.body,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textSecondary,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    marginTop: 14,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    ...Shadows.card,
  },
  continueBtnDisabled: {
    opacity: 0.6,
  },
  continueBtnText: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 15,
    color: Colors.primaryInk,
  },
  editCancelBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  editCancelBtnText: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  editSaveBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  editSaveBtnText: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 14,
    color: Colors.primaryInk,
  },
  fieldLabel: {
    fontFamily: FontFamilies.bodyBold,
    fontSize: 11,
    letterSpacing: 0.3,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
    paddingLeft: 2,
  },
  fieldInput: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    color: Colors.textPrimary,
    padding: 10,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
  },
  fieldInputMultiline: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  fieldInputFocused: {
    borderColor: Colors.primary,
  },
  outOfRangeCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.terracotta,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.card,
  },
  outOfRangeMap: {
    height: 120,
    backgroundColor: Colors.terraSoft,
  },
  outOfRangeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: `${Colors.terracotta}1C`,
    borderRadius: BorderRadius.full,
  },
  outOfRangeBadgeText: {
    fontFamily: FontFamilies.bodyBold,
    fontSize: 11,
    letterSpacing: 0.3,
    color: Colors.terracotta,
  },
  outOfRangeHeading: {
    fontFamily: FontFamilies.heading,
    fontSize: 18,
    lineHeight: 24,
    color: Colors.textPrimary,
  },
  outOfRangeSub: {
    fontFamily: FontFamilies.body,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  notifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
  },
  notifyBtnText: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 14,
    color: Colors.primary,
  },
});
