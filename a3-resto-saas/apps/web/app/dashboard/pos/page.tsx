'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  CreditCard,
  Check,
  TrendingUp,
  Utensils,
  ClipboardCheck,
  Edit2,
  Trash2,
  DollarSign,
  PackageCheck,
  UserCheck,
  Users,
  Search,
  Plus,
  PlusCircle,
  FolderOpen,
  Receipt,
  UtensilsCrossed,
  Printer,
  Smartphone,
  CheckSquare,
  AlertTriangle,
  Clock,
  X
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { getMenuItems, getCategories } from '@/services/menu.service';
import type { MenuItem, MenuCategory } from '@/src/types/menu.types';

type OrderItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
};

type LiveOrder = {
  id: string;
  orderNumber: string;
  tableName: string;
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Accepted' | 'Preparing' | 'Ready' | 'Paid';
  isTakeaway?: boolean;
  tokenNumber?: string;
  createdAt: string;
};

type StockItemRequest = {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  approxCost: number;
  status: 'Pending' | 'Approved';
};

type StaffMember = {
  id: string;
  name: string;
  role: string;
  present: boolean;
};

const gourmetPresets = [
  // Veg
  { id: 'preset-veg-1', name: 'Veg Pizza', price: 349, imageUrl: '/images/veg_pizza.png', isVeg: true, category: 'Mains', description: 'Fresh basil, bell peppers, olives, cherry tomatoes.' },
  { id: 'preset-veg-2', name: 'Pasta Alfredo', price: 299, imageUrl: '/images/pasta_alfredo.png', isVeg: true, category: 'Mains', description: 'Creamy fettuccine Alfredo pasta, garlic, cheese.' },
  { id: 'preset-veg-3', name: 'Paneer Butter Masala', price: 249, imageUrl: '/images/paneer_butter_masala.png', isVeg: true, category: 'Mains', description: 'Cottage cheese cubes cooked in rich tomato cashew butter gravy.' },
  { id: 'preset-veg-4', name: 'Samosa Crunch', price: 49, imageUrl: '/images/samosa_crunch.png', isVeg: true, category: 'Starters', description: 'Crispy fried pastry filled with spiced potato.' },
  { id: 'preset-veg-5', name: 'Garlic Naan', price: 39, imageUrl: '/images/garlic_naan.png', isVeg: true, category: 'Breads', description: 'Soft clay oven flatbread seasoned with minced garlic.' },
  
  // Non-Veg
  { id: 'preset-nv-1', name: 'Chicken Burger', price: 199, imageUrl: '/images/chicken_burger.png', isVeg: false, category: 'Mains', description: 'Gourmet crispy chicken burger, lettuce, cheese.' },
  { id: 'preset-nv-2', name: 'Chicken Biryani', price: 249, imageUrl: '/images/chicken_biryani.png', isVeg: false, category: 'Mains', description: 'Fragrant basmati rice cooked with chicken pieces.' },
  { id: 'preset-nv-3', name: 'Tandoori Tikka', price: 299, imageUrl: '/images/tandoori_tikka.png', isVeg: false, category: 'Starters', description: 'Yogurt-marinated chicken breast cubes baked in charcoal oven.' },
  { id: 'preset-nv-4', name: 'Butter Chicken', price: 329, imageUrl: '/images/butter_chicken.png', isVeg: false, category: 'Mains', description: 'Tandoori grilled chicken cooked in cream tomato sauce.' },
  { id: 'preset-nv-5', name: 'Mutton Seekh', price: 349, imageUrl: '/images/mutton_seekh.png', isVeg: false, category: 'Starters', description: 'Skewered minced spiced mutton sausage.' },
  
  // Drink
  { id: 'preset-dr-1', name: 'Cold Coffee', price: 149, imageUrl: '/images/cold_coffee.png', isVeg: true, category: 'Beverages', description: 'Chilled rich coffee blended with chocolate sauce and cream.' }
];

const hourlySalesData = [
  { hour: '11:00', sales: 4200 },
  { hour: '12:00', sales: 8500 },
  { hour: '13:00', sales: 12400 },
  { hour: '14:00', sales: 9800 },
  { hour: '15:00', sales: 3200 },
  { hour: '16:00', sales: 4100 },
  { hour: '17:00', sales: 6800 },
  { hour: '18:00', sales: 15400 },
  { hour: '19:00', sales: 22100 },
  { hour: '20:00', sales: 28400 },
  { hour: '21:00', sales: 19800 },
  { hour: '22:00', sales: 11200 },
];

export default function POSPage() {
  const [dbItems, setDbItems] = useState<MenuItem[]>([]);
  const [dbCategories, setDbCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Dynamic Taxes
  const [taxPercent, setTaxPercent] = useState(5);
  const [serviceChargePercent, setServiceChargePercent] = useState(10);

  // Add Custom Item Form state
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');

  // Checkout info
  const [isTakeaway, setIsTakeaway] = useState(false);
  const [selectedTable, setSelectedTable] = useState('Table 1');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [nextTokenNum, setNextTokenNum] = useState(1);
  const [showReceipt, setShowReceipt] = useState(false);
  const [printedOrder, setPrintedOrder] = useState<any>(null);

  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>([
    {
      id: 'ord-101',
      orderNumber: 'ORD-16279101',
      tableName: 'Table 2',
      customerName: 'Rohit K.',
      items: [
        { menuItemId: 'preset-nv-1', name: 'Chicken Burger', price: 199, quantity: 2 },
        { menuItemId: 'preset-dr-1', name: 'Cold Coffee', price: 149, quantity: 1 },
      ],
      total: 547,
      status: 'Pending',
      isTakeaway: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ord-102',
      orderNumber: 'ORD-16279102',
      tableName: 'Takeaway',
      customerName: 'Pooja',
      items: [{ menuItemId: 'preset-veg-1', name: 'Veg Pizza', price: 349, quantity: 1 }],
      total: 349,
      status: 'Accepted',
      isTakeaway: true,
      tokenNumber: 'TK-005',
      createdAt: new Date().toISOString()
    },
  ]);

  const [stockRequests, setStockRequests] = useState<StockItemRequest[]>([
    { id: 'stk-1', name: 'Basmati Rice', quantity: '25', unit: 'kg', approxCost: 2200, status: 'Pending' },
    { id: 'stk-2', name: 'Refined Oil', quantity: '15', unit: 'L', approxCost: 1800, status: 'Pending' },
    { id: 'stk-3', name: 'Fresh Tomatoes', quantity: '10', unit: 'kg', approxCost: 400, status: 'Approved' },
  ]);

  const [staff, setStaff] = useState<StaffMember[]>([
    { id: 'stf-1', name: 'Aman Deep', role: 'Chef', present: true },
    { id: 'stf-2', name: 'Karan Singh', role: 'Waiter', present: true },
    { id: 'stf-3', name: 'Sonal Sen', role: 'Cashier', present: true },
    { id: 'stf-4', name: 'Rahul Dev', role: 'Kitchen Helper', present: false },
  ]);

  const [activeTab, setActiveTab] = useState<'billing' | 'live-orders' | 'inventory' | 'expenses' | 'attendance'>('billing');
  const [billingCart, setBillingCart] = useState<OrderItem[]>([]);
  const [editingOrder, setEditingOrder] = useState<LiveOrder | null>(null);

  const loadMenuData = async () => {
    try {
      setLoading(true);
      const [items, cats] = await Promise.all([
        getMenuItems().catch(() => []),
        getCategories().catch(() => []),
      ]);
      setDbItems(items);
      setDbCategories(cats);
    } catch (error) {
      console.error('Failed to load menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMenuData();
    const savedTax = localStorage.getItem('owner-tax-percent');
    const savedSC = localStorage.getItem('owner-service-charge-percent');
    if (savedTax) setTaxPercent(Number(savedTax));
    if (savedSC) setServiceChargePercent(Number(savedSC));
  }, []);

  const catalogItems = useMemo(() => {
    const checkIsVeg = (name: string) => {
      const nonVegKeywords = ['chicken', 'mutton', 'nonveg', 'beef', 'fish', 'egg', 'pork', 'tikka', 'seekh', 'kabab', 'kebab'];
      return !nonVegKeywords.some(keyword => name.toLowerCase().includes(keyword));
    };

    const mappedDbItems = dbItems.map(item => ({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      imageUrl: item.imageUrl || '/images/chicken_burger.png',
      isVeg: checkIsVeg(item.name),
      category: item.categories?.name || 'Mains',
      description: item.description || ''
    }));

    if (mappedDbItems.length > 0) {
      const dbNames = new Set(mappedDbItems.map(i => i.name.toLowerCase()));
      const uniquePresets = gourmetPresets.filter(p => !dbNames.has(p.name.toLowerCase()));
      return [...mappedDbItems, ...uniquePresets];
    }
    
    return gourmetPresets;
  }, [dbItems]);

  const filteredCatalog = useMemo(() => {
    return catalogItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesVeg = vegFilter === 'all' || 
        (vegFilter === 'veg' && item.isVeg) || 
        (vegFilter === 'nonveg' && !item.isVeg);
        
      const matchesCategory = categoryFilter === 'all' || 
        item.category.toLowerCase() === categoryFilter.toLowerCase();
        
      return matchesSearch && matchesVeg && matchesCategory;
    });
  }, [catalogItems, searchQuery, vegFilter, categoryFilter]);

  const categoriesList = useMemo(() => {
    const categoriesSet = new Set<string>();
    catalogItems.forEach(item => {
      if (item.category) {
        categoriesSet.add(item.category);
      }
    });
    return Array.from(categoriesSet);
  }, [catalogItems]);

  const addToCart = (item: { id: string; name: string; price: number }) => {
    const existing = billingCart.find((i) => i.menuItemId === item.id);
    if (existing) {
      setBillingCart(
        billingCart.map((i) =>
          i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setBillingCart([...billingCart, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }]);
    }
  };

  const addCustomItemToCart = () => {
    if (!customName.trim() || !customPrice) return;
    const priceNum = Number(customPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Please enter a valid price');
      return;
    }

    const adhocItem = {
      id: `custom-${Date.now()}`,
      name: `[Custom] ${customName.trim()}`,
      price: priceNum,
    };

    addToCart(adhocItem);
    setCustomName('');
    setCustomPrice('');
    setShowCustomForm(false);
  };

  const updateCartQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setBillingCart(billingCart.filter((i) => i.menuItemId !== id));
    } else {
      setBillingCart(billingCart.map((i) => (i.menuItemId === id ? { ...i, quantity: qty } : i)));
    }
  };

  const approveStockRequest = (id: string) => {
    setStockRequests(stockRequests.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r)));
  };

  const toggleAttendance = (id: string) => {
    setStaff(staff.map((s) => (s.id === id ? { ...s, present: !s.present } : s)));
  };

  const acceptOrder = (orderId: string) => {
    setLiveOrders(liveOrders.map((o) => (o.id === orderId ? { ...o, status: 'Accepted' } : o)));
  };

  const saveEditedOrder = () => {
    if (!editingOrder) return;
    setLiveOrders(liveOrders.map((o) => (o.id === editingOrder.id ? editingOrder : o)));
    setEditingOrder(null);
  };

  // Tax and subtotal calculations
  const subtotal = billingCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxAmount = Math.round((subtotal * taxPercent) / 100);
  const serviceChargeAmount = Math.round((subtotal * serviceChargePercent) / 100);
  const grandTotal = subtotal + taxAmount + serviceChargeAmount;

  // Ledger calculation baseline
  const totalSalesToday = liveOrders.reduce((sum, o) => sum + o.total, 0) + 12450;
  const stockExpenses = stockRequests.filter((r) => r.status === 'Approved').reduce((sum, r) => sum + r.approxCost, 0) + 4500;
  const staffPayroll = staff.filter((s) => s.present).length * 800;
  const netProfit = totalSalesToday - (stockExpenses + staffPayroll);

  const handleCheckout = () => {
    if (billingCart.length === 0) return;

    let tokenStr = '';
    if (isTakeaway) {
      const numStr = String(nextTokenNum).padStart(3, '0');
      tokenStr = `TK-${numStr}`;
      setNextTokenNum(nextTokenNum + 1);
    }

    const newOrder: LiveOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${Math.floor(10000000 + Math.random() * 90000000)}`,
      tableName: isTakeaway ? 'Takeaway' : selectedTable,
      customerName: customerName || 'Walk-in Guest',
      customerPhone: customerPhone || undefined,
      items: [...billingCart],
      total: grandTotal,
      status: 'Pending',
      isTakeaway,
      tokenNumber: tokenStr || undefined,
      createdAt: new Date().toISOString()
    };

    setLiveOrders([newOrder, ...liveOrders]);
    setPrintedOrder(newOrder);
    setShowReceipt(true);
    setBillingCart([]);
    setCustomerName('');
    setCustomerPhone('');
  };

  const handlePrint = () => {
    window.print();
  };

  // Kitchen orders calculations for status monitoring
  const kitchenPending = liveOrders.filter(o => o.status === 'Pending').length;
  const kitchenPreparing = liveOrders.filter(o => o.status === 'Accepted' || o.status === 'Preparing').length;
  const kitchenReady = liveOrders.filter(o => o.status === 'Ready').length;

  return (
    <div className="space-y-6 text-slate-900 bg-[#F6F8FD] p-1 print:p-0 print:bg-white min-h-screen">
      
      {/* CSS print utility injection */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-receipt-modal, #print-receipt-modal * {
            visibility: visible;
          }
          #print-receipt-modal {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm;
            padding: 0;
            margin: 0;
            border: none;
            box-shadow: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* HEADER & TABS */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between no-print">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="text-[#8b5cf6]" size={20} />
            <span className="text-xs uppercase tracking-widest text-slate-500 font-extrabold">POS Billing Counter</span>
          </div>
          <h1 className="mt-1 text-3xl font-black tracking-tight">POS & Bill Management</h1>
        </div>

        <div className="flex rounded-2xl bg-white p-1 border border-slate-200/60 overflow-x-auto scrollbar-none shadow-sm">
          {([
            { id: 'billing', label: 'POS Billing', icon: CreditCard },
            { id: 'live-orders', label: 'Live Orders Feed', icon: Utensils },
            { id: 'inventory', label: 'Stock Requests', icon: PackageCheck },
            { id: 'expenses', label: 'Ledger Profit', icon: DollarSign },
            { id: 'attendance', label: 'Attendance', icon: UserCheck },
          ] as const).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-black transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#BFDEF3] text-[#1e3a8a] shadow-sm'
                    : 'text-slate-650 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* METRICS ROW */}
      <section className="grid gap-4 md:grid-cols-4 no-print">
        <div className="rounded-3xl bg-white border border-slate-100 p-5 shadow-sm">
          <p className="text-slate-500 text-xs font-black uppercase tracking-wider">Total Sales Today</p>
          <h3 className="mt-1.5 text-2xl font-black text-slate-900">₹{totalSalesToday}</h3>
          <span className="text-[10px] text-slate-400 font-bold block mt-1">Includes Table & QR checkouts</span>
        </div>
        <div className="rounded-3xl bg-white border border-slate-100 p-5 shadow-sm">
          <p className="text-slate-500 text-xs font-black uppercase tracking-wider">Stock Procurement</p>
          <h3 className="mt-1.5 text-2xl font-black text-rose-500">₹{stockExpenses}</h3>
          <span className="text-[10px] text-slate-400 font-bold block mt-1">Approved vegetable/oil stock</span>
        </div>
        <div className="rounded-3xl bg-white border border-slate-100 p-5 shadow-sm">
          <p className="text-slate-500 text-xs font-black uppercase tracking-wider">Staff Daily Wages</p>
          <h3 className="mt-1.5 text-2xl font-black text-sky-600">₹{staffPayroll}</h3>
          <span className="text-[10px] text-slate-400 font-bold block mt-1">Wages computed from attendance</span>
        </div>
        <div className="rounded-3xl bg-white border border-slate-100 p-5 shadow-sm">
          <p className="text-slate-500 text-xs font-black uppercase tracking-wider">Net Today Profit</p>
          <h3 className="mt-1.5 text-2xl font-black text-emerald-600">₹{netProfit}</h3>
          <span className="text-[10px] text-slate-400 font-bold block mt-1">Net profit margin: +{Math.round((netProfit / totalSalesToday) * 100)}%</span>
        </div>
      </section>

      {/* TAB WORKSPACES */}
      {activeTab === 'billing' && (
        <section className="grid gap-6 lg:grid-cols-[1fr_420px] no-print">
          
          {/* FOOD ITEMS LIST & CHARTS SECTION */}
          <div className="space-y-6">
            
            {/* GRID OF METRICS & HOURLY SALES CHART */}
            <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
              {/* TODAY'S HOURLY SALES */}
              <div className="bg-white border border-slate-100 p-5 rounded-[2.5rem] shadow-sm">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4">Today's Hourly Sales</h3>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlySalesData}>
                      <XAxis dataKey="hour" tickLine={false} axisLine={false} style={{ fontSize: '9px', fontWeight: 'bold', fill: '#64748b' }} />
                      <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                        {hourlySalesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#BFDEF3' : '#E0B7F4'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* KITCHEN MONITOR */}
              <div className="bg-white border border-slate-100 p-5 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">Kitchen Status Monitor</h3>
                  <p className="text-[10px] text-slate-400 font-bold">Real-time status counts across KDS boards</p>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="p-3 bg-yellow-50 rounded-2xl border border-yellow-100">
                    <span className="text-xs font-bold text-yellow-600 block">Pending</span>
                    <span className="text-2xl font-black text-yellow-700">{kitchenPending}</span>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100">
                    <span className="text-xs font-bold text-orange-600 block">Cooking</span>
                    <span className="text-2xl font-black text-orange-700">{kitchenPreparing}</span>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <span className="text-xs font-bold text-emerald-600 block">Ready</span>
                    <span className="text-2xl font-black text-[#0f766e]">{kitchenReady}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FOOD PRODUCTS CATALOG CARD */}
            <div className="rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-sm space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Food Ordering Catalog</h2>
                  <p className="text-xs text-slate-450 font-bold mt-0.5">Select menu items below to build the counter invoice.</p>
                </div>
                
                <button
                  onClick={() => setShowCustomForm(!showCustomForm)}
                  className="px-4 py-2 bg-[#E0B7F4]/20 hover:bg-[#E0B7F4]/30 text-purple-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 border border-[#E0B7F4]/10"
                >
                  <PlusCircle size={14} className="text-[#8b5cf6]" />
                  Add Custom Item
                </button>
              </div>

              {/* CUSTOM ADD FORM */}
              {showCustomForm && (
                <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl grid gap-4 sm:grid-cols-[1fr_120px_100px] items-end">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-black uppercase">Item Name</label>
                    <input
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Garlic Naan Special"
                      className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs outline-none text-slate-950 focus:border-rose-500 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-black uppercase">Price (INR)</label>
                    <input
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      placeholder="₹ 150"
                      type="number"
                      className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs outline-none text-slate-950 focus:border-rose-500 font-bold"
                    />
                  </div>
                  <button
                    onClick={addCustomItemToCart}
                    className="w-full bg-rose-500 hover:bg-rose-600 py-2.5 rounded-xl font-black text-xs text-white active:scale-95 transition shadow-sm"
                  >
                    Add
                  </button>
                </div>
              )}

              {/* SEARCH & FILTERS */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search dishes..."
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-xs outline-none focus:border-rose-500 transition font-bold"
                  />
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 w-fit">
                  <button
                    onClick={() => setVegFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                      vegFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setVegFilter('veg')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1 ${
                      vegFilter === 'veg' ? 'bg-emerald-500/10 text-[#0f766e]' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Veg
                  </button>
                  <button
                    onClick={() => setVegFilter('nonveg')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center gap-1 ${
                      vegFilter === 'nonveg' ? 'bg-rose-500/10 text-rose-700' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Non-Veg
                  </button>
                </div>
              </div>

              {/* CATEGORIES FILTERS */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-4 py-2 rounded-full text-xs font-black border transition ${
                    categoryFilter === 'all'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-350'
                  }`}
                >
                  All Categories
                </button>
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-black border transition whitespace-nowrap ${
                      categoryFilter === cat
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-350'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* MENU CARDS GRID */}
              {loading ? (
                <div className="text-slate-500 text-xs text-center py-12 font-bold">Loading dishes...</div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCatalog.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-150 p-4 rounded-3xl flex flex-col justify-between hover:border-slate-300 transition duration-200 shadow-sm">
                      <div>
                        <div 
                          className="h-28 w-full rounded-2xl bg-slate-100 bg-cover bg-center mb-3 relative"
                          style={{ backgroundImage: `url(${item.imageUrl})` }}
                        >
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur border border-slate-200 p-1.5 rounded-lg shadow-sm">
                            {item.isVeg ? (
                              <div className="w-3 h-3 border border-emerald-500 flex items-center justify-center bg-white rounded-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              </div>
                            ) : (
                              <div className="w-3 h-3 border border-rose-500 flex items-center justify-center bg-white rounded-sm">
                                <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-rose-500" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-start gap-1">
                          <h3 className="font-black text-sm text-slate-800 line-clamp-1">{item.name}</h3>
                          <span className="font-black text-rose-500 text-xs">₹{item.price}</span>
                        </div>
                        <p className="text-[10px] text-slate-450 font-bold mt-0.5">{item.category}</p>
                        <p className="text-[10px] text-slate-500 mt-2 leading-relaxed line-clamp-2">{item.description}</p>
                      </div>

                      <button
                        onClick={() => addToCart(item)}
                        className="mt-4 w-full bg-rose-500 hover:bg-rose-600 py-2.5 rounded-xl font-black active:scale-95 transition text-xs flex items-center justify-center gap-1 text-white shadow-sm"
                      >
                        <Plus size={12} /> Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CHECKOUT COUNTER PANEL */}
          <div className="rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-sm flex flex-col justify-between h-[fit-content] space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Receipt className="text-[#8b5cf6]" size={20} />
                <h2 className="text-xl font-black text-slate-900">Counter Invoice</h2>
              </div>

              {/* CUSTOMER DETAIL INPUTS */}
              <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                  <span className="text-xs font-black text-slate-800">Order Delivery Mode</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isTakeaway}
                      onChange={(e) => setIsTakeaway(e.target.checked)}
                      className="accent-rose-500 w-3.5 h-3.5"
                    />
                    <span className="text-xs font-black text-rose-600">Takeaway Token</span>
                  </label>
                </div>

                {!isTakeaway && (
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-black uppercase">Table Allocation</label>
                    <select
                      value={selectedTable}
                      onChange={(e) => setSelectedTable(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs outline-none text-slate-900 font-bold"
                    >
                      {['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7', 'Table 8'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-black uppercase">Customer Name</label>
                    <input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Guest Name"
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs outline-none text-slate-900 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-black uppercase">Phone Number</label>
                    <input
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs outline-none text-slate-900 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* CART ITEMS LIST */}
              {billingCart.length === 0 ? (
                <div className="text-center py-20 text-slate-400 text-xs font-bold border-2 border-dashed border-slate-200 rounded-3xl">
                  🛒 Cart is currently empty.
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {billingCart.map((item) => (
                    <div key={item.menuItemId} className="bg-slate-50 p-4 border border-slate-150 rounded-2xl flex items-center justify-between shadow-sm">
                      <div>
                        <p className="font-black text-xs text-slate-800 line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-rose-500 font-extrabold mt-0.5">₹{item.price}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateCartQty(item.menuItemId, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-black text-xs hover:bg-slate-100 transition shadow-sm"
                        >
                          -
                        </button>
                        <span className="text-xs font-black text-slate-800 w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.menuItemId, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-black text-xs hover:bg-slate-100 transition shadow-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RECEIPT SUMMARY */}
            <div className="border-t border-slate-250/60 pt-4 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-500 font-bold">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-800">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST ({taxPercent}%)</span>
                  <span className="text-slate-800">₹{taxAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charge ({serviceChargePercent}%)</span>
                  <span className="text-slate-800">₹{serviceChargeAmount}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-lg font-black border-t border-slate-100 pt-3">
                <span>Grand Total</span>
                <span className="text-rose-500">₹{grandTotal}</span>
              </div>
              <button
                disabled={billingCart.length === 0}
                onClick={handleCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 py-3.5 rounded-2xl font-black text-xs tracking-wider uppercase active:scale-95 transition-transform text-white shadow-sm"
              >
                Generate Token & Checkout
              </button>
            </div>
          </div>
        </section>
      )}

      {/* LIVE ORDERS FEED TAB */}
      {activeTab === 'live-orders' && (
        <section className="rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-sm space-y-6 no-print">
          <div>
            <h2 className="text-xl font-black text-slate-900">Live Orders Feed Queue</h2>
            <p className="text-xs text-slate-500 font-bold mt-0.5">Edit, accept, or track customer orders across Dine In & Takeaway.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {liveOrders.map((order) => (
              <div key={order.id} className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 space-y-4 relative overflow-hidden shadow-sm">
                {order.isTakeaway && (
                  <div className="absolute right-4 top-4 bg-purple-100 text-purple-800 font-black text-[10px] px-2.5 py-1 rounded-lg border border-purple-200">
                    Token: {order.tokenNumber}
                  </div>
                )}
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-lg text-slate-800">{order.tableName}</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{order.orderNumber}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black ${
                      order.status === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                        : 'bg-emerald-100 text-[#0f766e] border border-emerald-200'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-slate-500 font-bold">Guest: <span className="text-slate-900 font-black">{order.customerName}</span></p>
                  <div className="border-t border-slate-200 pt-2 space-y-1">
                    {order.items.map((item) => (
                      <div key={item.menuItemId} className="flex justify-between text-xs text-slate-650 font-bold">
                        <span>{item.name} x{item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-slate-800">
                    <span>Total Bill</span>
                    <span>₹{order.total}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setPrintedOrder(order);
                      setShowReceipt(true);
                    }}
                    className="flex-1 bg-white hover:bg-slate-100 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1 border border-slate-200 text-slate-700 shadow-sm transition active:scale-95"
                  >
                    <Printer size={12} /> Reprint Slip
                  </button>
                  <button
                    onClick={() => setEditingOrder(order)}
                    className="flex-1 bg-white hover:bg-slate-100 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1 border border-slate-200 text-slate-700 shadow-sm transition active:scale-95"
                  >
                    <Edit2 size={12} /> Modify Items
                  </button>
                  {order.status === 'Pending' && (
                    <button
                      onClick={() => acceptOrder(order.id)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1 active:scale-95 text-white shadow-sm"
                    >
                      <Check size={12} /> Accept Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* STOCK REQUESTS TAB */}
      {activeTab === 'inventory' && (
        <section className="rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-sm space-y-6 no-print">
          <div>
            <h2 className="text-xl font-black text-slate-900">Stock Purchase Approvals</h2>
            <p className="text-xs text-slate-500 font-bold mt-0.5">Approve Chef requests for vegetables, oils, salt, grains, etc.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {stockRequests.map((req) => (
              <div key={req.id} className="p-5 bg-slate-50 border border-slate-250/60 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-base text-slate-800">{req.name}</h3>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase ${
                        req.status === 'Approved' ? 'bg-emerald-100 text-[#0f766e]' : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-bold mt-2">Quantity: <span className="font-black text-slate-900">{req.quantity} {req.unit}</span></p>
                  <p className="text-xs text-slate-500 font-bold mt-1">Est. Expense: <span className="font-black text-rose-500">₹{req.approxCost}</span></p>
                </div>

                {req.status === 'Pending' && (
                  <button
                    onClick={() => approveStockRequest(req.id)}
                    className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 py-2.5 rounded-xl text-xs font-black active:scale-95 text-white transition shadow-sm"
                  >
                    Approve & Disburse
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* LEDGER PROFIT TAB */}
      {activeTab === 'expenses' && (
        <section className="grid gap-6 md:grid-cols-2 no-print">
          <div className="rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">Shift Ledger Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-2xl">
                <span className="font-bold text-xs text-slate-650">Counter Sales</span>
                <span className="text-emerald-600 font-black">₹12,450</span>
              </div>
              <div className="flex justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-2xl">
                <span className="font-bold text-xs text-slate-650">Dine-In QR Orders</span>
                <span className="text-emerald-600 font-black">₹896</span>
              </div>
              <div className="flex justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-2xl">
                <span className="font-bold text-xs text-slate-650">Ingredient Procurement</span>
                <span className="text-rose-500 font-black">-₹{stockExpenses}</span>
              </div>
              <div className="flex justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-2xl">
                <span className="font-bold text-xs text-slate-650">Staff Daily Wages</span>
                <span className="text-rose-500 font-black">-₹{staffPayroll}</span>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider mb-2">Shift Profit Summary</h2>
              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                Profit parameters and ledger indicators are updated instantly. Approved stock request expenses and attendance wages are dynamically subtracted from daily sales.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl">
              <div className="flex justify-between text-[10px] text-slate-400 uppercase tracking-widest font-black">
                <span>Profit Percentage</span>
                <span>Net Shift Revenue</span>
              </div>
              <div className="flex justify-between items-baseline mt-1.5">
                <span className="text-emerald-600 text-sm font-black">+{Math.round((netProfit / totalSalesToday) * 100)}%</span>
                <span className="text-emerald-600 text-2xl font-black">₹{netProfit}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ATTENDANCE TAB */}
      {activeTab === 'attendance' && (
        <section className="rounded-[2.5rem] bg-white border border-slate-100 p-6 shadow-sm space-y-6 no-print">
          <div>
            <h2 className="text-xl font-black text-slate-900">Staff Shift Attendance</h2>
            <p className="text-xs text-slate-500 font-bold mt-0.5">Toggle staff shift markers to compute employee daily wage disbursements.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {staff.map((member) => (
              <div
                key={member.id}
                className={`p-5 rounded-3xl border transition flex flex-col justify-between shadow-sm ${
                  member.present 
                    ? 'bg-emerald-500/5 border-emerald-500/20' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <h3 className="font-black text-base text-slate-800">{member.name}</h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">{member.role}</p>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className={`text-xs font-black ${member.present ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {member.present ? 'Checked-In' : 'Not Here'}
                  </span>
                  <button
                    onClick={() => toggleAttendance(member.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-black active:scale-95 transition-all ${
                      member.present 
                        ? 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20' 
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {member.present ? 'Mark Absent' : 'Mark Present'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MODIFY LIVE ORDER MODAL */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print">
          <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-2xl space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black text-slate-900">Edit Order Items</h2>
                <p className="text-xs text-slate-500 font-bold mt-0.5">Adjust ordered item counts or remove unavailable dishes.</p>
              </div>
              <button 
                onClick={() => setEditingOrder(null)}
                className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-700 transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {editingOrder.items.map((item, idx) => (
                <div key={item.menuItemId} className="bg-slate-50 p-4 border border-slate-150 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-black text-xs text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-rose-500 font-extrabold mt-0.5">₹{item.price}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const nextItems = [...editingOrder.items];
                        if (item.quantity <= 1) {
                          nextItems.splice(idx, 1);
                        } else {
                          nextItems[idx] = { ...item, quantity: item.quantity - 1 };
                        }
                        const nextTotal = nextItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
                        setEditingOrder({ ...editingOrder, items: nextItems, total: nextTotal });
                      }}
                      className="w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center text-xs font-black shadow-sm"
                    >
                      -
                    </button>
                    <span className="text-xs font-black text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => {
                        const nextItems = [...editingOrder.items];
                        nextItems[idx] = { ...item, quantity: item.quantity + 1 };
                        const nextTotal = nextItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
                        setEditingOrder({ ...editingOrder, items: nextItems, total: nextTotal });
                      }}
                      className="w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center text-xs font-black shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-lg font-black border-t border-slate-100 pt-4">
              <span>Updated Total</span>
              <span className="text-rose-500">₹{editingOrder.total}</span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditingOrder(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 py-3 rounded-xl font-black text-slate-700 transition text-xs"
              >
                Discard Changes
              </button>
              <button
                onClick={saveEditedOrder}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-black transition active:scale-95 text-xs shadow-sm"
              >
                Confirm Updates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* THERMAL RECEIPTS PRINT MODAL */}
      {showReceipt && printedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-2xl space-y-6 flex flex-col items-center">
            
            <div className="w-full flex justify-between items-center no-print">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Print Preview (80mm)</span>
              <button 
                onClick={() => setShowReceipt(false)}
                className="p-1.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-700 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Print Container (80mm style) */}
            <div 
              id="print-receipt-modal" 
              className="w-full bg-white p-4 border border-dashed border-slate-300 text-slate-900 font-mono text-xs text-center space-y-4"
            >
              <div>
                <h2 className="text-base font-black tracking-tight">A.K RESTO</h2>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5">Smart Billing Receipt</p>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-2.5 text-left space-y-1 text-[10px]">
                <p><strong>Order:</strong> {printedOrder.orderNumber}</p>
                <p><strong>Date:</strong> {new Date(printedOrder.createdAt).toLocaleString()}</p>
                <p><strong>Delivery:</strong> {printedOrder.isTakeaway ? 'Takeaway' : printedOrder.tableName}</p>
                <p><strong>Guest:</strong> {printedOrder.customerName}</p>
                {printedOrder.isTakeaway && (
                  <div className="mt-2 text-center bg-slate-100 border border-slate-200 py-1.5 rounded-md text-base font-black">
                    TOKEN: {printedOrder.tokenNumber}
                  </div>
                )}
              </div>

              <div className="space-y-1.5 text-left text-[10px]">
                <div className="flex justify-between font-black border-b border-dashed border-slate-200 pb-1">
                  <span>Item Description</span>
                  <span>Qty * Amt</span>
                </div>
                {printedOrder.items.map((it: any) => (
                  <div key={it.menuItemId} className="flex justify-between">
                    <span>{it.name}</span>
                    <span>{it.quantity} x ₹{it.price}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 text-right space-y-1 text-[10px]">
                <div className="flex justify-between font-black text-xs">
                  <span>Grand Total:</span>
                  <span>₹{printedOrder.total}</span>
                </div>
              </div>

              <div className="text-[9px] text-slate-400 font-bold pt-4">
                Thank you for your visit! Powered by A.K Resto
              </div>
            </div>

            {/* Action buttons */}
            <div className="w-full flex gap-3 no-print">
              <button
                onClick={() => setShowReceipt(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 py-3 rounded-xl font-black text-slate-700 transition text-xs"
              >
                Close Preview
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-black transition active:scale-95 text-xs flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Printer size={14} /> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
