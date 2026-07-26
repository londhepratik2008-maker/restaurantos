"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/config/navigation";
import { APP_NAME } from "@/lib/constants";
import { UtensilsCrossed, X } from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { useRestaurantStore } from "@/store/restaurant-store";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { restaurant } = useRestaurantStore();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-lg">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">{APP_NAME}</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isActive ? "text-orange-600" : "text-gray-400"
                    )}
                  />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-orange-600">
                  {restaurant?.name?.charAt(0) || "R"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {restaurant?.name || "RestaurantOS"}
                </p>
                <p className="text-xs text-gray-500 truncate capitalize">
                  {restaurant?.subscription_plan || "Free Plan"} Plan
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
