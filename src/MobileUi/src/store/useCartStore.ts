import { create } from 'zustand';
import type { SupplierItem } from '../types';

interface CartEntry {
  item: SupplierItem;
  quantity: number;
}

interface CartState {
  entries: CartEntry[];
  note: string;

  addItem: (item: SupplierItem) => void;
  removeItem: (itemId: string) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  incrementQuantity: (itemId: string) => void;
  decrementQuantity: (itemId: string) => void;
  setNote: (note: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  entries: [],
  note: '',

  addItem: (item) => {
    const existing = get().entries.find((e) => e.item.id === item.id);
    if (existing) return;
    set({ entries: [...get().entries, { item, quantity: 1 }] });
  },

  removeItem: (itemId) =>
    set({ entries: get().entries.filter((e) => e.item.id !== itemId) }),

  setQuantity: (itemId, quantity) =>
    set({
      entries: get().entries.map((e) =>
        e.item.id === itemId ? { ...e, quantity } : e,
      ),
    }),

  incrementQuantity: (itemId) => {
    const entry = get().entries.find((e) => e.item.id === itemId);
    if (entry && entry.quantity < entry.item.maximumQuantity) {
      set({
        entries: get().entries.map((e) =>
          e.item.id === itemId ? { ...e, quantity: e.quantity + 1 } : e,
        ),
      });
    }
  },

  decrementQuantity: (itemId) => {
    const entry = get().entries.find((e) => e.item.id === itemId);
    if (entry && entry.quantity > 1) {
      set({
        entries: get().entries.map((e) =>
          e.item.id === itemId ? { ...e, quantity: e.quantity - 1 } : e,
        ),
      });
    }
  },

  setNote: (note) => set({ note }),
  clear: () => set({ entries: [], note: '' }),
}));
