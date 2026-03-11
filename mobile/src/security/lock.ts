import * as LocalAuthentication from 'expo-local-authentication';

export async function requireBiometricUnlock() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (!hasHardware || !isEnrolled) {
    return { success: true, skipped: true };
  }

  return LocalAuthentication.authenticateAsync({
    promptMessage: 'TumorArchives kilidini aç',
    fallbackLabel: 'Cihaz parolası kullan',
    disableDeviceFallback: false,
  });
}
