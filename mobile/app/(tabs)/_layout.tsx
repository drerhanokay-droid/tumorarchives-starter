import { Tabs } from 'expo-router';
import { colors } from '@/src/theme/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg2,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary2,
        tabBarInactiveTintColor: colors.text3,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Ana Sayfa' }} />
      <Tabs.Screen name="patients" options={{ title: 'Hastalar' }} />
      <Tabs.Screen name="classifications" options={{ title: 'Sınıflama' }} />
      <Tabs.Screen name="scoring" options={{ title: 'Skorlama' }} />
      <Tabs.Screen name="settings" options={{ title: 'Ayarlar' }} />
    </Tabs>
  );
}
