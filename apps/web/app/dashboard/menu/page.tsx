'use client';

import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from 'react';
import {
  createCategory,
  createMenuItem,
  deleteMenuItem,
  getCategories,
  getMenuItems,
  updateMenuAvailability,
} from '@/services/menu.service';
import type { MenuCategory, MenuItem } from '@/src/types/menu.types';
import {
  Palette,
  Layout,
  MousePointer,
  Sparkles,
  Trash2,
  CheckCircle,
  Plus,
} from 'lucide-react';

type MenuForm = {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  variantName: string;
  variantPrice: string;
  addonName: string;
  addonPrice: string;
  imageUrl: string;
};

const emptyForm: MenuForm = {
  name: '',
  description: '',
  price: '',
  categoryId: '',
  variantName: '',
  variantPrice: '',
  addonName: '',
  addonPrice: '',
  imageUrl: '',
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

const vegLibrary = [
  {
    name: 'Veg Pizza',
    price: 349,
    category: 'Mains',
    imageUrl: '/images/veg_pizza.png',
    description: 'Fresh basil, bell peppers, olives, cherry tomatoes, wood-fired crust.'
  },
  {
    name: 'Pasta Alfredo',
    price: 299,
    category: 'Mains',
    imageUrl: '/images/pasta_alfredo.png',
    description: 'Creamy fettuccine Alfredo pasta, garlic, cheese, fresh parsley.'
  },
  {
    name: 'Paneer Butter Masala',
    price: 249,
    category: 'Mains',
    imageUrl: '/images/paneer_butter_masala.png',
    description: 'Cottage cheese cubes cooked in rich tomato cashew butter gravy.'
  },
  {
    name: 'Samosa Crunch',
    price: 49,
    category: 'Starters',
    imageUrl: '/images/samosa_crunch.png',
    description: 'Crispy fried pastry filled with spiced potato and peas mixture.'
  },
  {
    name: 'Garlic Naan',
    price: 39,
    category: 'Breads',
    imageUrl: '/images/garlic_naan.png',
    description: 'Soft clay oven flatbread seasoned with minced garlic and butter.'
  }
];

const nonVegLibrary = [
  {
    name: 'Chicken Burger',
    price: 199,
    category: 'Mains',
    imageUrl: '/images/chicken_burger.png',
    description: 'Gourmet crispy chicken burger, lettuce, red onion, melting cheese.'
  },
  {
    name: 'Chicken Biryani',
    price: 249,
    category: 'Mains',
    imageUrl: '/images/chicken_biryani.png',
    description: 'Fragrant basmati rice cooked with chicken pieces, boiled egg, spices.'
  },
  {
    name: 'Tandoori Tikka',
    price: 299,
    category: 'Starters',
    imageUrl: '/images/tandoori_tikka.png',
    description: 'Yogurt-marinated chicken breast cubes baked in charcoal oven.'
  },
  {
    name: 'Butter Chicken',
    price: 329,
    category: 'Mains',
    imageUrl: '/images/butter_chicken.png',
    description: 'Tandoori grilled chicken cooked in cream tomato onion sauce.'
  },
  {
    name: 'Mutton Seekh',
    price: 349,
    category: 'Starters',
    imageUrl: '/images/mutton_seekh.png',
    description: 'Skewered minced spiced mutton sausage grilled in tandoor.'
  }
];

export default function MenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [form, setForm] = useState<MenuForm>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Food library tab state
  const [libraryTab, setLibraryTab] = useState<'veg' | 'nonveg'>('veg');

  // Menu timing filter state
  const [selectedTiming, setSelectedTiming] = useState<'all' | 'breakfast' | 'lunch' | 'dinner'>('all');
  
  // Timing mapping state for mock persistence
  const [itemTimings, setItemTimings] = useState<Record<string, 'breakfast' | 'lunch' | 'dinner' | 'all-day'>>({});
  // Popular item highlighters
  const [popularItems, setPopularItems] = useState<Record<string, boolean>>({});

  // Layout customizer state
  const [selectedLayout, setSelectedLayout] = useState('design-1');
  const [headerColor, setHeaderColor] = useState('#1E1B4B');
  const [buttonColor, setButtonColor] = useState('#4F46E5');
  const [borderColor, setBorderColor] = useState('#E8EAF6');
  const [lightMode, setLightMode] = useState(true);

  const activeCategories = useMemo(
    () => categories.filter((category) => category.isActive),
    [categories],
  );

  const loadMenu = async () => {
    try {
      const [nextCategories, nextItems] = await Promise.all([
        getCategories(),
        getMenuItems(),
      ]);
      setCategories(nextCategories);
      setItems(nextItems);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void (async () => {
      await loadMenu();
    })();

    // Load customizer presets
    const savedLayout = localStorage.getItem('custom-layout') || 'design-1';
    const savedHeader = localStorage.getItem('custom-header') || '#1E1B4B';
    const savedButton = localStorage.getItem('custom-button') || '#4F46E5';
    const savedBorder = localStorage.getItem('custom-border') || '#E8EAF6';
    const savedTheme = localStorage.getItem('custom-theme') !== 'dark';

    setSelectedLayout(savedLayout);
    setHeaderColor(savedHeader);
    setButtonColor(savedButton);
    setBorderColor(savedBorder);
    setLightMode(savedTheme);

    // Initial timings & popular seed
    setPopularItems({
      '1': true,
      '3': true
    });
    setItemTimings({
      '1': 'lunch',
      '2': 'breakfast',
      '3': 'dinner'
    });
  }, []);

  const updateField = (key: keyof MenuForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) return;
    await createCategory({ name: categoryName.trim() });
    setCategoryName('');
    await loadMenu();
  };

  const handleCreateMenuItem = async () => {
    if (!form.name || !form.price) return;

    const createdItem = await createMenuItem({
      name: form.name,
      description: form.description || undefined,
      price: Number(form.price),
      categoryId: form.categoryId || undefined,
      imageUrl: form.imageUrl || undefined,
      variants: form.variantName
        ? [
            {
              name: form.variantName,
              priceDelta: Number(form.variantPrice || 0),
            },
          ]
        : undefined,
      addons: form.addonName
        ? [
            {
              name: form.addonName,
              price: Number(form.addonPrice || 0),
            },
          ]
        : undefined,
    });

    // Mock timings and popular flags
    if (createdItem && createdItem.id) {
      setItemTimings(prev => ({ ...prev, [createdItem.id]: 'all-day' }));
    }

    setForm(emptyForm);
    await loadMenu();
  };

  const saveCustomStyles = () => {
    localStorage.setItem('custom-layout', selectedLayout);
    localStorage.setItem('custom-header', headerColor);
    localStorage.setItem('custom-button', buttonColor);
    localStorage.setItem('custom-border', borderColor);
    localStorage.setItem('custom-theme', lightMode ? 'light' : 'dark');
    alert('🎨 Public customer ordering styles saved successfully!');
  };

  const handleQuickAdd = async (libItem: typeof vegLibrary[0]) => {
    let matchedCat = categories.find(
      (c) => c.name.toLowerCase() === libItem.category.toLowerCase()
    );
    
    if (!matchedCat && categories.length > 0) {
      matchedCat = categories[0];
    }
    
    try {
      const created = await createMenuItem({
        name: libItem.name,
        description: libItem.description,
        price: libItem.price,
        categoryId: matchedCat ? matchedCat.id : undefined,
        imageUrl: libItem.imageUrl,
      });

      if (created && created.id) {
        setItemTimings(prev => ({ ...prev, [created.id]: 'all-day' }));
      }

      alert(`🎉 Added "${libItem.name}" to your restaurant menu!`);
      await loadMenu();
    } catch (error) {
      console.error(error);
      alert('Failed to quick add menu item');
    }
  };

  // Filter items by timing state
  const filteredItems = useMemo(() => {
    if (selectedTiming === 'all') return items;
    return items.filter(item => {
      const timing = itemTimings[item.id] || 'all-day';
      return timing === 'all-day' || timing === selectedTiming;
    });
  }, [items, selectedTiming, itemTimings]);

  const togglePopular = (id: string) => {
    setPopularItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const setItemTimingMock = (id: string, timing: 'breakfast' | 'lunch' | 'dinner' | 'all-day') => {
    setItemTimings(prev => ({ ...prev, [id]: timing }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4F46E5]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-900 bg-[#F8F9FF] p-1">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Menu & Design Settings</h1>
          <p className="text-sm text-slate-500 font-bold mt-1">
            Manage your food catalog, customize timing schedules, and style the customer ordering interface.
          </p>
        </div>
      </div>

      {/* TIMINGS BAR */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit gap-1">
        {[
          { code: 'all', label: 'All-Day Menu' },
          { code: 'breakfast', label: '🍳 Breakfast Specials' },
          { code: 'lunch', label: '🍱 Lunch Menu' },
          { code: 'dinner', label: '🍲 Dinner Menu' }
        ].map(timing => (
          <button
            key={timing.code}
            onClick={() => setSelectedTiming(timing.code as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedTiming === timing.code
                ? 'bg-[#4F46E5]/10 text-[#4F46E5]'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {timing.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* LEFT COMPONENT LAYER */}
        <div className="space-y-6">
          
          {/* CATEGORIES & FOOD ITEMS CREATOR */}
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* CATEGORIES */}
            <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Category Manager</h2>
              <div className="flex gap-2">
                <input
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  placeholder="Category Name (e.g. Starters)"
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none text-xs font-bold focus:ring-2 focus:ring-[#4F46E5] text-slate-800"
                />
                <button
                  onClick={handleCreateCategory}
                  className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2 rounded-xl font-bold text-xs transition active:scale-95 flex items-center gap-1 shadow-md shadow-indigo-600/10 whitespace-nowrap"
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2.5 text-xs font-bold text-slate-700"
                  >
                    <span>{category.name}</span>
                    <span className="text-[10px] text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                      Sort #{category.sortOrder}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CREATE FOOD */}
            <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Create Food Item</h2>
              <div className="grid gap-2 text-xs">
                <input
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Item Name"
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none text-slate-800 font-bold"
                />
                <input
                  value={form.price}
                  onChange={(event) => updateField('price', event.target.value)}
                  placeholder="Price (INR)"
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none text-slate-800 font-bold"
                />
                <select
                  value={form.categoryId}
                  onChange={(event) => updateField('categoryId', event.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none text-slate-700 font-bold"
                >
                  <option value="">No Category</option>
                  {activeCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <input
                  value={form.description}
                  onChange={(event) => updateField('description', event.target.value)}
                  placeholder="Brief description of ingredients..."
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none text-slate-855 font-bold"
                />
              </div>

              <button
                onClick={handleCreateMenuItem}
                className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-2.5 rounded-xl text-xs font-bold active:scale-95 transition-all shadow-md shadow-indigo-600/10"
              >
                Save Menu Item
              </button>
            </div>

          </div>

          {/* QUICK FOOD TEMPLATE GALLERY */}
          <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-black text-slate-855 uppercase tracking-wider">Quick Import Library</h2>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Add ready-made culinary recipes directly to your active listings.</p>
              </div>

              {/* LIBRARY TABS */}
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 w-fit">
                <button
                  onClick={() => setLibraryTab('veg')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    libraryTab === 'veg' ? 'bg-[#10B981]/15 text-[#10B981]' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                  Vegetarian
                </button>
                <button
                  onClick={() => setLibraryTab('nonveg')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    libraryTab === 'nonveg' ? 'bg-[#EF4444]/15 text-[#EF4444]' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]"></span>
                  Non-Veg
                </button>
              </div>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {(libraryTab === 'veg' ? vegLibrary : nonVegLibrary).map((libItem) => (
                <div key={libItem.name} className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col justify-between hover:border-slate-300 transition duration-150">
                  <div>
                    <div 
                      className="h-24 w-full rounded-xl bg-slate-200 bg-cover bg-center mb-2"
                      style={{ backgroundImage: `url(${libItem.imageUrl})` }}
                    />
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-extrabold text-xs text-slate-800 line-clamp-1">{libItem.name}</span>
                      <span className="font-black text-[#4F46E5] text-xs whitespace-nowrap">₹{libItem.price}</span>
                    </div>
                    <p className="text-[9px] text-slate-500 mt-1 leading-normal line-clamp-2">{libItem.description}</p>
                  </div>

                  <button
                    onClick={() => void handleQuickAdd(libItem)}
                    className="w-full mt-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[10px] py-1.5 rounded-xl active:scale-95 transition-all"
                  >
                    + Add to Catalog
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIVE MENU GRID */}
          <div className="space-y-3">
            <h2 className="text-sm font-black text-slate-805 uppercase tracking-wider">Active Catalog List ({filteredItems.length} items)</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => {
                const isPopular = popularItems[item.id] || false;
                const timing = itemTimings[item.id] || 'all-day';

                return (
                  <div key={item.id} className="rounded-2xl bg-white border border-slate-100 p-4 shadow-sm flex flex-col justify-between relative hover:shadow-md transition duration-150">
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-1 z-10">
                      {isPopular && (
                        <span className="bg-amber-500 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
                          🔥 Popular
                        </span>
                      )}
                      <span className="bg-[#4F46E5]/10 text-[#4F46E5] font-extrabold text-[8px] px-1.5 py-0.5 rounded capitalize">
                        {timing}
                      </span>
                    </div>

                    <div>
                      <div
                        className="mb-3 h-28 w-full rounded-xl bg-cover bg-center bg-slate-100"
                        style={{ backgroundImage: `url(${getItemImageUrl(item)})` }}
                      />
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-extrabold text-xs text-slate-900 line-clamp-1">{item.name}</h3>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">{item.categories?.name || 'Mains'}</p>
                        </div>
                        <span className="font-black text-slate-900 text-sm whitespace-nowrap">₹{item.price}</span>
                      </div>
                      <p className="mt-1 text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-50 space-y-2">
                      {/* timing configuration & popular toggle */}
                      <div className="flex justify-between items-center gap-1.5">
                        <select
                          value={timing}
                          onChange={(e) => setItemTimingMock(item.id, e.target.value as any)}
                          className="px-2 py-1 border border-slate-200 rounded-lg text-[9px] font-bold text-slate-600 bg-white"
                        >
                          <option value="all-day">All-Day</option>
                          <option value="breakfast">Breakfast</option>
                          <option value="lunch">Lunch</option>
                          <option value="dinner">Dinner</option>
                        </select>

                        <button
                          onClick={() => togglePopular(item.id)}
                          className={`px-2 py-1 border rounded-lg text-[9px] font-bold transition-all ${
                            isPopular
                              ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                              : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-amber-500 hover:bg-amber-50'
                          }`}
                        >
                          {isPopular ? '★ Starred' : '★ Star'}
                        </button>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() =>
                            void updateMenuAvailability(item.id, !item.isAvailable).then(loadMenu)
                          }
                          className={`flex-1 py-1.5 rounded-lg font-bold text-[10px] transition-all ${
                            item.isAvailable
                              ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20'
                              : 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/20'
                          }`}
                        >
                          {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </button>
                        <button
                          onClick={() => void deleteMenuItem(item.id).then(loadMenu)}
                          className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-rose-50 hover:text-[#EF4444] rounded-lg text-slate-400 transition"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT DESIGN CUSTOMIZER */}
        <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Palette className="text-[#4F46E5]" size={20} />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Styling Settings</h2>
            </div>

            {/* LAYOUT SELECTOR */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">1. Customer Menu Template</label>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold text-slate-700">
                {[
                  { id: 'design-1', label: 'Classic Grid' },
                  { id: 'design-2', label: 'Sleek Rows' },
                  { id: 'design-3', label: 'Split Columns' },
                  { id: 'design-4', label: 'Banner Highlight' },
                ].map((design) => (
                  <button
                    key={design.id}
                    onClick={() => setSelectedLayout(design.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-2 border rounded-xl transition-all ${
                      selectedLayout === design.id
                        ? 'bg-[#4F46E5]/10 border-[#4F46E5] text-[#4F46E5]'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <Layout size={12} />
                    {design.label}
                  </button>
                ))}
              </div>
            </div>

            {/* COLOR OPTIONS */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">2. Custom Theme Colors</label>
              
              <div className="grid gap-2">
                <div className="flex justify-between items-center px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-600">Primary Sidebar</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">{headerColor}</span>
                    <input
                      type="color"
                      value={headerColor}
                      onChange={(e) => setHeaderColor(e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-600">Active Highlighters</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">{buttonColor}</span>
                    <input
                      type="color"
                      value={buttonColor}
                      onChange={(e) => setButtonColor(e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-600">Borders & Division</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">{borderColor}</span>
                    <input
                      type="color"
                      value={borderColor}
                      onChange={(e) => setBorderColor(e.target.value)}
                      className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* THEME TOGGLE */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">3. Customer Interface Theme</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setLightMode(true)}
                  className={`flex-1 py-2 border rounded-xl text-xs font-bold transition-all ${
                    lightMode ? 'bg-[#4F46E5] text-white border-[#4F46E5]' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  ☀️ Light Mode
                </button>
                <button
                  onClick={() => setLightMode(false)}
                  className={`flex-1 py-2 border rounded-xl text-xs font-bold transition-all ${
                    !lightMode ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  🌙 Dark Mode
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={saveCustomStyles}
            className="w-full mt-4 bg-[#4F46E5] hover:bg-[#4338CA] text-white py-3 rounded-xl text-xs font-black active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10"
          >
            <Sparkles size={14} /> Apply Styles Config
          </button>
        </div>
      </div>
    </div>
  );
}
