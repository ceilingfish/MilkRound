import { Delivery, DeliverySlot, SupplierItem } from './Api.types';

/** Response from the signup endpoint. */
export interface SignupResponse {
  redirectUrl: string;
}

/** Response confirming a delivery modification. */
export interface ModifyDeliveryResponse {
  id: string;
}

/** Response containing delivery schedule slots. */
export interface DeliveryScheduleResponse {
  slots: DeliverySlot[];
}

/** Response containing planned deliveries. */
export interface PlannedDeliveriesResponse {
  deliveries: Delivery[];
}

/** Response containing supplier items. */
export interface SupplierItemsResponse {
  items: SupplierItem[];
}

/** Standard error response. */
export interface ErrorResponse {
  message: string;
  code?: string;
}
