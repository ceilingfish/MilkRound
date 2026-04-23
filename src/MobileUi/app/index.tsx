import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '../src/store';
import { isAuthorized } from '../src/api';
import { Colors } from '../src/theme';

export default function IndexScreen() {
  const router = useRouter();
  const { setAuthenticated, isAuthenticated, role, isNewCustomer } = useAuthStore();

  useEffect(() => {
    async function checkAuth() {
      const authed = await isAuthorized();
      setAuthenticated(authed);

      if (!authed) {
        router.replace('/(auth)/login');
      } else if (isNewCustomer) {
        router.replace('/(customer)/onboarding/select-days');
      } else if (role === 'supplier') {
        router.replace('/(supplier)/delivery-run');
      } else {
        router.replace('/(customer)/home');
      }
    }
    checkAuth();
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
