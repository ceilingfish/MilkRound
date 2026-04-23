import { Stack } from 'expo-router';
import { Colors } from '../../src/theme';

export default function SupplierLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.textPrimary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    />
  );
}
