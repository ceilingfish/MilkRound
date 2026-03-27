/** Monetary value with currency display info. */
export interface Price {
  amount: number;
  precision: number;
  symbol: string;
}

/** A product item. */
export interface Item {
  id: string;
  name: string;
  price: Price;
  iconName: string;
}

/** A product available from a supplier, with max quantity constraint. */
export interface SupplierItem extends Item {
  maximumQuantity: number;
}

/** An item within a delivery with its quantity. */
export interface DeliveryItem {
  item: Item;
  quantity: number;
}

export type DeliveryStatus =
  | 'Pending'
  | 'Packed'
  | 'Shipped'
  | 'Cancelled'
  | 'Delivered';

/** A scheduled delivery. */
export interface Delivery {
  id: string;
  items: DeliveryItem[];
  deliverySlotId: string;
  scheduledTime: string;
  status: DeliveryStatus;
}

export type DeliveryDayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type DeliveryFrequency = 'Weekly' | 'Fortnightly' | 'Monthly';

/** A recurring delivery slot. */
export interface DeliverySlot {
  id: string;
  dayOfWeek: DeliveryDayOfWeek;
  frequency: DeliveryFrequency;
  cutoffTime: string;
  cutoffDaysBefore?: number;
}

/** Basic contact information for a supplier. */
export interface SupplierInfo {
  id: string;
  businessName: string;
  phoneNumber?: string;
  emailAddress?: string;
}

export type UserRole = 'customer' | 'supplier';
