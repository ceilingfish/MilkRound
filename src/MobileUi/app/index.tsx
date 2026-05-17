import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useOnboardingStore } from '../src/store';
import { Colors } from '../src/theme';

export default function IndexScreen() {
  const router = useRouter();
  const { customerId } = useOnboardingStore();

  useEffect(() => {
    if (customerId) {
      router.replace('/(customer)/home');
    } else {
      router.replace('/(auth)/login');
    }
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
});
