import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateOrderNumber(index: number): string {
  return `ORD-${String(index).padStart(4, "0")}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    preparing: "bg-orange-100 text-orange-800",
    ready: "bg-green-100 text-green-800",
    completed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-800",
    unpaid: "bg-red-100 text-red-800",
    paid: "bg-green-100 text-green-800",
    refunded: "bg-purple-100 text-purple-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    manager: "bg-purple-100 text-purple-800",
    waiter: "bg-blue-100 text-blue-800",
    kitchen: "bg-orange-100 text-orange-800",
    cashier: "bg-green-100 text-green-800",
  };
  return colors[role] || "bg-gray-100 text-gray-800";
}

export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}
