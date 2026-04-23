import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Share } from 'react-native';
import { AppText } from '../../src/components/ui/AppText';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Colors, Spacing, BorderRadius } from '../../src/theme';

export default function InviteCustomerScreen() {
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  function handleGenerate() {
    // Placeholder — will call supplier API to generate invitation code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
  }

  async function handleShare() {
    if (!generatedCode) return;
    await Share.share({
      message: `Join me on MilkRound! Use code: ${generatedCode}`,
    });
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <AppText variant="heading2">Invite a customer</AppText>
      <AppText variant="body" color={Colors.textSecondary} style={styles.subtitle}>
        Generate a code for your customer to sign up with.
      </AppText>

      {generatedCode && (
        <Card style={styles.codeCard}>
          <View style={styles.qrPlaceholder}>
            <AppText variant="caption" color={Colors.textMuted}>
              QR Code
            </AppText>
          </View>
          <AppText variant="heading1" style={styles.code}>
            {generatedCode}
          </AppText>
          <AppText variant="caption" color={Colors.textMuted}>
            Share this code with your customer
          </AppText>
        </Card>
      )}

      <Button
        title={generatedCode ? 'Generate new code' : 'Generate code'}
        variant={generatedCode ? 'secondary' : 'primary'}
        onPress={handleGenerate}
        style={styles.generateButton}
      />

      {generatedCode && (
        <Button
          title="Share"
          onPress={handleShare}
          style={styles.shareButton}
        />
      )}
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
  },
  subtitle: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  codeCard: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: Colors.disabledBackground,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  code: {
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: Spacing.sm,
  },
  generateButton: {
    marginTop: Spacing.lg,
  },
  shareButton: {
    marginTop: Spacing.sm,
  },
});
