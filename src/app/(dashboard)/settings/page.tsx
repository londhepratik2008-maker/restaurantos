"use client";

import { useState, useEffect } from "react";
import { Save, Building2, CreditCard, Bell, Shield } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRestaurantStore } from "@/store/restaurant-store";
import { updateRestaurantSettings } from "@/lib/database";
import { CURRENCIES } from "@/lib/constants";
import type { Restaurant } from "@/types";

export default function SettingsPage() {
  const { restaurant, setRestaurant } = useRestaurantStore();
  const [form, setForm] = useState<Partial<Restaurant>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    lowStock: true, newOrder: true, dailyReport: false, staffSchedule: true,
  });

  useEffect(() => {
    if (restaurant) setForm(restaurant);
  }, [restaurant]);

  const handleSave = async () => {
    if (!restaurant || !form) return;
    setSaving(true);
    try {
      const updated = await updateRestaurantSettings(restaurant.$id, form);
      setRestaurant(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your restaurant and account settings" />

      <Tabs defaultValue="restaurant">
        <TabsList>
          <TabsTrigger value="restaurant"><Building2 className="w-4 h-4 mr-2" />Restaurant</TabsTrigger>
          <TabsTrigger value="billing"><CreditCard className="w-4 h-4 mr-2" />Subscription</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-2" />Notifications</TabsTrigger>
          <TabsTrigger value="security"><Shield className="w-4 h-4 mr-2" />Security</TabsTrigger>
        </TabsList>

        <TabsContent value="restaurant" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
              <CardDescription>Update your restaurant details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Restaurant Name</Label>
                  <Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2"><Label>Email</Label>
                  <Input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Phone</Label>
                  <Input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="space-y-2"><Label>Currency</Label>
                  <Select value={form.currency || "USD"} onValueChange={(value) => setForm({ ...form, currency: value })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Address</Label>
                <Input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Tax Rate (%)</Label>
                  <Input type="number" step="0.1" value={form.tax_rate || 0} onChange={(e) => setForm({ ...form, tax_rate: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2"><Label>Service Charge (%)</Label>
                  <Input type="number" step="0.1" value={form.service_charge_rate || 0} onChange={(e) => setForm({ ...form, service_charge_rate: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="space-y-2"><Label>Cuisine Type</Label>
                <Input value={form.cuisine_type || ""} onChange={(e) => setForm({ ...form, cuisine_type: e.target.value })} placeholder="e.g., Italian, Indian" />
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>Manage your RestaurantOS subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { name: "Starter", price: "Free", features: ["1 location", "Basic POS", "Menu management"], current: form.subscription_plan === "starter" },
                  { name: "Pro", price: "$49/mo", features: ["Everything in Starter", "Inventory tracking", "Staff management", "Reports & analytics"], current: form.subscription_plan === "pro" },
                  { name: "Enterprise", price: "$99/mo", features: ["Everything in Pro", "AI insights", "Multi-location", "Loyalty program", "Priority support"], current: form.subscription_plan === "enterprise" },
                ].map((plan) => (
                  <Card key={plan.name} className={`relative ${plan.current ? "ring-2 ring-orange-500" : ""}`}>
                    {plan.current && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">Current Plan</span></div>}
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                      <p className="text-2xl font-bold text-orange-500 mt-1">{plan.price}</p>
                      <Separator className="my-4" />
                      <ul className="space-y-2">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-gray-600"><span className="text-green-500">&#x2713;</span>{feature}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {([
                { key: "lowStock" as const, title: "Low Stock Alerts", description: "Get notified when inventory items fall below minimum levels" },
                { key: "newOrder" as const, title: "New Order Alerts", description: "Receive notifications for new incoming orders" },
                { key: "dailyReport" as const, title: "Daily Report", description: "Receive a daily summary of sales and performance" },
                { key: "staffSchedule" as const, title: "Staff Schedule Updates", description: "Get notified about shift changes and schedule updates" },
              ]).map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div><p className="font-medium text-gray-900">{item.title}</p><p className="text-sm text-gray-500">{item.description}</p></div>
                  <Switch checked={notifications[item.key]} onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">Account security is managed through Appwrite Authentication. To change your password, use the password reset feature in the login page.</p>
              <div className="space-y-2"><Label>Email</Label><Input value={form.email || ""} disabled /></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
