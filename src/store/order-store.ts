"use client";

import { create } from "zustand";
import type { Order } from "@/types";

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  setOrders: (orders: Order[]) => void;
  setIsLoading: (loading: boolean) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, data: Partial<Order>) => void;
  removeOrder: (id: string) => void;
  updateStatus: (id: string, status: Order["status"]) => void;
}

export const useOrderStore = create<OrderState>()((set) => ({
  orders: [],
  isLoading: false,
  setOrders: (orders) => set({ orders }),
  setIsLoading: (isLoading) => set({ isLoading }),
  addOrder: (order) =>
    set((state) => ({ orders: [order, ...state.orders] })),
  updateOrder: (id, data) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.$id === id ? { ...o, ...data } : o
      ),
    })),
  removeOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((o) => o.$id !== id),
    })),
  updateStatus: (id, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.$id === id ? { ...o, status } : o
      ),
    })),
}));
