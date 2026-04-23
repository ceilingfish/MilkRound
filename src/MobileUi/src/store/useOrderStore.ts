import { create } from 'zustand';
import type { Delivery, DeliverySlot } from '../types';

interface OrderState {
  nextDelivery: Delivery | null;
  plannedDeliveries: Delivery[];
  availableSlots: DeliverySlot[];
  selectedSlotIds: string[];

  setNextDelivery: (delivery: Delivery | null) => void;
  setPlannedDeliveries: (deliveries: Delivery[]) => void;
  setAvailableSlots: (slots: DeliverySlot[]) => void;
  toggleSlot: (slotId: string) => void;
  clearSelectedSlots: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  nextDelivery: null,
  plannedDeliveries: [],
  availableSlots: [],
  selectedSlotIds: [],

  setNextDelivery: (delivery) => set({ nextDelivery: delivery }),
  setPlannedDeliveries: (deliveries) => set({ plannedDeliveries: deliveries }),
  setAvailableSlots: (slots) => set({ availableSlots: slots }),
  toggleSlot: (slotId) => {
    const current = get().selectedSlotIds;
    const next = current.includes(slotId)
      ? current.filter((id) => id !== slotId)
      : [...current, slotId];
    set({ selectedSlotIds: next });
  },
  clearSelectedSlots: () => set({ selectedSlotIds: [] }),
}));
