export const APP_NAME = "RestaurantOS";
export const APP_DESCRIPTION = "Smart Restaurant Management Platform";

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
] as const;

export const ORDER_TYPES = ["dine_in", "takeaway", "delivery"] as const;

export const PAYMENT_METHODS = ["cash", "card", "upi", "online"] as const;

export const PAYMENT_STATUSES = ["unpaid", "paid", "refunded", "partial"] as const;

export const STAFF_ROLES = ["manager", "waiter", "kitchen", "cashier"] as const;

export const SHIFT_STATUSES = [
  "scheduled",
  "checked_in",
  "completed",
  "absent",
] as const;

export const INVENTORY_CATEGORIES = [
  "produce",
  "meat",
  "dairy",
  "dry_goods",
  "beverages",
  "other",
] as const;

export const INVENTORY_UNITS = [
  "kg",
  "g",
  "liters",
  "ml",
  "pieces",
  "packs",
] as const;

export const TRANSACTION_CATEGORIES = [
  "sales",
  "inventory",
  "salary",
  "utilities",
  "rent",
  "other",
] as const;

export const CURRENCIES = ["USD", "EUR", "GBP", "INR", "CAD", "AUD"] as const;

export const SUBSCRIPTION_PLANS = [
  "starter",
  "pro",
  "enterprise",
] as const;
