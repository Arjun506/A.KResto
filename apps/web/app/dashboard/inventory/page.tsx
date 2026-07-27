'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Package,
  AlertTriangle,
  Truck,
  FileText,
  Plus,
  Search,
  Check,
  X,
  Trash2,
  TrendingDown,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

import {
  createInventoryItem,
  createSupplier,
  deductStock,
  getInventoryItems,
  getLowStockAlerts,
  getPurchaseOrders,
  getSuppliers,
} from '@/services/inventory.service';
import type { InventoryItem, PurchaseOrder, Supplier } from '@/src/types/inventory.types';

// Let's enhance PurchaseOrder local type to support items, approval status, etc.
interface EnhancedPurchaseOrder {
  id: string;
  supplierName: string;
  items: string;
  totalAmount: number;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'RECEIVED' | 'CANCELLED';
  requestedBy: string;
  date: string;
}

interface WastageLog {
  id: string;
  itemName: string;
  quantity: number;
  unit: string;
  cost: number;
  reason: 'EXPIRED' | 'SPOILED' | 'SPILLED';
  loggedAt: string;
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<InventoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'stock' | 'purchases' | 'suppliers' | 'wastage'>('stock');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom mock interactive states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Forms
  const [itemForm, setItemForm] = useState({
    name: '',
    quantity: '',
    unit: 'KG',
    lowStockLevel: '10',
    supplierId: '',
  });

  const [supplierForm, setSupplierForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const [wastageForm, setWastageForm] = useState({
    itemId: '',
    quantity: '',
    reason: 'SPOILED' as 'EXPIRED' | 'SPOILED' | 'SPILLED',
    cost: '',
  });

  const [prForm, setPrForm] = useState({
    itemName: '',
    quantity: '',
    supplierId: '',
    cost: '',
  });

  // Wastage Log state
  const [wastageLogs, setWastageLogs] = useState<WastageLog[]>([
    { id: 'w1', itemName: 'Fresh Whole Milk', quantity: 5, unit: 'Liters', cost: 320, reason: 'EXPIRED', loggedAt: '2026-06-13' },
    { id: 'w2', itemName: 'Red Tomatoes', quantity: 8, unit: 'KG', cost: 480, reason: 'SPOILED', loggedAt: '2026-06-14' },
    { id: 'w3', itemName: 'Cooking Oil Premium', quantity: 2, unit: 'Liters', cost: 360, reason: 'SPILLED', loggedAt: '2026-06-12' },
  ]);

  // Enhanced Purchase Orders
  const [enhancedPRs, setEnhancedPRs] = useState<EnhancedPurchaseOrder[]>([
    { id: 'pr1', supplierName: 'Metro Whole Foods', items: 'Basmati Rice Premium (50kg)', totalAmount: 4800, status: 'PENDING_APPROVAL', requestedBy: 'Chef Sanjay', date: '2026-06-14' },
    { id: 'pr2', supplierName: 'Standard Dairy Supplier', items: 'Paneer Block 20kg, Butter 10kg', totalAmount: 8500, status: 'APPROVED', requestedBy: 'Chef Sanjay', date: '2026-06-13' },
    { id: 'pr3', supplierName: 'Local Greens Market', items: 'Tomatoes 30kg, Onions 50kg, Capsicum 10kg', totalAmount: 2600, status: 'RECEIVED', requestedBy: 'Manager Rohan', date: '2026-06-12' },
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalStockValue = useMemo(
    () => items.reduce((total, item) => total + Number(item.quantity), 0),
    [items],
  );

  const totalWastageCost = useMemo(
    () => wastageLogs.reduce((sum, item) => sum + item.cost, 0),
    [wastageLogs],
  );

  const loadInventory = async () => {
    try {
      const [nextItems, nextAlerts, nextSuppliers, nextPurchaseOrders] =
        await Promise.all([
          getInventoryItems(),
          getLowStockAlerts(),
          getSuppliers(),
          getPurchaseOrders(),
        ]);
      setItems(nextItems);
      setAlerts(nextAlerts);
      setSuppliers(nextSuppliers);
      setPurchaseOrders(nextPurchaseOrders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await loadInventory();
    })();
  }, []);

  const createItem = async () => {
    if (!itemForm.name || !itemForm.quantity || !itemForm.unit) {
      triggerToast('Please fill out name, quantity, and unit');
      return;
    }
    try {
      await createInventoryItem({
        name: itemForm.name,
        quantity: Number(itemForm.quantity),
        unit: itemForm.unit,
        lowStockLevel: Number(itemForm.lowStockLevel || 0),
        supplierId: itemForm.supplierId || undefined,
      });
      triggerToast(`${itemForm.name} added to stock!`);
      setItemForm({
        name: '',
        quantity: '',
        unit: 'KG',
        lowStockLevel: '10',
        supplierId: '',
      });
      await loadInventory();
    } catch (error) {
      console.error(error);
      triggerToast('Error adding item.');
    }
  };

  const addSupplier = async () => {
    if (!supplierForm.name) {
      triggerToast('Please provide a supplier name');
      return;
    }
    try {
      await createSupplier({
        name: supplierForm.name,
        phone: supplierForm.phone || undefined,
        email: supplierForm.email || undefined,
        address: supplierForm.address || undefined,
      });
      triggerToast(`Supplier ${supplierForm.name} created!`);
      setSupplierForm({ name: '', phone: '', email: '', address: '' });
      await loadInventory();
    } catch (error) {
      console.error(error);
      triggerToast('Error adding supplier.');
    }
  };

  // Create Purchase Request
  const createPurchaseRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prForm.itemName || !prForm.quantity || !prForm.supplierId) {
      triggerToast('Fill in all required fields.');
      return;
    }
    const supName = suppliers.find(s => s.id === prForm.supplierId)?.name || 'Generic Supplier';
    const newPr: EnhancedPurchaseOrder = {
      id: 'pr_' + Math.random().toString(36).substr(2, 9),
      supplierName: supName,
      items: `${prForm.itemName} (${prForm.quantity})`,
      totalAmount: Number(prForm.cost || 0),
      status: 'PENDING_APPROVAL',
      requestedBy: 'Head Chef',
      date: new Date().toISOString().slice(0, 10),
    };
    setEnhancedPRs([newPr, ...enhancedPRs]);
    setPrForm({ itemName: '', quantity: '', supplierId: '', cost: '' });
    triggerToast('Purchase request sent to Owner/Manager dashboard!');
  };

  // PR Actions
  const approvePR = (id: string) => {
    setEnhancedPRs(prev =>
      prev.map(pr => (pr.id === id ? { ...pr, status: 'APPROVED' } : pr))
    );
    triggerToast('Purchase request approved! Sent to supplier.');
  };

  const rejectPR = (id: string) => {
    setEnhancedPRs(prev =>
      prev.map(pr => (pr.id === id ? { ...pr, status: 'CANCELLED' } : pr))
    );
    triggerToast('Purchase request cancelled.');
  };

  const receivePR = (id: string, itemsDesc: string) => {
    setEnhancedPRs(prev =>
      prev.map(pr => (pr.id === id ? { ...pr, status: 'RECEIVED' } : pr))
    );
    triggerToast('Stock received and auto-updated in system inventory!');
    
    // Simulate auto updating matching item in inventory
    const regex = /^([^(]+)/;
    const match = itemsDesc.match(regex);
    if (match) {
      const parsedItemName = match[1].trim();
      const existing = items.find(i => i.name.toLowerCase().includes(parsedItemName.toLowerCase()));
      if (existing) {
        // Quantities are typically decimals as strings
        const nextQty = Number(existing.quantity) + 50; // default simulate 50 units
        triggerToast(`Auto-incremented ${existing.name} stock by 50 units.`);
      }
    }
  };

  // Log Wastage Action
  const logWastage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wastageForm.itemId || !wastageForm.quantity) {
      triggerToast('Please pick an item and enter quantity.');
      return;
    }
    const targetItem = items.find(i => i.id === wastageForm.itemId);
    if (!targetItem) return;

    const newLog: WastageLog = {
      id: 'w_' + Math.random().toString(36).substr(2, 9),
      itemName: targetItem.name,
      quantity: Number(wastageForm.quantity),
      unit: targetItem.unit,
      cost: Number(wastageForm.cost || 0),
      reason: wastageForm.reason,
      loggedAt: new Date().toISOString().slice(0, 10),
    };

    setWastageLogs([newLog, ...wastageLogs]);
    
    // Deduct from real DB / mock state
    void deductStock(targetItem.id, Number(wastageForm.quantity)).then(() => {
      void loadInventory();
      triggerToast(`Wastage logged. Deducted ${wastageForm.quantity} ${targetItem.unit} from stock.`);
    });

    setWastageForm({ itemId: '', quantity: '', reason: 'SPOILED', cost: '' });
  };

  const filteredItems = useMemo(() => {
    return items.filter(i =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [items, searchQuery]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <span className="text-gray-500 font-medium">Loading inventory control...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory & Procurement</h1>
          <p className="text-sm text-slate-500">
            Real-time stock ledger, wastage tracking, supplier index, and purchase order request approval routing.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit self-start">
          <button
            onClick={() => setActiveTab('stock')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'stock'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="h-3.5 w-3.5" />
            Stock Ledger
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'purchases'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            Purchasing Flow
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'suppliers'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Truck className="h-3.5 w-3.5" />
            Supplier Directory
          </button>
          <button
            onClick={() => setActiveTab('wastage')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'wastage'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <TrendingDown className="h-3.5 w-3.5" />
            Wastage Log
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Items</span>
            <span className="rounded-full bg-indigo-50 p-1.5 text-indigo-600">
              <Package className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{items.length}</span>
            <span className="text-xs text-slate-400">tracked raw items</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock Warnings</span>
            <span className="rounded-full bg-rose-50 p-1.5 text-rose-600">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600">{alerts.length}</span>
            <span className="text-xs text-slate-400">items need reorder</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Wastage This Month</span>
            <span className="rounded-full bg-amber-50 p-1.5 text-amber-600">
              <TrendingDown className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">₹{totalWastageCost}</span>
            <span className="text-xs text-slate-400">loss cost</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Suppliers Logged</span>
            <span className="rounded-full bg-emerald-50 p-1.5 text-emerald-600">
              <Truck className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{suppliers.length}</span>
            <span className="text-xs text-slate-400">verified suppliers</span>
          </div>
        </div>
      </div>

      {/* 1. STOCK LEDGER VIEW */}
      {activeTab === 'stock' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          
          {/* Main Stock Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 p-4 bg-slate-50/70 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  placeholder="Search stock..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 bg-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase bg-slate-50/30">
                    <th className="px-6 py-3">Raw Item</th>
                    <th className="px-6 py-3">Current Stock</th>
                    <th className="px-6 py-3">Unit</th>
                    <th className="px-6 py-3">Min threshold</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Quick Stock Deduct</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredItems.map((item) => {
                    const isLow = Number(item.quantity) <= Number(item.lowStockLevel);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                        <td className="px-6 py-4 font-semibold text-slate-800">{item.quantity}</td>
                        <td className="px-6 py-4 text-slate-500">{item.unit}</td>
                        <td className="px-6 py-4 text-slate-400">Min {item.lowStockLevel} {item.unit}</td>
                        <td className="px-6 py-4">
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700">
                              <AlertTriangle className="h-3 w-3" />
                              Low Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                              Healthy
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => void deductStock(item.id, 1).then(loadInventory).then(() => triggerToast(`Deducted 1 ${item.unit} from ${item.name}`))}
                            className="rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200/60 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors"
                          >
                            Deduct 1
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Stock Item Form */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm self-start">
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Add Raw Ingredient</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Item Name *</label>
                <input
                  value={itemForm.name}
                  onChange={(e) => setItemForm(c => ({ ...c, name: e.target.value }))}
                  placeholder="e.g. Basmati Rice, Chicken Breast"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Initial Qty *</label>
                  <input
                    value={itemForm.quantity}
                    onChange={(e) => setItemForm(c => ({ ...c, quantity: e.target.value }))}
                    type="number"
                    placeholder="100"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Unit *</label>
                  <select
                    value={itemForm.unit}
                    onChange={(e) => setItemForm(c => ({ ...c, unit: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white text-slate-700"
                  >
                    <option value="KG">KG</option>
                    <option value="Liters">Liters</option>
                    <option value="Grams">Grams</option>
                    <option value="Pieces">Pieces</option>
                    <option value="Boxes">Boxes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Reorder Trigger Limit</label>
                <input
                  value={itemForm.lowStockLevel}
                  onChange={(e) => setItemForm(c => ({ ...c, lowStockLevel: e.target.value }))}
                  type="number"
                  placeholder="10"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Primary Supplier</label>
                <select
                  value={itemForm.supplierId}
                  onChange={(e) => setItemForm(c => ({ ...c, supplierId: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white text-slate-700"
                >
                  <option value="">No supplier assigned</option>
                  {suppliers.map((sup) => (
                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={createItem}
                className="mt-2 w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white py-2 text-sm font-semibold transition-colors shadow-sm"
              >
                Log Item to Inventory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PURCHASING WORKFLOW TAB */}
      {activeTab === 'purchases' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          
          {/* Purchase Requests List */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Purchase Orders & Approval Routing</h2>
            
            <div className="space-y-4">
              {enhancedPRs.map((pr) => (
                <div key={pr.id} className="border border-slate-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-slate-900">PR-{pr.id.toUpperCase()}</span>
                      <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                        pr.status === 'PENDING_APPROVAL'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : pr.status === 'APPROVED'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : pr.status === 'RECEIVED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-50 text-slate-400'
                      }`}>
                        {pr.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-700 mt-1">{pr.items}</p>
                    <div className="flex gap-4 text-xs text-slate-500 mt-0.5">
                      <span>Supplier: <strong>{pr.supplierName}</strong></span>
                      <span>By: {pr.requestedBy}</span>
                      <span>Date: {pr.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-slate-900 mr-2">₹{pr.totalAmount}</span>
                    
                    {pr.status === 'PENDING_APPROVAL' && (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => approvePR(pr.id)}
                          className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5"
                        >
                          Approve PR
                        </button>
                        <button
                          onClick={() => rejectPR(pr.id)}
                          className="rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 p-1.5"
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {pr.status === 'APPROVED' && (
                      <button
                        onClick={() => receivePR(pr.id, pr.items)}
                        className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5"
                      >
                        Receive Stock
                      </button>
                    )}

                    {pr.status === 'RECEIVED' && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        In Stock
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Purchase Request Form */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm self-start">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3">Chef Purchase Request</h3>
            
            <form onSubmit={createPurchaseRequest} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Item Description</label>
                <input
                  value={prForm.itemName}
                  onChange={(e) => setPrForm(c => ({ ...c, itemName: e.target.value }))}
                  placeholder="e.g. Basmati Rice Premium 50kg"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Quantity</label>
                  <input
                    value={prForm.quantity}
                    onChange={(e) => setPrForm(c => ({ ...c, quantity: e.target.value }))}
                    placeholder="e.g. 5 bags"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Estimated Cost</label>
                  <input
                    value={prForm.cost}
                    onChange={(e) => setPrForm(c => ({ ...c, cost: e.target.value }))}
                    placeholder="e.g. 4800"
                    type="number"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Supplier Selection</label>
                <select
                  value={prForm.supplierId}
                  onChange={(e) => setPrForm(c => ({ ...c, supplierId: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white text-slate-700"
                >
                  <option value="">Select target supplier</option>
                  {suppliers.map((sup) => (
                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white py-2 text-sm font-semibold transition-colors shadow-sm"
              >
                Send Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. SUPPLIER DIRECTORY TAB */}
      {activeTab === 'suppliers' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          
          {/* Suppliers Cards Layout */}
          <div className="grid gap-4 sm:grid-cols-2">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-950 mb-1">{supplier.name}</h3>
                  <div className="space-y-1 text-xs text-slate-500">
                    <p>Phone: <strong className="text-slate-700">{supplier.phone || 'N/A'}</strong></p>
                    <p>Email: <strong className="text-slate-700">{supplier.email || 'N/A'}</strong></p>
                    <p>Address: <strong className="text-slate-700">{supplier.address || 'N/A'}</strong></p>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                    Active Partner
                  </span>
                  <button
                    onClick={() => triggerToast(`Contacting ${supplier.name} via Email...`)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    Place Purchase Order
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Supplier Form */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm self-start">
            <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Add Supplier Partner</h2>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Company Name *</label>
                <input
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm(c => ({ ...c, name: e.target.value }))}
                  placeholder="e.g. Standard Dairy Foods"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Contact Phone</label>
                <input
                  value={supplierForm.phone}
                  onChange={(e) => setSupplierForm(c => ({ ...c, phone: e.target.value }))}
                  placeholder="Phone number"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Email</label>
                <input
                  value={supplierForm.email}
                  onChange={(e) => setSupplierForm(c => ({ ...c, email: e.target.value }))}
                  placeholder="email@supplier.com"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Business Address</label>
                <input
                  value={supplierForm.address}
                  onChange={(e) => setSupplierForm(c => ({ ...c, address: e.target.value }))}
                  placeholder="City Wholesale Market"
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                onClick={addSupplier}
                className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white py-2 text-sm font-semibold transition-colors shadow-sm"
              >
                Register Supplier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. WASTAGE LOG VIEW */}
      {activeTab === 'wastage' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          
          {/* Wastage Logs Table */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase bg-slate-50/30">
                    <th className="px-6 py-3">Wasted Item</th>
                    <th className="px-6 py-3">Logged Date</th>
                    <th className="px-6 py-3">Quantity</th>
                    <th className="px-6 py-3">Reason</th>
                    <th className="px-6 py-3 text-right">Estimated Loss Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {wastageLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{log.itemName}</td>
                      <td className="px-6 py-4 text-slate-500">{log.loggedAt}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">{log.quantity} {log.unit}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold rounded px-2 py-0.5 ${
                          log.reason === 'EXPIRED'
                            ? 'bg-amber-100 text-amber-800'
                            : log.reason === 'SPOILED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {log.reason}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-extrabold text-rose-600">₹{log.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Wastage Logger Form */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm self-start">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-3">Log Kitchen Wastage</h3>
            <form onSubmit={logWastage} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Pick Inventory Item</label>
                <select
                  value={wastageForm.itemId}
                  onChange={(e) => setWastageForm(c => ({ ...c, itemId: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white text-slate-700"
                >
                  <option value="">Select stock item</option>
                  {items.map((it) => (
                    <option key={it.id} value={it.id}>{it.name} (In stock: {it.quantity} {it.unit})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Wasted Qty</label>
                  <input
                    value={wastageForm.quantity}
                    onChange={(e) => setWastageForm(c => ({ ...c, quantity: e.target.value }))}
                    type="number"
                    placeholder="e.g. 2"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Estimated Cost (₹)</label>
                  <input
                    value={wastageForm.cost}
                    onChange={(e) => setWastageForm(c => ({ ...c, cost: e.target.value }))}
                    type="number"
                    placeholder="e.g. 150"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Reason for Wastage</label>
                <select
                  value={wastageForm.reason}
                  onChange={(e) => setWastageForm(c => ({ ...c, reason: e.target.value as any }))}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white text-slate-700"
                >
                  <option value="SPOILED">Spoiled / Rotten</option>
                  <option value="EXPIRED">Passed Expiry Date</option>
                  <option value="SPILLED">Spilled / Dropped</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-rose-600 hover:bg-rose-700 text-white py-2 text-sm font-semibold transition-colors shadow-sm"
              >
                Log Wastage & Deduct
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

