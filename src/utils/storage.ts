import * as SecureStore from 'expo-secure-store';

const ACCESS_KEY = 'yanqwip.access';
const REFRESH_KEY = 'yanqwip.refresh';
const USER_KEY = 'yanqwip.user';

export const saveAccessToken = (token: string | null) => {
  if (!token) {
    return SecureStore.deleteItemAsync(ACCESS_KEY);
  }
  return SecureStore.setItemAsync(ACCESS_KEY, token);
};

export const saveRefreshToken = (token: string | null) => {
  if (!token) {
    return SecureStore.deleteItemAsync(REFRESH_KEY);
  }
  return SecureStore.setItemAsync(REFRESH_KEY, token);
};

export const loadAccessToken = () => SecureStore.getItemAsync(ACCESS_KEY);
export const loadRefreshToken = () => SecureStore.getItemAsync(REFRESH_KEY);

export const saveUserSnapshot = (value: unknown) => {
  if (!value) {
    return SecureStore.deleteItemAsync(USER_KEY);
  }
  return SecureStore.setItemAsync(USER_KEY, JSON.stringify(value));
};

export const loadUserSnapshot = async <T>() => {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
};

export const clearSecureSession = async () => {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_KEY),
    SecureStore.deleteItemAsync(REFRESH_KEY),
    SecureStore.deleteItemAsync(USER_KEY),
  ]);
};
