import React from 'react';
import { View, ScrollView, StyleSheet, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppText } from '../../src/components/ui/AppText';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Colors, Spacing } from '../../src/theme';

export default function DeliveryStopScreen() {
  const router = useRouter();
  const { stopId } = useLocalSearchParams<{ stopId: string }>();

  // Placeholder — will be wired to supplier delivery detail API
  const stop = {
    customerName: '',
    address: '',
    items: [] as Array<{ name: string; quantity: number }>,
    note: '',
  };

  function handleOpenMaps() {
    if (!stop.address) return;
    const encoded = encodeURIComponent(stop.address);
    Linking.openURL(`https://maps.apple.com/?q=${encoded}`);
  }

  function handleMarkDelivered() {
    // Will call the API to mark delivery as completed
    router.back();
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <AppText variant="heading2">{stop.customerName || 'Delivery stop'}</AppText>
      <AppText variant="body" color={Colors.textSecondary} style={styles.address}>
        {stop.address || 'No address available'}
      </AppText>

      <Button
        title="Open in Maps"
        variant="secondary"
        onPress={handleOpenMaps}
        style={styles.mapsButton}
      />

      <Card style={styles.itemsCard}>
        <AppText variant="heading3" style={styles.itemsHeading}>
          Order items
        </AppText>
        {stop.items.length === 0 && (
          <AppText variant="body" color={Colors.textMuted}>
            No items to display
          </AppText>
        )}
        {stop.items.map((item, i) => (
          <View key={i} style={styles.itemRow}>
            <AppText variant="body">{item.name}</AppText>
            <AppText variant="bodyBold">x{item.quantity}</AppText>
          </View>
        ))}
      </Card>

      {stop.note ? (
        <Card style={styles.noteCard}>
          <AppText variant="label" color={Colors.accent}>
            Customer note
          </AppText>
          <AppText variant="body" style={styles.noteText}>
            {stop.note}
          </AppText>
        </Card>
      ) : null}

      <Button
        title="Mark as delivered"
        onPress={handleMarkDelivered}
        style={styles.deliveredButton}
      />

      <Button
        title="Issue with delivery"
        variant="ghost"
        onPress={() => {
          // Will open issue reporting flow
        }}
        style={styles.issueButton}
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
  },
  address: {
    marginTop: Spacing.xs,
  },
  mapsButton: {
    marginTop: Spacing.md,
  },
  itemsCard: {
    marginTop: Spacing.lg,
  },
  itemsHeading: {
    marginBottom: Spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  noteCard: {
    marginTop: Spacing.md,
  },
  noteText: {
    marginTop: Spacing.xs,
  },
  deliveredButton: {
    marginTop: Spacing.xl,
  },
  issueButton: {
    marginTop: Spacing.sm,
  },
});
