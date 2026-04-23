/** Request to sign up with a supplier code. */
export interface SignupRequest {
  supplierCode: string;
}

/** Request to add an item to a delivery or schedule. */
export interface AddItemRequest {
  productId: string;
  deliveryScheduleIds: string[];
  quantity: number;
}
