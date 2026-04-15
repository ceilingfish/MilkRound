import type { Delivery, DeliverySlot } from '../types';

/** Check if a delivery's order deadline has passed. */
export function isDeadlinePassed(
  delivery: Delivery,
  slot: DeliverySlot | undefined,
): boolean {
  if (!slot) return true;
  const deliveryDate = new Date(delivery.scheduledTime);
  const cutoff = new Date(deliveryDate);

  if (slot.cutoffDaysBefore) {
    cutoff.setDate(cutoff.getDate() - slot.cutoffDaysBefore);
  }

  // Parse cutoffTime as "HH:mm"
  const [hours, minutes] = slot.cutoffTime.split(':').map(Number);
  cutoff.setHours(hours, minutes, 0, 0);

  return new Date() > cutoff;
}

/** Check if a delivery can be modified. */
export function canModifyDelivery(
  delivery: Delivery,
  slot: DeliverySlot | undefined,
): boolean {
  if (delivery.status === 'Cancelled' || delivery.status === 'Delivered') {
    return false;
  }
  return !isDeadlinePassed(delivery, slot);
}
