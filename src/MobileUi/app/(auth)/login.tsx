import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AppText } from '../../src/components/ui/AppText';
import { TextInput } from '../../src/components/ui/TextInput';
import { Button } from '../../src/components/ui/Button';
import { signup } from '../../src/api';
import { useAuthStore } from '../../src/store';
import { Colors, Spacing } from '../../src/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { setAuthenticated, setNewCustomer } = useAuthStore();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    try {
      await signup({ supplierCode: code.trim() });
      setAuthenticated(true);
      setNewCustomer(true);
      router.replace('/(customer)/onboarding/select-days');
    } catch {
      setError('That was not recognised as a valid supplier');
    } finally {
      setLoading(false);
    }
  }

  function handleScanQr() {
    // QR scanning will be implemented as a follow-up
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <AppText variant="heading1" color={Colors.primary}>
            MilkRound
          </AppText>
          <AppText
            variant="body"
            color={Colors.textSecondary}
            style={styles.tagline}
          >
            Fresh from your local dairy, to your door.
          </AppText>
        </View>

        <TouchableOpacity onPress={handleScanQr} style={styles.qrLink}>
          <AppText variant="label" color={Colors.primary}>
            Have a QR code?
          </AppText>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <AppText variant="caption" color={Colors.textMuted} style={styles.dividerText}>
            OR
          </AppText>
          <View style={styles.dividerLine} />
        </View>

        <TextInput
          label="Enter your code"
          placeholder="e.g. 123456"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          error={error}
          containerStyle={styles.input}
        />

        <Button
          title="Sign In"
          onPress={handleSignIn}
          loading={loading}
          disabled={!code.trim()}
          style={styles.button}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  tagline: {
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  qrLink: {
    alignSelf: 'center',
    paddingVertical: Spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.divider,
  },
  dividerText: {
    paddingHorizontal: Spacing.md,
  },
  input: {
    marginBottom: Spacing.md,
  },
  button: {
    marginTop: Spacing.sm,
  },
});
