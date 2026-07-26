"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Circle, Loader2, AlertCircle, Database, Key } from "lucide-react";

interface Step {
  name: string;
  status: "pending" | "running" | "done" | "error";
  error?: string;
}

const collectionDefs = [
  { name: "restaurants", id: "restaurants", attrs: ["name:string:255", "owner_id:string:255", "address:string:500", "phone:string:50", "email:string:255", "logo_url:string:500", "currency:string:10", "currency_symbol:string:10", "tax_rate:float", "service_charge_rate:float", "subscription_plan:string:20", "is_active:boolean", "description:string:500", "cuisine_type:string:100", "website_url:string:500"] },
  { name: "categories", id: "categories", attrs: ["restaurant_id:string:255", "name:string:255", "description:string:500", "sort_order:integer", "is_active:boolean"] },
  { name: "menu_items", id: "menu_items", attrs: ["restaurant_id:string:255", "category_id:string:255", "name:string:255", "description:string:1000", "price:float", "cost_price:float", "image_url:string:500", "is_available:boolean", "prep_time_minutes:integer"] },
  { name: "orders", id: "orders", attrs: ["restaurant_id:string:255", "order_number:string:50", "type:string:20", "status:string:20", "table_number:string:10", "customer_name:string:255", "customer_phone:string:50", "subtotal:float", "tax_amount:float", "discount_amount:float", "total:float", "payment_status:string:20", "payment_method:string:20", "notes:string:500", "created_by:string:255"] },
  { name: "order_items", id: "order_items", attrs: ["order_id:string:255", "menu_item_id:string:255", "name:string:255", "quantity:integer", "unit_price:float", "total_price:float", "notes:string:500"] },
  { name: "inventory_items", id: "inventory_items", attrs: ["restaurant_id:string:255", "name:string:255", "category:string:50", "quantity:float", "unit:string:20", "min_stock_level:float", "cost_per_unit:float", "supplier_id:string:255", "last_restocked:string:20"] },
  { name: "suppliers", id: "suppliers", attrs: ["restaurant_id:string:255", "name:string:255", "contact_person:string:255", "phone:string:50", "email:string:255", "address:string:500", "is_active:boolean"] },
  { name: "staff", id: "staff", attrs: ["restaurant_id:string:255", "user_id:string:255", "name:string:255", "role:string:20", "phone:string:50", "pin:string:10", "hourly_rate:float", "is_active:boolean", "hire_date:string:20"] },
  { name: "transactions", id: "transactions", attrs: ["restaurant_id:string:255", "order_id:string:255", "type:string:20", "category:string:50", "amount:float", "description:string:500", "payment_method:string:20", "recorded_by:string:255", "transaction_date:string:20"] },
  { name: "customers", id: "customers", attrs: ["restaurant_id:string:255", "name:string:255", "phone:string:50", "email:string:255", "total_visits:integer", "total_spent:float", "loyalty_points:integer", "last_visit:string:20", "notes:string:1000"] },
  { name: "tables", id: "tables", attrs: ["restaurant_id:string:255", "number:integer", "capacity:integer", "status:string:20", "section:string:50", "current_order_id:string:255"] },
];

export default function SetupPage() {
  const [endpoint, setEndpoint] = useState(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "");
  const [projectId, setProjectId] = useState(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");
  const [apiKey, setApiKey] = useState("");
  const [databaseId, setDatabaseId] = useState(process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "");
  const [steps, setSteps] = useState<Step[]>(
    collectionDefs.map((c) => ({ name: c.name, status: "pending" }))
  );
  const [isRunning, setIsRunning] = useState(false);
  const [allDone, setAllDone] = useState(false);

  function updateStep(index: number, status: Step["status"], error?: string) {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, status, error } : s)));
  }

  async function apiCall(method: string, path: string, body?: Record<string, unknown>) {
    const res = await fetch(`${endpoint}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": projectId,
        "X-Appwrite-Key": apiKey,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || `HTTP ${res.status}`);
    }
    return res.json();
  }

  async function runSetup() {
    if (!apiKey.trim()) return;
    setIsRunning(true);
    setAllDone(false);

    for (let i = 0; i < collectionDefs.length; i++) {
      const col = collectionDefs[i];
      updateStep(i, "running");

      try {
        // Check if collection exists
        try {
          await apiCall("GET", `/databases/${databaseId}/collections/${col.id}`);
          updateStep(i, "done");
          continue;
        } catch {
          // doesn't exist, create
        }

        // Create collection
        await apiCall("POST", `/databases/${databaseId}/collections`, {
          collectionId: col.id,
          name: col.name,
          permissions: ["read(\"any\")", "write(\"any\")"],
        });

        // Wait a bit for collection to be ready
        await new Promise((r) => setTimeout(r, 500));

        // Create attributes
        for (const attrDef of col.attrs) {
          const [key, type, size] = attrDef.split(":");
          try {
            if (type === "string") {
              await apiCall("POST", `/databases/${databaseId}/collections/${col.id}/attributes/string`, {
                key, size: parseInt(size) || 255, required: false,
              });
            } else if (type === "integer") {
              await apiCall("POST", `/databases/${databaseId}/collections/${col.id}/attributes/integer`, {
                key, required: false,
              });
            } else if (type === "float") {
              await apiCall("POST", `/databases/${databaseId}/collections/${col.id}/attributes/float`, {
                key, required: false,
              });
            } else if (type === "boolean") {
              await apiCall("POST", `/databases/${databaseId}/collections/${col.id}/attributes/boolean`, {
                key, required: false,
              });
            }
          } catch {
            // attribute might already exist, continue
          }
        }

        updateStep(i, "done");
      } catch (err) {
        updateStep(i, "error", err instanceof Error ? err.message : "Unknown error");
      }
    }

    setIsRunning(false);
    setAllDone(true);
  }

  const doneCount = steps.filter((s) => s.status === "done").length;
  const errorCount = steps.filter((s) => s.status === "error").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Database Setup" description="Create all required Appwrite collections for RestaurantOS" />

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Database className="w-5 h-5" /> Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Appwrite Endpoint</Label><Input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} placeholder="https://sgp.cloud.appwrite.io/v1" /></div>
            <div className="space-y-2"><Label>Project ID</Label><Input value={projectId} onChange={(e) => setProjectId(e.target.value)} /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Database ID</Label><Input value={databaseId} onChange={(e) => setDatabaseId(e.target.value)} /></div>
            <div className="space-y-2"><Label className="flex items-center gap-1"><Key className="w-3 h-3" /> API Key (with databases.read/write scopes)</Label><Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Create one in Appwrite Console → API Keys" /></div>
          </div>
          <p className="text-xs text-gray-500">Go to Appwrite Console → API Keys → Create API Key with <code>databases.read</code> and <code>databases.write</code> scopes. Paste the key above.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Collections to Create ({collectionDefs.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            {steps.map((step) => (
            <div key={step.name} className="flex items-center gap-3">
              {step.status === "done" && <CheckCircle className="w-5 h-5 text-green-500" />}
              {step.status === "running" && <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />}
              {step.status === "error" && <AlertCircle className="w-5 h-5 text-red-500" />}
              {step.status === "pending" && <Circle className="w-5 h-5 text-gray-300" />}
              <span className="text-sm font-medium">{step.name}</span>
              {step.error && <span className="text-xs text-red-500 ml-auto">{step.error}</span>}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button className="bg-orange-500 hover:bg-orange-600" onClick={runSetup} disabled={isRunning || !apiKey.trim()}>
          {isRunning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
          {isRunning ? `Setting up... (${doneCount}/${collectionDefs.length})` : allDone ? "Re-run Setup" : "Run Setup"}
        </Button>
        {allDone && <p className="text-sm text-gray-600">{doneCount} done, {errorCount} errors</p>}
      </div>
    </div>
  );
}
