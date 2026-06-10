'use client';

import { useEffect, useMemo, useState } from 'react';

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

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<InventoryItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [itemForm, setItemForm] = useState({
    name: '',
    quantity: '',
    unit: 'KG',
    lowStockLevel: '',
    supplierId: '',
  });
  const [supplierForm, setSupplierForm] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);

  const totalStockValue = useMemo(
    () => items.reduce((total, item) => total + Number(item.quantity), 0),
    [items],
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
    if (!itemForm.name || !itemForm.quantity || !itemForm.unit) return;
    await createInventoryItem({
      name: itemForm.name,
      quantity: Number(itemForm.quantity),
      unit: itemForm.unit,
      lowStockLevel: Number(itemForm.lowStockLevel || 0),
      supplierId: itemForm.supplierId || undefined,
    });
    setItemForm({
      name: '',
      quantity: '',
      unit: 'KG',
      lowStockLevel: '',
      supplierId: '',
    });
    await loadInventory();
  };

  const addSupplier = async () => {
    if (!supplierForm.name) return;
    await createSupplier({
      name: supplierForm.name,
      phone: supplierForm.phone || undefined,
      email: supplierForm.email || undefined,
    });
    setSupplierForm({ name: '', phone: '', email: '' });
    await loadInventory();
  };

  if (loading) return <div>Loading inventory...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Inventory Control</h1>
        <p className="mt-2 text-gray-500">
          Stock, suppliers, alerts, purchase orders, and analytics.
        </p>
      </div>

      <section className="grid gap-5 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-500">Tracked Items</p>
          <h2 className="mt-3 text-4xl font-bold">{items.length}</h2>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-500">Low Stock</p>
          <h2 className="mt-3 text-4xl font-bold text-red-600">{alerts.length}</h2>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-500">Suppliers</p>
          <h2 className="mt-3 text-4xl font-bold">{suppliers.length}</h2>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-500">Stock Units</p>
          <h2 className="mt-3 text-4xl font-bold">{totalStockValue}</h2>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold">Add Stock Item</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <input
              value={itemForm.name}
              onChange={(event) =>
                setItemForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Item name"
              className="rounded-xl border px-4 py-3"
            />
            <input
              value={itemForm.quantity}
              onChange={(event) =>
                setItemForm((current) => ({ ...current, quantity: event.target.value }))
              }
              placeholder="Quantity"
              type="number"
              className="rounded-xl border px-4 py-3"
            />
            <input
              value={itemForm.unit}
              onChange={(event) =>
                setItemForm((current) => ({ ...current, unit: event.target.value }))
              }
              placeholder="Unit"
              className="rounded-xl border px-4 py-3"
            />
            <input
              value={itemForm.lowStockLevel}
              onChange={(event) =>
                setItemForm((current) => ({
                  ...current,
                  lowStockLevel: event.target.value,
                }))
              }
              placeholder="Low stock level"
              type="number"
              className="rounded-xl border px-4 py-3"
            />
            <select
              value={itemForm.supplierId}
              onChange={(event) =>
                setItemForm((current) => ({
                  ...current,
                  supplierId: event.target.value,
                }))
              }
              className="rounded-xl border px-4 py-3 md:col-span-2"
            >
              <option value="">No supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={createItem}
            className="mt-5 rounded-xl bg-black px-6 py-3 font-semibold text-white"
          >
            Add Inventory
          </button>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold">Suppliers</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <input
              value={supplierForm.name}
              onChange={(event) =>
                setSupplierForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Supplier"
              className="rounded-xl border px-4 py-3"
            />
            <input
              value={supplierForm.phone}
              onChange={(event) =>
                setSupplierForm((current) => ({ ...current, phone: event.target.value }))
              }
              placeholder="Phone"
              className="rounded-xl border px-4 py-3"
            />
            <input
              value={supplierForm.email}
              onChange={(event) =>
                setSupplierForm((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="Email"
              className="rounded-xl border px-4 py-3"
            />
          </div>
          <button
            onClick={addSupplier}
            className="mt-5 rounded-xl bg-black px-6 py-3 font-semibold text-white"
          >
            Add Supplier
          </button>
          <div className="mt-5 space-y-3">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="rounded-xl bg-gray-100 px-4 py-3">
                <p className="font-semibold">{supplier.name}</p>
                <p className="text-sm text-gray-500">{supplier.phone || supplier.email}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold">Stock Ledger</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-3">Item</th>
                  <th>Qty</th>
                  <th>Unit</th>
                  <th>Low Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-4 font-medium">{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit}</td>
                    <td>{item.lowStockLevel}</td>
                    <td>
                      <button
                        onClick={() =>
                          void deductStock(item.id, 1).then(loadInventory)
                        }
                        className="rounded-lg bg-gray-900 px-3 py-2 text-sm text-white"
                      >
                        Deduct 1
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl bg-red-50 p-6 text-red-900">
            <h2 className="text-xl font-bold">Low Stock Alerts</h2>
            <div className="mt-4 space-y-3">
              {alerts.map((item) => (
                <div key={item.id} className="rounded-xl bg-white px-4 py-3">
                  {item.name}: {item.quantity} {item.unit}
                </div>
              ))}
              {!alerts.length && <p>No alerts right now.</p>}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold">Purchase Orders</h2>
            <div className="mt-4 space-y-3">
              {purchaseOrders.map((order) => (
                <div key={order.id} className="rounded-xl bg-gray-100 px-4 py-3">
                  <p className="font-medium">{order.status}</p>
                  <p className="text-sm text-gray-500">Rs. {order.totalAmount}</p>
                </div>
              ))}
              {!purchaseOrders.length && <p className="text-gray-500">No purchase orders.</p>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
