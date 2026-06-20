'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  getRestaurantDetail,
  getRestaurantMenu,
  getMenuCategories,
  type Restaurant,
  type MenuItem,
} from '@/services/online-ordering.service';
import {
  AnimatedButton,
  GlassContainer,
  MenuItemCard,
  FilterChip,
  SkeletonCard,
  Alert,
} from '@/components/common/animated-components';
import {
  ArrowLeft,
  Star,
  Clock,
  Truck,
  MapPin,
  Phone,
  Heart,
  Share2,
  ShoppingCart,
  Search,
} from 'lucide-react';

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export default function RestaurantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const restaurantSlug = params.slug as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // Load restaurant and menu
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [restaurantData, menuData, categoriesData] = await Promise.all([
          getRestaurantDetail(restaurantSlug),
          getRestaurantMenu(restaurantSlug),
          getMenuCategories(restaurantSlug),
        ]);

        setRestaurant(restaurantData);
        setMenuItems(menuData);
        setCategories(['all', ...categoriesData]);
        setError(null);
      } catch (err) {
        console.error('Error loading restaurant:', err);
        setError('Failed to load restaurant. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [restaurantSlug]);

  // Filter menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart management
  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find((i) => i.menuItemId === item.id);
    if (existingItem) {
      setCart(
        cart.map((i) =>
          i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([
        ...cart,
        { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 },
      ]);
    }
  };

  const removeFromCart = (menuItemId: string) => {
    setCart(cart.filter((i) => i.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
    } else {
      setCart(
        cart.map((i) =>
          i.menuItemId === menuItemId ? { ...i, quantity } : i
        )
      );
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (restaurant && cart.length > 0) {
      router.push(`/checkout?restaurant=${restaurant.slug}&items=${btoa(JSON.stringify(cart))}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 px-4 py-8 flex items-center justify-center">
        <GlassContainer className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Restaurant not found'}
          </h1>
          <AnimatedButton
            variant="primary"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </AnimatedButton>
        </GlassContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {restaurant.name}
            </h1>
          </div>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ShoppingCart className="w-6 h-6 text-gray-900 dark:text-white" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="relative">
        <img
          src={restaurant.imageUrl || '/images/restaurant-placeholder.jpg'}
          alt={restaurant.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">{restaurant.name}</h2>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{restaurant.rating} ({restaurant.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{restaurant.deliveryTime} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    <span>₹{restaurant.deliveryCharge}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <Heart
                    className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                  />
                </button>
                <button className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            {restaurant.description && (
              <p className="text-sm opacity-90">{restaurant.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and filters */}
            <GlassContainer className="sticky top-24 z-30">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent outline-none text-gray-900 dark:text-white"
                  />
                </div>

                {/* Category filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {categories.map((category) => (
                    <FilterChip
                      key={category}
                      label={category.charAt(0).toUpperCase() + category.slice(1)}
                      selected={selectedCategory === category}
                      onClick={() => setSelectedCategory(category)}
                    />
                  ))}
                </div>
              </div>
            </GlassContainer>

            {/* Menu items */}
            {filteredItems.length === 0 ? (
              <GlassContainer className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  No items found in this category.
                </p>
              </GlassContainer>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    image={item.imageUrl || '/images/menu-placeholder.jpg'}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    rating={item.rating}
                    isVeg={item.isVeg}
                    onAddClick={() => addToCart(item)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          {showCart && (
            <div className="lg:col-span-1">
              <GlassContainer className="sticky top-24">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Your Cart
                  </h3>

                  {cart.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                      Your cart is empty
                    </p>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {cart.map((item) => (
                          <div
                            key={item.menuItemId}
                            className="flex items-center justify-between p-3 bg-white/10 dark:bg-white/5 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                ₹{item.price}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center bg-red-600 text-white rounded text-sm hover:bg-red-700"
                              >
                                −
                              </button>
                              <span className="w-6 text-center font-semibold text-gray-900 dark:text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center bg-green-600 text-white rounded text-sm hover:bg-green-700"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-white/20 dark:border-white/10 pt-4 space-y-3">
                        <div className="flex justify-between text-gray-900 dark:text-white">
                          <span>Subtotal:</span>
                          <span className="font-semibold">₹{cartTotal}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 dark:text-gray-400 text-sm">
                          <span>Delivery:</span>
                          <span>₹{restaurant.deliveryCharge}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                          <span>Total:</span>
                          <span>₹{cartTotal + restaurant.deliveryCharge}</span>
                        </div>

                        <AnimatedButton
                          variant="primary"
                          onClick={handleCheckout}
                          className="w-full"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Checkout
                        </AnimatedButton>
                      </div>
                    </>
                  )}
                </div>
              </GlassContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
