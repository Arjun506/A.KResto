'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import type { MenuCategory, MenuItem } from '@/src/types/menu.types';
import type { Order } from '@/src/types/order.types';

import {
  getPublicMenu,
  getPublicCategories,
  createPublicOrder,
  getPublicOrder,
  createWaiterRequest,
  getPublicRestaurant,
  type WaiterRequestPayload,
} from '@/services/public.service';
import { getSocket } from '@/services/socket';
import { Sparkles, ShoppingCart, Award, Gift, Star, RefreshCw, Send, Check } from 'lucide-react';

type Cart = Record<string, number>;

type Tracking = {
  status: string;
  lastOrder?: Order;
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return 'Received';
    case 'ACCEPTED':
      return 'Accepted';
    case 'PREPARING':
      return 'Preparing';
    case 'READY':
      return 'Ready';
    case 'COMPLETED':
      return 'Served';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
};

const getItemImageUrl = (item: MenuItem): string => {
  if (item.imageUrl && item.imageUrl.startsWith('http')) {
    return item.imageUrl;
  }
  const name = item.name.toLowerCase();
  if (name.includes('burger')) return '/images/chicken_burger.png';
  if (name.includes('pizza')) return '/images/veg_pizza.png';
  if (name.includes('pasta')) return '/images/pasta_alfredo.png';
  if (name.includes('biryani')) return '/images/chicken_biryani.png';
  if (name.includes('coffee')) return '/images/cold_coffee.png';
  return item.imageUrl || '/images/chicken_burger.png';
};

function QROrderContent() {
  const searchParams = useSearchParams();
  const tableId = searchParams.get('table') ?? '';
  const restaurantSlug = searchParams.get('restaurant') ?? '';
  const qrToken = searchParams.get('token') ?? '';

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string>('');
  const [restaurantName, setRestaurantName] = useState('Public Ordering');

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Customizer styling states (synced from Menu layout panel)
  const [layoutTheme, setLayoutTheme] = useState('design-1');
  const [headerColor, setHeaderColor] = useState('#000000');
  const [buttonColor, setButtonColor] = useState('#ef4444');
  const [borderColor, setBorderColor] = useState('#e2e8f0');
  const [isLightMode, setIsLightMode] = useState(true);

  // Guest customer states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderType, setOrderType] = useState<'dine-in' | 'pre-order' | 'delivery'>('dine-in');

  // Coupon / Loyalty states
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [loyaltyCoins, setLoyaltyCoins] = useState(50); // mock initial customer coins
  const [useCoins, setUseCoins] = useState(false);
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  // Feedback states
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [foodRating, setFoodRating] = useState(5);
  const [restaurantRating, setRestaurantRating] = useState(5);
  const [suggestion, setSuggestion] = useState('');

  // Waiter Request UI States
  const [showWaiterModal, setShowWaiterModal] = useState(false);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);

  const [tracking, setTracking] = useState<Tracking>({
    status: 'Cart open',
  });

  // ---------- Persistent cart (per-table) ----------
  const cartStorageKey = tableId ? `qr-cart:${tableId}` : null;

  const [cart, setCart] = useState<Cart>(() => {
    if (typeof window === 'undefined') return {};
    if (!tableId) return {};

    try {
      const raw = window.localStorage.getItem(`qr-cart:${tableId}`);
      if (!raw) return {};
      const parsed = JSON.parse(raw) as Cart;
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  });

  // Persist cart whenever it changes.
  useEffect(() => {
    if (!cartStorageKey) return;
    try {
      window.localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart, cartStorageKey]);

  // ---------- Load menu + categories + styling + active tracking ----------
  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!tableId || !restaurantSlug) {
        setError('Invalid QR code url. Missing restaurant or table.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Load customizer variables
      const savedLayout = localStorage.getItem('custom-layout') || 'design-1';
      const savedHeader = localStorage.getItem('custom-header') || '#000000';
      const savedButton = localStorage.getItem('custom-button') || '#ef4444';
      const savedBorder = localStorage.getItem('custom-border') || '#e2e8f0';
      const savedTheme = localStorage.getItem('custom-theme') !== 'dark';

      setLayoutTheme(savedLayout);
      setHeaderColor(savedHeader);
      setButtonColor(savedButton);
      setBorderColor(savedBorder);
      setIsLightMode(savedTheme);

      try {
        const [cats, items, rest] = await Promise.all([
          getPublicCategories(restaurantSlug),
          getPublicMenu(restaurantSlug),
          getPublicRestaurant(restaurantSlug).catch(() => null),
        ]);

        if (!mounted) return;

        setCategories(cats);
        setMenuItems(items);
        if (rest) {
          setRestaurantName(rest.name);
        }

        // Derive restaurantId
        const derivedResId = items[0]?.restaurantId || cats[0]?.restaurantId || '';
        setRestaurantId(derivedResId);

        // Load active order tracking
        const lastOrderId = window.localStorage.getItem(`qr-last-order:${tableId}`);
        if (lastOrderId) {
          try {
            const activeOrder = await getPublicOrder(lastOrderId);
            if (activeOrder && activeOrder.status !== 'COMPLETED' && activeOrder.status !== 'CANCELLED') {
              setTracking({
                status: getStatusLabel(activeOrder.status),
                lastOrder: activeOrder,
              });
            } else if (activeOrder && activeOrder.status === 'COMPLETED') {
              // Trigger feedback prompt post-service
              setShowFeedbackModal(true);
              window.localStorage.removeItem(`qr-last-order:${tableId}`);
            }
          } catch {
            window.localStorage.removeItem(`qr-last-order:${tableId}`);
          }
        }
      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : 'Failed to load menu');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [tableId, restaurantSlug]);

  // ---------- Socket.IO realtime tracking (order-specific room) ----------
  useEffect(() => {
    if (!restaurantId) return;

    const socket = getSocket(restaurantId);

    const trackedOrderId = tracking.lastOrder?.id;
    if (trackedOrderId) {
      socket.emit('joinOrder', { orderId: trackedOrderId });
    }

    const onOrderUpdated = (order: Order) => {
      if (trackedOrderId && order.id === trackedOrderId) {
        setTracking({
          status: getStatusLabel(order.status),
          lastOrder: order,
        });

        if (order.status === 'COMPLETED') {
          setShowFeedbackModal(true);
          window.localStorage.removeItem(`qr-last-order:${tableId}`);
        } else if (order.status === 'CANCELLED') {
          window.localStorage.removeItem(`qr-last-order:${tableId}`);
        }
      }
    };

    socket.on('orderUpdated', onOrderUpdated);
    socket.on('orderStatusChanged', onOrderUpdated);

    return () => {
      socket.off('orderUpdated', onOrderUpdated);
      socket.off('orderStatusChanged', onOrderUpdated);
    };
  }, [restaurantId, tracking.lastOrder?.id, tableId]);

  const categoriesById = useMemo(() => {
    const m = new Map<string, MenuCategory>();
    for (const c of categories) m.set(c.id, c);
    return m;
  }, [categories]);

  const isItemVeg = (item: MenuItem): boolean => {
    const name = item.name.toLowerCase();
    const desc = (item.description || '').toLowerCase();
    if (
      name.includes('chicken') ||
      name.includes('mutton') ||
      name.includes('seekh') ||
      name.includes('tikka') ||
      name.includes('egg') ||
      name.includes('fish') ||
      name.includes('meat') ||
      name.includes('nonveg') ||
      name.includes('non-veg') ||
      desc.includes('chicken') ||
      desc.includes('mutton')
    ) {
      return false;
    }
    return true;
  };

  const filteredMenu = useMemo(() => {
    const q = query.trim().toLowerCase();

    return menuItems.filter((item) => {
      if (!item.isAvailable) return false;
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) return false;

      // Veg/Non-Veg Filter
      const isVeg = isItemVeg(item);
      if (dietFilter === 'veg' && !isVeg) return false;
      if (dietFilter === 'non-veg' && isVeg) return false;

      const nameMatch = item.name.toLowerCase().includes(q);
      return !q || nameMatch;
    });
  }, [menuItems, query, selectedCategory, dietFilter]);

  const subtotal = useMemo(() => {
    let sum = 0;
    for (const [menuItemId, qty] of Object.entries(cart)) {
      const item = menuItems.find((m) => m.id === menuItemId);
      if (!item) continue;
      sum += Number(item.price) * qty;
    }
    return sum;
  }, [cart, menuItems]);

  const finalTotal = useMemo(() => {
    let price = subtotal;
    if (appliedDiscount > 0) {
      price = Math.max(0, price - appliedDiscount);
    }
    if (useCoins) {
      const coinDiscount = Math.min(price, loyaltyCoins * 0.5); // 1 coin = ₹0.5
      price = Math.max(0, price - coinDiscount);
    }
    return price;
  }, [subtotal, appliedDiscount, useCoins, loyaltyCoins]);

  const addToCart = (id: string) => {
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
  };

  const setQty = (id: string, qty: number) => {
    setCart((current) => {
      const next = { ...current };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  };

  const placeOrder = async () => {
    if (!subtotal) return;
    setPlacingOrder(true);
    setError(null);

    try {
      const itemIds = Object.keys(cart);
      if (!itemIds.length) return;
      if (!tableId || !restaurantSlug) throw new Error('Missing table or restaurant identifier');

      const items = itemIds.map((menuItemId) => ({
        menuItemId,
        quantity: cart[menuItemId] ?? 0,
      }));

      const order = await createPublicOrder({
        restaurantSlug,
        tableId,
        customerName: customerName.trim() || 'Guest',
        phone: customerPhone.trim() || undefined,
        notes: `Type: ${orderType.toUpperCase()} | Notes: ${orderNotes.trim()}`,
        items,
        qrToken: qrToken || undefined,
      });

      // Save order tracking
      window.localStorage.setItem(`qr-last-order:${tableId}`, order.id);

      setTracking({
        status: getStatusLabel(order.status),
        lastOrder: order,
      });

      // Reward points calculation
      if (useCoins) {
        setLoyaltyCoins(Math.max(0, loyaltyCoins - Math.round(subtotal * 0.1)));
      } else {
        setLoyaltyCoins(loyaltyCoins + Math.round(subtotal * 0.05)); // Earn 5% coins on purchase
      }

      setCart({});
      setOrderNotes('');
      setUseCoins(false);
      setAppliedDiscount(0);
      setCouponCode('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const sendWaiterCall = async (type: WaiterRequestPayload['type']) => {
    setRequestStatus('Sending...');
    try {
      await createWaiterRequest({
        restaurantSlug,
        tableId,
        type,
        qrToken: qrToken || undefined,
      });
      setRequestStatus('Request received!');
      setTimeout(() => {
        setShowWaiterModal(false);
        setRequestStatus(null);
      }, 1500);
    } catch (e) {
      setRequestStatus(e instanceof Error ? e.message : 'Failed to notify waiter');
    }
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'WELCOME10') {
      setAppliedDiscount(Math.round(subtotal * 0.1));
      alert('🎟️ 10% coupon applied successfully!');
    } else if (code === 'FREEBILL') {
      setAppliedDiscount(subtotal);
      alert('🎟️ Free Bill coupon applied! Total is now zero.');
    } else {
      alert('❌ Invalid coupon code.');
    }
  };

  const submitFeedback = () => {
    alert('🌟 Thank you for your feedback ratings! We look forward to serving you again.');
    setShowFeedbackModal(false);
  };

  if (error && menuItems.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-5 text-white">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
          <span className="text-5xl">⚠️</span>
          <h1 className="text-3xl font-black mt-4 text-rose-500">Access Denied</h1>
          <p className="mt-4 text-zinc-400 leading-relaxed">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <div className={isLightMode ? 'bg-slate-50 text-slate-900 min-h-screen' : 'dark bg-slate-950 text-white min-h-screen'}>
      <main className="pb-48">
        
        {/* HEADER */}
        <header
          className="px-6 py-8 text-white rounded-b-[2.5rem] shadow-xl relative"
          style={{ backgroundColor: headerColor }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold tracking-wider text-rose-400 uppercase">A.K Resto Platform</p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{restaurantName}</h1>
              <p className="text-xs text-zinc-300 mt-0.5">Table: {tableId.slice(-4).toUpperCase() || 'Counter'}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowWaiterModal(true)}
                className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-2xl text-xs font-bold transition-transform active:scale-95"
              >
                🛎️ Call Waiter
              </button>
            </div>
          </div>

          {/* LOYALTY CARD */}
          <div className="mt-5 p-4 bg-white/10 rounded-2xl border border-white/10 flex justify-between items-center text-xs">
            <span className="flex items-center gap-1.5 font-bold">
              <Award className="text-yellow-400" size={16} />
              Loyalty Coins: {loyaltyCoins}
            </span>
            <button
              onClick={() => setUseCoins(!useCoins)}
              disabled={subtotal === 0}
              className={`px-3 py-1.5 rounded-xl font-bold transition active:scale-95 disabled:opacity-50 ${
                useCoins ? 'bg-yellow-400 text-slate-900' : 'bg-white/20 text-white'
              }`}
            >
              {useCoins ? 'Applied Coins' : 'Apply Coins'}
            </button>
          </div>

          {/* ORDER LIVE STATUS TRACKER */}
          {tracking.lastOrder && (
            <div className="mt-6 rounded-3xl bg-black/30 border border-white/5 p-5 backdrop-blur-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-zinc-400">Track: {tracking.lastOrder.orderNumber}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
                    <p className="text-lg font-bold text-white uppercase">{tracking.status}</p>
                  </div>
                </div>
                <span className="text-xs bg-white/15 px-3 py-1 rounded-full text-zinc-300">
                  Dine-In Table #{tracking.lastOrder.tableId.slice(-4).toUpperCase()}
                </span>
              </div>

              {/* PROGRESS LINE STEPPER */}
              <div className="mt-5 grid grid-cols-5 gap-1 text-center text-[9px] text-zinc-400">
                {(['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'] as const).map((step, idx) => {
                  const currentStatus = tracking.lastOrder?.status;
                  const statusIdx = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'].indexOf(currentStatus ?? '');
                  const active = idx <= statusIdx;
                  return (
                    <div key={step} className="flex flex-col items-center gap-1.5">
                      <div className={`w-3.5 h-3.5 rounded-full ${active ? 'bg-rose-500 ring-4 ring-rose-500/20' : 'bg-zinc-700'}`}></div>
                      <span className={active ? 'text-white font-extrabold' : 'text-zinc-500'}>
                        {getStatusLabel(step)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </header>

        {/* ORDER TYPE SELECTOR */}
        <div className="px-6 mt-6">
          <div className="grid grid-cols-3 gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-2xl">
            {(['dine-in', 'pre-order', 'delivery'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`py-2 rounded-xl text-xs font-bold uppercase transition ${
                  orderType === type
                    ? 'bg-rose-500 text-white shadow'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* SEARCH & CATEGORIES */}
        <section className="p-6 space-y-6">
          {/* INJECT ANIMATION STYLE */}
          <style>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(28px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-card {
              opacity: 0;
              animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search items..."
            className="w-full rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 px-5 py-4 outline-none text-base focus:ring-1 focus:ring-rose-500"
          />

          {/* VEG/NON-VEG FILTER SELECTOR */}
          <div className="flex gap-2">
            <button
              onClick={() => setDietFilter('all')}
              className={`flex-1 py-3.5 rounded-2xl text-xs font-black transition-all border flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                dietFilter === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900'
                  : 'bg-white text-slate-650 border-slate-200 dark:bg-slate-900 dark:text-zinc-400 dark:border-slate-850'
              }`}
            >
              🍽️ All Food
            </button>
            <button
              onClick={() => setDietFilter('veg')}
              className={`flex-1 py-3.5 rounded-2xl text-xs font-black transition-all border flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                dietFilter === 'veg'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-emerald-650 border-slate-200 dark:bg-slate-900 dark:text-zinc-400 dark:border-slate-850'
              }`}
            >
              🟢 Veg Only
            </button>
            <button
              onClick={() => setDietFilter('non-veg')}
              className={`flex-1 py-3.5 rounded-2xl text-xs font-black transition-all border flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                dietFilter === 'non-veg'
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white text-rose-650 border-slate-200 dark:bg-slate-900 dark:text-zinc-400 dark:border-slate-850'
              }`}
            >
              🔴 Non-Veg
            </button>
          </div>

          {/* CATEGORIES SCROLLER */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-5 py-2.5 font-bold text-xs transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 text-zinc-500 shadow-sm border border-slate-200 dark:border-slate-800'
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 font-bold text-xs transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-white dark:bg-slate-900 text-zinc-500 shadow-sm border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* DYNAMIC DESIGN TEMPLATES */}
          {loading ? (
            <div className="text-center py-16 text-zinc-400">Loading menu...</div>
          ) : (
            <div
              className={`
                ${layoutTheme === 'design-1' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : ''}
                ${layoutTheme === 'design-2' ? 'space-y-4' : ''}
                ${layoutTheme === 'design-3' ? 'grid gap-8 md:grid-cols-2' : ''}
                ${layoutTheme === 'design-4' ? 'space-y-3' : ''}
                ${layoutTheme === 'design-5' ? 'grid gap-4' : ''}
              `}
            >
              {filteredMenu.map((item, idx) => {
                const category = item.categoryId ? categoriesById.get(item.categoryId) : null;
                const qty = cart[item.id] ?? 0;
                const isVeg = isItemVeg(item);

                // Simple grid Layout preset
                if (layoutTheme === 'design-1') {
                  return (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-lg border group animate-card flex flex-col relative"
                      style={{ 
                        borderColor: borderColor,
                        animationDelay: `${idx * 50}ms`
                      }}
                    >
                      {/* Dietary type badge overlay */}
                      <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 px-3 py-1.5 rounded-full shadow-md text-[9px] font-black uppercase tracking-wider">
                        {isVeg ? (
                          <>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">VEG</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                            <span className="text-rose-600 dark:text-rose-400 font-extrabold">NON-VEG</span>
                          </>
                        )}
                      </div>

                      {/* Image container with zoom effect */}
                      <div className="h-56 bg-slate-200 dark:bg-slate-850 overflow-hidden relative">
                        <div
                          className="w-full h-full bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                          style={{ backgroundImage: `url(${getItemImageUrl(item)})` }}
                        />
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start gap-3">
                            <h3 className="font-black text-lg text-slate-800 dark:text-white leading-snug">{item.name}</h3>
                            <span className="font-black text-rose-500 text-lg flex-shrink-0">₹{item.price}</span>
                          </div>
                          <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">{category?.name || 'Recipe'}</p>
                          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mt-2">{item.description || 'Delectable and fresh gourmet meal cooked to order by our master chefs.'}</p>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <div className="flex items-center gap-2">
                            {qty > 0 ? (
                              <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-2xl">
                                <button
                                  onClick={() => setQty(item.id, qty - 1)}
                                  className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 text-sm font-black active:scale-95 transition-transform"
                                >
                                  -
                                </button>
                                <span className="text-sm font-black w-4 text-center">{qty}</span>
                                <button
                                  onClick={() => addToCart(item.id)}
                                  className="w-8 h-8 rounded-full text-white text-sm font-black active:scale-95 transition-transform"
                                  style={{ backgroundColor: buttonColor }}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(item.id)}
                                className="px-5 py-3 rounded-2xl text-white text-xs font-black transition-all active:scale-95 shadow-md shadow-rose-500/10 cursor-pointer"
                                style={{ backgroundColor: buttonColor }}
                              >
                                Add to Cart
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                }

                // Default List rendering for other presets to retain compatibility
                return (
                  <article
                    key={item.id}
                    className="flex overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-md border p-5 items-center justify-between group animate-card gap-4"
                    style={{ 
                      borderColor: borderColor,
                      animationDelay: `${idx * 50}ms`
                    }}
                  >
                    <div className="flex items-center gap-5">
                      {/* Bigger list image with zoom hover */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 relative shadow-sm">
                        <div
                          className="w-full h-full bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
                          style={{ backgroundImage: `url(${getItemImageUrl(item)})` }}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {isVeg ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" title="Veg"></span>
                          ) : (
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0" title="Non-Veg"></span>
                          )}
                          <h3 className="font-black text-base sm:text-lg text-slate-800 dark:text-white leading-tight">{item.name}</h3>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{category?.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal max-w-sm line-clamp-2">{item.description || 'Chef selected ingredients cooked to perfection.'}</p>
                        <span className="font-black text-rose-500 text-sm mt-1 block">₹{item.price}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {qty > 0 ? (
                        <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-2xl">
                          <button
                            onClick={() => setQty(item.id, qty - 1)}
                            className="w-7 h-7 rounded-full bg-white dark:bg-slate-900 text-sm font-black active:scale-95 transition-transform"
                          >
                            -
                          </button>
                          <span className="text-xs font-black w-4 text-center">{qty}</span>
                          <button
                            onClick={() => addToCart(item.id)}
                            className="w-7 h-7 rounded-full text-white text-sm font-black active:scale-95 transition-transform"
                            style={{ backgroundColor: buttonColor }}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item.id)}
                          className="px-5 py-2.5 rounded-2xl text-white text-xs font-black transition-all active:scale-95 shadow-sm cursor-pointer"
                          style={{ backgroundColor: buttonColor }}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* BOTTOM CHECKOUT DRAWER */}
        {subtotal > 0 && (
          <footer className="fixed bottom-0 left-0 right-0 border-t bg-white dark:bg-slate-900 px-6 py-5 rounded-t-[2.5rem] shadow-2xl space-y-4 z-40">
            {/* COUPONS SECTION */}
            <div className="flex gap-2">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="🎟️ Enter Coupon (WELCOME10 / FREEBILL)"
                className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-slate-800 px-4 py-2 rounded-xl text-xs outline-none"
              />
              <button
                onClick={applyCoupon}
                className="px-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold active:scale-95 transition-transform"
              >
                Apply
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your Name (Required)"
                className="px-4 py-2.5 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
              />
              <input
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Notes for chef (optional)"
                className="px-4 py-2.5 rounded-xl border dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs outline-none"
              />
            </div>

            <button
              onClick={() => void placeOrder()}
              disabled={placingOrder || loading}
              className="w-full rounded-2xl py-4 text-base font-bold text-white shadow-xl transition-all active:scale-95 disabled:bg-slate-700"
              style={{ backgroundColor: buttonColor }}
            >
              {placingOrder ? 'Sending Order...' : `Place ${orderType.toUpperCase()} Order - ₹${finalTotal}`}
            </button>
          </footer>
        )}

        {/* WAITER MODAL */}
        {showWaiterModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-extrabold">🛎️ Waiter Request</h2>
                <button onClick={() => setShowWaiterModal(false)} className="text-zinc-400 hover:text-zinc-600 font-bold">
                  ✕
                </button>
              </div>

              {requestStatus ? (
                <div className="py-8 text-center text-md font-bold text-rose-500 animate-pulse">
                  {requestStatus}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {(['Call Waiter', 'Need Water', 'Need Bill', 'Clean Table'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => void sendWaiterCall(type)}
                      className="py-4 border border-slate-200 dark:border-slate-800 rounded-2xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 text-xs active:scale-95 shadow-sm"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* FEEDBACK MODAL */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-center">
              <span className="text-4xl">🌟</span>
              <h2 className="text-2xl font-black">Food & Service Review</h2>
              <p className="text-xs text-zinc-400">Please take 10 seconds to share your restaurant rating experience.</p>

              <div className="space-y-4 text-left">
                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Rate the Food</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setFoodRating(star)}>
                        <Star className={star <= foodRating ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'} size={24} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Rate Restaurant Hygiene</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setRestaurantRating(star)}>
                        <Star className={star <= restaurantRating ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'} size={24} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-zinc-500 block mb-1">Suggestions</label>
                  <textarea
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder="Add cooking or ambiance feedback..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-slate-850 p-3 rounded-2xl text-xs h-16 outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <button
                onClick={submitFeedback}
                className="w-full bg-rose-500 hover:bg-rose-600 py-3.5 rounded-2xl font-bold text-sm text-white active:scale-95 transition-all"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        )}
        {/* BRANDING BANNER */}
        <div className="mt-16 mb-8 flex flex-col items-center justify-center text-center space-y-3 opacity-80">
          <p className="text-[10px] font-black tracking-widest text-slate-400 dark:text-zinc-500 uppercase">Powered By</p>
          <img src="/ak-resto-banner.png" alt="A.K Resto Banner" className="w-64 object-contain rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800/80" />
        </div>

      </main>
    </div>
  );
}

export default function QROrderPage() {
  return (
    <Suspense fallback={null}>
      <QROrderContent />
    </Suspense>
  );
}
