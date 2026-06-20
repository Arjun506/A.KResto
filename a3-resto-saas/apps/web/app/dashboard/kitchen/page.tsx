'use client';

import { useEffect, useMemo, useState } from 'react';
import { getOrders, updateOrderStatus } from '@/services/order.service';
import { getSocket } from '@/services/socket';
import type { Order } from '@/src/types/order.types';
import {
  ChefHat,
  Clock,
  AlertCircle,
  Play,
  Check,
  CheckSquare,
  MessageSquare,
  Package,
  PlusCircle,
  TrendingUp,
  UserCheck,
  BookOpen,
  UtensilsCrossed,
  AlertTriangle,
  Printer,
  Settings,
  DollarSign,
  Flame,
  RotateCcw,
  Calendar,
  ShieldAlert,
  ListChecks,
  Activity,
  FileText,
  CheckCircle2,
  XCircle,
  Search,
  Sparkles,
  HelpCircle,
  MapPin,
  ClipboardList
} from 'lucide-react';

// Custom illustration matching mockup
const ChefIllustration = () => (
  <svg width="100" height="70" viewBox="0 0 120 90" fill="none" className="mx-auto my-1 drop-shadow-lg">
    <rect x="25" y="70" width="70" height="8" rx="2" fill="#475569" />
    <ellipse cx="60" cy="70" rx="15" ry="3" fill="#334155" />
    <path d="M52 69C52 63 60 55 60 55C60 55 68 63 68 69C68 73.4 64.4 77 60 77C55.6 77 52 73.4 52 69Z" fill="#F97316" className="animate-pulse" />
    <path d="M56 69C56 65 60 60 60 60C60 60 64 65 64 69C64 71.8 62.2 74 60 74C57.8 74 56 71.8 56 69Z" fill="#FBBF24" />
    <rect x="40" y="58" width="36" height="6" rx="3" fill="#64748B" />
    <path d="M75 60H100V62H75V60Z" fill="#94A3B8" />
    <circle cx="48" cy="45" r="2.5" fill="#EF4444" />
    <circle cx="56" cy="40" r="3.5" fill="#10B981" />
    <circle cx="68" cy="42" r="2.5" fill="#F59E0B" />
    <path d="M60 48C62 45 64 45 66 48" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M50 30C45 28 45 20 52 18C52 14 68 14 68 18C75 20 75 28 70 30V32H50V30Z" fill="#F1F5F9" />
    <rect x="52" y="31" width="16" height="3" fill="#CBD5E1" />
  </svg>
);

// Types
type LocalOrder = {
  id: string;
  orderNumber: string;
  tableId: string;
  source: 'Dine-in' | 'Takeaway' | 'Delivery' | 'Online' | 'QR';
  priority: 'High' | 'Medium' | 'Normal' | 'Low';
  specialInstructions?: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    notes?: string;
    station: string;
  }[];
  status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  chefAssigned?: string;
  stationAssigned?: string;
  createdAt: string;
  estimatedCompletionMinutes?: number;
  qualityChecked?: boolean;
  packed?: boolean;
  cancellationReason?: string;
};

type IngredientItem = {
  id: string;
  name: string;
  qty: number;
  unit: string;
  minQty: number;
  status: 'Sufficient' | 'Low' | 'Critical';
  cost: number;
  expiryDate: string;
  supplier: string;
};

type RecipeItem = {
  id: string;
  name: string;
  category: string;
  prepTimeMins: number;
  cookTimeMins: number;
  cost: number;
  ingredients: string[];
  instructions: string[];
  portionSize: string;
};

type WastageLog = {
  id: string;
  name: string;
  qty: string;
  cost: number;
  reason: string;
  date: string;
};

type ChefStaff = {
  id: string;
  name: string;
  role: 'Head Chef' | 'Sous Chef' | 'Line Cook' | 'Commis Chef';
  station: string;
  shift: string;
  status: 'Active' | 'Break' | 'Absent';
  attendance: string;
};

export default function KitchenDashboard() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [kitchenStatus, setKitchenStatus] = useState<'Active' | 'Offline'>('Active');
  
  // Date & Time states
  const [timeStr, setTimeStr] = useState('11:42 AM');
  const [dateStr, setDateStr] = useState('31 May 2024, Friday');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(d.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric', weekday: 'long' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mock KDS Orders (Prepopulated with rich data matching all layout checklist criteria)
  const [orders, setOrders] = useState<LocalOrder[]>([
    {
      id: 'k-101',
      orderNumber: 'KOD-9281',
      tableId: 'Table 4',
      source: 'Dine-in',
      priority: 'High',
      specialInstructions: 'Allergic to peanut oil. Prepare with olive oil.',
      items: [
        { id: 'ki-1', name: 'Butter Chicken Masala', quantity: 2, notes: 'Less spicy', station: 'Grill Station' },
        { id: 'ki-2', name: 'Garlic Naan Buttered', quantity: 3, notes: 'Crispy', station: 'Tandoor/Bakery Station' }
      ],
      status: 'PENDING',
      createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 mins ago
      estimatedCompletionMinutes: 15,
      qualityChecked: false,
      packed: false
    },
    {
      id: 'k-102',
      orderNumber: 'KOD-8802',
      tableId: 'Table 12',
      source: 'QR',
      priority: 'High',
      specialInstructions: 'No onions in Salad.',
      items: [
        { id: 'ki-3', name: 'Paneer Tikka Platter', quantity: 1, station: 'Grill Station' },
        { id: 'ki-4', name: 'Mint Chutney Salad', quantity: 2, station: 'Salad Station' }
      ],
      status: 'PREPARING',
      chefAssigned: 'Chef Ramesh',
      stationAssigned: 'Grill Station',
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      estimatedCompletionMinutes: 20,
      qualityChecked: false,
      packed: false
    },
    {
      id: 'k-103',
      orderNumber: 'ZOM-8192',
      tableId: 'Delivery-1',
      source: 'Online',
      priority: 'Normal',
      items: [
        { id: 'ki-5', name: 'Margherita Pizza 12"', quantity: 2, notes: 'Extra cheese', station: 'Pizza Station' },
        { id: 'ki-6', name: 'French Fries Loaded', quantity: 1, station: 'Fry Station' }
      ],
      status: 'PREPARING',
      chefAssigned: 'Chef Priya',
      stationAssigned: 'Pizza Station',
      createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      estimatedCompletionMinutes: 18,
      qualityChecked: false,
      packed: false
    },
    {
      id: 'k-104',
      orderNumber: 'KOD-7729',
      tableId: 'Token #81',
      source: 'Takeaway',
      priority: 'Medium',
      items: [
        { id: 'ki-7', name: 'Triple Chocolate Brownie', quantity: 2, station: 'Dessert Station' },
        { id: 'ki-8', name: 'Virgin Mojito Blue', quantity: 2, station: 'Beverage Station' }
      ],
      status: 'READY',
      chefAssigned: 'Chef David',
      stationAssigned: 'Dessert Station',
      createdAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
      qualityChecked: true,
      packed: true
    },
    {
      id: 'k-105',
      orderNumber: 'SWG-1102',
      tableId: 'Delivery-2',
      source: 'Online',
      priority: 'High',
      items: [
        { id: 'ki-9', name: 'Crispy Veg Spring Rolls', quantity: 2, station: 'Fry Station' }
      ],
      status: 'PENDING',
      createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      estimatedCompletionMinutes: 10,
      qualityChecked: false,
      packed: false
    },
    {
      id: 'k-106',
      orderNumber: 'KOD-6192',
      tableId: 'Table 9',
      source: 'Dine-in',
      priority: 'Normal',
      items: [
        { id: 'ki-10', name: 'Greek Feta Salad', quantity: 1, station: 'Salad Station' }
      ],
      status: 'COMPLETED',
      chefAssigned: 'Chef Ramesh',
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      qualityChecked: true,
      packed: false
    },
    {
      id: 'k-107',
      orderNumber: 'KOD-5112',
      tableId: 'Table 2',
      source: 'Dine-in',
      priority: 'High',
      items: [
        { id: 'ki-11', name: 'Chicken Seekh Kabab', quantity: 2, station: 'Grill Station' }
      ],
      status: 'CANCELLED',
      cancellationReason: 'Customer left early',
      createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString()
    }
  ]);

  // Mock Ingredients
  const [ingredients, setIngredients] = useState<IngredientItem[]>([
    { id: 'i-1', name: 'Basmati Rice Premium', qty: 120, unit: 'kg', minQty: 50, status: 'Sufficient', cost: 110, expiryDate: '2026-09-15', supplier: 'Delhi Grain Traders' },
    { id: 'i-2', name: 'Refined Oil Sunflower', qty: 18, unit: 'Litres', minQty: 40, status: 'Critical', cost: 145, expiryDate: '2026-07-20', supplier: 'Vardhman Edibles' },
    { id: 'i-3', name: 'Fresh Paneer/Cottage Cheese', qty: 2.5, unit: 'kg', minQty: 10, status: 'Critical', cost: 320, expiryDate: '2026-06-18', supplier: 'Mother Dairy Direct' },
    { id: 'i-4', name: 'Boneless Chicken Marinade', qty: 45, unit: 'kg', minQty: 25, status: 'Sufficient', cost: 260, expiryDate: '2026-06-17', supplier: 'Nandu Hatcheries' },
    { id: 'i-5', name: 'Amul Salted Butter Block', qty: 4.8, unit: 'kg', minQty: 15, status: 'Low', cost: 520, expiryDate: '2026-08-10', supplier: 'Amul Dist. Centre' },
    { id: 'i-6', name: 'Mozzarella Shredded Cheese', qty: 8.2, unit: 'kg', minQty: 20, status: 'Low', cost: 480, expiryDate: '2026-07-02', supplier: 'Amul Dist. Centre' }
  ]);

  // Mock Recipes
  const [recipes, setRecipes] = useState<RecipeItem[]>([
    {
      id: 'r-1',
      name: 'Butter Chicken Masala',
      category: 'Main Course',
      prepTimeMins: 10,
      cookTimeMins: 15,
      cost: 135,
      portionSize: 'Single Bowl (450g)',
      ingredients: ['Boneless Chicken (250g)', 'Salted Butter (30g)', 'Fresh Cream (20ml)', 'Onion Tomato Paste (120g)', 'Garam Masala Spices (5g)'],
      instructions: [
        'Sauté marinated chicken cubes in tandoor or pan for 8 minutes until light golden.',
        'Heat butter in a separate skillet, add spiced tomato onion gravy base and simmer.',
        'Fold in cream and cook on slow heat for 4 minutes.',
        'Add cooked chicken cubes, adjust spice seasoning, garnish with coriander leaves and a slice of butter.'
      ]
    },
    {
      id: 'r-2',
      name: 'Paneer Tikka Platter',
      category: 'Starters',
      prepTimeMins: 12,
      cookTimeMins: 10,
      cost: 95,
      portionSize: 'Plate (6 Cubes)',
      ingredients: ['Fresh Paneer (200g)', 'Capsicum & Onion Shards (80g)', 'Spiced Yogurt Marinade (40g)', 'Chaot Masala & Lemon (5g)'],
      instructions: [
        'Cut paneer blocks and veggies into thick uniform squares.',
        'Toss lightly in spiced mustard oil yogurt marinade and sit for 10 minutes.',
        'Skewer alternatively and cook in active clay tandoor oven for 6 to 8 minutes.',
        'Brush with melted butter, sprinkle chaat masala and serve hot with mint chutney.'
      ]
    },
    {
      id: 'r-3',
      name: 'Margherita Pizza 12"',
      category: 'Pizza',
      prepTimeMins: 8,
      cookTimeMins: 7,
      cost: 80,
      portionSize: '1 Pizza (8 Slices)',
      ingredients: ['Fermented Pizza Dough (220g)', 'Classic Tomato Sauce (80g)', 'Mozzarella Cheese (120g)', 'Basil Leaves & Olive Oil (5ml)'],
      instructions: [
        'Stretch fermented pizza dough to 12 inches circular shape.',
        'Spread fresh tomato pizza sauce evenly, leaving 1cm edge.',
        'Distribute mozzarella cheese evenly and add basil leaves.',
        'Bake in woodfired pizza deck oven at 350°C for 6 to 7 minutes until crust is blistered and cheese is bubbly.'
      ]
    }
  ]);

  // Wastage Logs
  const [wastageLogs, setWastageLogs] = useState<WastageLog[]>([
    { id: 'w-1', name: 'Sunflower Oil (Spilled)', qty: '2 Ltr', cost: 290, reason: 'Accidentally knocked over fry station dispenser', date: '2026-06-13' },
    { id: 'w-2', name: 'Paneer (Burnt)', qty: '0.8 kg', cost: 256, reason: 'Overcooked in tandoor during rush', date: '2026-06-14' },
    { id: 'w-3', name: 'Spring Rolls (Returned)', qty: '1 Plate', cost: 120, reason: 'Cold serving complaint by Table 1', date: '2026-06-14' }
  ]);

  // Chef roster schedules
  const [chefs, setChefs] = useState<ChefStaff[]>([
    { id: 'c-1', name: 'Chef Raj', role: 'Head Chef', station: 'All Stations', shift: 'Morning (09:00 - 18:00)', status: 'Active', attendance: 'Clocked In' },
    { id: 'c-2', name: 'Chef Ramesh', role: 'Sous Chef', station: 'Grill Station', shift: 'Morning (09:00 - 18:00)', status: 'Active', attendance: 'Clocked In' },
    { id: 'c-3', name: 'Chef Priya', role: 'Line Cook', station: 'Pizza & Pasta', shift: 'Evening (15:00 - 23:00)', status: 'Active', attendance: 'Clocked In' },
    { id: 'c-4', name: 'Chef David', role: 'Line Cook', station: 'Dessert Station', shift: 'Morning (09:00 - 18:00)', status: 'Break', attendance: 'On Break' },
    { id: 'c-5', name: 'Chef Amit', role: 'Commis Chef', station: 'Fry Station', shift: 'Full Day (11:00 - 22:00)', status: 'Active', attendance: 'Clocked In' }
  ]);

  // Form states for stock requests and recipe creations
  const [showStockModal, setShowStockModal] = useState(false);
  const [newStockName, setNewStockName] = useState('');
  const [newStockQty, setNewStockQty] = useState('');

  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [recipeName, setRecipeName] = useState('');
  const [recipeCategory, setRecipeCategory] = useState('Main Course');
  const [recipePrepTime, setRecipePrepTime] = useState(10);
  const [recipeCookTime, setRecipeCookTime] = useState(15);
  const [recipeCost, setRecipeCost] = useState(100);
  const [recipePortion, setRecipePortion] = useState('1 Portion');
  const [recipeIngredients, setRecipeIngredients] = useState('');
  const [recipeInstructions, setRecipeInstructions] = useState('');

  // Status transitions
  const handleStartPrep = (orderId: string, minutes: number = 15) => {
    setOrders(current =>
      current.map(o =>
        o.id === orderId
          ? { ...o, status: 'PREPARING', estimatedCompletionMinutes: minutes, chefAssigned: o.chefAssigned || 'Chef Ramesh' }
          : o
      )
    );
  };

  const handleMarkReady = (orderId: string) => {
    setOrders(current =>
      current.map(o =>
        o.id === orderId ? { ...o, status: 'READY', qualityChecked: true, packed: true } : o
      )
    );
  };

  const handleCompleteOrder = (orderId: string) => {
    setOrders(current =>
      current.map(o =>
        o.id === orderId ? { ...o, status: 'COMPLETED' } : o
      )
    );
  };

  const handleCancelOrder = (orderId: string, reason: string) => {
    setOrders(current =>
      current.map(o =>
        o.id === orderId ? { ...o, status: 'CANCELLED', cancellationReason: reason } : o
      )
    );
  };

  const handleAssignChef = (orderId: string, chefName: string) => {
    setOrders(current =>
      current.map(o =>
        o.id === orderId ? { ...o, chefAssigned: chefName } : o
      )
    );
  };

  const handleAssignStation = (orderId: string, stationName: string) => {
    setOrders(current =>
      current.map(o =>
        o.id === orderId ? { ...o, stationAssigned: stationName } : o
      )
    );
  };

  const handleStockRequest = () => {
    if (!newStockName || !newStockQty) return;
    const qtyVal = parseFloat(newStockQty) || 10;
    const unitPart = newStockQty.replace(/[0-9.]/g, '').trim() || 'kg';
    const newIng: IngredientItem = {
      id: `i-${Date.now()}`,
      name: newStockName,
      qty: 0,
      unit: unitPart,
      minQty: qtyVal,
      status: 'Critical',
      cost: 150,
      expiryDate: '-',
      supplier: 'Self Request'
    };
    setIngredients([newIng, ...ingredients]);
    setNewStockName('');
    setNewStockQty('');
    setShowStockModal(false);
  };

  const handleCreateRecipe = () => {
    if (!recipeName) return;
    const newRecipe: RecipeItem = {
      id: `r-${Date.now()}`,
      name: recipeName,
      category: recipeCategory,
      prepTimeMins: recipePrepTime,
      cookTimeMins: recipeCookTime,
      cost: recipeCost,
      portionSize: recipePortion,
      ingredients: recipeIngredients.split('\n').filter(i => i.trim() !== ''),
      instructions: recipeInstructions.split('\n').filter(i => i.trim() !== '')
    };
    setRecipes([newRecipe, ...recipes]);
    setRecipeName('');
    setRecipeIngredients('');
    setRecipeInstructions('');
    setShowRecipeModal(false);
  };

  // Metrics calculators
  const ordersNewCount = useMemo(() => orders.filter(o => o.status === 'PENDING').length, [orders]);
  const ordersPreparingCount = useMemo(() => orders.filter(o => o.status === 'PREPARING').length, [orders]);
  const ordersReadyCount = useMemo(() => orders.filter(o => o.status === 'READY').length, [orders]);
  const lowStockCount = useMemo(() => ingredients.filter(i => i.status === 'Low' || i.status === 'Critical').length, [ingredients]);

  // Sidebar link definitions mapping to mockup
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'new-orders', label: 'New Orders', icon: AlertCircle, badge: ordersNewCount, badgeColor: 'bg-[#EF4444] text-white' },
    { id: 'preparing', label: 'Preparing', icon: Clock, badge: ordersPreparingCount, badgeColor: 'bg-[#F97316] text-white' },
    { id: 'ready-to-serve', label: 'Ready to Serve', icon: ChefHat, badge: ordersReadyCount, badgeColor: 'bg-[#10B981] text-white' },
    { id: 'completed', label: 'Completed', icon: CheckSquare },
    { id: 'cancelled', label: 'Cancelled', icon: XCircle }
  ];

  const kitchenModules = [
    { id: 'prep-time', label: 'Preparation Time', icon: Clock },
    { id: 'recipe-management', label: 'Recipe & Items', icon: BookOpen },
    { id: 'stock-inventory', label: 'Stock & Inventory', icon: Package, badge: lowStockCount, badgeColor: 'bg-[#EF4444] text-white' },
  ];

  const manageModules = [
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'staff', label: 'Staff Management', icon: UserCheck },
    { id: 'settings', label: 'Kitchen Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#0B0F19] text-slate-100 overflow-hidden font-sans">
      
      {/* 1. MOCKUP SIDEBAR CONTAINER */}
      <aside className="w-64 bg-[#0F172A] border-r border-[#1E293B] flex flex-col justify-between flex-shrink-0 select-none overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        <div className="p-4 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#1E293B]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-xl shadow-lg shadow-orange-500/20">
              🍳
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-white leading-none">Spice Corner</h1>
              <span className="text-[10px] text-[#F97316] font-extrabold uppercase tracking-widest mt-1 block">Kitchen Dashboard</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            {/* Group 1: General/Dashboard */}
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                  activeTab === 'dashboard'
                    ? 'bg-[#F97316] text-white shadow-lg shadow-orange-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp size={15} />
                  <span>Dashboard</span>
                </div>
              </button>
            </div>

            {/* Group 2: ORDERS */}
            <div className="space-y-1">
              <span className="px-3 text-[9px] font-black uppercase tracking-wider text-slate-500 block mb-1">Orders</span>
              {navigationItems.slice(1).map(item => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isSelected
                        ? 'bg-[#F97316] text-white shadow-lg shadow-orange-500/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className={isSelected ? 'text-white' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Group 3: KITCHEN */}
            <div className="space-y-1">
              <span className="px-3 text-[9px] font-black uppercase tracking-wider text-slate-500 block mb-1">Kitchen</span>
              {kitchenModules.map(item => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isSelected
                        ? 'bg-[#F97316] text-white shadow-lg shadow-orange-500/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className={isSelected ? 'text-white' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Group 4: MANAGE */}
            <div className="space-y-1">
              <span className="px-3 text-[9px] font-black uppercase tracking-wider text-slate-500 block mb-1">Manage</span>
              {manageModules.map(item => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                      isSelected
                        ? 'bg-[#F97316] text-white shadow-lg shadow-orange-500/25'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className={isSelected ? 'text-white' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer Illustration Widget (Matching Image mockup) */}
        <div className="p-4 border-t border-[#1E293B]">
          <div className="bg-[#1E293B] rounded-2xl p-3 relative overflow-hidden shadow-inner text-center border border-[#334155]/40">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Kitchen Status</span>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[9px] font-black">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span>Active</span>
              </div>
            </div>
            
            <div className="my-1 text-slate-200">
              <h3 className="text-lg font-black tracking-tight leading-none text-white">{timeStr.split(' ')[0]} <span className="text-xs font-semibold">{timeStr.split(' ')[1]}</span></h3>
              <p className="text-[9px] text-slate-400 font-bold mt-1">{dateStr}</p>
            </div>

            <ChefIllustration />

            <div className="grid grid-cols-2 gap-2 border-t border-[#334155] pt-2.5 mt-2.5 text-left text-[10px]">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px] block">Today's Orders</span>
                <span className="text-sm font-black text-white">56</span>
              </div>
              <div className="border-l border-[#334155] pl-2">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[8px] block">In Progress</span>
                <span className="text-sm font-black text-[#F97316]">15</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. PRIMARY VIEW WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0B0F19] overflow-hidden">
        
        {/* Top Header Panel */}
        <header className="h-16 border-b border-[#1E293B] bg-[#0F172A] px-6 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2 uppercase tracking-wide">
              {activeTab === 'dashboard' && 'Kitchen Operations Desk'}
              {activeTab === 'new-orders' && 'KDS Tickets: New Incoming'}
              {activeTab === 'preparing' && 'KDS Tickets: Cooking Queue'}
              {activeTab === 'ready-to-serve' && 'KDS Tickets: Ready for Service'}
              {activeTab === 'completed' && 'KDS Tickets: Completed History'}
              {activeTab === 'cancelled' && 'KDS Tickets: Cancelled Logs'}
              {activeTab === 'prep-time' && 'Cooking Duration & Delay Analytics'}
              {activeTab === 'recipe-management' && 'Smart Recipe & Portion Guide'}
              {activeTab === 'stock-inventory' && 'Inventory Stock Level Dashboard'}
              {activeTab === 'reports' && 'Kitchen Performance Reports'}
              {activeTab === 'staff' && 'Chef Scheduling & Shifts'}
              {activeTab === 'settings' && 'KDS Configuration Panel'}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Spice Corner fine dining automation stack.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setKitchenStatus(kitchenStatus === 'Active' ? 'Offline' : 'Active')}
              className={`text-xs px-3 py-1.5 rounded-lg font-black transition ${
                kitchenStatus === 'Active' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'
              }`}
            >
              Status: {kitchenStatus}
            </button>
            <button
              onClick={() => setShowStockModal(true)}
              className="bg-[#F97316] hover:bg-orange-600 text-white text-xs px-4 py-2 rounded-xl font-black transition active:scale-95 shadow-lg shadow-orange-500/20 flex items-center gap-1.5"
            >
              <PlusCircle size={14} />
              Request Stock
            </button>
          </div>
        </header>

        {/* Content Pane */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* KPIs Row */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-[#0F172A] border border-[#1E293B] p-4.5 rounded-2xl">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Today's Orders</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-white">56</span>
                    <span className="text-[10px] text-emerald-400 font-bold">+12% vs yest</span>
                  </div>
                </div>
                <div className="bg-[#0F172A] border border-[#1E293B] p-4.5 rounded-2xl">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Active cooking</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-[#F97316]">{ordersPreparingCount}</span>
                    <span className="text-[10px] text-slate-400 font-bold">In progress</span>
                  </div>
                </div>
                <div className="bg-[#0F172A] border border-[#1E293B] p-4.5 rounded-2xl">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Ready to serve</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-emerald-400">{ordersReadyCount}</span>
                    <span className="text-[10px] text-slate-400 font-bold">Pickups pending</span>
                  </div>
                </div>
                <div className="bg-[#0F172A] border border-[#1E293B] p-4.5 rounded-2xl">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Avg Prep Time</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-white">14.2m</span>
                    <span className="text-[10px] text-emerald-400 font-bold">-1.5m better</span>
                  </div>
                </div>
                <div className="bg-[#0F172A] border border-[#1E293B] p-4.5 rounded-2xl col-span-2 lg:col-span-1">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Low Stock Alerts</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-red-500">{lowStockCount}</span>
                    <span className="text-[10px] text-red-400 font-bold">Reorder recommended</span>
                  </div>
                </div>
              </div>

              {/* Main analytics grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Station Load & Chef availability */}
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Flame size={14} className="text-[#F97316]" /> Live Station Heat Load
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Grill Station', load: 85, color: 'bg-red-500', chefs: 'Chef Ramesh, Chef Amit' },
                      { name: 'Pizza Station', load: 60, color: 'bg-orange-500', chefs: 'Chef Priya' },
                      { name: 'Fry Station', load: 30, color: 'bg-yellow-500', chefs: 'Chef Amit' },
                      { name: 'Salad Station', load: 15, color: 'bg-emerald-500', chefs: 'Chef Ramesh' },
                      { name: 'Dessert Station', load: 10, color: 'bg-emerald-500', chefs: 'Chef David' }
                    ].map((st, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-200">{st.name}</span>
                          <span className="text-slate-400">{st.load}% Load</span>
                        </div>
                        <div className="w-full bg-[#1E293B] h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full ${st.color}`} style={{ width: `${st.load}%` }} />
                        </div>
                        <span className="text-[9px] text-slate-500 font-bold block">{st.chefs}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delay & Priority Alerts */}
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert size={14} className="text-red-500" /> Active Delay Warnings
                  </h3>
                  <div className="space-y-3">
                    {orders.filter(o => o.status === 'PREPARING').map((o, idx) => {
                      const elapsed = 14; // simulated minutes elapsed
                      const limit = o.estimatedCompletionMinutes || 15;
                      const isDelay = elapsed >= limit;
                      return (
                        <div key={idx} className="p-3 rounded-xl bg-[#1E293B]/60 border border-[#334155]/40 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-black text-white">{o.orderNumber} ({o.tableId})</span>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Assigned to: {o.chefAssigned}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              isDelay ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                            }`}>
                              {isDelay ? 'Delay Alert' : 'On Track'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-1">{elapsed}m / {limit}m limit</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* AI Predictive Analytics Smart Widget */}
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} className="text-orange-400" /> AI Demand Forecast
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Based on historic Sunday lunch analytics: Peak starts in 45 mins.</p>
                  </div>
                  <div className="space-y-3 my-2">
                    <div className="p-3 bg-[#1E293B] rounded-xl border border-[#334155]/30">
                      <span className="text-[9px] text-[#F97316] font-black uppercase tracking-wider block">Recommended Prep</span>
                      <p className="text-xs font-bold text-white mt-1">Pre-prep 15 units of Butter Chicken Gravy & 10 units Paneer Tikka marinade.</p>
                    </div>
                    <div className="p-3 bg-[#1E293B] rounded-xl border border-[#334155]/30">
                      <span className="text-[9px] text-emerald-400 font-black uppercase tracking-wider block">Est. Peak Traffic</span>
                      <p className="text-xs font-bold text-white mt-1">Expected 42 Dine-In orders between 13:00 - 14:30. Highly likely Delivery volume surge (+30%).</p>
                    </div>
                  </div>
                  <div className="text-[9px] text-slate-500 text-center font-bold">
                    Last sync: Just now • AI suggestions auto-refresh
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2 TO 6: KDS TICKETS LIST */}
          {['new-orders', 'preparing', 'ready-to-serve', 'completed', 'cancelled'].includes(activeTab) && (
            <div className="space-y-6">
              {/* Filters / Counter summary */}
              <div className="flex flex-wrap gap-2 items-center justify-between pb-2 border-b border-[#1E293B]">
                <div className="flex gap-2">
                  {['All', 'Dine-in', 'Takeaway', 'Online', 'QR'].map(src => (
                    <button
                      key={src}
                      className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-bold border border-[#1E293B]"
                    >
                      {src}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-slate-400 font-bold">
                  Showing {
                    orders.filter(o => {
                      if (activeTab === 'new-orders') return o.status === 'PENDING';
                      if (activeTab === 'preparing') return o.status === 'PREPARING';
                      if (activeTab === 'ready-to-serve') return o.status === 'READY';
                      if (activeTab === 'completed') return o.status === 'COMPLETED';
                      if (activeTab === 'cancelled') return o.status === 'CANCELLED';
                      return true;
                    }).length
                  } active ticket cards
                </div>
              </div>

              {/* Grid of Ticket Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.filter(o => {
                  if (activeTab === 'new-orders') return o.status === 'PENDING';
                  if (activeTab === 'preparing') return o.status === 'PREPARING';
                  if (activeTab === 'ready-to-serve') return o.status === 'READY';
                  if (activeTab === 'completed') return o.status === 'COMPLETED';
                  if (activeTab === 'cancelled') return o.status === 'CANCELLED';
                  return true;
                }).map(order => {
                  const minutesElapsed = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);
                  return (
                    <div key={order.id} className="bg-[#0F172A] border border-[#1E293B] rounded-2xl flex flex-col justify-between overflow-hidden shadow-xl hover:border-slate-700 transition duration-150">
                      
                      {/* Ticket Header */}
                      <div className="p-4 bg-[#1E293B] border-b border-[#334155]/30 flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white">{order.orderNumber}</span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                              order.source === 'Dine-in' ? 'bg-[#4F46E5]/20 text-[#818CF8]' :
                              order.source === 'QR' ? 'bg-emerald-500/20 text-emerald-400' :
                              order.source === 'Online' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {order.source}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold mt-1">{order.tableId}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                          order.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                          order.priority === 'Medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-600/20 text-slate-300'
                        }`}>
                          {order.priority} Priority
                        </span>
                      </div>

                      {/* Ticket Items */}
                      <div className="p-4 space-y-3 flex-1">
                        {order.specialInstructions && (
                          <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-400 font-bold">
                            ⚠️ Instructions: {order.specialInstructions}
                          </div>
                        )}
                        <div className="space-y-2">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs p-2.5 bg-[#1E293B]/40 rounded-xl border border-[#334155]/20">
                              <div>
                                <span className="font-bold text-slate-200">{it.name}</span>
                                <span className="text-[9px] text-[#F97316] font-bold block mt-0.5">{it.station}</span>
                                {it.notes && <p className="text-[9px] text-slate-400 italic mt-0.5">Notes: {it.notes}</p>}
                              </div>
                              <span className="font-black text-white bg-slate-800 px-2 py-0.5 rounded">x{it.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ticket Actions & Footer */}
                      <div className="p-4 border-t border-[#1E293B] bg-[#101726]/40 space-y-3">
                        <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                          <span>Elapsed: {minutesElapsed} mins</span>
                          {order.estimatedCompletionMinutes && (
                            <span>Est: {order.estimatedCompletionMinutes} mins limit</span>
                          )}
                        </div>

                        {/* Dropdown Assignments (Chef / Station) */}
                        {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div>
                              <label className="text-[8px] uppercase tracking-wider text-slate-500 block mb-1">Chef</label>
                              <select
                                value={order.chefAssigned || ''}
                                onChange={(e) => handleAssignChef(order.id, e.target.value)}
                                className="w-full bg-[#1E293B] border border-[#334155] rounded px-2 py-1 outline-none text-slate-200"
                              >
                                <option value="">Assign Chef</option>
                                {chefs.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="text-[8px] uppercase tracking-wider text-slate-500 block mb-1">Station</label>
                              <select
                                value={order.stationAssigned || ''}
                                onChange={(e) => handleAssignStation(order.id, e.target.value)}
                                className="w-full bg-[#1E293B] border border-[#334155] rounded px-2 py-1 outline-none text-slate-200"
                              >
                                <option value="">Assign Station</option>
                                <option value="Grill Station">Grill Station</option>
                                <option value="Pizza Station">Pizza Station</option>
                                <option value="Fry Station">Fry Station</option>
                                <option value="Salad Station">Salad Station</option>
                                <option value="Dessert Station">Dessert Station</option>
                                <option value="Beverage Station">Beverage Station</option>
                                <option value="Bakery Station">Bakery Station</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* Workflow Buttons */}
                        <div className="pt-2 border-t border-[#1E293B] flex gap-2">
                          {order.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleStartPrep(order.id, 15)}
                                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs py-2 rounded-xl transition flex items-center justify-center gap-1 shadow-sm"
                              >
                                <Play size={12} /> Start Prep
                              </button>
                              <button
                                onClick={() => handleCancelOrder(order.id, 'Chef Rejected')}
                                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold text-xs px-3 rounded-xl transition"
                              >
                                Void
                              </button>
                            </>
                          )}

                          {order.status === 'PREPARING' && (
                            <>
                              <button
                                onClick={() => handleMarkReady(order.id)}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2 rounded-xl transition flex items-center justify-center gap-1 shadow-sm"
                              >
                                <Check size={12} /> Mark Ready
                              </button>
                            </>
                          )}

                          {order.status === 'READY' && (
                            <button
                              onClick={() => handleCompleteOrder(order.id)}
                              className="w-full bg-[#F97316] hover:bg-orange-600 text-white font-black text-xs py-2 rounded-xl transition flex items-center justify-center gap-1 shadow-sm"
                            >
                              <CheckSquare size={12} /> Mark Served & Closed
                            </button>
                          )}

                          {order.status === 'COMPLETED' && (
                            <div className="w-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-center text-xs font-black">
                              ✓ Ticket Served & Closed
                            </div>
                          )}

                          {order.status === 'CANCELLED' && (
                            <div className="w-full bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-xl text-center text-xs font-bold">
                              Voided: {order.cancellationReason || 'Unknown reason'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 7: PREPARATION TIME */}
          {activeTab === 'prep-time' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Prep Time Settings */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4 lg:col-span-2">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Item cooking times (KDS Settings)</h3>
                <div className="space-y-3">
                  {[
                    { item: 'Butter Chicken Masala', category: 'Gravy Course', defaultMins: 15, currentMins: 15 },
                    { item: 'Paneer Tikka Platter', category: 'Tandoor Starter', defaultMins: 10, currentMins: 12 },
                    { item: 'Margherita Pizza 12"', category: 'Baking Deck', defaultMins: 8, currentMins: 8 },
                    { item: 'French Fries Loaded', category: 'Deep Fryer', defaultMins: 6, currentMins: 5 },
                    { item: 'Virgin Mojito Blue', category: 'Beverages Counter', defaultMins: 4, currentMins: 4 }
                  ].map((it, idx) => (
                    <div key={idx} className="p-3 bg-[#1E293B] rounded-xl flex items-center justify-between gap-4 text-xs">
                      <div>
                        <span className="font-bold text-white block">{it.item}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{it.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Target Time:</span>
                        <input
                          type="number"
                          defaultValue={it.currentMins}
                          className="w-14 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-center outline-none font-black text-white"
                        />
                        <span className="text-slate-400">mins</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Time Reports & Delays */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Preparation analytics</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-[#1E293B] rounded-xl border border-[#334155]/30">
                    <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider">Category Wise average</span>
                    <div className="mt-3 space-y-2">
                      {[
                        { cat: 'Main Course', avg: 14.5 },
                        { cat: 'Starters', avg: 10.2 },
                        { cat: 'Pizza / Baked', avg: 8.8 },
                        { cat: 'Beverages', avg: 3.5 }
                      ].map((c, i) => (
                        <div key={i} className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300">{c.cat}</span>
                          <span className="text-white font-black">{c.avg} mins</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-[#1E293B] rounded-xl border border-[#334155]/30">
                    <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider text-red-400">Delay tracking</span>
                    <div className="mt-2 text-xs text-slate-300 leading-relaxed font-bold">
                      Chef Amit reported minor delays at Fry Station due to oil temperature drop. Average delay: +3.2 mins. Resolved.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: RECIPE MANAGEMENT */}
          {activeTab === 'recipe-management' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-2 border-b border-[#1E293B]">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Active Recipes Library</h3>
                <button
                  onClick={() => setShowRecipeModal(true)}
                  className="bg-[#F97316] hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  <PlusCircle size={13} />
                  Add Recipe
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {recipes.map(recipe => (
                  <div key={recipe.id} className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4 shadow-xl">
                    <div className="flex justify-between items-start border-b border-[#1E293B] pb-3">
                      <div>
                        <h4 className="font-black text-white text-base leading-snug">{recipe.name}</h4>
                        <span className="text-[10px] text-slate-400 font-bold">{recipe.category} • {recipe.portionSize}</span>
                      </div>
                      <span className="text-emerald-400 font-black text-xs">Cost: ₹{recipe.cost}</span>
                    </div>

                    {/* Ingredients list */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#F97316] font-black uppercase tracking-wider">Ingredients & Portions</span>
                      <ul className="text-xs text-slate-300 font-semibold space-y-1 list-disc pl-4">
                        {recipe.ingredients.map((ing, idx) => (
                          <li key={idx}>{ing}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Cooking steps */}
                    <div className="space-y-2 border-t border-[#1E293B] pt-3">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Cooking Instructions</span>
                      <ol className="text-xs text-slate-450 font-bold space-y-2 list-decimal pl-4 leading-normal">
                        {recipe.instructions.map((step, idx) => (
                          <li key={idx} className="pl-1">{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="flex gap-4 text-[10px] text-slate-500 font-bold border-t border-[#1E293B] pt-3">
                      <span>Prep: {recipe.prepTimeMins}m</span>
                      <span>Cook: {recipe.cookTimeMins}m</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: STOCK & INVENTORY */}
          {activeTab === 'stock-inventory' && (
            <div className="space-y-6">
              {/* Warning Dashboard */}
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Critical Inventory Warning</h4>
                  <p className="text-[10px] text-slate-300 font-bold mt-0.5">
                    {ingredients.filter(i => i.status === 'Critical').map(i => i.name).join(', ')} are below safety levels. AI recommends reordering immediately.
                  </p>
                </div>
              </div>

              {/* Stock Grid & Requests */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4 lg:col-span-2">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Kitchen Ingredient Quantities</h3>
                  <div className="space-y-2.5">
                    {ingredients.map(item => (
                      <div key={item.id} className="p-3 bg-[#1E293B] rounded-xl flex items-center justify-between gap-4 text-xs">
                        <div>
                          <span className="font-bold text-white block">{item.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">Supplier: {item.supplier}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-slate-300 font-bold">{item.qty} {item.unit}</span>
                            <p className="text-[9px] text-slate-500 font-semibold mt-0.5">Min: {item.minQty} {item.unit}</p>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase ${
                            item.status === 'Sufficient' ? 'bg-emerald-500/15 text-emerald-400' :
                            item.status === 'Low' ? 'bg-yellow-500/15 text-yellow-400' : 'bg-red-500/15 text-red-400'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Auto reorder recommendations</h3>
                  <div className="space-y-3">
                    {[
                      { item: 'Refined Oil Sunflower', rec: '40 Litres', supplier: 'Vardhman Edibles' },
                      { item: 'Fresh Paneer/Cottage Cheese', rec: '15 kg', supplier: 'Mother Dairy Direct' },
                      { item: 'Amul Salted Butter Block', rec: '20 kg', supplier: 'Amul Dist. Centre' }
                    ].map((re, idx) => (
                      <div key={idx} className="p-3 bg-[#1E293B] rounded-xl border border-[#334155]/40 text-xs">
                        <span className="font-black text-white">{re.item}</span>
                        <div className="flex justify-between items-center mt-2 text-[10px] text-slate-400 font-bold">
                          <span>Quantity: {re.rec}</span>
                          <span>Supplier: {re.supplier}</span>
                        </div>
                        <button className="w-full mt-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-black text-[9px] py-1.5 rounded-lg transition">
                          Approve Auto-Order
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: REPORTS */}
          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Wastage Logs */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4 lg:col-span-2">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Kitchen Wastage cost log</h3>
                <div className="space-y-2.5">
                  {wastageLogs.map(w => (
                    <div key={w.id} className="p-3 bg-[#1E293B] rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-black text-white block">{w.name} ({w.qty})</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{w.reason}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-red-400 font-black">₹{w.cost}</span>
                        <p className="text-[9px] text-slate-500 font-semibold mt-0.5">{w.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reports Dashboard */}
              <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Weekly kitchen summary</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-[#1E293B] rounded-xl">
                    <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider">Wastage Analytics</span>
                    <h4 className="text-xl font-black text-white mt-1">₹666</h4>
                    <p className="text-[10px] text-emerald-400 font-bold mt-0.5">▼ 15% improvement vs last week</p>
                  </div>
                  <div className="p-4 bg-[#1E293B] rounded-xl">
                    <span className="text-slate-400 text-[10px] font-bold block uppercase tracking-wider">Chef Performance Index</span>
                    <h4 className="text-xl font-black text-white mt-1">94.8%</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Average tickets completed under target time limit</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: STAFF MANAGEMENT */}
          {activeTab === 'staff' && (
            <div className="space-y-6">
              <h3 className="text-sm font-black text-white uppercase tracking-wider pb-2 border-b border-[#1E293B]">Shift scheduling roster</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chefs.map(chef => (
                  <div key={chef.id} className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4.5 space-y-4 flex flex-col justify-between hover:border-slate-700 transition">
                    <div>
                      <div className="flex justify-between items-start pb-2 border-b border-[#1E293B]">
                        <div>
                          <h4 className="font-black text-white text-base leading-none">{chef.name}</h4>
                          <span className="text-[10px] text-slate-400 font-bold block mt-1.5">{chef.role}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          chef.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                          chef.status === 'Break' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {chef.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1.5 mt-3 text-xs text-slate-300 font-semibold">
                        <p>Shift: <span className="text-white font-bold">{chef.shift}</span></p>
                        <p>Assigned Station: <span className="text-[#F97316] font-bold">{chef.station}</span></p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-black pt-3 border-t border-[#1E293B] mt-2">
                      <button
                        onClick={() => {
                          setChefs(current =>
                            current.map(c => c.id === chef.id ? { ...c, status: c.status === 'Active' ? 'Break' : 'Active' } : c)
                          );
                        }}
                        className="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                      >
                        {chef.status === 'Active' ? 'Set Break' : 'Set Active'}
                      </button>
                      <button
                        onClick={() => {
                          setChefs(current =>
                            current.map(c => c.id === chef.id ? { ...c, status: c.status === 'Absent' ? 'Active' : 'Absent' } : c)
                          );
                        }}
                        className="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                      >
                        {chef.status === 'Absent' ? 'Clock In' : 'Clock Out'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 12: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 space-y-6 max-w-3xl">
              <h3 className="text-base font-black text-white uppercase tracking-wider pb-3 border-b border-[#1E293B]">KDS Workflow rules</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-300 uppercase block">Auto Order Assignment</label>
                    <select className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3 py-2 text-xs outline-none text-slate-200 font-bold">
                      <option value="round-robin">Round-Robin Chef Assignment</option>
                      <option value="load-balanced">Station Load Balanced</option>
                      <option value="manual">Manual Assign Only</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-300 uppercase block">KOT Print Rules</label>
                    <select className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3 py-2 text-xs outline-none text-slate-200 font-bold">
                      <option value="auto">Auto-Print KOT on Receipt</option>
                      <option value="manual">Manual Print Only</option>
                      <option value="no-print">Paperless (KDS Display Only)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#1E293B]">
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Priority Escalation Timers</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-[#1E293B] rounded-xl text-xs">
                      <span className="text-slate-300">Escalate to Medium after</span>
                      <div className="flex items-center gap-2">
                        <input type="number" defaultValue={10} className="w-12 bg-slate-800 border border-slate-700 rounded text-center py-1 text-white font-black" />
                        <span className="text-slate-400">mins</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#1E293B] rounded-xl text-xs">
                      <span className="text-slate-300">Escalate to High after</span>
                      <div className="flex items-center gap-2">
                        <input type="number" defaultValue={20} className="w-12 bg-slate-800 border border-slate-700 rounded text-center py-1 text-white font-black" />
                        <span className="text-slate-400">mins</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* REQUEST STOCK DIALOG MODAL */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-2xl space-y-5">
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">Request Ingredient Stock</h2>
              <p className="text-[10px] text-slate-450 font-bold mt-0.5">Send a stock replenishment request to the cashier or store manager.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ingredient Name</label>
                <input
                  value={newStockName}
                  onChange={(e) => setNewStockName(e.target.value)}
                  placeholder="e.g. Mozzarella Cheese, Tomatoes"
                  className="w-full bg-[#1E293B] border border-[#334155] px-3.5 py-2.5 rounded-xl text-slate-200 outline-none font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Approx Quantity needed (e.g. 5 kg)</label>
                <input
                  value={newStockQty}
                  onChange={(e) => setNewStockQty(e.target.value)}
                  placeholder="e.g. 15 kg"
                  className="w-full bg-[#1E293B] border border-[#334155] px-3.5 py-2.5 rounded-xl text-slate-200 outline-none font-bold"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2 text-xs font-black">
              <button
                onClick={() => setShowStockModal(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl border border-slate-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStockRequest}
                className="flex-1 bg-[#F97316] hover:bg-orange-600 text-white py-3 rounded-xl transition active:scale-95 shadow-lg shadow-orange-500/20"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE RECIPE DIALOG MODAL */}
      {showRecipeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto scrollbar-thin">
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">Create New Food Recipe</h2>
              <p className="text-[10px] text-slate-450 font-bold mt-0.5">Add cooking steps and portion details for kitchen staff.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Recipe Name</label>
                  <input
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    placeholder="e.g. Tandoori Roti"
                    className="w-full bg-[#1E293B] border border-[#334155] px-3.5 py-2 rounded-xl text-slate-200 outline-none font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Category</label>
                  <select
                    value={recipeCategory}
                    onChange={(e) => setRecipeCategory(e.target.value)}
                    className="w-full bg-[#1E293B] border border-[#334155] px-3.5 py-2 rounded-xl text-slate-200 outline-none font-bold"
                  >
                    <option value="Main Course">Main Course</option>
                    <option value="Starters">Starters</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Prep Time (mins)</label>
                  <input
                    type="number"
                    value={recipePrepTime}
                    onChange={(e) => setRecipePrepTime(parseInt(e.target.value) || 10)}
                    className="w-full bg-[#1E293B] border border-[#334155] px-3.5 py-2 rounded-xl text-slate-200 outline-none font-bold text-center"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Cook Time (mins)</label>
                  <input
                    type="number"
                    value={recipeCookTime}
                    onChange={(e) => setRecipeCookTime(parseInt(e.target.value) || 15)}
                    className="w-full bg-[#1E293B] border border-[#334155] px-3.5 py-2 rounded-xl text-slate-200 outline-none font-bold text-center"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Ingredient Cost (₹)</label>
                  <input
                    type="number"
                    value={recipeCost}
                    onChange={(e) => setRecipeCost(parseInt(e.target.value) || 50)}
                    className="w-full bg-[#1E293B] border border-[#334155] px-3.5 py-2 rounded-xl text-slate-200 outline-none font-bold text-center"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">Portion Control / Size</label>
                <input
                  value={recipePortion}
                  onChange={(e) => setRecipePortion(e.target.value)}
                  placeholder="e.g. 1 Bowl (350g)"
                  className="w-full bg-[#1E293B] border border-[#334155] px-3.5 py-2 rounded-xl text-slate-200 outline-none font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">Ingredients (one per line)</label>
                <textarea
                  value={recipeIngredients}
                  onChange={(e) => setRecipeIngredients(e.target.value)}
                  rows={3}
                  placeholder="e.g. Wheat Flour (150g)&#10;Water (50ml)&#10;Butter (10g)"
                  className="w-full bg-[#1E293B] border border-[#334155] px-3.5 py-2.5 rounded-xl text-slate-200 outline-none font-bold font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">Cooking Instructions (one per line)</label>
                <textarea
                  value={recipeInstructions}
                  onChange={(e) => setRecipeInstructions(e.target.value)}
                  rows={3}
                  placeholder="e.g. Mix flour and water and knead dough.&#10;Bake inside clay tandoor for 2 mins."
                  className="w-full bg-[#1E293B] border border-[#334155] px-3.5 py-2.5 rounded-xl text-slate-200 outline-none font-bold font-sans"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2 text-xs font-black">
              <button
                onClick={() => setShowRecipeModal(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl border border-slate-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRecipe}
                className="flex-1 bg-[#F97316] hover:bg-orange-600 text-white py-3 rounded-xl transition active:scale-95 shadow-lg shadow-orange-500/20"
              >
                Save Recipe
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
