import { apiClient } from './client';
import type { ValidateCodeRequest, ValidateCodeResponse } from '../types';

export async function validateSupplierCode(
  request: ValidateCodeRequest,
): Promise<ValidateCodeResponse> {
  const url = `${apiClient.defaults.baseURL}/Suppliers/ValidateCode`;
  console.log('[validateSupplierCode] POST', url, request);
  try {
    const { data } = await apiClient.post<ValidateCodeResponse>(
      '/Suppliers/ValidateCode',
      request,
    );
    console.log('[validateSupplierCode] OK', data);
    return data;
  } catch (err: any) {
    console.log('[validateSupplierCode] ERROR', err?.code, err?.response?.status, err?.message);
    throw err;
  }
}
