import { create } from 'zustand';
import type { UserRole, SupplierInfo } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  isNewCustomer: boolean;
  role: UserRole | null;
  supplierId: string | null;
  supplier: SupplierInfo | null;

  setAuthenticated: (authenticated: boolean) => void;
  setNewCustomer: (isNew: boolean) => void;
  setRole: (role: UserRole) => void;
  setSupplier: (supplier: SupplierInfo) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isNewCustomer: false,
  role: null,
  supplierId: null,
  supplier: null,

  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  setNewCustomer: (isNew) => set({ isNewCustomer: isNew }),
  setRole: (role) => set({ role }),
  setSupplier: (supplier) =>
    set({ supplier, supplierId: supplier.id }),
  logout: () =>
    set({
      isAuthenticated: false,
      isNewCustomer: false,
      role: null,
      supplierId: null,
      supplier: null,
    }),
}));
