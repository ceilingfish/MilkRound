import { Redirect } from 'expo-router';
import { useOnboardingStore } from '../src/store';

export default function IndexScreen() {
  const { customerId } = useOnboardingStore();

  if (customerId) {
    return <Redirect href="/(customer)/home" />;
  }
  return <Redirect href="/(auth)/login" />;
}
