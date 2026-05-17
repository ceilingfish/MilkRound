import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const AUTH_TOKEN_KEY = 'milkround_auth_token';

const tokenStore = {
  async get(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    }
    return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  },
  async set(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      return;
    }
    return SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  },
  async delete(): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      return;
    }
    return SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  },
};

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.milkround.local',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStore.delete();
    }
    return Promise.reject(error);
  },
);

export async function setAuthToken(token: string): Promise<void> {
  await tokenStore.set(token);
}

export async function clearAuthToken(): Promise<void> {
  await tokenStore.delete();
}
