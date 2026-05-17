import { apiClient } from './client';
import type { ValidateCodeRequest, ValidateCodeResponse } from '../types';

export async function validateSupplierCode(
  request: ValidateCodeRequest,
): Promise<ValidateCodeResponse> {
  const url = `${apiClient.defaults.baseURL}/Suppliers/FindByCode?code=${request.code}`;
  console.log('[validateSupplierCode] GET', url);
  try {
    const { data } = await apiClient.get<ValidateCodeResponse>(
      '/Suppliers/FindByCode',
      { params: { code: request.code } },
    );
    console.log('[validateSupplierCode] OK', data);
    return data;
  } catch (err: any) {
    console.log('[validateSupplierCode] ERROR', err?.code, err?.response?.status, err?.message);
    throw err;
  }
}
