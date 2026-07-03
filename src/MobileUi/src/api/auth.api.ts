import { apiClient } from './client';
import type { ValidateCodeRequest, ValidateCodeResponse } from '../types';

export async function validateSupplierCode(
  request: ValidateCodeRequest,
): Promise<ValidateCodeResponse> {
  const url = `${apiClient.defaults.baseURL}/Suppliers/ValidateCode`;
  console.log('[validateSupplierCode] QUERY', url, request);
  try {
    // The backend exposes this as the HTTP QUERY method — a body-bearing,
    // safe, idempotent method. Axios has no dedicated `.query()` helper, but
    // `client.request` passes the `method` string straight through to the
    // underlying adapter, so an arbitrary custom method works here.
    const { data } = await apiClient.request<ValidateCodeResponse>({
      method: 'QUERY',
      url: '/Suppliers/ValidateCode',
      data: { code: request.code },
    });
    console.log('[validateSupplierCode] OK', data);
    return data;
  } catch (err: any) {
    console.log('[validateSupplierCode] ERROR', err?.code, err?.response?.status, err?.message);
    throw err;
  }
}
