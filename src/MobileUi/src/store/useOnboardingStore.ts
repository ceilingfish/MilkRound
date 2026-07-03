import { create } from 'zustand';

export interface OnboardingAddress {
  flat?: string;
  line1: string;
  line2: string;
  postcode: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
  inRange: boolean;
  eta?: string;
}

// productId → quantity
type Basket = Record<string, number>;

interface OnboardingState {
  // Step 1 — code / supplier
  supplierCode: string;
  supplierId: string | null;
  supplierName: string | null;

  // Step 2 — address
  customerName: string;
  address: OnboardingAddress | null;
  customerId: string | null;

  // Step 3 — days
  selectedDays: string[];          // e.g. ['Monday', 'Wednesday', 'Friday']

  // Step 4 — products
  defaultBasket: Basket;
  dayOverrides: Record<string, Basket>;  // day name → basket
  splitDays: string[];

  // Actions
  setSupplier: (code: string, id: string, name: string) => void;
  setCustomerName: (name: string) => void;
  setAddress: (address: OnboardingAddress) => void;
  setCustomerId: (id: string) => void;
  toggleDay: (day: string) => void;
  setBasketQty: (basketKey: string, productId: string, qty: number) => void;
  splitDay: (day: string) => void;
  unsplitDay: (day: string) => void;
  reset: () => void;
}

const initialState = {
  supplierCode: '',
  supplierId: null,
  supplierName: null,
  customerName: '',
  address: null,
  customerId: null,
  selectedDays: [],
  defaultBasket: {},
  dayOverrides: {},
  splitDays: [],
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState,

  setSupplier: (code, id, name) =>
    set({ supplierCode: code, supplierId: id, supplierName: name }),

  setCustomerName: (name) => set({ customerName: name }),

  setAddress: (address) => set({ address }),

  setCustomerId: (id) => set({ customerId: id }),

  toggleDay: (day) => {
    const { selectedDays } = get();
    const next = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    set({ selectedDays: next });
  },

  setBasketQty: (basketKey, productId, qty) => {
    const state = get();
    const isDefault = basketKey === 'default';
    if (isDefault) {
      const next = { ...state.defaultBasket };
      if (qty === 0) delete next[productId];
      else next[productId] = qty;
      set({ defaultBasket: next });
    } else {
      const current = state.dayOverrides[basketKey] ?? { ...state.defaultBasket };
      const next = { ...current };
      if (qty === 0) delete next[productId];
      else next[productId] = qty;
      set({ dayOverrides: { ...state.dayOverrides, [basketKey]: next } });
    }
  },

  splitDay: (day) => {
    const { splitDays, defaultBasket, dayOverrides } = get();
    if (splitDays.includes(day)) return;
    set({
      splitDays: [...splitDays, day],
      dayOverrides: { ...dayOverrides, [day]: { ...defaultBasket } },
    });
  },

  unsplitDay: (day) => {
    const { splitDays, dayOverrides } = get();
    const { [day]: _, ...rest } = dayOverrides;
    set({
      splitDays: splitDays.filter((d) => d !== day),
      dayOverrides: rest,
    });
  },

  reset: () => set(initialState),
}));
