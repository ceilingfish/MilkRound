import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Svg, { Path, Rect } from 'react-native-svg';
import { Logo } from '../../src/components/icons/Logo';
import { CodeInput } from '../../src/components/ui/CodeInput';
import { validateSupplierCode } from '../../src/api';
import { useOnboardingStore } from '../../src/store';
import { Colors, FontFamilies, BorderRadius, Shadows } from '../../src/theme';

type Mode = 'scan' | 'code';

export default function LoginScreen() {
  const router = useRouter();
  const { setSupplier } = useOnboardingStore();
  const [mode, setMode] = useState<Mode>('scan');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    const extracted = data.replace(/\D/g, '').slice(0, 6);
    if (extracted.length === 6) {
      setCode(extracted);
      setMode('code');
    }
  };

  const submit = async () => {
    const trimmed = code.replace(/\s/g, '');
    if (trimmed.length !== 6) return;
    setLoading(true);
    setError(null);
    try {
      const res = await validateSupplierCode({ code: trimmed });
      setSupplier(trimmed, res.supplierId, res.businessName);
      router.replace('/(customer)/onboarding/address');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    if (mode === 'scan' && !permission?.granted) {
      requestPermission();
    }
    setMode(mode === 'scan' ? 'code' : 'scan');
    setError(null);
  };

  const codeComplete = code.replace(/\s/g, '').length === 6;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Brand */}
        <View style={styles.brand}>
          <Logo size={36} />
        </View>

        <Text style={styles.heading}>
          {mode === 'scan' ? 'Scan your welcome card' : 'Enter your code'}
        </Text>
        <Text style={styles.sub}>
          {mode === 'scan'
            ? 'Your milkman sent you a QR code. Point the camera at it to get started.'
            : 'Type the 6-digit code from your welcome card.'}
        </Text>

        {/* Main interaction area */}
        <View style={styles.inputArea}>
          {mode === 'scan' ? (
            permission?.granted ? (
              <QRViewfinder onScanned={handleBarcodeScanned} />
            ) : (
              <Pressable style={styles.permissionBox} onPress={requestPermission}>
                <Text style={styles.permissionText}>Tap to allow camera access</Text>
              </Pressable>
            )
          ) : (
            <CodeInput value={code} onChange={setCode} error={!!error} />
          )}
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Continue button (code mode only) */}
        {mode === 'code' && (
          <Pressable
            onPress={submit}
            disabled={!codeComplete || loading}
            style={[styles.primaryBtn, (!codeComplete || loading) && styles.primaryBtnDisabled]}
          >
            <Text style={[styles.primaryBtnText, (!codeComplete || loading) && styles.primaryBtnTextDisabled]}>
              {loading ? 'Checking…' : 'Continue'}
            </Text>
          </Pressable>
        )}

        {/* Mode toggle */}
        <Pressable onPress={toggleMode} style={styles.toggleLink}>
          <Text style={styles.toggleText}>
            {mode === 'scan' ? 'I have a code instead' : 'Scan QR code instead'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function QRViewfinder({ onScanned }: { onScanned: (result: { data: string }) => void }) {
  return (
    <View style={styles.viewfinder}>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={onScanned}
      />
      {/* Corner brackets */}
      {[
        { top: 20, left: 20, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 4 },
        { top: 20, right: 20, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 4 },
        { bottom: 20, left: 20, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 4 },
        { bottom: 20, right: 20, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 4 },
      ].map((s, i) => (
        <View key={i} style={[styles.corner, s]} />
      ))}
      {/* Flashlight button */}
      <View style={styles.flashBtn}>
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round">
          <Path d="M6 3h12l-2 4H8Z" />
          <Path d="M8 7v4l4 10 4-10V7" />
        </Svg>
      </View>
    </View>
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
    paddingTop: 12,
    paddingBottom: 28,
  },
  brand: {
    marginBottom: 28,
  },
  heading: {
    fontFamily: FontFamilies.heading,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.4,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  sub: {
    fontFamily: FontFamilies.body,
    fontSize: 14,
    lineHeight: 21,
    color: Colors.textSecondary,
  },
  inputArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  viewfinder: {
    width: 240,
    height: 240,
    borderRadius: BorderRadius.md,
    backgroundColor: '#1a2420',
    overflow: 'hidden',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: Colors.primaryInk,
  },
  flashBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionBox: {
    width: 240,
    height: 240,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  permissionText: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 14,
    color: Colors.primary,
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    borderRadius: BorderRadius.sm,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    fontFamily: FontFamilies.body,
    fontSize: 13,
    color: Colors.error,
    lineHeight: 18,
  },
  primaryBtn: {
    height: 52,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  primaryBtnDisabled: {
    backgroundColor: Colors.chipBg,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnText: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 16,
    color: Colors.primaryInk,
    letterSpacing: 0.1,
  },
  primaryBtnTextDisabled: {
    color: Colors.textMuted,
  },
  toggleLink: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 14,
  },
  toggleText: {
    fontFamily: FontFamilies.bodyMedium,
    fontSize: 14,
    color: Colors.primary,
  },
});
