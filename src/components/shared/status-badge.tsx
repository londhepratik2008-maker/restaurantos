"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  ready: "bg-green-100 text-green-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
  unpaid: "bg-red-100 text-red-800",
  paid: "bg-green-100 text-green-800",
  refunded: "bg-purple-100 text-purple-800",
  partial: "bg-yellow-100 text-yellow-800",
  scheduled: "bg-gray-100 text-gray-800",
  checked_in: "bg-blue-100 text-blue-800",
  absent: "bg-red-100 text-red-800",
  available: "bg-green-100 text-green-800",
  unavailable: "bg-red-100 text-red-800",
  occupied: "bg-red-100 text-red-800",
  reserved: "bg-yellow-100 text-yellow-800",
  cleaning: "bg-blue-100 text-blue-800",
};

const roleColors: Record<string, string> = {
  manager: "bg-purple-100 text-purple-800",
  waiter: "bg-blue-100 text-blue-800",
  kitchen: "bg-orange-100 text-orange-800",
  cashier: "bg-green-100 text-green-800",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colors = statusColors[status] || roleColors[status] || "bg-gray-100 text-gray-800";
  const label = status.replace(/_/g, " ");

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        colors,
        className
      )}
    >
      {label}
    </span>
  );
}
