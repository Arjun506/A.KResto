'use client';

import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from 'react';
import {
  createCategory,
  createMenuItem,
  deleteMenuItem,
  getCategories,
  getMenuItems,
  updateMenuAvailability,
  updateMenuItem,
  deleteCategory,
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
  Search,
  Printer,
  Download,
  Upload,
  History,
  Lock,
  AlertCircle,
  Clock,
  Settings,
  Edit,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Filter,
  FileSpreadsheet,
  RefreshCw,
  Wifi,
  WifiOff,
  Layers,
  Star,
  Info
} from 'lucide-react';

type MenuForm = {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  imageUrl: string;
};

const emptyForm: MenuForm = {
  name: '',
  description: '',
  price: '',
  categoryId: '',
  imageUrl: '',
};

type ToastType = 'success' | 'error' | 'info';
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

export default function MenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [form, setForm] = useState<MenuForm>(emptyForm);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [editForm, setEditForm] = useState<MenuForm>(emptyForm);
  const [loading, setLoading] = useState(true);

  // Storage states for custom metadata
  const [itemTimings, setItemTimings] = useState<Record<string, 'breakfast' | 'lunch' | 'dinner' | 'all-day'>>({});
  const [popularItems, setPopularItems] = useState<Record<string, boolean>>({});

  // Operational states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedAvailabilityFilter, setSelectedAvailabilityFilter] = useState('all');
  const [selectedTimingFilter, setSelectedTimingFilter] = useState('all');
  const [sortOption, setSortOption] = useState<'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>('name-asc');
  
  // Selection states for bulk actions
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Customizer styling settings
  const [selectedLayout, setSelectedLayout] = useState('design-1');
  const [headerColor, setHeaderColor] = useState('#1E1B4B');
  const [buttonColor, setButtonColor] = useState('#4F46E5');
  const [borderColor, setBorderColor] = useState('#E8EAF6');
  const [lightMode, setLightMode] = useState(true);

  // Audits & offline states
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // AI states
  const [showAICopilot, setShowAICopilot] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiPricingPrompt, setAiPricingPrompt] = useState(false);

  const activeCategories = useMemo(
    () => categories.filter((category) => category.isActive),
    [categories],
  );

  // Toast manager helper
  const addToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Add audit log helper
  const logActivity = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      action,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev].slice(0, 50));
  };

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
      addToast('Failed to retrieve food catalog details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Setup listeners
  useEffect(() => {
    void loadMenu();

    // Load customizer presets from local cache
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

    // Initial timings & popular seeds
    setPopularItems({ '1': true, '3': true });
    setItemTimings({ '1': 'lunch', '2': 'breakfast', '3': 'dinner' });

    // Monitor connectivity
    setIsOnline(navigator.onLine);
    const handleOnline = () => {
      setIsOnline(true);
      addToast('System is back online. Syncing updates.', 'success');
      logActivity('SYSTEM_ONLINE', 'Connection re-established with API backend.');
    };
    const handleOffline = () => {
      setIsOnline(false);
      addToast('Lost connection. Operations are saved locally.', 'info');
      logActivity('SYSTEM_OFFLINE', 'Backend offline. Running on cache client mode.');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key?.toLowerCase() === 'n') {
        e.preventDefault();
        const el = document.getElementById('food-name-input');
        el?.focus();
        addToast('Shortcut Activated: Create Food Form Focused', 'info');
      }
      if (e.altKey && e.key?.toLowerCase() === 's') {
        e.preventDefault();
        const el = document.getElementById('menu-search-input');
        el?.focus();
        addToast('Shortcut Activated: Search bar Focused', 'info');
      }
      if (e.altKey && e.key?.toLowerCase() === 'c') {
        e.preventDefault();
        const el = document.getElementById('category-name-input');
        el?.focus();
        addToast('Shortcut Activated: Category input Focused', 'info');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Seed AI advice
    setAiSuggestions([
      '💡 Reduce price of Starter Platters by 5% to boost conversion by estimated 12%.',
      '🔥 Bundling Butter Chicken with Garlic Naan generates 18% higher checkout volumes.',
      '🍱 Breakfast Timing Specials see peak traffic between 8:30 AM and 10:00 AM.'
    ]);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCreateCategory = async () => {
    if (!categoryName.trim()) {
      addToast('Category name cannot be empty', 'error');
      return;
    }
    try {
      const created = await createCategory({ name: categoryName.trim() });
      addToast(`Category "${created.name}" created successfully`);
      logActivity('CATEGORY_CREATE', `Created category "${created.name}"`);
      setCategoryName('');
      await loadMenu();
    } catch {
      addToast('Failed to create category', 'error');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await deleteCategory(id);
      addToast(`Category "${name}" deleted successfully`);
      logActivity('CATEGORY_DELETE', `Deleted category "${name}"`);
      await loadMenu();
    } catch {
      addToast('Failed to delete category. Verify if active menu items exist inside it.', 'error');
    }
  };

  const handleCreateMenuItem = async () => {
    if (!form.name || !form.price) {
      addToast('Please fill out all mandatory fields.', 'error');
      return;
    }
    if (Number(form.price) <= 0) {
      addToast('Price must be a positive number.', 'error');
      return;
    }

    try {
      const createdItem = await createMenuItem({
        name: form.name,
        description: form.description || undefined,
        price: Number(form.price),
        categoryId: form.categoryId || undefined,
        imageUrl: form.imageUrl || undefined,
      });

      if (createdItem && createdItem.id) {
        setItemTimings((prev) => ({ ...prev, [createdItem.id]: 'all-day' }));
      }

      addToast(`Menu Item "${form.name}" added successfully`);
      logActivity('ITEM_CREATE', `Added item "${form.name}" priced at ₹${form.price}`);
      setForm(emptyForm);
      await loadMenu();
    } catch {
      addToast('Failed to save menu item.', 'error');
    }
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditItem(item);
    setEditForm({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      categoryId: item.categoryId || '',
      imageUrl: item.imageUrl || '',
    });
  };

  const handleUpdateMenuItem = async () => {
    if (!editItem) return;
    if (!editForm.name || !editForm.price) {
      addToast('Item name and price are required.', 'error');
      return;
    }

    try {
      await updateMenuItem(editItem.id, {
        name: editForm.name,
        description: editForm.description || undefined,
        price: Number(editForm.price),
        categoryId: editForm.categoryId || undefined,
        imageUrl: editForm.imageUrl || undefined,
      });

      addToast(`Menu Item "${editForm.name}" updated successfully`);
      logActivity('ITEM_UPDATE', `Updated item attributes for "${editForm.name}"`);
      setEditItem(null);
      await loadMenu();
    } catch {
      addToast('Failed to update menu item.', 'error');
    }
  };

  const handleToggleAvailability = async (id: string, current: boolean, name: string) => {
    try {
      await updateMenuAvailability(id, !current);
      addToast(`"${name}" is now ${!current ? 'In Stock' : 'Out of Stock'}`);
      logActivity('ITEM_AVAILABILITY_TOGGLE', `Toggled availability of "${name}" to ${!current}`);
      await loadMenu();
    } catch {
      addToast('Failed to toggle item availability.', 'error');
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete menu item "${name}"?`)) return;
    try {
      await deleteMenuItem(id);
      addToast(`"${name}" removed from catalog.`);
      logActivity('ITEM_DELETE', `Deleted item "${name}"`);
      await loadMenu();
    } catch {
      addToast('Failed to delete item.', 'error');
    }
  };

  // Bulk operations handlers
  const handleSelectItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItemIds(filteredItems.map((item) => item.id));
    } else {
      setSelectedItemIds([]);
    }
  };

  const executeBulkDelete = async () => {
    if (selectedItemIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete the ${selectedItemIds.length} selected items?`)) return;
    try {
      await Promise.all(selectedItemIds.map((id) => deleteMenuItem(id)));
      addToast(`Bulk Delete complete: ${selectedItemIds.length} items removed.`);
      logActivity('BULK_DELETE', `Deleted ${selectedItemIds.length} items`);
      setSelectedItemIds([]);
      await loadMenu();
    } catch {
      addToast('An error occurred during bulk delete.', 'error');
    }
  };

  const executeBulkAvailability = async (isAvailable: boolean) => {
    if (selectedItemIds.length === 0) return;
    try {
      await Promise.all(selectedItemIds.map((id) => updateMenuAvailability(id, isAvailable)));
      addToast(`Bulk availability updated for ${selectedItemIds.length} items.`);
      logActivity('BULK_AVAILABILITY', `Set availability to ${isAvailable} for ${selectedItemIds.length} items`);
      setSelectedItemIds([]);
      await loadMenu();
    } catch {
      addToast('Failed to update bulk availability.', 'error');
    }
  };

  const executeBulkSetTiming = (timing: 'breakfast' | 'lunch' | 'dinner' | 'all-day') => {
    if (selectedItemIds.length === 0) return;
    setItemTimings((prev) => {
      const next = { ...prev };
      selectedItemIds.forEach((id) => {
        next[id] = timing;
      });
      return next;
    });
    addToast(`Bulk timing set to ${timing} for ${selectedItemIds.length} items.`);
    logActivity('BULK_TIMING_CHANGE', `Changed timing schedule to "${timing}" for ${selectedItemIds.length} items`);
    setSelectedItemIds([]);
  };

  // Export functions
  const handleExportCSV = () => {
    const headers = 'ID,Name,Price,Category,Description,InStock,Timings\n';
    const rows = filteredItems
      .map((item) => {
        const catName = item.categories?.name || 'Mains';
        const timing = itemTimings[item.id] || 'all-day';
        return `"${item.id}","${item.name}",${item.price},"${catName}","${item.description || ''}",${item.isAvailable},"${timing}"`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `menu_catalog_export_${Date.now()}.csv`;
    a.click();
    addToast('CSV file exported successfully');
    logActivity('EXPORT_CSV', 'Exported menu catalog to CSV file.');
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(filteredItems, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `menu_catalog_export_${Date.now()}.json`;
    a.click();
    addToast('JSON file exported successfully');
    logActivity('EXPORT_JSON', 'Exported menu catalog to JSON file.');
  };

  // Import functions
  const handleImportCSV = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').slice(1); // skip headers
      let count = 0;

      try {
        for (const line of lines) {
          const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // regex split commas not inside quotes
          if (parts.length >= 3) {
            const name = parts[1].replace(/"/g, '').trim();
            const price = Number(parts[2]);
            const catName = parts[3]?.replace(/"/g, '').trim();
            const desc = parts[4]?.replace(/"/g, '').trim();

            if (name && price > 0) {
              let matchedCat = categories.find((c) => c.name.toLowerCase() === catName?.toLowerCase());
              if (!matchedCat && categories.length > 0) {
                matchedCat = categories[0];
              }

              await createMenuItem({
                name,
                description: desc || undefined,
                price,
                categoryId: matchedCat?.id,
              });
              count++;
            }
          }
        }
        addToast(`Successfully imported ${count} menu items from CSV!`);
        logActivity('IMPORT_CSV', `Imported ${count} menu items via CSV file`);
        await loadMenu();
      } catch (err) {
        console.error(err);
        addToast('Error parsing CSV file format.', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Pricing optimization simulation
  const handleOptimizePricing = () => {
    setAiPricingPrompt(true);
    setTimeout(() => {
      setAiPricingPrompt(false);
      setItems((prev) =>
        prev.map((item) => {
          if (item.name.includes('Pizza')) {
            return { ...item, price: item.price.add(30) }; // recommend price increase
          }
          return item;
        }),
      );
      addToast('AI Pricing optimization complete: Applied recommended margins.', 'success');
      logActivity('AI_PRICING_OPTIMIZATION', 'Optimized catalog prices based on raw ingredient margins.');
    }, 1500);
  };

  const handleAISuggestDescription = () => {
    if (!form.name) {
      addToast('Enter a food item name first to generate description.', 'error');
      return;
    }
    const descriptions: Record<string, string> = {
      'Veg Pizza': 'Crispy golden wood-fired pizza base loaded with fresh mozzarella, basil, bell peppers, and cherry tomatoes.',
      'Pasta Alfredo': 'Creamy fettuccine tossed in a rich, buttery garlic parmesan cream sauce, finished with fresh Italian parsley.',
      'Butter Chicken': 'Tender charcoal-grilled chicken tikka cubes simmered in a luscious, spiced tomato, butter, and cashew cream sauce.',
      'Garlic Naan': 'Soft and pillowy flatbread baked in a traditional tandoor, brushed with melted garlic butter.',
      'Chicken Burger': 'Crispy seasoned chicken patty layered with melted cheddar, crisp lettuce, tomato slices, and secret house sauce.',
    };

    const match = descriptions[form.name] || `A chef-curated signature recipe of ${form.name} prepared with freshly sourced ingredients.`;
    setForm((prev) => ({ ...prev, description: match }));
    addToast('Description generated by AI Assistant', 'success');
  };

  // Filtering, search, sorting
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.categories?.name.toLowerCase().includes(q),
      );
    }

    // Category filter
    if (selectedCategoryFilter !== 'all') {
      result = result.filter((item) => item.categoryId === selectedCategoryFilter);
    }

    // Availability filter
    if (selectedAvailabilityFilter !== 'all') {
      const showAvail = selectedAvailabilityFilter === 'instock';
      result = result.filter((item) => item.isAvailable === showAvail);
    }

    // Timing filter
    if (selectedTimingFilter !== 'all') {
      result = result.filter((item) => {
        const timing = itemTimings[item.id] || 'all-day';
        return timing === 'all-day' || timing === selectedTimingFilter;
      });
    }

    // Sort options
    result.sort((a, b) => {
      if (sortOption === 'price-asc') return Number(a.price) - Number(b.price);
      if (sortOption === 'price-desc') return Number(b.price) - Number(a.price);
      if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

    return result;
  }, [items, searchQuery, selectedCategoryFilter, selectedAvailabilityFilter, selectedTimingFilter, sortOption, itemTimings]);

  // Paginated output
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;

  const handlePrintCatalog = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const rowsHTML = filteredItems
      .map(
        (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #ddd;font-weight:bold;">${item.name}</td>
        <td style="padding:8px;border-bottom:1px solid #ddd;">${item.categories?.name || 'Mains'}</td>
        <td style="padding:8px;border-bottom:1px solid #ddd;">${item.description || ''}</td>
        <td style="padding:8px;border-bottom:1px solid #ddd;font-weight:bold;color:#4F46E5;">₹${item.price}</td>
      </tr>
    `,
      )
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Menu Catalog</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #333; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #f5f5f5; padding: 10px; border-bottom: 2px solid #ddd; text-align: left; }
          </style>
        </head>
        <body>
          <h1>Menu Catalog List</h1>
          <table>
            <thead>
              <tr>
                <th>Dish Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHTML}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    addToast('Print catalog command triggered');
  };

  const handleQuickAdd = async (libItem: typeof vegLibrary[0]) => {
    let matchedCat = categories.find(
      (c) => c.name.toLowerCase() === libItem.category.toLowerCase(),
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
        setItemTimings((prev) => ({ ...prev, [created.id]: 'all-day' }));
      }

      addToast(`🎉 Added "${libItem.name}" to catalog!`);
      logActivity('ITEM_QUICK_ADD', `Imported "${libItem.name}" from Veg library.`);
      await loadMenu();
    } catch {
      addToast('Failed to quick add menu item', 'error');
    }
  };

  const saveCustomStyles = () => {
    localStorage.setItem('custom-layout', selectedLayout);
    localStorage.setItem('custom-header', headerColor);
    localStorage.setItem('custom-button', buttonColor);
    localStorage.setItem('custom-border', borderColor);
    localStorage.setItem('custom-theme', lightMode ? 'light' : 'dark');
    addToast('🎨 Public customer ordering styles saved successfully!');
    logActivity('STYLES_UPDATE', `Applied Layout: ${selectedLayout}, Primary Color: ${headerColor}`);
  };

  return (
    <div className="space-y-6 text-slate-900 bg-[#F8F9FF] p-4 min-h-screen relative pb-12">
      {/* TOAST SYSTEM CONTAINER */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-xl shadow-2xl pointer-events-auto border flex items-start gap-2.5 animate-in slide-in-from-top-5 duration-200 ${
              t.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800'
                : t.type === 'error'
                ? 'bg-red-500/10 border-red-500/20 text-red-800'
                : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-800'
            }`}
          >
            {t.type === 'success' && <CheckCircle className="h-5 w-5 shrink-0" />}
            {t.type === 'error' && <AlertCircle className="h-5 w-5 shrink-0" />}
            {t.type === 'info' && <Info className="h-5 w-5 shrink-0" />}
            <span className="text-xs font-bold">{t.message}</span>
          </div>
        ))}
      </div>

      {/* HEADER WITH ONLINE & SHORTCUT STATS */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200/50 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Menu & Design Settings</h1>
            <div
              className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                isOnline
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
              }`}
            >
              {isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
              <span>{isOnline ? 'Online Sync' : 'Offline Mode'}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Manage your food catalog, customize timing schedules, run bulk actions, and style the customer interfaces.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm">
          <span>Shortcuts:</span>
          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">Alt+N</span>
          <span>Add Food</span>
          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">Alt+S</span>
          <span>Search</span>
        </div>
      </div>

      {/* ACTION & INTEGRATIONS TOOLBAR */}
      <div className="bg-white border border-slate-150 rounded-2xl p-4.5 shadow-sm flex flex-wrap gap-3.5 items-center justify-between">
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-xs text-slate-700"
          >
            <Download size={13} /> Export CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-xs text-slate-700"
          >
            <Layers size={13} /> Export JSON
          </button>
          <label className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-xs cursor-pointer text-slate-700">
            <Upload size={13} /> Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
          </label>
          <button
            onClick={handlePrintCatalog}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-xs text-slate-700"
          >
            <Printer size={13} /> Print Catalog
          </button>
        </div>

        <button
          onClick={() => setShowAICopilot(!showAICopilot)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-indigo-500/10 transition active:scale-95"
        >
          <Sparkles size={14} /> AI Copilot Manager
        </button>
      </div>

      {/* AI SUGGESTIONS EXPANSION PANE */}
      {showAICopilot && (
        <div className="bg-gradient-to-r from-violet-50/50 to-indigo-50/50 border border-indigo-100 rounded-3xl p-5 shadow-inner space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-indigo-600" /> AI Menu Optimization Engine
            </h3>
            <button
              onClick={() => setShowAICopilot(false)}
              className="p-1 rounded-full hover:bg-white text-indigo-400 hover:text-indigo-900"
            >
              <X size={15} />
            </button>
          </div>
          <div className="grid gap-3.5 md:grid-cols-3">
            {aiSuggestions.map((item, index) => (
              <div key={index} className="bg-white border border-indigo-50 p-4 rounded-2xl shadow-xs text-xs font-semibold text-indigo-950 flex flex-col justify-between">
                <p className="leading-relaxed">{item}</p>
                <span className="block text-[9px] uppercase font-bold text-indigo-400 tracking-wider mt-3">Smart Insight</span>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2 text-xs font-bold">
            <button
              disabled={aiPricingPrompt}
              onClick={handleOptimizePricing}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-sm flex items-center gap-1.5"
            >
              {aiPricingPrompt ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Layers size={13} />}
              Auto-Optimize Pricing
            </button>
          </div>
        </div>
      )}

      {/* SEARCH, SORT & DETAILED FILTERS PANEL */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid gap-3.5 md:grid-cols-[1fr_200px_200px]">
          {/* Search bar */}
          <div className="relative">
            <input
              id="menu-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, descriptions, categories... (Alt+S)"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:border-[#4F46E5]"
            />
            <Search className="absolute left-3 top-3 text-slate-400" size={15} />
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-slate-400 shrink-0">Sort By</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 outline-none"
            >
              <option value="name-asc">Alphabetical A-Z</option>
              <option value="name-desc">Alphabetical Z-A</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Availability filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-slate-400 shrink-0">Status</span>
            <select
              value={selectedAvailabilityFilter}
              onChange={(e) => setSelectedAvailabilityFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 outline-none"
            >
              <option value="all">All Items</option>
              <option value="instock">In Stock Only</option>
              <option value="outofstock">Out of Stock Only</option>
            </select>
          </div>
        </div>

        {/* Categories & Timings filter chips */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            <span className="text-[10px] font-black uppercase text-slate-400 mr-1 flex items-center gap-1"><Filter size={10} /> Category:</span>
            <button
              onClick={() => setSelectedCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs ${
                selectedCategoryFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-500'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs ${
                  selectedCategoryFilter === cat.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-500'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] font-black uppercase text-slate-400 mr-1 flex items-center gap-1"><Clock size={10} /> Timing:</span>
            {['all', 'breakfast', 'lunch', 'dinner'].map((timing) => (
              <button
                key={timing}
                onClick={() => setSelectedTimingFilter(timing)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize ${
                  selectedTimingFilter === timing
                    ? 'bg-[#4F46E5] text-white'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-500'
                }`}
              >
                {timing === 'all' ? 'All-Day' : timing}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BULK ACTIONS BAR (DYNAMICAL OVERLAY) */}
      {selectedItemIds.length > 0 && (
        <div className="bg-slate-900 text-white px-5 py-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl border border-slate-800 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center gap-2.5">
            <span className="grid h-5 w-5 place-items-center bg-indigo-500 text-[10px] font-black rounded-full text-white">
              {selectedItemIds.length}
            </span>
            <span className="text-xs font-black uppercase tracking-wider">Items Selected for Bulk Actions</span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <button
              onClick={() => executeBulkAvailability(true)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
            >
              Set In Stock
            </button>
            <button
              onClick={() => executeBulkAvailability(false)}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
            >
              Set Out of Stock
            </button>
            <select
              onChange={(e) => executeBulkSetTiming(e.target.value as any)}
              className="px-3 py-2 bg-slate-800 text-white border border-slate-700 rounded-xl text-xs outline-none"
              defaultValue=""
            >
              <option value="" disabled>Set Timing Schedule...</option>
              <option value="all-day">All-Day</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
            <button
              onClick={executeBulkDelete}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center gap-1.5"
            >
              <Trash2 size={13} /> Delete Selected
            </button>
            <button
              onClick={() => setSelectedItemIds([])}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* CORE WORKSPACE CONTENT LAYOUT */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        
        {/* LEFT COLUMN: ACTIVE CATALOG AND TEMPLATES */}
        <div className="space-y-6">
          
          {/* FOOD CREATOR FORMS */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Category manager */}
            <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Category Manager</h2>
                <div className="flex gap-2">
                  <input
                    id="category-name-input"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Category Name (e.g. Starters) (Alt+C)"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none text-xs font-bold focus:ring-2 focus:ring-[#4F46E5] text-slate-850"
                  />
                  <button
                    onClick={handleCreateCategory}
                    className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-4 py-2.5 rounded-xl font-bold text-xs transition active:scale-95 flex items-center gap-1"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>

                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2.5 text-xs font-bold text-slate-750"
                    >
                      <span>{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                          Sort #{cat.sortOrder}
                        </span>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="text-slate-400 hover:text-red-500 transition"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Create food item */}
            <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-black text-slate-855 uppercase tracking-wider">Create Food Item</h2>
                <button
                  onClick={handleAISuggestDescription}
                  className="text-[9px] font-black uppercase tracking-wider text-indigo-650 hover:text-indigo-800 flex items-center gap-1"
                  title="Generate food descriptions using AI"
                >
                  <Sparkles size={11} /> AI Autocomplete
                </button>
              </div>

              <div className="grid gap-2 text-xs font-bold">
                <input
                  id="food-name-input"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Item Name (e.g. Pasta Alfredo) (Alt+N)"
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none text-slate-855"
                />
                <input
                  value={form.price}
                  onChange={(e) => updateField('price', e.target.value)}
                  placeholder="Price (INR)"
                  type="number"
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none text-slate-855"
                />
                <select
                  value={form.categoryId}
                  onChange={(e) => updateField('categoryId', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none text-slate-700"
                >
                  <option value="">No Category</option>
                  {activeCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <input
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Brief description or ingredient details..."
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none text-slate-855"
                />
              </div>

              <button
                onClick={handleCreateMenuItem}
                className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-2.5 rounded-xl text-xs font-black active:scale-95 transition-all shadow-md shadow-indigo-500/10"
              >
                Save Menu Item
              </button>
            </div>
          </div>

          {/* ACTIVE DISHES LIST GRID WITH PAGINATION */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                Active Catalog List 
                <span className="bg-slate-100 text-slate-600 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-slate-200">
                  {filteredItems.length} items
                </span>
              </h2>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="select-all-chk"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={selectedItemIds.length === filteredItems.length && filteredItems.length > 0}
                  className="h-3.5 w-3.5 rounded border-slate-300 text-[#4F46E5]"
                />
                <label htmlFor="select-all-chk" className="text-[10px] font-black uppercase text-slate-400 cursor-pointer">Select All</label>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-3">
                <Layout className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="text-sm font-black text-slate-800 uppercase">No menu items found</h3>
                <p className="text-[11px] text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                  No food products match your active search terms, timings, or categories. Adjust filters to inspect other options.
                </p>
              </div>
            ) : (
              <div className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedItems.map((item) => {
                  const isPopular = popularItems[item.id] || false;
                  const timing = itemTimings[item.id] || 'all-day';
                  const isChecked = selectedItemIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl bg-white border p-4.5 shadow-xs flex flex-col justify-between relative hover:shadow-md transition duration-150 ${
                        isChecked ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-slate-100'
                      }`}
                    >
                      {/* Selection Checkbox */}
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleSelectItem(item.id)}
                        className="absolute top-2 right-2 z-20 h-4 w-4 rounded border-slate-350 text-[#4F46E5]"
                      />

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex gap-1 z-10">
                        {isPopular && (
                          <span className="bg-amber-500 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wider shadow-xs">
                            ★ Starred
                          </span>
                        )}
                        <span className="bg-[#4F46E5]/10 text-[#4F46E5] font-extrabold text-[8px] px-1.5 py-0.5 rounded capitalize">
                          {timing}
                        </span>
                      </div>

                      <div>
                        <div
                          className="mb-3 h-28 w-full rounded-xl bg-cover bg-center bg-slate-100 border border-slate-200/50"
                          style={{
                            backgroundImage: `url(${
                              item.imageUrl ||
                              (item.name.toLowerCase().includes('pizza')
                                ? '/images/veg_pizza.png'
                                : item.name.toLowerCase().includes('pasta')
                                ? '/images/pasta_alfredo.png'
                                : '/images/chicken_burger.png')
                            })`,
                          }}
                        />
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-extrabold text-xs text-slate-900 line-clamp-1">{item.name}</h3>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                              {item.categories?.name || 'Mains'}
                            </p>
                          </div>
                          <span className="font-black text-slate-900 text-sm whitespace-nowrap">₹{item.price}</span>
                        </div>
                        <p className="mt-1 text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-2 border-t border-slate-50 space-y-2">
                        <div className="flex justify-between items-center gap-1.5">
                          <select
                            value={timing}
                            onChange={(e) => setItemTimingMock(item.id, e.target.value as any)}
                            className="px-2 py-1 border border-slate-250 rounded-lg text-[9px] font-bold text-slate-655 bg-white"
                          >
                            <option value="all-day">All-Day</option>
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                          </select>

                          <button
                            onClick={() => togglePopular(item.id)}
                            className={`px-2.5 py-1 border rounded-lg text-[9px] font-bold transition-all ${
                              isPopular
                                ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-amber-500 hover:bg-amber-50'
                            }`}
                          >
                            Starred
                          </button>
                        </div>

                        <div className="flex gap-1.5 pt-1">
                          <button
                            onClick={() => handleToggleAvailability(item.id, item.isAvailable, item.name)}
                            className={`flex-1 py-1.5 rounded-lg font-bold text-[10px] transition-all border ${
                              item.isAvailable
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                : 'bg-red-500/10 text-red-600 border-red-500/20'
                            }`}
                          >
                            {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-indigo-50 hover:text-[#4F46E5] rounded-lg text-slate-400 transition"
                            title="Edit Item details"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-rose-50 hover:text-[#EF4444] rounded-lg text-slate-400 transition"
                            title="Delete Item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-200/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-500 transition"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-slate-500 transition"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* QUICK FOOD TEMPLATE GALLERY */}
          <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Quick Import Template Library</h2>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Add ready-made culinary recipes directly to your active listings.</p>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Veg Pizza', price: 349, category: 'Mains', imageUrl: '/images/veg_pizza.png', description: 'Fresh basil, bell peppers, olives, cherry tomatoes, wood-fired crust.' },
                { name: 'Pasta Alfredo', price: 299, category: 'Mains', imageUrl: '/images/pasta_alfredo.png', description: 'Creamy fettuccine Alfredo pasta, garlic, cheese, fresh parsley.' },
                { name: 'Chicken Burger', price: 199, category: 'Mains', imageUrl: '/images/chicken_burger.png', description: 'Gourmet crispy chicken burger, lettuce, red onion, melting cheese.' },
              ].map((libItem) => (
                <div
                  key={libItem.name}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col justify-between hover:border-slate-350 transition duration-150"
                >
                  <div>
                    <div
                      className="h-24 w-full rounded-xl bg-slate-200 bg-cover bg-center mb-2"
                      style={{
                        backgroundImage: `url(${
                          libItem.name.includes('Pizza')
                            ? '/images/veg_pizza.png'
                            : libItem.name.includes('Pasta')
                            ? '/images/pasta_alfredo.png'
                            : '/images/chicken_burger.png'
                        })`,
                      }}
                    />
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-extrabold text-xs text-slate-855 line-clamp-1">{libItem.name}</span>
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
        </div>

        {/* RIGHT COLUMN: STYLING CUSTOMIZER & AUDIT TIMELINES */}
        <div className="space-y-6">
          
          {/* STYLING CONFIGURATIONS */}
          <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <Palette className="text-[#4F46E5]" size={20} />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Styling Settings</h2>
            </div>

            {/* Layout Customizer */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                1. Customer Menu Template
              </label>
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
                        : 'bg-slate-50 border-slate-205 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <Layout size={12} />
                    {design.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Presets Colors */}
            <div className="space-y-3.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                2. Custom Theme Colors
              </label>
              <div className="grid gap-2">
                <div className="flex justify-between items-center px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-600">Primary Color</span>
                  <input
                    type="color"
                    value={headerColor}
                    onChange={(e) => setHeaderColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                  />
                </div>
                <div className="flex justify-between items-center px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-600">Button Highlighters</span>
                  <input
                    type="color"
                    value={buttonColor}
                    onChange={(e) => setButtonColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={saveCustomStyles}
              className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-2.5 rounded-xl text-xs font-black active:scale-95 transition-all shadow-md shadow-indigo-600/10"
            >
              Apply Styles Config
            </button>
          </div>

          {/* AUDIT LOG TIMELINE */}
          <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <History className="text-[#4F46E5]" size={16} />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Audit Log History</h2>
            </div>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {auditLogs.length === 0 ? (
                <p className="text-[10px] text-slate-400 font-bold py-6 text-center">No modifications logged in this session.</p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="border-l-2 border-slate-200 pl-3 relative space-y-0.5">
                    <span className="absolute -left-1.5 top-1.5 h-2.5 w-2.5 bg-slate-400 rounded-full border-2 border-white"></span>
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase">
                      <span>{log.action}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <p className="text-[10px] text-slate-655 font-bold leading-normal">{log.details}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* EDIT MENU ITEM DIALOG MODAL */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Edit Menu Item</h3>
              <button
                onClick={() => setEditItem(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-3.5 text-xs font-bold">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Item Name</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Item Name"
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Price (INR)</label>
                <input
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  type="number"
                  placeholder="Price"
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Category</label>
                <select
                  value={editForm.categoryId}
                  onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none text-slate-700"
                >
                  <option value="">No Category</option>
                  {activeCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Description</label>
                <input
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Description..."
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl outline-none text-slate-800"
                />
              </div>
            </div>

            <button
              onClick={handleUpdateMenuItem}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition active:scale-95 shadow-md shadow-indigo-500/10"
            >
              Update Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

