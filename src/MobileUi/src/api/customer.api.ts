import { apiClient } from './client';
import type {
  CreateCustomerRequest,
  CreateCustomerResponse,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  ServiceAreaResponse,
} from '../types';

export async function checkServiceArea(
  supplierId: string,
  postcode: string,
): Promise<ServiceAreaResponse> {
  const { data } = await apiClient.get<ServiceAreaResponse>(
    `/Suppliers/${supplierId}/ServiceArea`,
    { params: { postcode } },
  );
  return data;
}

export async function createCustomer(
  request: CreateCustomerRequest,
): Promise<CreateCustomerResponse> {
  const { data } = await apiClient.post<CreateCustomerResponse>(
    '/Customers',
    request,
  );
  return data;
}

export async function createSubscription(
  customerId: string,
  request: CreateSubscriptionRequest,
): Promise<CreateSubscriptionResponse> {
  const { data } = await apiClient.post<CreateSubscriptionResponse>(
    `/Customers/${customerId}/Subscription`,
    request,
  );
  return data;
}
