'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
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
  X,
  Sparkles,
  Gift,
  ArrowRight,
  ShieldCheck,
  Layers,
  Truck,
  Settings,
  Grid,
  Menu,
  ChevronDown,
  Lock,
  Mic,
  Volume2,
  Bookmark
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
  notes?: string;
  modifiers?: string[];
};

type LiveOrder = {
  id: string;
  orderNumber: string;
  tableName: string;
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  taxes: number;
  serviceCharge: number;
  total: number;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Paid' | 'Cancelled';
  isTakeaway?: boolean;
  isDelivery?: boolean;
  deliveryPartner?: string;
  deliveryStatus?: 'Assigned' | 'Out for Delivery' | 'Delivered';
  tokenNumber?: string;
  createdAt: string;
  discountApplied?: number;
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
  pin: string;
  clockInTime?: string;
};

type TablePOS = {
  id: string;
  name: string;
  capacity: number;
  status: 'Available' | 'Occupied' | 'Reserved';
  runningOrder?: string;
};

const gourmetPresets = [
  { id: 'preset-veg-1', name: 'Veg Margherita Pizza', price: 349, imageUrl: '/images/veg_pizza.png', isVeg: true, category: 'Mains', description: 'Fresh basil, bell peppers, olives, cherry tomatoes.' },
  { id: 'preset-veg-2', name: 'Pasta Alfredo Creamy', price: 299, imageUrl: '/images/pasta_alfredo.png', isVeg: true, category: 'Mains', description: 'Creamy fettuccine Alfredo pasta, garlic, cheese.' },
  { id: 'preset-veg-3', name: 'Paneer Butter Masala', price: 249, imageUrl: '/images/paneer_butter_masala.png', isVeg: true, category: 'Mains', description: 'Cottage cheese cubes cooked in rich tomato cashew butter gravy.' },
  { id: 'preset-veg-4', name: 'Samosa Potato Crunch', price: 49, imageUrl: '/images/samosa_crunch.png', isVeg: true, category: 'Starters', description: 'Crispy fried pastry filled with spiced potato.' },
  { id: 'preset-veg-5', name: 'Garlic Butter Naan', price: 39, imageUrl: '/images/garlic_naan.png', isVeg: true, category: 'Breads', description: 'Soft clay oven flatbread seasoned with minced garlic.' },
  { id: 'preset-nv-1', name: 'Chicken Crispy Burger', price: 199, imageUrl: '/images/chicken_burger.png', isVeg: false, category: 'Mains', description: 'Gourmet crispy chicken burger, lettuce, cheese.' },
  { id: 'preset-nv-2', name: 'Chicken Dum Biryani', price: 249, imageUrl: '/images/chicken_biryani.png', isVeg: false, category: 'Mains', description: 'Fragrant basmati rice cooked with chicken pieces.' },
  { id: 'preset-nv-3', name: 'Tandoori Tikka Grill', price: 299, imageUrl: '/images/tandoori_tikka.png', isVeg: false, category: 'Starters', description: 'Yogurt-marinated chicken breast cubes baked in charcoal oven.' },
  { id: 'preset-nv-4', name: 'Classic Butter Chicken', price: 329, imageUrl: '/images/butter_chicken.png', isVeg: false, category: 'Mains', description: 'Tandoori grilled chicken cooked in cream tomato sauce.' },
  { id: 'preset-nv-5', name: 'Mutton Seekh Kebab', price: 349, imageUrl: '/images/mutton_seekh.png', isVeg: false, category: 'Starters', description: 'Skewered minced spiced mutton sausage.' },
  { id: 'preset-dr-1', name: 'Cold Coffee Creamy', price: 149, imageUrl: '/images/cold_coffee.png', isVeg: true, category: 'Beverages', description: 'Chilled rich coffee blended with chocolate sauce and cream.' }
];

const hourlySalesData = [
  { hour: '11:00 AM', sales: 4200 },
  { hour: '12:00 PM', sales: 8500 },
  { hour: '01:00 PM', sales: 12400 },
  { hour: '02:00 PM', sales: 9800 },
  { hour: '05:00 PM', sales: 6800 },
  { hour: '07:00 PM', sales: 22100 },
  { hour: '08:00 PM', sales: 28400 },
  { hour: '09:00 PM', sales: 19800 }
];

export default function POSPage() {
  const [dbItems, setDbItems] = useState<MenuItem[]>([]);
  const [dbCategories, setDbCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Active workspace tabs
  // 'billing' (Checkout Terminal) | 'tables' (Dine-in Floor Layout) | 'live-orders' (Takeaway / Delivery Tracking) | 'drawer' (Shift & Cash Drawer Log) | 'settings' (Printers & Rules Setup)
  const [activeTab, setActiveTab] = useState<'billing' | 'tables' | 'live-orders' | 'drawer' | 'settings'>('billing');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Dynamic Taxes & GST
  const [taxPercent, setTaxPercent] = useState(5);
  const [serviceChargePercent, setServiceChargePercent] = useState(10);

  // Custom Item Modal
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');

  // Cart & Order properties
  const [billingCart, setBillingCart] = useState<OrderItem[]>([]);
  const [isTakeaway, setIsTakeaway] = useState(false);
  const [isDelivery, setIsDelivery] = useState(false);
  const [selectedTable, setSelectedTable] = useState('Table 1');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'UPI'>('Cash');
  const [nextTokenNum, setNextTokenNum] = useState(1);
  const [showReceipt, setShowReceipt] = useState(false);
  const [printedOrder, setPrintedOrder] = useState<LiveOrder | null>(null);
  
  // Custom Notes & Modifiers modal
  const [selectedCartItemForMods, setSelectedCartItemForMods] = useState<OrderItem | null>(null);
  const [customItemNote, setCustomItemNote] = useState('');
  const [activeModifiers, setActiveModifiers] = useState<string[]>([]);
  
  // Held orders state (F3 Hold Order)
  const [heldOrders, setHeldOrders] = useState<{ id: string; name: string; items: OrderItem[]; date: string }[]>([]);

  // Split bill checkout state
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [splitGuestsCount, setSplitGuestsCount] = useState(2);

  // Discount Coupons
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [activeDiscountAmount, setActiveDiscountAmount] = useState(0);

  // Cash Drawer & Shift Management
  const [shiftOpened, setShiftOpened] = useState(true);
  const [openingBalance, setOpeningBalance] = useState(5000);
  const [cashInVal, setCashInVal] = useState('');
  const [cashOutVal, setCashOutVal] = useState('');
  const [cashInOutReason, setCashInOutReason] = useState('');
  const [cashTransactions, setCashTransactions] = useState<{ id: string; type: 'IN' | 'OUT'; amount: number; reason: string; time: string }[]>([
    { id: '1', type: 'IN', amount: 5000, reason: 'Shift Opening Cash', time: '09:00 AM' },
    { id: '2', type: 'OUT', amount: 350, reason: 'Local dairy curd purchase', time: '10:30 AM' }
  ]);

  // Table status and floor map
  const [tablesList, setTablesList] = useState<TablePOS[]>([
    { id: 't1', name: 'Table 1', capacity: 2, status: 'Available' },
    { id: 't2', name: 'Table 2', capacity: 4, status: 'Occupied', runningOrder: 'ORD-8931102' },
    { id: 't3', name: 'Table 3', capacity: 6, status: 'Reserved' },
    { id: 't4', name: 'Table 4', capacity: 4, status: 'Available' },
    { id: 't5', name: 'Table 5', capacity: 2, status: 'Occupied', runningOrder: 'ORD-8931105' },
    { id: 't6', name: 'Table 6', capacity: 8, status: 'Available' }
  ]);

  // Waitlist State
  const [waitlistQueue, setWaitlistQueue] = useState<{ id: string; name: string; pax: number; phone: string }[]>([
    { id: 'w1', name: 'Siddharth Roy', pax: 4, phone: '9888877777' }
  ]);
  const [waitlistName, setWaitlistName] = useState('');
  const [waitlistPax, setWaitlistPax] = useState('2');
  const [waitlistPhone, setWaitlistPhone] = useState('');

  // Voice command assistant simulation
  const [isListening, setIsListening] = useState(false);
  const [voiceQueryText, setVoiceQueryText] = useState('');

  // Settings & printer preferences
  const [selectedPrinterType, setSelectedPrinterType] = useState<'80mm' | 'A4'>('80mm');
  const [enableAutoPrint, setEnableAutoPrint] = useState(true);

  // Live orders feed
  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>([
    {
      id: 'ord-101',
      orderNumber: 'ORD-8931102',
      tableName: 'Table 2',
      customerName: 'Rohit K.',
      customerPhone: '9876543210',
      items: [
        { menuItemId: 'preset-nv-1', name: 'Chicken Crispy Burger', price: 199, quantity: 2, modifiers: ['Extra Cheese'] },
        { menuItemId: 'preset-dr-1', name: 'Cold Coffee Creamy', price: 149, quantity: 1 },
      ],
      subtotal: 547,
      taxes: 27,
      serviceCharge: 55,
      total: 629,
      status: 'Preparing',
      isTakeaway: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ord-102',
      orderNumber: 'ORD-8931105',
      tableName: 'Takeaway',
      customerName: 'Aishwarya Sen',
      customerPhone: '9988776655',
      items: [{ menuItemId: 'preset-veg-1', name: 'Veg Margherita Pizza', price: 349, quantity: 1 }],
      subtotal: 349,
      taxes: 17,
      serviceCharge: 35,
      total: 401,
      status: 'Ready',
      isTakeaway: true,
      tokenNumber: 'TK-005',
      createdAt: new Date().toISOString()
    },
  ]);

  const [editingOrder, setEditingOrder] = useState<LiveOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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

  // Bind Keyboard shortcuts: F1, F2, F3, F4
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setActiveTab('billing');
        triggerToast('Shortcut: Billing Counter Workspace opened.');
      } else if (e.key === 'F2') {
        e.preventDefault();
        setActiveTab('tables');
        triggerToast('Shortcut: Dine-in Floor Grid opened.');
      } else if (e.key === 'F3') {
        e.preventDefault();
        handleHoldOrder();
      } else if (e.key === 'F4') {
        e.preventDefault();
        if (billingCart.length > 0) {
          handleCheckout();
        } else {
          triggerToast('Shortcut Void: Cart is empty.');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [billingCart, customerName, isTakeaway, selectedTable]);

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

  // Cart operations
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
    triggerToast(`Added ${item.name} to cart.`);
  };

  const addCustomItemToCart = () => {
    if (!customName.trim() || !customPrice) return;
    const priceNum = Number(customPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      triggerToast('Please enter a valid price.');
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

  // Modifier Config Modal
  const openModifiersModal = (item: OrderItem) => {
    setSelectedCartItemForMods(item);
    setCustomItemNote(item.notes || '');
    setActiveModifiers(item.modifiers || []);
  };

  const saveItemModifiers = () => {
    if (!selectedCartItemForMods) return;
    setBillingCart(prev =>
      prev.map(item =>
        item.menuItemId === selectedCartItemForMods.menuItemId
          ? { ...item, notes: customItemNote, modifiers: activeModifiers }
          : item
      )
    );
    setSelectedCartItemForMods(null);
    triggerToast('Special chef instructions and item modifiers saved.');
  };

  // Draft Holds (F3)
  const handleHoldOrder = () => {
    if (billingCart.length === 0) {
      triggerToast('Cannot hold an empty cart.');
      return;
    }
    const draftName = customerName || `Hold Draft #${heldOrders.length + 1}`;
    const newHold = {
      id: 'held_' + Date.now(),
      name: draftName,
      items: [...billingCart],
      date: new Date().toLocaleTimeString()
    };
    setHeldOrders([...heldOrders, newHold]);
    setBillingCart([]);
    setCustomerName('');
    setCustomerPhone('');
    triggerToast(`Order draft held for ${draftName}.`);
  };

  const retrieveHeldOrder = (heldId: string) => {
    const target = heldOrders.find(h => h.id === heldId);
    if (!target) return;
    setBillingCart(target.items);
    setCustomerName(target.name.startsWith('Hold Draft') ? '' : target.name);
    setHeldOrders(heldOrders.filter(h => h.id !== heldId));
    triggerToast('Draft order retrieved and loaded into active cart.');
  };

  // Coupon Discount
  const applyPromoCoupon = () => {
    if (appliedCouponCode.toUpperCase() === 'FIRST15') {
      setActiveDiscountAmount(Math.round(subtotal * 0.15));
      triggerToast('Coupon FIRST15 Applied: 15% discount applied!');
    } else if (appliedCouponCode.toUpperCase() === 'VIP50') {
      setActiveDiscountAmount(Math.round(subtotal * 0.5));
      triggerToast('Coupon VIP50 Applied: 50% Manager Discount applied!');
    } else {
      triggerToast('Invalid or expired promo code.');
    }
  };

  // Calculations
  const subtotal = billingCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountVal = activeDiscountAmount;
  const taxableSubtotal = Math.max(0, subtotal - discountVal);
  const taxAmount = Math.round((taxableSubtotal * taxPercent) / 100);
  const serviceChargeAmount = Math.round((taxableSubtotal * serviceChargePercent) / 100);
  const grandTotal = taxableSubtotal + taxAmount + serviceChargeAmount;

  // Checkout execution
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
      tableName: isTakeaway ? 'Takeaway' : (isDelivery ? 'Delivery' : selectedTable),
      customerName: customerName || 'Walk-in Guest',
      customerPhone: customerPhone || undefined,
      items: [...billingCart],
      subtotal,
      taxes: taxAmount,
      serviceCharge: serviceChargeAmount,
      total: grandTotal,
      status: 'Pending',
      isTakeaway,
      isDelivery,
      deliveryPartner: isDelivery ? 'Swiggy' : undefined,
      deliveryStatus: isDelivery ? 'Assigned' : undefined,
      tokenNumber: tokenStr || undefined,
      createdAt: new Date().toISOString(),
      discountApplied: discountVal
    };

    setLiveOrders([newOrder, ...liveOrders]);
    setPrintedOrder(newOrder);
    setShowReceipt(true);
    setBillingCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setAppliedCouponCode('');
    setActiveDiscountAmount(0);
    setIsDelivery(false);
    setIsTakeaway(false);
  };

  // Split bill equal calculator
  const triggerEqualSplitPrint = () => {
    setShowSplitModal(false);
    triggerToast(`Split bills printed: ₹${Math.round(grandTotal / splitGuestsCount)} per guest.`);
  };

  // Shift & Cash Drawer Functions
  const handleCashEntry = (type: 'IN' | 'OUT') => {
    const val = type === 'IN' ? cashInVal : cashOutVal;
    if (!val || !cashInOutReason) {
      triggerToast('Enter amount and reason.');
      return;
    }
    const amount = Number(val);
    const newTx = {
      id: 'tx_' + Date.now(),
      type,
      amount,
      reason: cashInOutReason,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setCashTransactions([newTx, ...cashTransactions]);
    if (type === 'IN') {
      triggerToast(`Cash In logged: +₹${amount}`);
      setCashInVal('');
    } else {
      triggerToast(`Cash Out logged: -₹${amount}`);
      setCashOutVal('');
    }
    setCashInOutReason('');
  };

  const currentDrawerCash = useMemo(() => {
    return cashTransactions.reduce((sum, tx) => {
      return tx.type === 'IN' ? sum + tx.amount : sum - tx.amount;
    }, openingBalance);
  }, [cashTransactions, openingBalance]);

  // Voice Assistant Simulation
  const handleVoiceOrderStart = () => {
    setIsListening(true);
    setVoiceQueryText('Listening for dishes...');
    
    setTimeout(() => {
      setIsListening(false);
      // Simulate transcription success
      setVoiceQueryText('"Add 2 Dum Biryanis and 1 Cold Coffee"');
      
      // Add matching items
      const biryani = gourmetPresets.find(p => p.name.includes('Biryani'));
      const coffee = gourmetPresets.find(p => p.name.includes('Coffee'));
      
      if (biryani) {
        setBillingCart(prev => [
          ...prev.filter(i => i.menuItemId !== biryani.id),
          { menuItemId: biryani.id, name: biryani.name, price: biryani.price, quantity: 2 }
        ]);
      }
      if (coffee) {
        setBillingCart(prev => [
          ...prev.filter(i => i.menuItemId !== coffee.id),
          { menuItemId: coffee.id, name: coffee.name, price: coffee.price, quantity: 1 }
        ]);
      }
      triggerToast('Voice order added to billing cart!');
    }, 2500);
  };

  // Waitlist Operations
  const addToWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistName || !waitlistPhone) return;
    const newItem = {
      id: 'w_' + Date.now(),
      name: waitlistName,
      pax: Number(waitlistPax),
      phone: waitlistPhone
    };
    setWaitlistQueue([...waitlistQueue, newItem]);
    setWaitlistName('');
    setWaitlistPhone('');
    triggerToast(`Added ${newItem.name} to waitlist queue.`);
  };

  // Table management helpers
  const handleTableSeat = (tableId: string) => {
    setTablesList(prev =>
      prev.map(t =>
        t.id === tableId ? { ...t, status: 'Occupied', runningOrder: `ORD-POS-${Math.floor(1000 + Math.random() * 9000)}` } : t
      )
    );
    triggerToast('Guest seated.');
  };

  const handleTableFree = (tableId: string) => {
    setTablesList(prev =>
      prev.map(t =>
        t.id === tableId ? { ...t, status: 'Available', runningOrder: undefined } : t
      )
    );
    triggerToast('Table released.');
  };

  const handlePrint = () => {
    window.print();
  };

  // Receipt Share simulators
  const sendReceiptToMobile = (channel: 'sms' | 'whatsapp') => {
    if (!printedOrder?.customerPhone) {
      triggerToast('Add customer phone number before sharing receipt.');
      return;
    }
    const phone = printedOrder.customerPhone.replace(/\D/g, '');
    const message = encodeURIComponent(`Receipt ${printedOrder.orderNumber}. Subtotal: ₹${printedOrder.subtotal}. Grand Total: ₹${printedOrder.total}. Powered by A.K Resto.`);
    if (channel === 'whatsapp') {
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank', 'noopener,noreferrer');
      return;
    }
    triggerToast(`SMS receipt link sent to ${printedOrder.customerPhone}`);
  };

  // Totals calculations
  const totalSalesToday = useMemo(() => {
    return liveOrders.filter(o => o.status === 'Paid' || o.status === 'Ready' || o.status === 'Preparing').reduce((sum, o) => sum + o.total, 0) + 12450;
  }, [liveOrders]);

  const stockExpenses = 3400; // static demo
  const staffPayroll = 2400; // static demo
  const netProfit = totalSalesToday - (stockExpenses + staffPayroll);

  const kitchenPending = liveOrders.filter(o => o.status === 'Pending').length;
  const kitchenPreparing = liveOrders.filter(o => o.status === 'Preparing').length;
  const kitchenReady = liveOrders.filter(o => o.status === 'Ready').length;

  return (
    <div className="space-y-6 text-slate-900 bg-slate-50/50 p-1 print:p-0 print:bg-white min-h-screen max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Dynamic print settings injection */}
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
            width: ${selectedPrinterType === '80mm' ? '80mm' : '210mm'};
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

      {/* HEADER & SHORTCUTS */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200 pb-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              Operations Hub
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">Billing Counter & POS</h1>
        </div>

        {/* Shortcuts Legend */}
        <div className="flex items-center gap-3 bg-slate-100/70 border border-slate-200 px-3 py-2 rounded-xl text-[10px] font-bold text-slate-500 self-start lg:self-center">
          <span className="flex items-center gap-1"><kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300">F1</kbd> POS Terminal</span>
          <span className="flex items-center gap-1"><kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300">F2</kbd> Floor Map</span>
          <span className="flex items-center gap-1"><kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300">F3</kbd> Hold Cart</span>
          <span className="flex items-center gap-1"><kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300">F4</kbd> Quick Pay</span>
        </div>

        {/* Workspace selector tabs */}
        <div className="flex rounded-xl bg-slate-200/50 p-1 border border-slate-200 overflow-x-auto scrollbar-none shadow-xs">
          {([
            { id: 'billing', label: 'POS Terminal', icon: CreditCard },
            { id: 'tables', label: 'Floor Map', icon: Layers },
            { id: 'live-orders', label: 'Live Orders', icon: Utensils },
            { id: 'drawer', label: 'Cash Drawer Logs', icon: DollarSign },
            { id: 'settings', label: 'POS Settings', icon: Settings },
          ] as const).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm font-bold border-b-2 border-indigo-600'
                    : 'text-slate-500 hover:text-slate-900'
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
      <section className="grid gap-4 grid-cols-2 lg:grid-cols-4 no-print">
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Sales Today</p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">₹{totalSalesToday}</h3>
          <span className="text-[10px] text-slate-400 mt-1 block">Includes POS, Online & QR</span>
        </div>
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Drawer Cash</p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">₹{currentDrawerCash}</h3>
          <span className="text-[10px] text-slate-400 mt-1 block">Shift opening balance + cash-ins</span>
        </div>
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Tables</p>
          <h3 className="mt-1 text-2xl font-bold text-indigo-600">{tablesList.filter(t => t.status === 'Occupied').length} / {tablesList.length}</h3>
          <span className="text-[10px] text-slate-400 mt-1 block">Currently seated parties</span>
        </div>
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Kitchen Load</p>
          <h3 className="mt-1 text-2xl font-bold text-emerald-600">{kitchenPreparing} cooking</h3>
          <span className="text-[10px] text-slate-400 mt-1 block">{kitchenPending} pending tickets</span>
        </div>
      </section>

      {/* 1. POS TERMINAL BILLING WORKSPACE */}
      {activeTab === 'billing' && (
        <section className="grid gap-6 lg:grid-cols-[1fr_420px] no-print">
          
          {/* Menu Catalog Workspace */}
          <div className="space-y-6">
            
            {/* Today's Stats & Voice Command panel */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
                <h3 className="text-xs font-bold text-slate-550 uppercase tracking-wider mb-2">Hourly Sales Speed</h3>
                <div className="h-28 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlySalesData}>
                      <Bar dataKey="sales" fill="#4F46E5" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Voice Assist Simulation Card */}
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-550 uppercase tracking-wider flex items-center gap-1.5">
                    <Mic className="h-4 w-4 text-indigo-600" />
                    AI Voice Order Assistant
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Fast checkout transcription simulator. Click microphone to speak orders.
                  </p>
                </div>
                
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={handleVoiceOrderStart}
                    disabled={isListening}
                    className={`rounded-full h-11 w-11 flex items-center justify-center transition-all ${
                      isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    }`}
                  >
                    <Mic className="h-5 w-5" />
                  </button>
                  <div className="flex-1">
                    {isListening ? (
                      <span className="text-xs text-rose-600 font-bold animate-pulse">Transcribing speech...</span>
                    ) : (
                      <span className="text-xs text-slate-600 italic font-medium">{voiceQueryText || 'Click mic & speak order'}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Menu catalog items */}
            <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Food Catalog</h2>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCustomForm(!showCustomForm)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs flex items-center gap-1 transition-all active:scale-95"
                  >
                    <PlusCircle size={14} />
                    Add Ad-hoc Item
                  </button>
                </div>
              </div>

              {/* Custom Ad-hoc Item add form */}
              {showCustomForm && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl grid gap-3 sm:grid-cols-[1fr_120px_100px] items-end">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">Item Title</label>
                    <input
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Garlic Naan Butter Extra"
                      className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs outline-none text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">Price (₹)</label>
                    <input
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      placeholder="₹ 90"
                      type="number"
                      className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs outline-none text-slate-800"
                    />
                  </div>
                  <button
                    onClick={addCustomItemToCart}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 py-1.5 rounded-lg font-bold text-xs text-white"
                  >
                    Add to Bill
                  </button>
                </div>
              )}

              {/* Search & veg/nonveg filters */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-2.5 text-slate-400 h-4 w-4" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search catalog by name or description..."
                    className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 rounded-lg text-xs outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 w-fit">
                  <button
                    onClick={() => setVegFilter('all')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      vegFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setVegFilter('veg')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                      vegFilter === 'veg' ? 'bg-emerald-500/10 text-emerald-700' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Veg
                  </button>
                  <button
                    onClick={() => setVegFilter('nonveg')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                      vegFilter === 'nonveg' ? 'bg-rose-550/10 text-rose-700' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Non-Veg
                  </button>
                </div>
              </div>

              {/* Category buttons list */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-150">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                    categoryFilter === 'all' ? 'bg-indigo-600 text-white border-indigo-650' : 'bg-slate-50 border-slate-200 text-slate-650'
                  }`}
                >
                  All Items
                </button>
                {categoriesList.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition whitespace-nowrap ${
                      categoryFilter === cat ? 'bg-indigo-600 text-white border-indigo-650' : 'bg-slate-50 border-slate-200 text-slate-650'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Cards Grid */}
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {filteredCatalog.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200/80 p-3 rounded-xl flex flex-col justify-between shadow-xs hover:border-slate-350 transition-colors">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{item.name}</h4>
                        <span className="text-xs font-extrabold text-indigo-700">₹{item.price}</span>
                      </div>
                      <p className="text-[10px] text-slate-450 font-semibold">{item.category}</p>
                      <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed line-clamp-2">{item.description}</p>
                    </div>

                    <button
                      onClick={() => addToCart(item)}
                      className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded-lg text-xs font-bold transition-colors active:scale-95"
                    >
                      Add to Invoice
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Checkout Terminal sidebar */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 flex flex-col justify-between self-start">
            
            {/* Header info / Held orders retrieve widget */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Receipt className="h-4.5 w-4.5 text-indigo-600" />
                  Cart Invoice Details
                </h2>
                
                {heldOrders.length > 0 && (
                  <button
                    onClick={() => {
                      const id = heldOrders[0].id;
                      retrieveHeldOrder(id);
                    }}
                    className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded flex items-center gap-1 font-bold transition-colors"
                  >
                    <FolderOpen className="h-3 w-3" />
                    Retrieve Draft ({heldOrders.length})
                  </button>
                )}
              </div>

              {/* Delivery and Table configurations */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-150/60 mb-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-700">Service Mode</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1 text-xs font-bold text-slate-650 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isTakeaway}
                        disabled={isDelivery}
                        onChange={(e) => setIsTakeaway(e.target.checked)}
                        className="accent-indigo-600 h-3.5 w-3.5"
                      />
                      Takeaway
                    </label>
                    
                    <label className="flex items-center gap-1 text-xs font-bold text-slate-650 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isDelivery}
                        disabled={isTakeaway}
                        onChange={(e) => setIsDelivery(e.target.checked)}
                        className="accent-indigo-600 h-3.5 w-3.5"
                      />
                      Delivery
                    </label>
                  </div>
                </div>

                {!isTakeaway && !isDelivery && (
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold block uppercase mb-1">Seated Table</label>
                    <select
                      value={selectedTable}
                      onChange={(e) => setSelectedTable(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs outline-none text-slate-900 font-bold"
                    >
                      {tablesList.map(t => (
                        <option key={t.id} value={t.name}>{t.name} ({t.status})</option>
                      ))}
                    </select>
                  </div>
                )}

                {isDelivery && (
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold block uppercase mb-1">Delivery Address</label>
                    <input
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Enter street, apartment no..."
                      className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs outline-none text-slate-900 font-semibold"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold block uppercase mb-1">Guest Phone</label>
                    <input
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs outline-none text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold block uppercase mb-1">Guest Name</label>
                    <input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Walk-in Guest"
                      className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs outline-none text-slate-900 font-bold"
                    />
                  </div>
                </div>

                {/* Loyalty Point Tracker notification if phone input matches */}
                {customerPhone.length === 10 && (
                  <div className="bg-indigo-50 border border-indigo-150 p-2 rounded-lg text-[10px] text-indigo-800 font-semibold flex items-center justify-between">
                    <span>VIP Loyalty client: 340 points</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCouponCode('VIP50');
                        applyPromoCoupon();
                      }}
                      className="text-xs text-indigo-600 underline"
                    >
                      Apply 50% discount
                    </button>
                  </div>
                )}
              </div>

              {/* Cart Items list view */}
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {billingCart.map((item) => (
                  <div key={item.menuItemId} className="bg-slate-50 border border-slate-150 p-3 rounded-lg flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs text-slate-800 truncate">{item.name}</p>
                      <div className="flex gap-1.5 text-[9px] text-slate-400 font-semibold">
                        <span>₹{item.price} each</span>
                        {item.modifiers && item.modifiers.map(m => (
                          <span key={m} className="bg-indigo-50 text-indigo-600 px-1 rounded">{m}</span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openModifiersModal(item)}
                        className="text-[10px] text-slate-400 hover:text-indigo-600 font-bold"
                        title="Add modifiers notes"
                      >
                        Mods
                      </button>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateCartQty(item.menuItemId, item.quantity - 1)}
                          className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shadow-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-slate-800 w-3 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.menuItemId, item.quantity + 1)}
                          className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shadow-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {billingCart.length === 0 && (
                  <div className="py-12 text-center text-slate-400 text-xs font-bold border border-dashed border-slate-200 rounded-xl">
                    Cart is empty. Add menu items.
                  </div>
                )}
              </div>
            </div>

            {/* Calculations and payment triggers */}
            <div className="border-t border-slate-200 pt-3.5 space-y-4">
              
              {/* Promo Coupon apply bar */}
              <div className="flex gap-2">
                <input
                  value={appliedCouponCode}
                  onChange={(e) => setAppliedCouponCode(e.target.value)}
                  placeholder="Coupon code (FIRST15, VIP50)"
                  className="flex-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-indigo-500 font-bold"
                />
                <button
                  type="button"
                  onClick={applyPromoCoupon}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  Apply
                </button>
              </div>

              {/* Subtotal table details */}
              <div className="space-y-1 text-xs text-slate-500 font-semibold">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="text-slate-800">₹{subtotal}</span>
                </div>
                {activeDiscountAmount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Discount</span>
                    <span>-₹{activeDiscountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST ({taxPercent}%)</span>
                  <span className="text-slate-800">₹{taxAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charge ({serviceChargePercent}%)</span>
                  <span className="text-slate-800">₹{serviceChargeAmount}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-base font-extrabold border-t border-slate-100 pt-3">
                <span>Total Payable</span>
                <span className="text-indigo-600 text-xl">₹{grandTotal}</span>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-3 gap-2">
                {(['Cash', 'Card', 'UPI'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`rounded-lg border py-1.5 text-xs font-bold transition-all text-center ${
                      paymentMethod === method
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-650 hover:bg-slate-50'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowSplitModal(true)}
                  disabled={billingCart.length === 0}
                  className="rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 text-xs font-bold transition-colors disabled:opacity-50"
                >
                  Split Checks
                </button>
                <button
                  onClick={handleHoldOrder}
                  disabled={billingCart.length === 0}
                  className="rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 text-xs font-bold transition-colors disabled:opacity-50"
                >
                  Hold Draft
                </button>
              </div>

              <button
                disabled={billingCart.length === 0}
                onClick={handleCheckout}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 py-3 rounded-lg font-bold text-xs uppercase text-white shadow-sm transition-all"
              >
                Checkout & Send KOT (F4)
              </button>
            </div>

          </div>
        </section>
      )}

      {/* 2. DINE-IN FLOOR MAP VIEW */}
      {activeTab === 'tables' && (
        <section className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm space-y-6 no-print">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Live Restaurant Floor Map</h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Seat guests, transfer orders, or merge tables.</p>
            </div>
            
            <div className="flex gap-2 text-xs font-bold">
              <button
                onClick={() => triggerToast('Select two tables to merge capacities.')}
                className="rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5"
              >
                Merge Tables
              </button>
              <button
                onClick={() => triggerToast('Select source table and destination table to transfer.')}
                className="rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5"
              >
                Transfer Table
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            
            {/* Table Floor Cards grid */}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {tablesList.map((tab) => (
                <div
                  key={tab.id}
                  className={`rounded-xl border p-4 flex flex-col justify-between h-36 transition-all hover:-translate-y-0.5 ${
                    tab.status === 'Occupied'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : tab.status === 'Reserved'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-emerald-50/50 border-emerald-100 text-emerald-900'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="font-extrabold text-sm block">{tab.name}</span>
                      <span className={`text-[9px] font-bold rounded px-1.5 py-0.5 uppercase ${
                        tab.status === 'Occupied' ? 'bg-rose-100' : tab.status === 'Reserved' ? 'bg-amber-100' : 'bg-emerald-100'
                      }`}>
                        {tab.status}
                      </span>
                    </div>
                    <span className="text-[10px] opacity-75 mt-0.5 block">Max capacity: {tab.capacity} Pax</span>
                    {tab.runningOrder && (
                      <p className="text-[10px] font-bold mt-2 font-mono">Order: {tab.runningOrder}</p>
                    )}
                  </div>

                  <div className="flex gap-1.5 justify-end">
                    {tab.status === 'Available' && (
                      <button
                        onClick={() => handleTableSeat(tab.id)}
                        className="rounded-lg bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1.5 hover:bg-emerald-700 transition"
                      >
                        Seat Guest
                      </button>
                    )}
                    {tab.status === 'Occupied' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedTable(tab.name);
                            setActiveTab('billing');
                            triggerToast(`Active order loaded for ${tab.name}`);
                          }}
                          className="rounded-lg bg-white border border-rose-300 text-rose-800 text-[10px] font-bold px-2 py-1 hover:bg-rose-100 transition"
                        >
                          POS Checkout
                        </button>
                        <button
                          onClick={() => handleTableFree(tab.id)}
                          className="rounded-lg bg-white border border-slate-200 text-slate-650 text-[10px] font-bold px-2 py-1 hover:bg-slate-100 transition"
                          title="Free table"
                        >
                          Free
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Waitlist Queue panel */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-xs self-start space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b border-slate-200 pb-2 flex items-center gap-1.5">
                <Users className="h-4.5 w-4.5 text-amber-600" />
                Live Walk-in Waitlist
              </h3>

              <form onSubmit={addToWaitlist} className="space-y-2.5">
                <input
                  value={waitlistName}
                  onChange={(e) => setWaitlistName(e.target.value)}
                  placeholder="Guest Name"
                  className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs outline-none"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={waitlistPhone}
                    onChange={(e) => setWaitlistPhone(e.target.value)}
                    placeholder="Mobile"
                    className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs outline-none"
                  />
                  <select
                    value={waitlistPax}
                    onChange={(e) => setWaitlistPax(e.target.value)}
                    className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs outline-none"
                  >
                    <option value="2">2 Pax</option>
                    <option value="4">4 Pax</option>
                    <option value="6">6 Pax</option>
                    <option value="8">8+ Pax</option>
                  </select>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded-lg text-xs font-bold"
                >
                  Add to Waitlist
                </button>
              </form>

              {/* Waitlist list */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                {waitlistQueue.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-150 p-3 rounded-lg flex items-center justify-between shadow-2xs">
                    <div>
                      <p className="font-bold text-xs text-slate-800">{item.name} ({item.pax} Pax)</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.phone}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setWaitlistQueue(prev => prev.filter(w => w.id !== item.id));
                        triggerToast(`WhatsApp alert sent to ${item.name}!`);
                      }}
                      className="rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1"
                    >
                      Seat & Alert
                    </button>
                  </div>
                ))}
                {waitlistQueue.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-4">No guests currently waiting.</p>
                )}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 3. LIVE KOT FEED & DELIVERY TRACKER */}
      {activeTab === 'live-orders' && (
        <section className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm space-y-6 no-print">
          <div>
            <h2 className="text-base font-bold text-slate-900">Live KOT & Takeaway Tracker</h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Control order status, assign delivery couriers Swiggy/Zomato, and reprint receipts.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {liveOrders.map((order) => (
              <div key={order.id} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3 relative overflow-hidden">
                {order.isTakeaway && (
                  <span className="absolute top-3 right-3 bg-indigo-100 text-indigo-800 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">
                    Token: {order.tokenNumber}
                  </span>
                )}
                {order.isDelivery && (
                  <span className="absolute top-3 right-3 bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase flex items-center gap-0.5">
                    <Truck className="h-3 w-3" /> Delivery
                  </span>
                )}

                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{order.tableName}</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">{order.orderNumber}</p>
                </div>

                <div className="space-y-1.5 text-xs border-t border-slate-200 pt-2">
                  <p className="text-slate-500">Guest: <strong className="text-slate-800">{order.customerName}</strong></p>
                  
                  <div className="space-y-1 pt-1.5">
                    {order.items.map((item) => (
                      <div key={item.menuItemId} className="flex justify-between text-xs text-slate-700">
                        <span>{item.name} x{item.quantity}</span>
                        <span className="font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between border-t border-slate-200/60 pt-2 font-bold text-slate-800">
                    <span>Total Amount</span>
                    <span>₹{order.total}</span>
                  </div>
                </div>

                {/* Delivery details if any */}
                {order.isDelivery && (
                  <div className="bg-white border border-slate-200/80 p-2.5 rounded-lg space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Partner:</span>
                      <span className="font-bold text-slate-700">{order.deliveryPartner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className="font-bold text-emerald-700">{order.deliveryStatus}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setPrintedOrder(order);
                      setShowReceipt(true);
                    }}
                    className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 py-2 rounded-lg text-xs font-bold text-slate-700 transition"
                  >
                    Reprint
                  </button>
                  <button
                    onClick={() => setEditingOrder(order)}
                    className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 py-2 rounded-lg text-xs font-bold text-slate-700 transition"
                  >
                    Modify
                  </button>
                  
                  {order.status !== 'Paid' && (
                    <button
                      onClick={() => {
                        setLiveOrders(prev =>
                          prev.map(o => o.id === order.id ? { ...o, status: 'Paid' } : o)
                        );
                        triggerToast('Invoice updated to PAID status.');
                      }}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-bold transition"
                    >
                      Paid
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. CASH DRAWER & SHIFT LOGS */}
      {activeTab === 'drawer' && (
        <section className="grid gap-6 md:grid-cols-[1.5fr_1fr] no-print">
          
          {/* Cash Transactions ledger */}
          <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">Shift Transaction Activity Ledger</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-150 text-[10px] text-slate-400 uppercase font-bold bg-slate-50">
                    <th className="px-4 py-2.5">Time Log</th>
                    <th className="px-4 py-2.5">Description</th>
                    <th className="px-4 py-2.5">Type</th>
                    <th className="px-4 py-2.5 text-right">Cash Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {cashTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="px-4 py-3 text-slate-400">{tx.time}</td>
                      <td className="px-4 py-3">{tx.reason}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          tx.type === 'IN' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {tx.type === 'IN' ? 'Cash In' : 'Cash Out'}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-right font-extrabold ${
                        tx.type === 'IN' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {tx.type === 'IN' ? '+' : '-'}₹{tx.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Cash In / Cash Out controller */}
          <div className="space-y-4">
            <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Record Cash Transaction</h3>
              
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-1">Reason / Description</label>
                <input
                  value={cashInOutReason}
                  onChange={(e) => setCashInOutReason(e.target.value)}
                  placeholder="e.g. Purchased ice-creams, customer void refund..."
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5 pt-2">
                <div className="space-y-1">
                  <input
                    value={cashInVal}
                    onChange={(e) => setCashInVal(e.target.value)}
                    placeholder="₹ Cash In"
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-indigo-500 font-bold text-slate-800"
                  />
                  <button
                    onClick={() => handleCashEntry('IN')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 rounded-lg transition"
                  >
                    + Cash In
                  </button>
                </div>

                <div className="space-y-1">
                  <input
                    value={cashOutVal}
                    onChange={(e) => setCashOutVal(e.target.value)}
                    placeholder="₹ Cash Out"
                    type="number"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-indigo-500 font-bold text-slate-850"
                  />
                  <button
                    onClick={() => handleCashEntry('OUT')}
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-1.5 rounded-lg transition"
                  >
                    - Cash Out
                  </button>
                </div>
              </div>
            </div>

            {/* End of day report trigger */}
            <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm text-center space-y-2">
              <Lock className="h-6 w-6 text-slate-400 mx-auto" />
              <h4 className="font-bold text-slate-900 text-xs">End of Day Settlement</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">Deactivate counter, audit cash balances, and print final EOD settlement sheets.</p>
              <button
                onClick={() => {
                  alert(`Shift Settlement Audit:\nOpening balance: ₹${openingBalance}\nTransactions: ₹${currentDrawerCash - openingBalance}\nClosing balance: ₹${currentDrawerCash}\nReport queued for printing.`);
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg transition"
              >
                Trigger Shift Settlement
              </button>
            </div>
          </div>

        </section>
      )}

      {/* 5. SETTINGS & PRINTER WORKSPACE */}
      {activeTab === 'settings' && (
        <section className="max-w-2xl bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4 no-print mx-auto">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-600" />
            Receipt Printers & GST Rules Configuration
          </h2>

          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-650 block mb-1">Receipt Print Width Type</label>
                <select
                  value={selectedPrinterType}
                  onChange={(e) => setSelectedPrinterType(e.target.value as any)}
                  className="w-full bg-slate-55/40 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none font-bold text-slate-800"
                >
                  <option value="80mm">Thermal Printer (80mm width)</option>
                  <option value="A4">Standard Inkjet Printer (A4 width)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-650 block mb-1">GST / VAT Rate (%)</label>
                <input
                  type="number"
                  value={taxPercent}
                  onChange={(e) => {
                    setTaxPercent(Number(e.target.value));
                    localStorage.setItem('owner-tax-percent', e.target.value);
                  }}
                  className="w-full bg-slate-55/40 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none font-bold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-650 block mb-1">Standard Service Charge (%)</label>
              <input
                type="number"
                value={serviceChargePercent}
                onChange={(e) => {
                  setServiceChargePercent(Number(e.target.value));
                  localStorage.setItem('owner-service-charge-percent', e.target.value);
                }}
                className="w-full bg-slate-55/40 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none font-bold text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 py-2 border-t border-slate-150">
              <input
                type="checkbox"
                id="autoprint"
                checked={enableAutoPrint}
                onChange={(e) => setEnableAutoPrint(e.target.checked)}
                className="h-4 w-4 rounded border-slate-350 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="autoprint" className="text-xs font-bold text-slate-700">
                Trigger print preview automatically upon checkout completion
              </label>
            </div>

            <button
              onClick={() => {
                triggerToast('POS print templates and settings updated successfully.');
              }}
              className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-bold"
            >
              Save Printer Setup
            </button>
          </div>
        </section>
      )}

      {/* MODIFIERS & CHEF NOTES OVERLAY */}
      {selectedCartItemForMods && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Modifiers & Kitchen Notes</h3>
                <span className="text-[10px] text-slate-400 font-semibold">{selectedCartItemForMods.name}</span>
              </div>
              <button onClick={() => setSelectedCartItemForMods(null)}>
                <X size={15} className="text-slate-400 hover:text-slate-700" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Modifiers checklist */}
              <div>
                <span className="font-bold text-slate-500 block mb-1">Pick Add-ons</span>
                <div className="grid grid-cols-2 gap-2">
                  {['Extra Cheese', 'Less Spicy', 'Extra Butter', 'No Onion', 'Jain Style'].map((mod) => {
                    const active = activeModifiers.includes(mod);
                    return (
                      <button
                        key={mod}
                        type="button"
                        onClick={() => {
                          if (active) {
                            setActiveModifiers(activeModifiers.filter(m => m !== mod));
                          } else {
                            setActiveModifiers([...activeModifiers, mod]);
                          }
                        }}
                        className={`py-1.5 px-2.5 rounded-lg border font-bold text-center ${
                          active ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-650'
                        }`}
                      >
                        {mod}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-550 block mb-1">Chef Cooking instructions</span>
                <textarea
                  value={customItemNote}
                  onChange={(e) => setCustomItemNote(e.target.value)}
                  rows={2}
                  placeholder="e.g. Make it extra hot, serve bread separately..."
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCartItemForMods(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 py-2 rounded-lg font-bold text-slate-650"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={saveItemModifiers}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-bold shadow-sm"
                >
                  Save Modifiers
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SPLIT BILLS MODAL */}
      {showSplitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-slate-900 text-sm">Split check equally</h3>
              <button onClick={() => setShowSplitModal(false)}>
                <X size={15} />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold text-slate-700">
              <p>Grand Total: <strong className="text-slate-900 text-sm">₹{grandTotal}</strong></p>
              
              <div>
                <label className="text-[10px] text-slate-500 uppercase block mb-1">Split Guests Count</label>
                <select
                  value={splitGuestsCount}
                  onChange={(e) => setSplitGuestsCount(Number(e.target.value))}
                  className="w-full bg-slate-55/40 border border-slate-200 px-3 py-1.5 rounded-lg font-bold text-slate-800"
                >
                  {[2, 3, 4, 5, 6, 7, 8].map(n => (
                    <option key={n} value={n}>{n} Guests</option>
                  ))}
                </select>
              </div>

              <div className="bg-indigo-50 border border-indigo-150 p-3.5 rounded-lg flex items-center justify-between">
                <span>Per Guest Share</span>
                <span className="text-base font-extrabold text-indigo-700">₹{Math.round(grandTotal / splitGuestsCount)}</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowSplitModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 py-2 rounded-lg font-bold text-slate-650"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={triggerEqualSplitPrint}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-bold shadow-sm"
                >
                  Print Split Receipts
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* THERMAL RECEIPTS PRINT PREVIEW MODAL */}
      {showReceipt && printedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-slate-250 shadow-2xl space-y-4 flex flex-col items-center">
            
            <div className="w-full flex justify-between items-center no-print border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Thermal 80mm preview</span>
              <button 
                onClick={() => setShowReceipt(false)}
                className="p-1 hover:bg-slate-50 rounded text-slate-400"
              >
                <X size={15} />
              </button>
            </div>

            {/* Print Container (80mm width emulation) */}
            <div 
              id="print-receipt-modal" 
              className="w-full bg-white p-3.5 border border-dashed border-slate-300 text-slate-900 font-mono text-[10px] text-center space-y-3.5"
            >
              <div>
                <h2 className="text-sm font-bold tracking-tight">A.K RESTO POS BILL</h2>
                <p className="text-[9px] text-slate-500 font-semibold mt-0.5">GST Tax Invoice Receipt</p>
              </div>

              <div className="border-t border-b border-dashed border-slate-350 py-2 text-left space-y-0.5 text-[9px]">
                <p><strong>Bill Invoice:</strong> {printedOrder.orderNumber}</p>
                <p><strong>Timestamp:</strong> {new Date(printedOrder.createdAt).toLocaleString()}</p>
                <p><strong>Table / Mode:</strong> {printedOrder.isTakeaway ? 'Takeaway' : printedOrder.tableName}</p>
                <p><strong>Client Name:</strong> {printedOrder.customerName}</p>
                <p><strong>Payment Mode:</strong> {paymentMethod}</p>
                {printedOrder.isTakeaway && (
                  <div className="mt-1.5 text-center bg-slate-100 border border-slate-250 py-1 rounded text-sm font-extrabold text-slate-900">
                    TOKEN NO: {printedOrder.tokenNumber}
                  </div>
                )}
              </div>

              <div className="space-y-1 text-left text-[9px]">
                <div className="flex justify-between font-bold border-b border-dashed border-slate-200 pb-1">
                  <span>Description</span>
                  <span>Qty * Amt</span>
                </div>
                {printedOrder.items.map((it: any) => (
                  <div key={it.menuItemId} className="flex justify-between">
                    <span>{it.name}</span>
                    <span>{it.quantity} x ₹{it.price}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-350 pt-2 text-right space-y-0.5 text-[9px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{printedOrder.subtotal}</span>
                </div>
                {printedOrder.discountApplied && printedOrder.discountApplied > 0 ? (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>Discount:</span>
                    <span>-₹{printedOrder.discountApplied}</span>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <span>GST ({taxPercent}%):</span>
                  <span>₹{printedOrder.taxes}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charge ({serviceChargePercent}%):</span>
                  <span>₹{printedOrder.serviceCharge}</span>
                </div>
                <div className="flex justify-between font-extrabold text-xs border-t border-dashed border-slate-200 pt-1.5">
                  <span>Grand Total:</span>
                  <span>₹{printedOrder.total}</span>
                </div>
              </div>

              <div className="text-[8px] text-slate-400 font-bold pt-3">
                Thanks for dining! Powered by A.K Resto SaaS
              </div>
            </div>

            {/* Action buttons */}
            <div className="w-full flex gap-2 no-print border-t border-slate-100 pt-3">
              <button
                onClick={() => setShowReceipt(false)}
                className="flex-1 bg-slate-150 hover:bg-slate-200 py-2.5 rounded-lg text-xs font-bold text-slate-700 transition"
              >
                Close Preview
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
              >
                <Printer size={13} /> Print Slip
              </button>
            </div>
            <div className="w-full grid grid-cols-2 gap-2 no-print">
              <button
                onClick={() => sendReceiptToMobile('sms')}
                className="bg-slate-100 hover:bg-slate-200 py-2 rounded-lg text-[10px] font-bold text-slate-700 transition flex items-center justify-center gap-1"
              >
                <Smartphone size={13} /> SMS Receipt
              </button>
              <button
                onClick={() => sendReceiptToMobile('whatsapp')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 shadow-sm"
              >
                <Smartphone size={13} /> WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
