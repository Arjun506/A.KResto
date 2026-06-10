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

  // Layout customizer state
  const [selectedLayout, setSelectedLayout] = useState('design-1');
  const [headerColor, setHeaderColor] = useState('#000000');
  const [buttonColor, setButtonColor] = useState('#ef4444');
  const [borderColor, setBorderColor] = useState('#e2e8f0');
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
    const savedHeader = localStorage.getItem('custom-header') || '#000000';
    const savedButton = localStorage.getItem('custom-button') || '#ef4444';
    const savedBorder = localStorage.getItem('custom-border') || '#e2e8f0';
    const savedTheme = localStorage.getItem('custom-theme') !== 'dark';

    setSelectedLayout(savedLayout);
    setHeaderColor(savedHeader);
    setButtonColor(savedButton);
    setBorderColor(savedBorder);
    setLightMode(savedTheme);
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

    await createMenuItem({
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
    // Find category matching libItem.category name (case-insensitive)
    let matchedCat = categories.find(
      (c) => c.name.toLowerCase() === libItem.category.toLowerCase()
    );
    
    // If no category matched, and categories exist, use the first available category
    if (!matchedCat && categories.length > 0) {
      matchedCat = categories[0];
    }
    
    try {
      await createMenuItem({
        name: libItem.name,
        description: libItem.description,
        price: libItem.price,
        categoryId: matchedCat ? matchedCat.id : undefined,
        imageUrl: libItem.imageUrl,
      });
      alert(`🎉 Added "${libItem.name}" to your restaurant menu!`);
      await loadMenu();
    } catch (error) {
      console.error(error);
      alert('Failed to quick add menu item');
    }
  };

  if (loading) return <div className="text-white p-6">Loading menu...</div>;

  return (
    <div className="space-y-8 text-white p-6 bg-slate-900 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Menu & Design Customizer</h1>
          <p className="mt-2 text-zinc-400">
            Configure restaurant items, categories, and customize the layout styling for your customer ordering screen.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* LEFT COMPONENT LAYER */}
        <div className="space-y-8">
          
          {/* CATEGORIES & FOOD ITEMS */}
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* CATEGORIES */}
            <div className="rounded-3xl bg-slate-800/60 border border-slate-700 p-6 shadow-xl space-y-4">
              <h2 className="text-xl font-bold">Categories</h2>
              <div className="flex gap-2">
                <input
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  placeholder="Category name"
                  className="w-full bg-slate-900 border border-slate-700 px-4 py-2.5 rounded-2xl outline-none text-white text-sm focus:ring-1 focus:ring-rose-500"
                />
                <button
                  onClick={handleCreateCategory}
                  className="bg-rose-500 hover:bg-rose-600 px-4 py-2.5 rounded-2xl font-bold text-sm transition active:scale-95 flex items-center gap-1"
                >
                  <Plus size={16} /> Add
                </button>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between rounded-xl bg-slate-900/40 border border-slate-800 px-4 py-3 text-sm"
                  >
                    <span className="font-medium text-zinc-300">{category.name}</span>
                    <span className="text-xs text-zinc-500 bg-slate-800 px-2.5 py-0.5 rounded-full">
                      #{category.sortOrder}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CREATE FOOD */}
            <div className="rounded-3xl bg-slate-800/60 border border-slate-700 p-6 shadow-xl space-y-4">
              <h2 className="text-xl font-bold">Create Food Item</h2>
              <div className="grid gap-3 text-xs">
                <input
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Food name"
                  className="w-full bg-slate-900 border border-slate-700 px-4 py-3 rounded-2xl outline-none text-white text-sm"
                />
                <input
                  value={form.price}
                  onChange={(event) => updateField('price', event.target.value)}
                  placeholder="Price (INR)"
                  type="number"
                  className="w-full bg-slate-900 border border-slate-700 px-4 py-3 rounded-2xl outline-none text-white text-sm"
                />
                <select
                  value={form.categoryId}
                  onChange={(event) => updateField('categoryId', event.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 px-4 py-3 rounded-2xl outline-none text-white text-sm"
                >
                  <option value="">No category</option>
                  {activeCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <input
                  value={form.description}
                  onChange={(event) => updateField('description', event.target.value)}
                  placeholder="Short food description"
                  className="w-full bg-slate-900 border border-slate-700 px-4 py-3 rounded-2xl outline-none text-white text-sm"
                />
              </div>

              <button
                onClick={handleCreateMenuItem}
                className="w-full bg-rose-500 hover:bg-rose-600 py-3 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
              >
                Save Menu Item
              </button>
            </div>

          </div>

          {/* QUICK FOOD TEMPLATE GALLERY */}
          <div className="rounded-3xl bg-slate-800/60 border border-slate-700 p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Food Templates Gallery</h2>
                <p className="text-xs text-zinc-400 mt-1">Pre-configured veg and non-veg menu recipes. Adds food item with default price and picture.</p>
              </div>

              {/* TABS TACTIC */}
              <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800 w-fit">
                <button
                  onClick={() => setLibraryTab('veg')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    libraryTab === 'veg' ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Veg Recipes
                </button>
                <button
                  onClick={() => setLibraryTab('nonveg')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    libraryTab === 'nonveg' ? 'bg-rose-500/20 text-rose-400' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                  Non-Veg Recipes
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(libraryTab === 'veg' ? vegLibrary : nonVegLibrary).map((libItem) => (
                <div key={libItem.name} className="bg-slate-900 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
                  <div>
                    <div 
                      className="h-28 w-full rounded-xl bg-slate-800 bg-cover bg-center mb-3"
                      style={{ backgroundImage: `url(${libItem.imageUrl})` }}
                    />
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-extrabold text-sm text-zinc-200">{libItem.name}</span>
                      <span className="font-black text-rose-400 text-xs whitespace-nowrap">₹{libItem.price}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1.5 leading-relaxed">{libItem.description}</p>
                  </div>

                  <button
                    onClick={() => void handleQuickAdd(libItem)}
                    className="w-full mt-4 bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs py-2 rounded-xl active:scale-95 transition-transform"
                  >
                    + Add to Menu
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIVE MENU GRID */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Active Menu Items</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-3xl bg-slate-800/40 border border-slate-800 p-5 shadow-lg flex flex-col justify-between">
                  <div>
                    <div
                      className="mb-4 h-36 w-full rounded-2xl bg-cover bg-center"
                      style={{ backgroundImage: `url(${getItemImageUrl(item)})` }}
                    />
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-extrabold text-lg">{item.name}</h3>
                        <p className="text-xs text-zinc-500">{item.categories?.name}</p>
                      </div>
                      <span className="font-black text-rose-400">₹{item.price}</span>
                    </div>
                    <p className="mt-2 text-xs text-zinc-400 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="mt-4 flex gap-2 pt-2">
                    <button
                      onClick={() =>
                        void updateMenuAvailability(item.id, !item.isAvailable).then(loadMenu)
                      }
                      className={`flex-1 py-2.5 rounded-xl font-bold text-xs ${
                        item.isAvailable
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                      }`}
                    >
                      {item.isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                    <button
                      onClick={() => void deleteMenuItem(item.id).then(loadMenu)}
                      className="px-3 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-xl text-zinc-400 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT DESIGN CUSTOMIZER */}
        <div className="rounded-3xl bg-slate-800 border border-slate-700 p-6 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Palette className="text-rose-500" size={22} />
              <h2 className="text-xl font-black">Design Settings</h2>
            </div>

            {/* LAYOUT SELECTOR */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">1. Selected Layout Template</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                {[
                  { id: 'design-1', label: 'Simple Grid' },
                  { id: 'design-2', label: 'Detailed List' },
                  { id: 'design-3', label: 'Card Layout' },
                  { id: 'design-4', label: 'Elegant List' },
                  { id: 'design-5', label: 'Cozy Board' },
                ].map((design) => (
                  <button
                    key={design.id}
                    onClick={() => setSelectedLayout(design.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 border rounded-xl transition ${
                      selectedLayout === design.id
                        ? 'bg-rose-500/10 border-rose-500 text-rose-400'
                        : 'bg-slate-900 border-slate-800 text-zinc-400 hover:border-slate-700'
                    }`}
                  >
                    <Layout size={14} />
                    {design.label}
                  </button>
                ))}
              </div>
            </div>

            {/* COLOR OPTIONS */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">2. Custom Theme Colors</label>
              
              <div className="grid gap-3">
                <div className="flex justify-between items-center p-3 bg-slate-900/60 border border-slate-850 rounded-xl">
                  <span className="text-xs text-zinc-300">Header Background</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500">{headerColor}</span>
                    <input
                      type="color"
                      value={headerColor}
                      onChange={(e) => setHeaderColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-900/60 border border-slate-850 rounded-xl">
                  <span className="text-xs text-zinc-300">Buttons & Highlights</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500">{buttonColor}</span>
                    <input
                      type="color"
                      value={buttonColor}
                      onChange={(e) => setButtonColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-900/60 border border-slate-850 rounded-xl">
                  <span className="text-xs text-zinc-300">Card Borders</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500">{borderColor}</span>
                    <input
                      type="color"
                      value={borderColor}
                      onChange={(e) => setBorderColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* THEME TOGGLE */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">3. Customer Interface Theme</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setLightMode(true)}
                  className={`flex-1 py-2 border rounded-xl text-xs font-bold transition ${
                    lightMode ? 'bg-white text-black border-white' : 'bg-slate-900 border-slate-800 text-zinc-400'
                  }`}
                >
                  ☀️ Light Mode
                </button>
                <button
                  onClick={() => setLightMode(false)}
                  className={`flex-1 py-2 border rounded-xl text-xs font-bold transition ${
                    !lightMode ? 'bg-white text-black border-white' : 'bg-slate-900 border-slate-800 text-zinc-400'
                  }`}
                >
                  🌙 Dark Mode
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={saveCustomStyles}
            className="w-full mt-8 bg-rose-500 hover:bg-rose-600 py-4 rounded-2xl font-bold text-md active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg"
          >
            <Sparkles size={18} /> Apply & Save Customizer
          </button>
        </div>
      </div>
    </div>
  );
}
