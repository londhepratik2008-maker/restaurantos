"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Restaurant } from "@/types";

interface RestaurantState {
  restaurant: Restaurant | null;
  setRestaurant: (restaurant: Restaurant | null) => void;
}

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set) => ({
      restaurant: null,
      setRestaurant: (restaurant) => set({ restaurant }),
    }),
    { name: "restaurant-storage" }
  )
);
