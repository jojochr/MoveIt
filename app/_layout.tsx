import { Stack } from 'expo-router';
import { enableReactTracking } from '@legendapp/state/config/enableReactTracking';
import '../global.css';

enableReactTracking({
  warnMissingUse: true,
});

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
