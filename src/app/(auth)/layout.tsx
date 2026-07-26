"use client";

import { UtensilsCrossed } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-orange-600 items-center justify-center p-12">
        <div className="max-w-md text-center text-white">
          <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-6">
            <UtensilsCrossed className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">RestaurantOS</h1>
          <p className="text-lg text-orange-100">
            Smart restaurant management platform. Manage menu, orders, inventory, staff, and analytics — all in one place.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
