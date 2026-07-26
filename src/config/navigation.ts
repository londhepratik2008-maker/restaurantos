import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  Grid3X3,
  Package,
  Users,
  CreditCard,
  BarChart3,
  Sparkles,
  Settings,
  UserCheck,
} from "lucide-react";

export const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Menu",
    href: "/menu",
    icon: UtensilsCrossed,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ClipboardList,
  },
  {
    title: "Tables",
    href: "/tables",
    icon: Grid3X3,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    title: "Staff",
    href: "/staff",
    icon: Users,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: UserCheck,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "AI Insights",
    href: "/ai",
    icon: Sparkles,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
] as const;
