"use client";

import { useState, useEffect } from "react";
import { DollarSign, ShoppingCart, Users, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRestaurantStore } from "@/store/restaurant-store";
import { listOrders, listStaff, listInventory } from "@/lib/database";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { Order, Staff, InventoryItem } from "@/types";

export default function DashboardPage() {
  const { restaurant } = useRestaurantStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurant) return;
    Promise.all([
      listOrders(restaurant.$id),
      listStaff(restaurant.$id),
      listInventory(restaurant.$id),
    ]).then(([o, s, i]) => {
      setOrders(o);
      setStaffList(s);
      setInventory(i);
    }).catch(console.error).finally(() => setLoading(false));
  }, [restaurant]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.$createdAt.startsWith(todayStr));
  const todayRevenue = todayOrders.filter((o) => o.payment_status === "paid").reduce((s, o) => s + o.total, 0);
  const lowStockItems = inventory.filter((i) => i.quantity < i.min_stock_level);

  const stats = [
    {
      title: "Today's Revenue",
      value: formatCurrency(todayRevenue),
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Today's Orders",
      value: String(todayOrders.length),
      change: "+8.2%",
      trend: "up" as const,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Active Staff",
      value: String(staffList.filter((s) => s.is_active).length),
      change: "0%",
      trend: "up" as const,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Low Stock Items",
      value: String(lowStockItems.length),
      change: lowStockItems.length > 0 ? `+${lowStockItems.length}` : "0",
      trend: lowStockItems.length > 0 ? "down" as const : "up" as const,
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyRevenue = days.map((day, i) => {
    const dayOrders = orders.filter((o) => new Date(o.$createdAt).getDay() === i && o.payment_status === "paid");
    return { day, revenue: dayOrders.reduce((s, o) => s + o.total, 0), orders: dayOrders.length };
  });

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back! Here&apos;s what&apos;s happening at {restaurant?.name || "your restaurant"} today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">vs yesterday</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg">Weekly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" fontSize={12} tickLine={false} />
                  <YAxis fontSize={12} tickLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Revenue"]} labelStyle={{ color: "#374151" }} />
                  <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No orders yet</p>}
              {orders.slice(0, 5).map((order) => (
                <div key={order.$id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{order.order_number}</p>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {order.customer_name || "Walk-in"} &bull; {formatDate(order.$createdAt)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 ml-4">{formatCurrency(order.total)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.length === 0 && <p className="text-sm text-gray-500 text-center py-4">All stock levels are good</p>}
              {lowStockItems.map((item) => (
                <div key={item.$id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-red-600">
                      {item.quantity} {item.unit} remaining (min: {item.min_stock_level})
                    </p>
                  </div>
                  <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">Restock</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Staff On Duty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {staffList.filter((s) => s.is_active).slice(0, 5).map((staff) => (
                <div key={staff.$id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-orange-600">
                        {staff.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{staff.role}</p>
                    </div>
                  </div>
                  <StatusBadge status="checked_in" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
