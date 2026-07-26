"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import { useRestaurantLoader } from "@/hooks/use-restaurant";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRestaurantLoader();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
