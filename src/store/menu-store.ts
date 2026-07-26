"use client";

import { create } from "zustand";
import type { MenuItem, Category } from "@/types";

interface MenuState {
  categories: Category[];
  items: MenuItem[];
  isLoading: boolean;
  setCategories: (categories: Category[]) => void;
  setItems: (items: MenuItem[]) => void;
  setIsLoading: (loading: boolean) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  removeCategory: (id: string) => void;
  addItem: (item: MenuItem) => void;
  updateItem: (id: string, data: Partial<MenuItem>) => void;
  removeItem: (id: string) => void;
  toggleAvailability: (id: string) => void;
}

export const useMenuStore = create<MenuState>()((set) => ({
  categories: [],
  items: [],
  isLoading: false,
  setCategories: (categories) => set({ categories }),
  setItems: (items) => set({ items }),
  setIsLoading: (isLoading) => set({ isLoading }),
  addCategory: (category) =>
    set((state) => ({ categories: [...state.categories, category] })),
  updateCategory: (id, data) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.$id === id ? { ...c, ...data } : c
      ),
    })),
  removeCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.$id !== id),
    })),
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
  toggleAvailability: (id) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.$id === id ? { ...i, is_available: !i.is_available } : i
      ),
    })),
}));
