"use client";

import { create } from "zustand";
import type { InventoryItem, Supplier } from "@/types";

interface InventoryState {
  items: InventoryItem[];
  suppliers: Supplier[];
  isLoading: boolean;
  setItems: (items: InventoryItem[]) => void;
  setSuppliers: (suppliers: Supplier[]) => void;
  setIsLoading: (loading: boolean) => void;
  addItem: (item: InventoryItem) => void;
  updateItem: (id: string, data: Partial<InventoryItem>) => void;
  removeItem: (id: string) => void;
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (id: string, data: Partial<Supplier>) => void;
  removeSupplier: (id: string) => void;
}

export const useInventoryStore = create<InventoryState>()((set) => ({
  items: [],
  suppliers: [],
  isLoading: false,
  setItems: (items) => set({ items }),
  setSuppliers: (suppliers) => set({ suppliers }),
  setIsLoading: (isLoading) => set({ isLoading }),
  addItem: (item) =>
    set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, data) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.$id === id ? { ...i, ...data } : i
      ),
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.$id !== id),
    })),
  addSupplier: (supplier) =>
    set((state) => ({ suppliers: [...state.suppliers, supplier] })),
  updateSupplier: (id, data) =>
    set((state) => ({
      suppliers: state.suppliers.map((s) =>
        s.$id === id ? { ...s, ...data } : s
      ),
    })),
  removeSupplier: (id) =>
    set((state) => ({
      suppliers: state.suppliers.filter((s) => s.$id !== id),
    })),
}));
