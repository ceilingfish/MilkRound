import { apiClient } from './client';
import type { SignupRequest, SignupResponse } from '../types';

export async function signup(request: SignupRequest): Promise<SignupResponse> {
  const { data } = await apiClient.post<SignupResponse>('/Auth/Signup', request);
  return data;
}

export async function isAuthorized(): Promise<boolean> {
  try {
    const { data } = await apiClient.get<boolean>('/Auth/Authorized');
    return data;
  } catch {
    return false;
  }
}
