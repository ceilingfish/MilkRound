import { apiClient } from './client';
import type {
  SupplierInfo,
  DeliveryScheduleResponse,
  SupplierItemsResponse,
  PlannedDeliveriesResponse,
} from '../types';

export async function getSupplierInfo(id: string): Promise<SupplierInfo> {
  const { data } = await apiClient.get<SupplierInfo>(`/Supplier/${id}`);
  return data;
}

export async function getDeliverySchedule(
  supplierId: string,
): Promise<DeliveryScheduleResponse> {
  const { data } = await apiClient.get<DeliveryScheduleResponse>(
    `/Supplier/${supplierId}/DeliverySchedule`,
  );
  return data;
}

export async function getSupplierItems(
  supplierId: string,
  deliveryScheduleId?: string,
  query?: string,
): Promise<SupplierItemsResponse> {
  const { data } = await apiClient.get<SupplierItemsResponse>(
    `/Supplier/${supplierId}/Items`,
    { params: { deliveryScheduleId, query } },
  );
  return data;
}

export async function getPlannedDeliveries(
  supplierId: string,
): Promise<PlannedDeliveriesResponse> {
  const { data } = await apiClient.get<PlannedDeliveriesResponse>(
    `/Supplier/${supplierId}/PlannedDeliveries`,
  );
  return data;
}
