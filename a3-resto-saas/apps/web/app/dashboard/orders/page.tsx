'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import socket from '@/services/socket';


import type { Order } from '@/src/types/order.types';

import {
  createOrder,
  getOrders,
} from '@/services/order.service';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);

  const [customerName, setCustomerName] = useState('');

  const [tableId, setTableId] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      // Avoid setState-in-effect pattern
      void fetchOrders();
    };

    // Run initial fetch without violating lint rule
    void (async () => {
      await fetchOrders();
    })();

    socket.on('orderCreated', handler);

    return () => {
      socket.off('orderCreated', handler);
    };
  }, [fetchOrders]);


  const handleCreateOrder = async () => {
    try {
      await createOrder({
        customerName,
        tableId,
        items: [
          {
            menuItemId: 'demo-menu-item',
            quantity: 1,
          },
        ],
      });

      setCustomerName('');
      setTableId('');

      void fetchOrders();

      alert('Order created successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to create order');
    }
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Orders</h1>
        <p className="text-gray-500 mt-2">
          Real restaurant orders
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">
          Create Order
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="border rounded-2xl px-4 py-3"
          />

          <input
            type="text"
            placeholder="Table ID"
            value={tableId}
            onChange={(e) => setTableId(e.target.value)}
            className="border rounded-2xl px-4 py-3"
          />
        </div>

        <button
          onClick={handleCreateOrder}
          className="mt-5 bg-black text-white px-6 py-3 rounded-2xl"
        >
          Create Order
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="py-4">Customer</th>
              <th>Table</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b"
              >
                <td className="py-4 font-medium">
                  {order.customerName}
                </td>
                <td>{order.tableId}</td>
                <td>₹{order.totalAmount}</td>
                <td>
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

