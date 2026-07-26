"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { useRestaurantStore } from "@/store/restaurant-store";
import { listCategories, listMenuItems, createCategory, createMenuItem, updateMenuItem, deleteMenuItem, deleteCategory } from "@/lib/database";
import type { Category, MenuItem } from "@/types";

export default function MenuPage() {
  const { restaurant } = useRestaurantStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!restaurant) return;
    try {
      const [c, m] = await Promise.all([
        listCategories(restaurant.$id),
        listMenuItems(restaurant.$id),
      ]);
      setCategories(c);
      setItems(m);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [restaurant]);

  useEffect(() => { load(); }, [load]);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !restaurant) return;
    try {
      const cat = await createCategory({
        restaurant_id: restaurant.$id,
        name: newCategoryName,
        description: newCategoryDesc,
        sort_order: categories.length + 1,
        is_active: true,
      });
      setCategories([...categories, cat]);
      setNewCategoryName("");
      setNewCategoryDesc("");
      setIsCategoryDialogOpen(false);
    } catch (e) { console.error(e); }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter((c) => c.$id !== id));
    } catch (e) { console.error(e); }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await updateMenuItem(item.$id, { is_available: !item.is_available });
      setItems(items.map((i) => i.$id === item.$id ? { ...i, is_available: !i.is_available } : i));
    } catch (e) { console.error(e); }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteMenuItem(id);
      setItems(items.filter((i) => i.$id !== id));
    } catch (e) { console.error(e); }
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.$id === categoryId)?.name || "Unknown";
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Menu Management"
        description="Manage your menu categories and items"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />Category
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => { setEditingItem(null); setIsItemDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />Add Item
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search menu items..." className="sm:max-w-xs" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.$id} value={cat.$id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredItems.length === 0 ? (
            <EmptyState title="No menu items found" description="Add your first menu item to get started" action={{ label: "Add Item", onClick: () => setIsItemDialogOpen(true) }} />
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.$id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500 max-w-[200px] truncate">{item.description}</p>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant="secondary">{getCategoryName(item.category_id)}</Badge></TableCell>
                        <TableCell className="font-medium">{formatCurrency(item.price)}</TableCell>
                        <TableCell className="text-gray-500">{formatCurrency(item.cost_price)}</TableCell>
                        <TableCell>
                          <StatusBadge status={item.is_available ? "available" : "unavailable"} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleToggleAvailability(item)}>
                              {item.is_available ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4 text-gray-400" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingItem(item); setIsItemDialogOpen(true); }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDeleteItem(item.$id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const itemCount = items.filter((i) => i.category_id === category.$id).length;
              return (
                <Card key={category.$id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">{itemCount} items</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600" onClick={() => handleDeleteCategory(category.$id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Category</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="e.g., Appetizers" />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea value={newCategoryDesc} onChange={(e) => setNewCategoryDesc(e.target.value)} placeholder="Short description" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
          </DialogHeader>
          <MenuForm
            editingItem={editingItem}
            categories={categories}
            restaurantId={restaurant?.$id || ""}
            onSuccess={async () => { setIsItemDialogOpen(false); await load(); }}
            onCancel={() => setIsItemDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MenuForm({ editingItem, categories, restaurantId, onSuccess, onCancel }: {
  editingItem: MenuItem | null;
  categories: Category[];
  restaurantId: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(editingItem?.name || "");
  const [description, setDescription] = useState(editingItem?.description || "");
  const [categoryId, setCategoryId] = useState(editingItem?.category_id || "");
  const [price, setPrice] = useState(String(editingItem?.price || ""));
  const [costPrice, setCostPrice] = useState(String(editingItem?.cost_price || ""));
  const [prepTime, setPrepTime] = useState(String(editingItem?.prep_time_minutes || ""));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name || !categoryId || !price) return;
    setSaving(true);
    try {
      const data = {
        restaurant_id: restaurantId,
        category_id: categoryId,
        name,
        description,
        price: parseFloat(price),
        cost_price: parseFloat(costPrice) || 0,
        prep_time_minutes: parseInt(prepTime) || 15,
        is_available: editingItem?.is_available ?? true,
        image_url: editingItem?.image_url || "",
        tags: editingItem?.tags || [],
      };
      if (editingItem) {
        await updateMenuItem(editingItem.$id, data);
      } else {
        await createMenuItem(data);
      }
      onSuccess();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Item Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Grilled Salmon" />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the dish" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.$id} value={cat.$id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Prep Time (min)</Label>
          <Input type="number" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} placeholder="15" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Selling Price</Label>
          <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
        </div>
        <div className="space-y-2">
          <Label>Cost Price</Label>
          <Input type="number" step="0.01" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} placeholder="0.00" />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : editingItem ? "Save Changes" : "Add Item"}
        </Button>
      </DialogFooter>
    </div>
  );
}
