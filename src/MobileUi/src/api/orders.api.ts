import { apiClient } from './client';
import type {
  Delivery,
  AddItemRequest,
  ModifyDeliveryResponse,
} from '../types';

export async function getNextDelivery(): Promise<Delivery> {
  const { data } = await apiClient.get<Delivery>('/PlannedDeliveries/Next');
  return data;
}

export async function addItemToDelivery(
  deliveryId: string,
  request: AddItemRequest,
): Promise<ModifyDeliveryResponse> {
  const { data } = await apiClient.post<ModifyDeliveryResponse>(
    `/PlannedDeliveries/${deliveryId}/Items`,
    request,
  );
  return data;
}

export async function removeItemFromDelivery(
  deliveryId: string,
  itemId: string,
): Promise<void> {
  await apiClient.delete(`/PlannedDeliveries/${deliveryId}/Items/${itemId}`);
}

export async function skipDelivery(
  deliveryId: string,
): Promise<ModifyDeliveryResponse> {
  const { data } = await apiClient.post<ModifyDeliveryResponse>(
    `/PlannedDeliveries/${deliveryId}/Cancel`,
  );
  return data;
}

export async function addItemToSchedule(
  scheduleId: string,
  request: AddItemRequest,
): Promise<ModifyDeliveryResponse> {
  const { data } = await apiClient.post<ModifyDeliveryResponse>(
    `/DeliverySchedules/${scheduleId}/Items`,
    request,
  );
  return data;
}

export async function removeItemFromSchedule(
  scheduleId: string,
  itemId: string,
): Promise<void> {
  await apiClient.delete(`/DeliverySchedules/${scheduleId}/Items/${itemId}`);
}

export async function cancelSchedule(
  scheduleId: string,
): Promise<ModifyDeliveryResponse> {
  const { data } = await apiClient.post<ModifyDeliveryResponse>(
    `/DeliverySchedules/${scheduleId}/Cancel`,
  );
  return data;
}
