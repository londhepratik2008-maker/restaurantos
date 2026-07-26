"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, Brain, TrendingUp, AlertTriangle, Lightbulb, Send, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useRestaurantStore } from "@/store/restaurant-store";
import { listOrders, listMenuItems, listInventory, listStaff } from "@/lib/database";

const quickPrompts = [
  { icon: TrendingUp, label: "Demand Forecast", prompt: "Based on my recent orders and inventory, predict demand for the next 3 days and suggest staffing adjustments." },
  { icon: AlertTriangle, label: "Waste Check", prompt: "Analyze my current inventory levels and identify items at risk of spoilage. Suggest menu specials to reduce waste." },
  { icon: Lightbulb, label: "Menu Optimization", prompt: "Review my menu items, their prices and availability. Which items have the best margins? What should I promote or reprice?" },
  { icon: Brain, label: "Staffing Plan", prompt: "Based on my order patterns, recommend optimal staffing for this week including peak hours." },
];

export default function AIInsightsPage() {
  const { restaurant } = useRestaurantStore();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "ai"; content: string }>>([]);
  const [restaurantData, setRestaurantData] = useState<Record<string, unknown> | null>(null);

  const loadData = useCallback(async () => {
    if (!restaurant) return;
    try {
      const [orders, menu, inventory, staff] = await Promise.all([
        listOrders(restaurant.$id),
        listMenuItems(restaurant.$id),
        listInventory(restaurant.$id),
        listStaff(restaurant.$id),
      ]);
      setRestaurantData({
        restaurant_name: restaurant.name,
        cuisine: restaurant.cuisine_type,
        total_orders: orders.length,
        recent_orders: orders.slice(0, 10).map((o) => ({
          number: o.order_number, type: o.type, status: o.status,
          total: o.total, date: o.$createdAt, items: o.customer_name,
        })),
        menu_items: menu.map((m) => ({
          name: m.name, price: m.price, cost: m.cost_price,
          available: m.is_available, category: m.category_id,
        })),
        inventory: inventory.map((i) => ({
          name: i.name, quantity: i.quantity, unit: i.unit,
          min_stock: i.min_stock_level, category: i.category,
        })),
        staff_count: staff.length,
        active_staff: staff.filter((s) => s.is_active).length,
      });
    } catch (err) { console.error(err); }
  }, [restaurant]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSend = async (customPrompt?: string) => {
    const userMessage = customPrompt || prompt;
    if (!userMessage.trim() || loading) return;
    setPrompt("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage, data: restaurantData }),
      });
      const data = await res.json();
      setChatMessages((prev) => [...prev, {
        role: "ai",
        content: data.error ? `Error: ${data.error}. Make sure your Gemini API key is valid.` : data.text,
      }]);
    } catch {
      setChatMessages((prev) => [...prev, {
        role: "ai",
        content: "Failed to connect to AI service. Please check your API configuration.",
      }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="AI Insights" description="AI-powered recommendations for your restaurant" />

      {restaurantData && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickPrompts.map((qp, i) => (
            <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow hover:border-orange-300" onClick={() => handleSend(qp.prompt)}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <qp.icon className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">{qp.label}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{qp.prompt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            AI Assistant
            {restaurantData && <Badge variant="outline" className="text-xs ml-2">Connected to live data</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chatMessages.length > 0 && (
              <div className="max-h-[400px] overflow-y-auto space-y-3 mb-4 p-4 bg-gray-50 rounded-lg">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-wrap ${msg.role === "user" ? "bg-orange-500 text-white" : "bg-white border text-gray-700"}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border p-3 rounded-lg text-sm text-gray-500 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Analyzing your restaurant data...
                    </div>
                  </div>
                )}
              </div>
            )}
            {chatMessages.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-orange-300" />
                <p className="text-sm">Ask me anything about your restaurant operations</p>
                <p className="text-xs text-gray-400 mt-1">I have access to your orders, menu, inventory, and staff data</p>
              </div>
            )}
            <div className="flex gap-2">
              <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ask AI about demand forecasting, waste reduction, menu optimization, staffing..." className="min-h-[60px] resize-none" disabled={loading}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
              <Button className="bg-orange-500 hover:bg-orange-600 self-end" size="icon" onClick={() => handleSend()} disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
