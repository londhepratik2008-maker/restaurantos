"use client";

import { useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useRestaurantStore } from "@/store/restaurant-store";
import { getRestaurant } from "@/lib/database";

export function useRestaurantLoader() {
  const { user } = useAuth();
  const { restaurant, setRestaurant } = useRestaurantStore();

  useEffect(() => {
    if (user && !restaurant) {
      getRestaurant(user.$id).then((r) => {
        if (r) setRestaurant(r);
      });
    }
  }, [user, restaurant, setRestaurant]);

  return restaurant;
}
