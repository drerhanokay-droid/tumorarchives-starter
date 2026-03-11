import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, Text, View } from 'react-native';
import { getDb } from '@/src/db';
import { requireBiometricUnlock } from '@/src/security/lock';
import { colors } from '@/src/theme/colors';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await requireBiometricUnlock();
        await getDb();
        setReady(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
      }
    })();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Başlatma hatası</Text>
        <Text style={{ color: colors.text2, textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator color={colors.primary} />
        <Text style={{ color: colors.text2, marginTop: 12 }}>Şifreli arşiv açılıyor...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="patient/form" />
        <Stack.Screen name="patient/followup-form" />
        <Stack.Screen name="patient/[id]" />
      </Stack>
    </>
  );
}
