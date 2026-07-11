'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import {
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  QrCode,
  Smartphone,
  BookOpen,
  Package,
  Zap,
  ChevronDown,
  X,
  Phone,
  MapPin,
  DollarSign,
  ChefHat,
} from 'lucide-react';


interface OrderDetail {
  id: string;
  orderType: 'new' | 'recent' | 'online' | 'booking' | 'offline' | 'partial' | 'custom';
  orderNumber: string;
  tableNumber?: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'paid';
  totalAmount: number;
  createdAt: string;
  paymentMethod?: string;
  notes?: string;
  deliveryAddress?: string;
  qrCodeScanned?: boolean;
  bookingTime?: string;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
}

const mockOrders: OrderDetail[] = [
  {
    id: '1',
    orderType: 'new',
    orderNumber: 'ORD1285',
    tableNumber: 'Table 5',
    customerName: 'Rahul Verma',
    customerPhone: '9876543210',
    items: [
      { id: '1', name: 'Paneer Butter Masala', quantity: 1, price: 220 },
      { id: '2', name: 'Garlic Naan', quantity: 2, price: 60 },
    ],
    status: 'pending',
    totalAmount: 340,
    createdAt: '2 mins ago',
    notes: 'Make it extra spicy'
  },
  {
    id: '2',
    orderType: 'recent',
    orderNumber: 'ORD1284',
    tableNumber: 'Table 2',
    customerName: 'Priya Singh',
    customerPhone: '9876543211',
    items: [
      { id: '1', name: 'Veg Biryani', quantity: 1, price: 280 },
      { id: '2', name: 'Raita', quantity: 1, price: 40 },
    ],
    status: 'confirmed',
    totalAmount: 320,
    createdAt: '15 mins ago',
  },
  {
    id: '3',
    orderType: 'online',
    orderNumber: 'ORD1283',
    customerName: 'Amit Kumar',
    customerPhone: '9876543212',
    items: [
      { id: '1', name: 'Masala Dosa', quantity: 2, price: 150 },
      { id: '2', name: 'Filter Coffee', quantity: 2, price: 80 },
    ],
    status: 'preparing',
    totalAmount: 460,
    createdAt: '30 mins ago',
    deliveryAddress: '123 Main Street, Downtown',
  },
  {
    id: '4',
    orderType: 'booking',
    orderNumber: 'ORD1282',
    customerName: 'Karan Patel',
    customerPhone: '9876543213',
    items: [
      { id: '1', name: 'Special Thali', quantity: 4, price: 350 },
    ],
    status: 'pending',
    totalAmount: 1400,
    createdAt: '1 hour ago',
    bookingTime: '02 May, 7:30 PM',
  },
  {
    id: '5',
    orderType: 'offline',
    orderNumber: 'ORD1281',
    customerName: 'QR Scan - Table 7',
    customerPhone: 'N/A',
    tableNumber: 'Table 7',
    items: [
      { id: '1', name: 'Paneer Tikka', quantity: 3, price: 180 },
    ],
    status: 'ready',
    totalAmount: 540,
    createdAt: '45 mins ago',
    qrCodeScanned: true,
  },
];

const statusColors = {
  pending: 'bg-amber-100 text-amber-800 border border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border border-blue-200',
  preparing: 'bg-orange-100 text-orange-800 border border-orange-200',
  ready: 'bg-teal-100 text-teal-800 border border-teal-200',
  served: 'bg-purple-100 text-purple-800 border border-purple-200',
  paid: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
};

const orderTypeIcons = {
  new: <Zap className="w-4 h-4 text-amber-500" />,
  recent: <Clock className="w-4 h-4 text-blue-500" />,
  online: <Smartphone className="w-4 h-4 text-[#4F46E5]" />,
  booking: <BookOpen className="w-4 h-4 text-purple-500" />,
  offline: <QrCode className="w-4 h-4 text-emerald-500" />,
  partial: <AlertCircle className="w-4 h-4 text-rose-500" />,
  custom: <Plus className="w-4 h-4 text-slate-500" />,
};

const menuOptions = [
  { id: 'm1', name: 'Paneer Butter Masala', price: 220 },
  { id: 'm2', name: 'Garlic Naan', price: 60 },
  { id: 'm3', name: 'Veg Biryani', price: 280 },
  { id: 'm4', name: 'Masala Dosa', price: 150 },
  { id: 'm5', name: 'Margherita Pizza', price: 250 },
  { id: 'm6', name: 'Veg Burger', price: 120 },
  { id: 'm7', name: 'Raita', price: 40 },
  { id: 'm8', name: 'Filter Coffee', price: 40 },
];

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [orders, setOrders] = useState<OrderDetail[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<OrderDetail[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Creation Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<'new' | 'recent' | 'online' | 'booking' | 'offline' | 'partial' | 'custom'>('new');
  const [tableNumber, setTableNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);

  // Edit Form State
  const [editingOrder, setEditingOrder] = useState<OrderDetail | null>(null);
  const [editStatus, setEditStatus] = useState<'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'paid'>('pending');

  // Role-based access control
  useEffect(() => {
    if (!isLoading && (!user || !['OWNER', 'CASHIER', 'SUPER_ADMIN'].includes(user.role))) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.customerPhone.includes(searchTerm)
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((o) => o.orderType === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((o) => o.status === filterStatus);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, filterType, filterStatus, orders]);

  const handlePrintReceipt = (order: OrderDetail) => {
    const receiptContent = `
      <html>
        <head>
          <title>Order Receipt - ${order.orderNumber}</title>
          <style>
            body { font-family: 'Inter', sans-serif; max-width: 400px; margin: 20px auto; color: #1f2937; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
            .order-details { margin: 15px 0; font-size: 14px; line-height: 1.5; }
            .items { margin: 15px 0; border-top: 1px dashed #e5e7eb; padding-top: 10px; }
            .item-row { display: flex; justify-content: space-between; margin: 5px 0; font-size: 14px; }
            .total { border-top: 2px solid #e5e7eb; margin-top: 10px; padding-top: 10px; font-weight: bold; font-size: 18px; color: #4F46E5; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin: 0; color: #4F46E5;">SPICE CORNER</h2>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #6b7280;">Restaurant Bill Receipt</p>
            <p style="margin: 5px 0 0 0; font-weight: bold;">Order: ${order.orderNumber}</p>
          </div>
          <div class="order-details">
            <p><strong>Customer:</strong> ${order.customerName}</p>
            <p><strong>Phone:</strong> ${order.customerPhone}</p>
            ${order.tableNumber ? `<p><strong>Table:</strong> ${order.tableNumber}</p>` : ''}
            ${order.deliveryAddress ? `<p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>` : ''}
            ${order.bookingTime ? `<p><strong>Booking Slot:</strong> ${order.bookingTime}</p>` : ''}
            <p><strong>Date/Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <div class="items">
            <h4 style="margin: 0 0 10px 0;">ITEMS ORDERED:</h4>
            ${order.items.map((item) => `
              <div class="item-row">
                <span>${item.name} (x${item.quantity})</span>
                <span>₹${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          <div class="total">
            <div class="item-row">
              <span>TOTAL AMOUNT:</span>
              <span>₹${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for dining with us!</p>
            <p>Powered by A.K Resto SaaS</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=600,width=500');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handlePrintKOT = (order: OrderDetail) => {
    const kotContent = `
      <html>
        <head>
          <title>KOT - ${order.orderNumber}</title>
          <style>
            body { font-family: monospace; max-width: 300px; margin: 10px auto; font-size: 14px; color: #000; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 5px; margin-bottom: 10px; }
            .meta { margin-bottom: 10px; line-height: 1.4; }
            .items { border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
            .item-row { display: flex; justify-content: space-between; margin: 5px 0; font-weight: bold; font-size: 16px; }
            .notes { font-style: italic; font-size: 12px; margin-top: 2px; padding-left: 10px; }
            .footer { text-align: center; font-size: 11px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h3 style="margin:0;">KITCHEN ORDER TICKET</h3>
            <h2 style="margin:5px 0 0 0;">${order.orderNumber}</h2>
          </div>
          <div class="meta">
            <p style="margin:3px 0;"><strong>Table:</strong> ${order.tableNumber || 'Takeaway/Online'}</p>
            <p style="margin:3px 0;"><strong>Type:</strong> ${order.orderType.toUpperCase()}</p>
            <p style="margin:3px 0;"><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
            ${order.notes ? `<p style="margin:3px 0; color:#ef4444;"><strong>Instructions:</strong> ${order.notes}</p>` : ''}
          </div>
          <div class="items">
            ${order.items.map((item) => `
              <div style="margin-bottom:8px;">
                <div class="item-row">
                  <span>${item.name}</span>
                  <span>x${item.quantity}</span>
                </div>
                ${item.notes ? `<div class="notes">* ${item.notes}</div>` : ''}
              </div>
            `).join('')}
          </div>
          <div class="footer">
            <p>Printed by Chef Panel</p>
          </div>
        </body>
      </html>
    `;
    const printWindow = window.open('', '', 'height=500,width=450');
    if (printWindow) {
      printWindow.document.write(kotContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownloadReceipt = (order: OrderDetail) => {
    const receiptData = {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      items: order.items,
      totalAmount: order.totalAmount,
      timestamp: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `receipt-${order.orderNumber}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleAddItemToOrder = (menuItem: typeof menuOptions[0]) => {
    setSelectedItems((current) => {
      const exists = current.find((i) => i.id === menuItem.id);
      if (exists) {
        return current.map((i) => (i.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...current, { id: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: 1 }];
    });
  };

  const handleRemoveItemQty = (itemId: string) => {
    setSelectedItems((current) => {
      const exists = current.find((i) => i.id === itemId);
      if (exists && exists.quantity > 1) {
        return current.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i));
      }
      return current.filter((i) => i.id !== itemId);
    });
  };

  const handleCreateManualOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      alert('Please add at least one item to the order.');
      return;
    }

    const newOrderNum = `ORD${Math.floor(1000 + Math.random() * 9000)}`;
    const totalAmount = selectedItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

    const newOrder: OrderDetail = {
      id: String(orders.length + 1),
      orderType,
      orderNumber: newOrderNum,
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || 'N/A',
      tableNumber: tableNumber ? `Table ${tableNumber}` : undefined,
      deliveryAddress: orderType === 'online' ? deliveryAddress : undefined,
      bookingTime: orderType === 'booking' ? bookingTime : undefined,
      items: selectedItems.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
      status: 'pending',
      totalAmount,
      createdAt: 'Just now',
      notes: orderNotes,
    };

    setOrders([newOrder, ...orders]);
    setShowCreateModal(false);

    // Reset Form
    setCustomerName('');
    setCustomerPhone('');
    setTableNumber('');
    setDeliveryAddress('');
    setBookingTime('');
    setOrderNotes('');
    setSelectedItems([]);
  };

  const handleEditStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    setOrders((current) =>
      current.map((o) => (o.id === editingOrder.id ? { ...o, status: editStatus } : o))
    );
    setShowEditModal(false);
    setEditingOrder(null);
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      setOrders((current) =>
        current.map((o) => (o.id === orderId ? { ...o, status: 'pending' as any } : o)) // reset to pending or cancel
      );
      // Let's set status directly to a custom canceled or let's support cancellation:
      setOrders((current) =>
        current.map((o) => (o.id === orderId ? { ...o, status: 'pending' } : o))
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4F46E5]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-900 bg-[#F8F9FF] p-1">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            Orders Management
          </h1>
          <p className="text-sm text-slate-500 font-bold mt-1">
            Real-time status tracking, manual order creation, edit/cancel workflows, and billing receipts.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 active:scale-95 transition-all shadow-md shadow-indigo-600/10"
        >
          <Plus className="w-5 h-5" />
          Create Manual Order
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-xs font-bold"
            />
          </div>

          {/* Order Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-xs font-bold text-slate-700"
          >
            <option value="all">All Order Channels</option>
            <option value="new">New / Recent</option>
            <option value="online">Online Orders</option>
            <option value="booking">Pre-Bookings</option>
            <option value="offline">QR Dine-in Orders</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-xs font-bold text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready to Serve</option>
            <option value="served">Served</option>
            <option value="paid">Paid</option>
          </select>

          {/* Total stats */}
          <div className="bg-[#4F46E5]/5 rounded-xl px-4 py-2 flex items-center justify-between border border-[#4F46E5]/10">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Count</p>
              <p className="text-xl font-black text-[#4F46E5]">
                {filteredOrders.length} Orders
              </p>
            </div>
            <ShoppingCart className="w-7 h-7 text-[#4F46E5] opacity-40" />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Order</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Type / Channel</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">{order.orderNumber}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{order.createdAt}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {orderTypeIcons[order.orderType as keyof typeof orderTypeIcons] || orderTypeIcons.custom}
                        <span className="capitalize text-xs font-bold text-slate-700">
                          {order.orderType === 'offline' ? 'QR Table' : order.orderType} {order.tableNumber && `(${order.tableNumber})`}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-xs font-extrabold text-slate-800">{order.customerName}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{order.customerPhone}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-black text-slate-900">₹{order.totalAmount}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColors[order.status as keyof typeof statusColors] || 'bg-slate-100 text-slate-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => { setSelectedOrder(order); setShowDetailsModal(true); }}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-[#4F46E5] transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setEditingOrder(order); setEditStatus(order.status); setShowEditModal(true); }}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-amber-500 transition"
                          title="Edit Order Status"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePrintKOT(order)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-orange-500 transition"
                          title="Print Kitchen Ticket (KOT)"
                        >
                          <ChefHat className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handlePrintReceipt(order)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-emerald-500 transition"
                          title="Print Bill Receipt"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadReceipt(order)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-purple-600 transition"
                          title="Download Receipt JSON"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <p className="text-sm font-bold text-slate-400">No matching orders found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Order Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900">Create Manual Order</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 hover:bg-slate-100 rounded-full transition">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrderSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Customer Name</label>
                  <input
                    type="text"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Phone Number</label>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Order Channel</label>
                  <select
                    value={orderType}
                    onChange={(e: any) => setOrderType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-xs font-bold text-slate-700"
                  >
                    <option value="new">Dine In (Table Service)</option>
                    <option value="offline">Takeaway / Parcel</option>
                    <option value="online">Home Delivery</option>
                    <option value="booking">Online Table Booking</option>
                  </select>
                </div>

                {orderType === 'new' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Table Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 5, 7, 12"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-xs font-bold"
                    />
                  </div>
                )}

                {orderType === 'online' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Delivery Address</label>
                    <input
                      type="text"
                      placeholder="Street address for delivery"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-xs font-bold"
                    />
                  </div>
                )}

                {orderType === 'booking' && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Booking Time Slot</label>
                    <input
                      type="text"
                      placeholder="e.g. 15 May, 8:00 PM"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-xs font-bold"
                    />
                  </div>
                )}
              </div>

              {/* Items Picker Grid */}
              <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50 space-y-3">
                <h4 className="text-xs font-black text-slate-700">Add Menu Items</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {menuOptions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleAddItemToOrder(item)}
                      className="p-2 border border-slate-200 hover:border-[#4F46E5] bg-white hover:bg-indigo-50/20 text-left rounded-xl transition active:scale-95"
                    >
                      <p className="text-[11px] font-black text-slate-800 line-clamp-1">{item.name}</p>
                      <p className="text-[10px] font-bold text-[#4F46E5] mt-0.5">₹{item.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Items List */}
              {selectedItems.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Selected Items</h4>
                  <div className="divide-y divide-slate-100 border border-slate-150 rounded-2xl overflow-hidden bg-white">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center px-4 py-2.5 text-xs font-bold">
                        <span className="text-slate-800">{item.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500">₹{item.price} x {item.quantity}</span>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => handleRemoveItemQty(item.id)}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs transition"
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddItemToOrder(item)}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs transition"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="p-3 bg-indigo-50/20 flex justify-between items-center font-black text-slate-900 border-t border-slate-150">
                      <span>Total Amount:</span>
                      <span className="text-[#4F46E5] text-sm">
                        ₹{selectedItems.reduce((acc, i) => acc + i.price * i.quantity, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Order Notes / Chef Instructions</label>
                <textarea
                  placeholder="Add comments, allergy details, or preparation notes..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-xs font-bold"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                >
                  Submit Order
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setSelectedItems([]); }}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Order Status Modal */}
      {showEditModal && editingOrder && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-black text-slate-900 mb-4">Edit Order: {editingOrder.orderNumber}</h3>
            <form onSubmit={handleEditStatusSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Change Status</label>
                <select
                  value={editStatus}
                  onChange={(e: any) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-xs font-bold text-slate-700"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready to Serve</option>
                  <option value="served">Served</option>
                  <option value="paid">Paid (Close Order)</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                >
                  Save Status
                </button>
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditingOrder(null); }}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details View Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">Order details - {selectedOrder.orderNumber}</h2>
              <button onClick={() => setShowDetailsModal(false)} className="p-1.5 hover:bg-slate-100 rounded-full transition">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400">Customer Name</span>
                  <p className="font-extrabold text-slate-800 mt-0.5">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400">Contact Number</span>
                  <p className="font-extrabold text-slate-800 mt-0.5">{selectedOrder.customerPhone}</p>
                </div>
                {selectedOrder.tableNumber && (
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400">Dine-In Table</span>
                    <p className="font-extrabold text-[#4F46E5] mt-0.5">{selectedOrder.tableNumber}</p>
                  </div>
                )}
                {selectedOrder.bookingTime && (
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400">Pre-Booking Slot</span>
                    <p className="font-extrabold text-[#4F46E5] mt-0.5">{selectedOrder.bookingTime}</p>
                  </div>
                )}
              </div>

              {selectedOrder.deliveryAddress && (
                <div className="text-xs">
                  <span className="text-[10px] font-black uppercase text-slate-400">Delivery Address</span>
                  <p className="font-extrabold text-slate-800 mt-0.5">{selectedOrder.deliveryAddress}</p>
                </div>
              )}

              {selectedOrder.notes && (
                <div className="text-xs border border-orange-100 bg-orange-50/30 p-2.5 rounded-xl">
                  <span className="text-[10px] font-black uppercase text-orange-500">Chef Instructions</span>
                  <p className="font-extrabold text-slate-800 mt-0.5">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-black text-slate-700 mb-2">Itemized List</h4>
                <div className="space-y-1.5">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-2 border border-slate-100 rounded-xl bg-slate-50/50 text-xs font-bold text-slate-800">
                      <span>{item.name} (x{item.quantity})</span>
                      <span className="text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="text-xs font-black text-slate-500 uppercase">Grand Total:</span>
                <span className="text-xl font-black text-[#4F46E5]">₹{selectedOrder.totalAmount.toFixed(2)}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handlePrintReceipt(selectedOrder)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-emerald-600/10"
                >
                  <Printer className="w-4 h-4" />
                  Print Receipt
                </button>
                <button
                  onClick={() => handlePrintKOT(selectedOrder)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-orange-500/10"
                >
                  <ChefHat className="w-4 h-4" />
                  Print KOT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

