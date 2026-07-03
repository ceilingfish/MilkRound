import { CustomerAddress, DeliveryDayOfWeek } from './Api.types';

export interface ValidateCodeRequest {
  code: string;
}

export interface CreateCustomerRequest {
  name: string;
  supplierCode: string;
  address: CustomerAddress;
}

export interface BasketItem {
  productId: string;
  quantity: number;
}

export interface CreateSubscriptionRequest {
  deliveryDays: DeliveryDayOfWeek[];
  defaultBasket: BasketItem[];
  dayOverrides?: Record<string, BasketItem[]>;
}

/** Request to add an item to a delivery or schedule. */
export interface AddItemRequest {
  productId: string;
  deliveryScheduleIds: string[];
  quantity: number;
}
