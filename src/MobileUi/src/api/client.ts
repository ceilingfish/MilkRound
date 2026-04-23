import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'milkround_auth_token';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.milkround.local',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    }
    return Promise.reject(error);
  },
);

export async function setAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
}

export async function clearAuthToken(): Promise<void> {
  await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
}
