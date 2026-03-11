import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const DB_KEY_NAME = 'tumorarchives.db.key';

export async function getOrCreateDatabaseKey() {
  const existing = await SecureStore.getItemAsync(DB_KEY_NAME);
  if (existing) return existing;

  const seed = `${Date.now()}-${Math.random()}-${globalThis.navigator?.userAgent ?? 'device'}`;
  const key = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, seed);
  await SecureStore.setItemAsync(DB_KEY_NAME, key, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  return key;
}
