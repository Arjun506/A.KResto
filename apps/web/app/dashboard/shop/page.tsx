'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
  ShoppingCart,
  Package,
  Barcode,
  Users,
  Printer,
  Search,
  Plus,
  Minus,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  CreditCard,
  ArrowRight,
  X,
  ChevronDown,
  Database,
  Calendar,
  Volume2,
  VolumeX,
  PlusCircle,
  Tag,
  Sparkles,
  Layers,
  ArrowLeftRight,
  ClipboardList
} from 'lucide-react';
import { getMenuItems } from '@/services/menu.service';
import { getInventoryItems, deductStock, updateInventoryItem } from '@/services/inventory.service';
import type { MenuItem } from '@/src/types/menu.types';
import type { InventoryItem } from '@/src/types/inventory.types';

// Retail Product structure
interface RetailProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  stock: number;
  lowStockLevel: number;
  emoji: string;
  description: string;
}

// Order structure
interface ShopOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    sku: string;
  }>;
  subtotal: number;
  gst: number;
  discount: number;
  total: number;
  paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Split';
  splitDetails?: { cash: number; card: number; upi: number };
  status: 'Completed' | 'Refunded';
  date: string;
}

// Customer structure
interface CustomerLoyalty {
  phone: string;
  name: string;
  email: string;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

export default function ShopBillingDashboard() {
  // Navigation Tabs: 'pos' | 'orders' | 'inventory'
  const [activeTab, setActiveTab] = useState<'pos' | 'orders' | 'inventory'>('pos');
  
  // Data States
  const [products, setProducts] = useState<RetailProduct[]>([]);
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [customers, setCustomers] = useState<CustomerLoyalty[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // POS / Cart States
  const [cart, setCart] = useState<Array<{ product: RetailProduct; quantity: number; discount: number; note: string }>>([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Customer states
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerLoyalty | null>(null);
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState(0);

  // Hold / Recall states
  const [heldCarts, setHeldCarts] = useState<Array<{ id: string; customer: CustomerLoyalty | null; cart: typeof cart; date: string }>>([]);
  
  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'UPI' | 'Split'>('Cash');
  const [splitCash, setSplitCash] = useState<number>(0);
  const [splitCard, setSplitCard] = useState<number>(0);
  const [splitUpi, setSplitUpi] = useState<number>(0);

  // Modals
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<ShopOrder | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({ name: '', phone: '', email: '' });
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showHeldModal, setShowHeldModal] = useState(false);

  // Toast system
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  // Input Ref for Barcode
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Beep synthesis
  const playScanBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime); // 1200Hz
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.08); // 80ms
    } catch (e) {
      console.warn('Audio context error:', e);
    }
  };

  // Initialize presets
  const retailProductPresets: RetailProduct[] = useMemo(() => [
    { id: 'rp1', name: 'Gourmet Cotton Shirt', sku: 'SKU-SHIRT', price: 999, category: 'Clothing', stock: 45, lowStockLevel: 10, emoji: '👕', description: 'Premium cotton regular fit casual shirt.' },
    { id: 'rp2', name: 'Raw Denim Jeans', sku: 'SKU-JEANS', price: 1499, category: 'Clothing', stock: 30, lowStockLevel: 8, emoji: '👖', description: 'Heavyweight organic blue denim pants.' },
    { id: 'rp3', name: 'Sports Flex Cap', sku: 'SKU-CAP', price: 399, category: 'Clothing', stock: 4, lowStockLevel: 5, emoji: '🧢', description: 'Adjustable athletic sunvisor cap.' },
    { id: 'rp4', name: 'Wireless Pro Earbuds', sku: 'SKU-EARBUDS', price: 2499, category: 'Electronics', stock: 18, lowStockLevel: 3, emoji: '🎧', description: 'Noise cancelling Bluetooth 5.3 in-ear earbuds.' },
    { id: 'rp5', name: 'Smart Active Watch', sku: 'SKU-WATCH', price: 4999, category: 'Electronics', stock: 12, lowStockLevel: 4, emoji: '⌚', description: 'Amoled screen health & fitness activity tracker.' },
    { id: 'rp6', name: 'Fast Wall Charger 20W', sku: 'SKU-CHARGER', price: 599, category: 'Electronics', stock: 3, lowStockLevel: 10, emoji: '🔌', description: 'Dual USB-C quick power adapter.' },
    { id: 'rp7', name: 'Organic Forest Honey 500g', sku: 'SKU-HONEY', price: 299, category: 'Groceries', stock: 60, lowStockLevel: 15, emoji: '🍯', description: '100% pure wild forest natural honey.' },
    { id: 'rp8', name: 'Whole Wheat Farm Bread', sku: 'SKU-BREAD', price: 49, category: 'Groceries', stock: 2, lowStockLevel: 5, emoji: '🍞', description: 'Freshly baked sliced multi-grain fiber loaf.' },
    { id: 'rp9', name: 'Raw Premium Almonds 250g', sku: 'SKU-ALMONDS', price: 349, category: 'Groceries', stock: 25, lowStockLevel: 8, emoji: '🥜', description: 'California whole almonds packed fresh.' },
    { id: 'rp10', name: 'Genuine Leather Wallet', sku: 'SKU-WALLET', price: 899, category: 'Accessories', stock: 15, lowStockLevel: 5, emoji: '💼', description: 'Bi-fold RFID blocking textured calf leather wallet.' },
    { id: 'rp11', name: 'Travel Multi-pocket Backpack', sku: 'SKU-BACKPACK', price: 1999, category: 'Accessories', stock: 8, lowStockLevel: 3, emoji: '🎒', description: 'Water resistant laptop backpack with charging port.' }
  ], []);

  const customerPresets: CustomerLoyalty[] = useMemo(() => [
    { phone: '9876543210', name: 'Arjun Sharma', email: 'arjun@gmail.com', points: 340, tier: 'Gold' },
    { phone: '8765432109', name: 'Sneha Patel', email: 'sneha@yahoo.com', points: 80, tier: 'Bronze' },
    { phone: '7654321098', name: 'Vikram Singh', email: 'vikram@outlook.com', points: 720, tier: 'Platinum' },
    { phone: '6543210987', name: 'Kabir Mehta', email: 'kabir@akresto.com', points: 150, tier: 'Silver' }
  ], []);

  const orderPresets: ShopOrder[] = useMemo(() => [
    {
      id: 'S-ORD-1001',
      orderNumber: 'RET-00001',
      customerName: 'Arjun Sharma',
      customerPhone: '9876543210',
      items: [
        { productId: 'rp1', name: 'Gourmet Cotton Shirt', price: 999, quantity: 1, sku: 'SKU-SHIRT' },
        { productId: 'rp7', name: 'Organic Forest Honey 500g', price: 299, quantity: 2, sku: 'SKU-HONEY' }
      ],
      subtotal: 1597,
      gst: 287.46,
      discount: 100,
      total: 1784.46,
      paymentMethod: 'UPI',
      status: 'Completed',
      date: '2026-06-27T10:14:00Z'
    },
    {
      id: 'S-ORD-1002',
      orderNumber: 'RET-00002',
      customerName: 'Walk-in Customer',
      customerPhone: '',
      items: [
        { productId: 'rp4', name: 'Wireless Pro Earbuds', price: 2499, quantity: 1, sku: 'SKU-EARBUDS' }
      ],
      subtotal: 2499,
      gst: 449.82,
      discount: 0,
      total: 2948.82,
      paymentMethod: 'Card',
      status: 'Completed',
      date: '2026-06-27T12:05:00Z'
    }
  ], []);

  // Fetch / Sync with API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Load menu items and inventory from DB if available
        const [menuItemsRes, inventoryItemsRes] = await Promise.allSettled([
          getMenuItems(),
          getInventoryItems()
        ]);

        let loadedProducts: RetailProduct[] = [...retailProductPresets];

        // Map database menu items to Retail products if database contains items
        if (menuItemsRes.status === 'fulfilled' && menuItemsRes.value.length > 0) {
          const dbProducts = menuItemsRes.value.map((item: MenuItem, idx) => {
            // Find inventory counterpart if exists to sync stock levels
            let matchedStock = 20;
            let matchedSku = `SKU-DB-${idx + 1}`;
            let matchedLow = 5;

            if (inventoryItemsRes.status === 'fulfilled') {
              const matchedInv = inventoryItemsRes.value.find(
                (inv: InventoryItem) => inv.name.toLowerCase() === item.name.toLowerCase() || inv.sku === item.name
              );
              if (matchedInv) {
                matchedStock = Number(matchedInv.quantity) || 0;
                matchedSku = matchedInv.sku || matchedSku;
                matchedLow = Number(matchedInv.lowStockLevel) || matchedLow;
              }
            }

            return {
              id: item.id,
              name: item.name,
              sku: matchedSku,
              price: Number(item.price) || 100,
              category: item.categories?.name || 'Retail',
              stock: matchedStock,
              lowStockLevel: matchedLow,
              emoji: '📦',
              description: item.description || ''
            };
          });

          // Blend database items with retail presets for maximum richness
          loadedProducts = [...dbProducts, ...retailProductPresets];
        }

        setProducts(loadedProducts);
        setCustomers(customerPresets);
        setOrders(orderPresets);
      } catch (err) {
        console.warn('API fetch failed, falling back to mock presets', err);
        setProducts(retailProductPresets);
        setCustomers(customerPresets);
        setOrders(orderPresets);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();

    // Auto-focus barcode input
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [retailProductPresets, customerPresets, orderPresets]);

  // Keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F1 -> focus Barcode scanning input
      if (e.key === 'F1') {
        e.preventDefault();
        barcodeInputRef.current?.focus();
        showToast('Barcode scanner focused', 'success');
      }
      // F2 -> Open Split Payment modal if cart has items
      if (e.key === 'F2') {
        e.preventDefault();
        if (cart.length > 0) {
          setPaymentMethod('Split');
          setShowSplitModal(true);
        } else {
          showToast('Cart is empty. Add items first!', 'warning');
        }
      }
      // F3 -> Hold Current Cart
      if (e.key === 'F3') {
        e.preventDefault();
        handleHoldCart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, selectedCustomer]);

  // Categories list
  const categories = useMemo(() => {
    const unique = new Set(products.map(p => p.category));
    return ['All', ...Array.from(unique)];
  }, [products]);

  // Filter products by category and search query
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Low stock inventory items
  const lowStockItems = useMemo(() => {
    return products.filter(p => p.stock <= p.lowStockLevel);
  }, [products]);

  // Cart calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [cart]);

  const cartGst = useMemo(() => {
    // 18% standard Retail / Mall GST (9% CGST + 9% SGST)
    return Math.round((cartSubtotal * 0.18) * 100) / 100;
  }, [cartSubtotal]);

  const discountAmount = useMemo(() => {
    let amt = 0;
    // Apply coupon discount
    if (appliedDiscountPercent > 0) {
      amt += cartSubtotal * (appliedDiscountPercent / 100);
    }
    // Apply loyalty point redemption (1 point = ₹1)
    if (redeemPoints && selectedCustomer) {
      // Cap points discount to subtotal
      amt += Math.min(selectedCustomer.points, cartSubtotal - amt);
    }
    return Math.round(amt * 100) / 100;
  }, [cartSubtotal, appliedDiscountPercent, redeemPoints, selectedCustomer]);

  const cartTotal = useMemo(() => {
    const net = cartSubtotal + cartGst - discountAmount;
    return Math.max(0, Math.round(net * 100) / 100);
  }, [cartSubtotal, cartGst, discountAmount]);

  // Set split defaults when total changes
  useEffect(() => {
    if (paymentMethod === 'Split') {
      setSplitCash(Math.round((cartTotal / 2) * 100) / 100);
      setSplitCard(Math.round((cartTotal / 2) * 100) / 100);
      setSplitUpi(0);
    }
  }, [cartTotal, paymentMethod]);

  // Barcode / SKU Scan Handler
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const query = barcodeInput.trim().toUpperCase();
    // Search exact SKU match or search name starting with SKU code
    const foundProduct = products.find(p => p.sku.toUpperCase() === query || p.sku.toUpperCase() === `SKU-${query}`);

    if (foundProduct) {
      if (foundProduct.stock <= 0) {
        showToast(`${foundProduct.name} is OUT OF STOCK!`, 'error');
        setBarcodeInput('');
        return;
      }
      playScanBeep();
      addToCart(foundProduct);
      showToast(`Scanned: ${foundProduct.name} (₹${foundProduct.price})`, 'success');
    } else {
      showToast(`SKU/Barcode "${query}" not found!`, 'error');
    }
    setBarcodeInput('');
  };

  // Add item to cart
  const addToCart = (product: RetailProduct) => {
    const existing = cart.find(item => item.product.id === product.id);
    
    // Check stock limit
    const currentQty = existing ? existing.quantity : 0;
    if (currentQty >= product.stock) {
      showToast(`Cannot add. Only ${product.stock} items available in inventory.`, 'warning');
      return;
    }

    if (existing) {
      setCart(cart.map(item => 
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1, discount: 0, note: '' }]);
    }
  };

  // Adjust cart item quantity
  const updateCartQty = (productId: string, delta: number) => {
    const item = cart.find(i => i.product.id === productId);
    if (!item) return;

    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      setCart(cart.filter(i => i.product.id !== productId));
      return;
    }

    if (delta > 0 && newQty > item.product.stock) {
      showToast(`Stock limit reached. Only ${item.product.stock} available.`, 'warning');
      return;
    }

    setCart(cart.map(i => 
      i.product.id === productId ? { ...i, quantity: newQty } : i
    ));
  };

  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCart(cart.filter(i => i.product.id !== productId));
    showToast('Item removed from cart', 'warning');
  };

  // Customer loyalty search
  const handleCustomerLookup = () => {
    if (!customerSearch.trim()) return;
    const found = customers.find(c => c.phone === customerSearch.trim() || c.name.toLowerCase().includes(customerSearch.toLowerCase()));
    if (found) {
      setSelectedCustomer(found);
      showToast(`Welcome back, ${found.name}! Tier: ${found.tier}`, 'success');
      setCustomerSearch('');
    } else {
      showToast(`Customer not found. Opening registration...`, 'warning');
      setNewCustomerForm({ name: '', phone: customerSearch, email: '' });
      setShowCustomerModal(true);
    }
  };

  // Register customer
  const handleRegisterCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerForm.name || !newCustomerForm.phone) {
      showToast('Name and Phone are required', 'error');
      return;
    }

    const newCust: CustomerLoyalty = {
      name: newCustomerForm.name,
      phone: newCustomerForm.phone,
      email: newCustomerForm.email || 'walkin@shop.com',
      points: 10, // Welcome points
      tier: 'Bronze'
    };

    setCustomers([...customers, newCust]);
    setSelectedCustomer(newCust);
    setShowCustomerModal(false);
    showToast(`Customer ${newCust.name} registered and selected!`, 'success');
  };

  // Coupon application
  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'MALL10') {
      setAppliedDiscountPercent(10);
      showToast('10% Mall discount applied successfully!', 'success');
    } else if (couponCode.toUpperCase() === 'WELCOME20') {
      setAppliedDiscountPercent(20);
      showToast('20% Welcome coupon applied!', 'success');
    } else {
      showToast('Invalid or expired coupon code', 'error');
    }
  };

  // Hold current cart
  const handleHoldCart = () => {
    if (cart.length === 0) {
      showToast('Cannot hold an empty cart', 'warning');
      return;
    }

    const holdId = `H-${Math.floor(1000 + Math.random() * 9000)}`;
    const newHold = {
      id: holdId,
      customer: selectedCustomer,
      cart: [...cart],
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setHeldCarts([...heldCarts, newHold]);
    setCart([]);
    setSelectedCustomer(null);
    setRedeemPoints(false);
    setCouponCode('');
    setAppliedDiscountPercent(0);
    showToast(`Cart placed on HOLD. Recall Code: ${holdId}`, 'success');
  };

  // Recall held cart
  const handleRecallCart = (holdId: string) => {
    const target = heldCarts.find(h => h.id === holdId);
    if (!target) return;

    setCart(target.cart);
    setSelectedCustomer(target.customer);
    setHeldCarts(heldCarts.filter(h => h.id !== holdId));
    setShowHeldModal(false);
    showToast(`Cart ${holdId} recalled!`, 'success');
  };

  // Split payment validation & save
  const handleSaveSplit = () => {
    const totalSplit = Number(splitCash) + Number(splitCard) + Number(splitUpi);
    // Allowing small decimal difference
    if (Math.abs(totalSplit - cartTotal) > 1) {
      showToast(`Split sum (₹${totalSplit.toFixed(2)}) must equal Total (₹${cartTotal.toFixed(2)})`, 'error');
      return;
    }
    setShowSplitModal(false);
    showToast('Split details saved', 'success');
  };

  // Complete billing
  const handleCheckout = async () => {
    if (cart.length === 0) {
      showToast('Please add products to the cart first', 'warning');
      return;
    }

    // Verify split details if method is Split
    if (paymentMethod === 'Split') {
      const totalSplit = Number(splitCash) + Number(splitCard) + Number(splitUpi);
      if (Math.abs(totalSplit - cartTotal) > 1) {
        showToast('Please set valid split values first (press F2)', 'error');
        return;
      }
    }

    playScanBeep();

    // Create retail order payload
    const orderNum = `RET-${String(orders.length + 1).padStart(5, '0')}`;
    const newOrder: ShopOrder = {
      id: `S-ORD-${Date.now()}`,
      orderNumber: orderNum,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
      customerPhone: selectedCustomer ? selectedCustomer.phone : '',
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        sku: item.product.sku
      })),
      subtotal: cartSubtotal,
      gst: cartGst,
      discount: discountAmount,
      total: cartTotal,
      paymentMethod,
      splitDetails: paymentMethod === 'Split' ? { cash: splitCash, card: splitCard, upi: splitUpi } : undefined,
      status: 'Completed',
      date: new Date().toISOString()
    };

    // Update local stock levels
    const updatedProducts = products.map(prod => {
      const cartItem = cart.find(c => c.product.id === prod.id);
      if (cartItem) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - cartItem.quantity)
        };
      }
      return prod;
    });
    setProducts(updatedProducts);

    // Call backend deductStock API in the background to sync DB
    cart.forEach(async (cartItem) => {
      try {
        await deductStock(cartItem.product.id, cartItem.quantity);
      } catch (err) {
        // Keep offline working state if backend api fails
        console.warn(`Could not sync stock deduction for ${cartItem.product.name}`, err);
      }
    });

    // Update customer loyalty points if customer is selected
    if (selectedCustomer) {
      let nextPoints = selectedCustomer.points;
      if (redeemPoints) {
        // Deduct redeemed points
        nextPoints = Math.max(0, nextPoints - Math.min(selectedCustomer.points, cartSubtotal));
      }
      // Add points for current sale (1 point per ₹100 spent)
      const pointsEarned = Math.floor(cartTotal / 100);
      nextPoints += pointsEarned;

      setCustomers(customers.map(c => 
        c.phone === selectedCustomer.phone ? { ...c, points: nextPoints } : c
      ));
    }

    // Add to orders list
    setOrders([newOrder, ...orders]);

    // Open Thermal Receipt modal
    setCurrentReceipt(newOrder);
    setShowReceipt(true);

    // Reset checkout states
    setCart([]);
    setSelectedCustomer(null);
    setRedeemPoints(false);
    setCouponCode('');
    setAppliedDiscountPercent(0);
    showToast(`Bill generated: ${orderNum}`, 'success');
  };

  // Refund Order (Returns stock to inventory)
  const handleRefundOrder = (orderId: string) => {
    const orderToRefund = orders.find(o => o.id === orderId);
    if (!orderToRefund || orderToRefund.status === 'Refunded') return;

    // Restore inventory stock
    const updatedProducts = products.map(prod => {
      const refundedItem = orderToRefund.items.find(i => i.productId === prod.id);
      if (refundedItem) {
        return {
          ...prod,
          stock: prod.stock + refundedItem.quantity
        };
      }
      return prod;
    });
    setProducts(updatedProducts);

    // Sync database inventory values in background
    orderToRefund.items.forEach(async (item) => {
      try {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          await updateInventoryItem(item.productId, { quantity: String(prod.stock + item.quantity) });
        }
      } catch (err) {
        console.warn(`Sync restore stock failed for item ${item.name}`, err);
      }
    });

    // Update order status to Refunded
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Refunded' } : o));
    showToast(`Order ${orderToRefund.orderNumber} successfully refunded and stock restored`, 'success');
  };

  // Add custom item / restock in stock inventory view
  const handleRestock = (productId: string, restockQty: number) => {
    if (isNaN(restockQty) || restockQty <= 0) return;
    
    setProducts(products.map(p => 
      p.id === productId ? { ...p, stock: p.stock + restockQty } : p
    ));

    const item = products.find(p => p.id === productId);
    if (item) {
      // Call background API
      void (async () => {
        try {
          await updateInventoryItem(productId, { quantity: String(item.stock + restockQty) });
        } catch (err) {
          console.warn('API sync restock failed', err);
        }
      })();
      showToast(`Restocked ${item.name} by +${restockQty}`, 'success');
    }
  };

  // Stock editor form state
  const [newStockItem, setNewStockItem] = useState({
    name: '',
    sku: '',
    price: '',
    category: 'Clothing',
    stock: '',
    lowStockLevel: '5',
    emoji: '📦'
  });

  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStockItem.name || !newStockItem.sku || !newStockItem.price || !newStockItem.stock) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    const priceNum = Number(newStockItem.price);
    const stockNum = Number(newStockItem.stock);
    const lowStockNum = Number(newStockItem.lowStockLevel);

    if (isNaN(priceNum) || isNaN(stockNum) || isNaN(lowStockNum)) {
      showToast('Price and stock levels must be numbers', 'error');
      return;
    }

    const newProd: RetailProduct = {
      id: `rp-${Date.now()}`,
      name: newStockItem.name,
      sku: newStockItem.sku.toUpperCase(),
      price: priceNum,
      category: newStockItem.category,
      stock: stockNum,
      lowStockLevel: lowStockNum,
      emoji: newStockItem.emoji,
      description: 'Custom retail product added via dashboard'
    };

    setProducts([newProd, ...products]);
    setNewStockItem({
      name: '',
      sku: '',
      price: '',
      category: 'Clothing',
      stock: '',
      lowStockLevel: '5',
      emoji: '📦'
    });
    showToast(`${newProd.name} added to stock inventory`, 'success');
  };

  return (
    <div className="min-h-screen text-slate-800 bg-[#F8FAFC] pb-12">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-4 right-4 z-55 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-white transition-all transform duration-300 animate-slide-in ${
          toast.type === 'success' ? 'bg-emerald-600 border-emerald-500' :
          toast.type === 'error' ? 'bg-rose-600 border-rose-500' : 'bg-amber-500 border-amber-400'
        }`}>
          {toast.type === 'success' && <CheckCircle size={18} />}
          {toast.type === 'error' && <AlertTriangle size={18} />}
          {toast.type === 'warning' && <AlertTriangle size={18} />}
          <span className="text-xs font-bold">{toast.message}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-xl shadow-md">
              🛒
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Shop & Mall Billing POS</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Retail checkout module</span>
            </div>
          </div>
        </div>

        {/* Tab Selector & Sound Toggle */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200">
            <button
              onClick={() => setActiveTab('pos')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition ${
                activeTab === 'pos' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Barcode size={14} />
              <span>POS Billing</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition ${
                activeTab === 'orders' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ClipboardList size={14} />
              <span>Track Orders</span>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition ${
                activeTab === 'inventory' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Package size={14} />
              <span>Stock Inventory</span>
              {lowStockItems.length > 0 && (
                <span className="bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full ml-1 animate-pulse">
                  {lowStockItems.length}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition cursor-pointer ${
              soundEnabled ? 'text-indigo-600 bg-indigo-50 border-indigo-100' : 'text-slate-400 bg-white'
            }`}
            title={soundEnabled ? 'Disable scanner sound' : 'Enable scanner sound'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </header>

      {/* CORE VIEWPORT */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        
        {/* ======================================= */}
        {/* VIEW 1: POS BILLING COUNTER             */}
        {/* ======================================= */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            
            {/* LEFT: PRODUCTS LIST & SCANNER */}
            <div className="space-y-6">
              
              {/* SCANNER EMULATION AND PRODUCT SEARCH */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Barcode scanner box */}
                <form onSubmit={handleBarcodeSubmit} className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Barcode Gun Scanner (F1 to Focus)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Barcode size={16} />
                    </div>
                    <input
                      ref={barcodeInputRef}
                      type="text"
                      placeholder="Type SKU (e.g. SKU-SHIRT, SKU-MILK) & press Enter..."
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs font-mono font-bold uppercase placeholder:normal-case placeholder:font-sans placeholder:font-normal"
                    />
                  </div>
                </form>

                {/* Regular search input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Fast Item Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Search size={16} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search retail products by name or SKU..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* CATEGORY SELECTOR */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition shrink-0 cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* PRODUCTS GRID */}
              {loading ? (
                <div className="text-center py-20 text-slate-400 font-bold text-sm">
                  <RefreshCw className="animate-spin inline mr-2 text-indigo-500" size={18} />
                  Loading shop inventory catalog...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400 font-semibold text-xs">
                  No products match your filters. Try scanning another SKU.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map((p) => {
                    const isLow = p.stock <= p.lowStockLevel;
                    const isOut = p.stock <= 0;
                    return (
                      <div
                        key={p.id}
                        onClick={() => !isOut && addToCart(p)}
                        className={`bg-white rounded-2xl border p-4 flex flex-col justify-between hover:shadow-md transition cursor-pointer select-none relative overflow-hidden group ${
                          isOut ? 'opacity-55 border-slate-200 pointer-events-none' :
                          isLow ? 'border-amber-200 hover:border-amber-300' : 'border-slate-100 hover:border-indigo-100'
                        }`}
                      >
                        {/* EMOJI IMAGE */}
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <span className="text-3xl p-1 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">{p.emoji}</span>
                          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tight bg-slate-100 px-1.5 py-0.5 rounded-md">{p.sku}</span>
                        </div>

                        {/* NAME & PRICE */}
                        <div>
                          <h3 className="font-bold text-xs text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{p.name}</h3>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{p.description}</p>
                          
                          <div className="flex items-baseline gap-1 mt-3">
                            <span className="text-xs font-extrabold text-slate-900">₹{p.price}</span>
                            <span className="text-[9px] text-slate-400 font-medium">unit</span>
                          </div>
                        </div>

                        {/* STOCK LEVEL INDICATOR */}
                        <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-2 text-[9px] font-bold">
                          {isOut ? (
                            <span className="text-rose-600 flex items-center gap-0.5 bg-rose-50 px-1.5 py-0.5 rounded">
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="text-amber-600 flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded">
                              Only {p.stock} left
                            </span>
                          ) : (
                            <span className="text-slate-500">
                              Stock: {p.stock} units
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR: CHECKOUT CART */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between min-h-[70vh] shadow-sm sticky top-28 self-start">
              
              {/* TOP: CART ITEMS */}
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={16} className="text-indigo-600" />
                    <h2 className="font-black text-sm text-slate-900">Checkout Cart</h2>
                  </div>
                  <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {cart.reduce((sum, i) => sum + i.quantity, 0)} items
                  </span>
                </div>

                {/* HELD BILLS ALERT */}
                {heldCarts.length > 0 && (
                  <button
                    onClick={() => setShowHeldModal(true)}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-100 transition cursor-pointer border border-amber-100"
                  >
                    <span>Recall Held Bill ({heldCarts.length})</span>
                    <ArrowLeftRight size={14} />
                  </button>
                )}

                {/* CART LIST */}
                <div className="flex-1 overflow-y-auto max-h-[35vh] space-y-3 pr-1 scrollbar-none">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2 flex-1">
                      <Barcode size={36} className="opacity-40 animate-pulse text-indigo-500" />
                      <p className="text-xs font-bold text-center">Ready to scan or tap items</p>
                      <span className="text-[9px] text-slate-400">Shortcuts: F1 (scan) | F3 (hold)</span>
                    </div>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start gap-2 p-2 bg-slate-50 rounded-xl">
                        <div className="min-w-0">
                          <h4 className="font-bold text-[11px] text-slate-800 truncate leading-tight">{item.product.emoji} {item.product.name}</h4>
                          <span className="text-[9px] text-slate-400 font-medium">₹{item.product.price} each</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => updateCartQty(item.product.id, -1)}
                            className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-xs font-extrabold text-slate-900 w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQty(item.product.id, 1)}
                            className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition"
                          >
                            <Plus size={10} />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="w-5 h-5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center ml-1 transition"
                            title="Remove"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* BOTTOM CART CONTROLS: LOYALTY & COUPON */}
                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                  
                  {/* Loyalty Customer Lookup */}
                  <div className="bg-slate-50 p-2.5 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-400">
                      <span>Customer Loyalty Lookup</span>
                      {selectedCustomer && <span className="text-indigo-600">Selected</span>}
                    </div>
                    
                    {selectedCustomer ? (
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div>
                          <p className="font-extrabold text-slate-800">{selectedCustomer.name}</p>
                          <p className="text-[9px] text-slate-500">Tier: {selectedCustomer.tier} | Points: {selectedCustomer.points}</p>
                        </div>
                        <button
                          onClick={() => { setSelectedCustomer(null); setRedeemPoints(false); }}
                          className="text-[9px] font-bold text-rose-500 hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Phone number / Name..."
                          value={customerSearch}
                          onChange={(e) => setCustomerSearch(e.target.value)}
                          className="flex-1 bg-white border border-slate-200 px-2 py-1 rounded-lg text-[10px] font-semibold focus:outline-none"
                          onKeyDown={(e) => e.key === 'Enter' && handleCustomerLookup()}
                        />
                        <button
                          onClick={handleCustomerLookup}
                          className="bg-indigo-600 text-white text-[10px] px-2.5 py-1 rounded-lg font-bold hover:bg-indigo-700 cursor-pointer"
                        >
                          Find
                        </button>
                      </div>
                    )}

                    {selectedCustomer && selectedCustomer.points > 0 && (
                      <label className="flex items-center gap-1.5 mt-1 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={redeemPoints}
                          onChange={(e) => setRedeemPoints(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 w-3 h-3"
                        />
                        <span className="text-[9px] text-slate-600 font-bold">
                          Redeem {selectedCustomer.points} pts for ₹{selectedCustomer.points} off
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Coupon Code Input */}
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Promo Coupon (MALL10)..."
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-xl text-[10px] font-semibold focus:outline-none placeholder:text-slate-400"
                    />
                    <button
                      onClick={applyCoupon}
                      className="bg-slate-800 text-white text-[10px] px-3 py-1.5 rounded-xl font-bold hover:bg-slate-900 cursor-pointer shrink-0"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>

              {/* BOTTOM: CALCULATIONS & CHECKOUT */}
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="space-y-1.5 text-xs font-bold text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-slate-900">₹{cartSubtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span className="text-slate-900">₹{cartGst}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Loyalty / Coupon Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-100">
                    <span>Net Payable</span>
                    <span className="text-indigo-600 text-base">₹{cartTotal}</span>
                  </div>
                </div>

                {/* PAYMENT METHOD SELECTOR */}
                <div className="grid grid-cols-4 gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[10px] font-black uppercase text-center text-slate-500">
                  <button
                    onClick={() => setPaymentMethod('Cash')}
                    className={`py-1.5 rounded-lg cursor-pointer ${paymentMethod === 'Cash' ? 'bg-white text-slate-800 shadow-sm' : ''}`}
                  >
                    Cash
                  </button>
                  <button
                    onClick={() => setPaymentMethod('Card')}
                    className={`py-1.5 rounded-lg cursor-pointer ${paymentMethod === 'Card' ? 'bg-white text-slate-800 shadow-sm' : ''}`}
                  >
                    Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod('UPI')}
                    className={`py-1.5 rounded-lg cursor-pointer ${paymentMethod === 'UPI' ? 'bg-white text-slate-800 shadow-sm' : ''}`}
                  >
                    UPI
                  </button>
                  <button
                    onClick={() => { setPaymentMethod('Split'); setShowSplitModal(true); }}
                    className={`py-1.5 rounded-lg cursor-pointer flex items-center justify-center gap-0.5 ${paymentMethod === 'Split' ? 'bg-white text-slate-800 shadow-sm' : ''}`}
                  >
                    Split
                  </button>
                </div>

                {paymentMethod === 'Split' && (
                  <div className="flex items-center justify-between text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1.5 rounded-xl border border-indigo-100">
                    <span>Split Ratio Setup: Cash, Card, UPI</span>
                    <button
                      onClick={() => setShowSplitModal(true)}
                      className="underline font-black hover:text-indigo-800 cursor-pointer"
                    >
                      Edit Ratio (F2)
                    </button>
                  </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="grid grid-cols-5 gap-2">
                  <button
                    onClick={handleHoldCart}
                    className="col-span-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs py-3 rounded-xl font-bold transition active:scale-95 cursor-pointer text-center"
                    title="Hold Bill (F3)"
                  >
                    Hold Cart
                  </button>
                  
                  <button
                    onClick={handleCheckout}
                    className="col-span-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs py-3 rounded-xl font-black transition-all active:scale-95 shadow-md shadow-indigo-600/10 cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>Generate Bill</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================= */}
        {/* VIEW 2: TRACK SHOP TRANSACTIONS         */}
        {/* ======================================= */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            
            {/* Header / Filter Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">Retail Sales Tracker</h2>
                <p className="text-xs text-slate-500 mt-1">Audit and refund physical billing invoices</p>
              </div>

              {/* Search Order */}
              <div className="relative w-full sm:w-72">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search size={14} />
                </div>
                <input
                  type="text"
                  placeholder="Order ID / Customer Phone..."
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                    <th className="p-4">Receipt ID</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Items count</th>
                    <th className="p-4">Amount Paid</th>
                    <th className="p-4">Payment Mode</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                  {orders.filter(o => 
                    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    o.customerPhone.includes(searchQuery)
                  ).map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4">
                        <span className="font-mono text-indigo-600">{ord.orderNumber}</span>
                        <p className="text-[9px] text-slate-400 font-medium mt-0.5">{new Date(ord.date).toLocaleString()}</p>
                      </td>
                      <td className="p-4">
                        <span>{ord.customerName}</span>
                        {ord.customerPhone && <p className="text-[9px] text-slate-400 font-medium mt-0.5">📞 {ord.customerPhone}</p>}
                      </td>
                      <td className="p-4">
                        <span>{ord.items.reduce((sum, i) => sum + i.quantity, 0)} items</span>
                        <p className="text-[9px] text-slate-400 font-medium mt-0.5 line-clamp-1">
                          {ord.items.map(i => `${i.name} (${i.quantity}x)`).join(', ')}
                        </p>
                      </td>
                      <td className="p-4 text-slate-900 font-extrabold">₹{ord.total.toFixed(2)}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px]">
                          {ord.paymentMethod}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          ord.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1.5">
                        <button
                          onClick={() => { setCurrentReceipt(ord); setShowReceipt(true); }}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition shrink-0 cursor-pointer inline-flex items-center gap-1"
                          title="Print Receipt"
                        >
                          <Printer size={12} />
                          <span className="text-[9px]">Receipt</span>
                        </button>
                        {ord.status !== 'Refunded' && (
                          <button
                            onClick={() => handleRefundOrder(ord.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition shrink-0 cursor-pointer inline-flex items-center gap-1"
                            title="Process Refund"
                          >
                            <X size={12} />
                            <span className="text-[9px]">Refund</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ======================================= */}
        {/* VIEW 3: STOCK & INVENTORY               */}
        {/* ======================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            
            {/* Low stock warning */}
            {lowStockItems.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
                <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="text-xs font-black text-amber-800">Critical Stock Warning</h4>
                  <p className="text-[10px] text-amber-700 mt-0.5 font-bold">
                    {lowStockItems.length} retail items are currently running below their defined low-stock warning threshold. Please check stock levels and restock items to prevent out-of-stock checkouts.
                  </p>
                </div>
              </div>
            )}

            {/* Split layout: inventory items + add form */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
              
              {/* Left Column: Stock Inventory Table */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Retail Inventory Directory</h2>
                    <p className="text-xs text-slate-500 mt-1">Configure stock warning levels and record replenishment</p>
                  </div>
                  
                  {/* Search inventory */}
                  <div className="relative w-full sm:w-60">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Search size={14} />
                    </div>
                    <input
                      type="text"
                      placeholder="Search SKU or item name..."
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                        <th className="p-4">Product SKU</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Stock Level</th>
                        <th className="p-4">Low Stock Limit</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Quick Restock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                      {products.filter(p => 
                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map((prod) => {
                        const isLow = prod.stock <= prod.lowStockLevel;
                        return (
                          <tr key={prod.id} className="hover:bg-slate-50/50 transition">
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xl p-1 bg-slate-50 rounded-lg">{prod.emoji}</span>
                                <div>
                                  <p className="text-slate-900 font-extrabold">{prod.name}</p>
                                  <span className="text-[9px] text-slate-400 font-mono uppercase">{prod.sku} | ₹{prod.price}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px]">
                                {prod.category}
                              </span>
                            </td>
                            <td className="p-4 text-slate-900 font-extrabold">{prod.stock} units</td>
                            <td className="p-4 text-slate-400">{prod.lowStockLevel} units</td>
                            <td className="p-4">
                              {prod.stock <= 0 ? (
                                <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase">
                                  Out of Stock
                                </span>
                              ) : isLow ? (
                                <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase">
                                  Low Stock
                                </span>
                              ) : (
                                <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase">
                                  Good
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <input
                                  type="number"
                                  placeholder="+10"
                                  id={`restock-qty-${prod.id}`}
                                  className="w-12 border border-slate-200 px-1 py-1 rounded text-center text-[10px] font-bold focus:outline-none"
                                  defaultValue="10"
                                  min="1"
                                />
                                <button
                                  onClick={() => {
                                    const el = document.getElementById(`restock-qty-${prod.id}`) as HTMLInputElement;
                                    if (el) {
                                      handleRestock(prod.id, Number(el.value));
                                    }
                                  }}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] px-2 py-1 rounded font-bold cursor-pointer"
                                >
                                  Add
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Add Stock Form */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 self-start">
                <div>
                  <h3 className="font-black text-sm text-slate-900">Add New SKU to Catalog</h3>
                  <p className="text-[10px] text-slate-400 mt-1">Register new barcode products in software database</p>
                </div>

                <form onSubmit={handleAddNewProduct} className="space-y-3.5 text-xs font-bold text-slate-600">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider text-slate-400">Product Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Designer Silk Tie"
                      value={newStockItem.name}
                      onChange={(e) => setNewStockItem({ ...newStockItem, name: e.target.value })}
                      className="w-full border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-slate-400">SKU Barcode</label>
                      <input
                        type="text"
                        placeholder="SKU-TIE"
                        value={newStockItem.sku}
                        onChange={(e) => setNewStockItem({ ...newStockItem, sku: e.target.value })}
                        className="w-full border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 uppercase"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-slate-400">Product Price (₹)</label>
                      <input
                        type="text"
                        placeholder="599"
                        value={newStockItem.price}
                        onChange={(e) => setNewStockItem({ ...newStockItem, price: e.target.value })}
                        className="w-full border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-slate-400">Category</label>
                      <select
                        value={newStockItem.category}
                        onChange={(e) => setNewStockItem({ ...newStockItem, category: e.target.value })}
                        className="w-full border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                      >
                        <option value="Clothing">Clothing</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-slate-400">Emoji icon</label>
                      <input
                        type="text"
                        placeholder="👔"
                        value={newStockItem.emoji}
                        onChange={(e) => setNewStockItem({ ...newStockItem, emoji: e.target.value })}
                        className="w-full border border-slate-200 px-3 py-2 rounded-xl focus:outline-none text-center"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-slate-400">Initial Stock</label>
                      <input
                        type="number"
                        placeholder="50"
                        value={newStockItem.stock}
                        onChange={(e) => setNewStockItem({ ...newStockItem, stock: e.target.value })}
                        className="w-full border border-slate-200 px-3 py-2 rounded-xl focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider text-slate-400">Low stock Alert</label>
                      <input
                        type="number"
                        placeholder="5"
                        value={newStockItem.lowStockLevel}
                        onChange={(e) => setNewStockItem({ ...newStockItem, lowStockLevel: e.target.value })}
                        className="w-full border border-slate-200 px-3 py-2 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs py-2.5 rounded-xl font-bold transition active:scale-95 cursor-pointer text-center"
                  >
                    Add Product to Directory
                  </button>
                </form>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* ======================================= */}
      {/* MODAL 1: THERMAL INVOICE RECEIPT       */}
      {/* ======================================= */}
      {showReceipt && currentReceipt && (
        <div className="fixed inset-0 z-55 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 flex flex-col justify-between max-h-[85vh] animate-scale-up">
            
            {/* THERMAL BILL CARD (Paper styling) */}
            <div className="flex-1 overflow-y-auto pr-1 scrollbar-none font-mono text-slate-800 border-2 border-dashed border-slate-200 p-4 bg-slate-50/50 rounded-xl text-xs space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-base font-black uppercase text-slate-900">A3 RETAIL MART</h3>
                <p className="text-[10px] font-bold">12/A Mall Avenue, Block C</p>
                <p className="text-[10px] font-bold">GSTIN: 27AAAAA1111A1Z0</p>
                <p className="text-[10px] font-medium">Phone: +91 99999 88888</p>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 space-y-0.5 text-[10px] font-bold">
                <div className="flex justify-between">
                  <span>BILL NO: {currentReceipt.orderNumber}</span>
                  <span>DATE: {new Date(currentReceipt.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>CASHIER: COUNTER 1</span>
                  <span>TIME: {new Date(currentReceipt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {currentReceipt.customerName && (
                  <div className="flex justify-between border-t border-dashed border-slate-200 pt-1">
                    <span>CUSTOMER: {currentReceipt.customerName}</span>
                    <span>{currentReceipt.customerPhone}</span>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
                <div className="grid grid-cols-12 font-black text-[9px] uppercase border-b border-dashed border-slate-300 pb-1">
                  <span className="col-span-6">Item Description</span>
                  <span className="col-span-2 text-center">Qty</span>
                  <span className="col-span-2 text-right">Price</span>
                  <span className="col-span-2 text-right">Amt</span>
                </div>
                {currentReceipt.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 text-[10px]">
                    <span className="col-span-6 truncate font-bold">{item.name}</span>
                    <span className="col-span-2 text-center font-bold">{item.quantity}</span>
                    <span className="col-span-2 text-right font-medium">{item.price}</span>
                    <span className="col-span-2 text-right font-extrabold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1 text-[10px] font-bold">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{currentReceipt.subtotal}</span>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span>GST Tax (9% CGST + 9% SGST)</span>
                  <span>₹{currentReceipt.gst}</span>
                </div>
                {currentReceipt.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon / Points Discount</span>
                    <span>-₹{currentReceipt.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-black border-t border-dashed border-slate-300 pt-1.5 text-slate-900">
                  <span>NET PAYABLE</span>
                  <span>₹{currentReceipt.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-300 pt-3 text-center space-y-2">
                <span className="text-[10px] font-extrabold uppercase bg-slate-200/80 px-2 py-0.5 rounded">
                  Paid via: {currentReceipt.paymentMethod}
                </span>
                {currentReceipt.splitDetails && (
                  <p className="text-[9px] text-slate-500 font-bold">
                    Ratio: Cash ₹{currentReceipt.splitDetails.cash} | Card ₹{currentReceipt.splitDetails.card} | UPI ₹{currentReceipt.splitDetails.upi}
                  </p>
                )}
                <p className="text-[9px] font-bold text-slate-500">Thank you for shopping with us!</p>
                <div className="flex justify-center pt-1 opacity-70">
                  <Barcode className="w-40 h-8 text-slate-800" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  try { window.print(); } catch (e) { console.error(e); }
                }}
                className="flex-1 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Printer size={14} />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setShowReceipt(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition cursor-pointer text-center"
              >
                Close Receipt
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* MODAL 2: REGISTER CUSTOMER              */}
      {/* ======================================= */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-55 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-100 animate-scale-up space-y-4">
            <div>
              <h3 className="font-black text-sm text-slate-900">Register Retail Customer</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Create a loyalty profile to earn reward points</p>
            </div>

            <form onSubmit={handleRegisterCustomer} className="space-y-3.5 text-xs font-bold text-slate-600">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-400">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Patel"
                  value={newCustomerForm.name}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                  className="w-full border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-400">Phone number</label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={newCustomerForm.phone}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                  className="w-full border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-400">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. rahul@patel.com"
                  value={newCustomerForm.email}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                  className="w-full border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomerModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl transition cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* MODAL 3: SPLIT PAYMENT CALCULATOR       */}
      {/* ======================================= */}
      {showSplitModal && (
        <div className="fixed inset-0 z-55 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-100 animate-scale-up space-y-4">
            <div>
              <h3 className="font-black text-sm text-slate-900">Split Bill Calculator</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Divide total payable amount between channels</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-center">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Bill Amount</span>
              <p className="text-xl font-black text-indigo-600 mt-0.5">₹{cartTotal}</p>
            </div>

            <div className="space-y-3.5 text-xs font-bold text-slate-600">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-400">Cash Payment (₹)</label>
                <input
                  type="number"
                  value={splitCash}
                  onChange={(e) => setSplitCash(Number(e.target.value))}
                  className="w-full border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-400">Card Terminal Payment (₹)</label>
                <input
                  type="number"
                  value={splitCard}
                  onChange={(e) => setSplitCard(Number(e.target.value))}
                  className="w-full border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-slate-400">UPI Scanner Payment (₹)</label>
                <input
                  type="number"
                  value={splitUpi}
                  onChange={(e) => setSplitUpi(Number(e.target.value))}
                  className="w-full border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs font-black">
                <span className="text-slate-500">Split Total Sum:</span>
                <span className={Math.abs((Number(splitCash) + Number(splitCard) + Number(splitUpi)) - cartTotal) < 1 ? 'text-emerald-600' : 'text-rose-500'}>
                  ₹{(Number(splitCash) + Number(splitCard) + Number(splitUpi)).toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleSaveSplit}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs py-2.5 rounded-xl font-bold transition active:scale-95 cursor-pointer text-center"
              >
                Save Split Ratios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================= */}
      {/* MODAL 4: RECALL HELD CARTS              */}
      {/* ======================================= */}
      {showHeldModal && (
        <div className="fixed inset-0 z-55 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-100 animate-scale-up space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-black text-sm text-slate-900">Recall Held Carts</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Resume checking out customers who were put on hold</p>
              </div>
              <button
                onClick={() => setShowHeldModal(false)}
                className="p-1 rounded-lg border hover:bg-slate-50 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[50vh] pr-1">
              {heldCarts.map((h) => (
                <div key={h.id} className="p-3 bg-slate-50 rounded-xl border border-slate-155 flex justify-between items-center gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-indigo-600 text-xs">{h.id}</span>
                      <span className="text-[10px] text-slate-400 font-medium">({h.date})</span>
                    </div>
                    <p className="font-extrabold text-slate-800 mt-0.5">
                      Customer: {h.customer ? h.customer.name : 'Walk-in'}
                    </p>
                    <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">
                      {h.cart.map(c => `${c.product.emoji} ${c.product.name} (${c.quantity}x)`).join(', ')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRecallCart(h.id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] px-3 py-1.5 rounded-lg font-black shrink-0 cursor-pointer"
                  >
                    Recall
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
