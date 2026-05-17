import { apiClient } from './client';
import type { ValidateCodeRequest, ValidateCodeResponse } from '../types';

export async function validateSupplierCode(
  request: ValidateCodeRequest,
): Promise<ValidateCodeResponse> {
  const { data } = await apiClient.post<ValidateCodeResponse>(
    '/Suppliers/ValidateCode',
    request,
  );
  return data;
}
