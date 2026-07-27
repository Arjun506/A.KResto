'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Search,
  Sparkles,
  Layers,
  FileText,
  ShoppingCart,
  User,
  Users,
  BarChart3,
  CornerDownLeft,
  Command,
  HelpCircle,
  Package,
} from 'lucide-react';
import { useCommandCenter } from './useCommandCenter';
import { CommandResult, CommandCategory } from './types';

interface CommandCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_ICONS: Record<CommandCategory, React.ComponentType<{ className?: string }>> = {
  'Quick Actions': Sparkles,
  'Modules': Layers,
  'Pages': FileText,
  'Products': Package,
  'Orders': ShoppingCart,
  'Invoices': FileText,
  'Customers': User,
  'Employees': Users,
  'Reports': BarChart3,
  'Businesses': Layers,
  'Unknown': HelpCircle,
};

export default function CommandCenterModal({ isOpen, onClose }: CommandCenterModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const {
    query,
    setQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    executeResult,
  } = useCommandCenter(isOpen, onClose);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      // Small timeout to ensure input is fully rendered and ready
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Click outside overlay to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  // Group items by category to display them beautifully
  const groupedResults: Record<string, Array<{ item: CommandResult; index: number }>> = {};
  results.forEach((item, index) => {
    const cat = item.category || 'Unknown';
    if (!groupedResults[cat]) {
      groupedResults[cat] = [];
    }
    groupedResults[cat].push({ item, index });
  });

  // Predefined category ordering for visual consistency
  const orderedCategories = [
    'Quick Actions',
    'Modules',
    'Pages',
    'Products',
    'Orders',
    'Invoices',
    'Customers',
    'Employees',
    'Reports',
    'Businesses',
    'Unknown',
  ].filter((cat) => groupedResults[cat] && groupedResults[cat].length > 0);

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] px-4 bg-slate-950/40 backdrop-blur-md animate-cc-backdrop-in select-none"
    >
      {/* Modal Container */}
      <div
        className="w-full max-w-2xl bg-white/90 dark:bg-[#11131c]/90 rounded-2xl shadow-2xl border border-slate-200/50 dark:border-slate-800/40 overflow-hidden flex flex-col max-h-[60vh] glass animate-cc-panel-in"
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200/40 dark:border-slate-800/30">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, page, product, or order..."
            className="flex-1 bg-transparent border-0 outline-none text-slate-800 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 focus:border-0 p-0"
          />
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">
            ESC
          </div>
        </div>

        {/* Results Body */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto px-2 py-3 divide-y-0 space-y-3"
          style={{ scrollbarWidth: 'thin' }}
        >
          {results.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
              <Command className="w-8 h-8 text-slate-300 dark:text-slate-600 animate-pulse" />
              <p className="text-xs font-bold text-slate-450 dark:text-slate-400">
                No commands or items found for "{query}"
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                Try searching for "POS", "Order", "Product", or "Report"
              </p>
            </div>
          ) : (
            orderedCategories.map((category) => {
              return (
                <div key={category} className="space-y-1">
                  {/* Category Title */}
                  <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {category}
                  </div>
                  
                  {/* Category Items */}
                  <div className="space-y-0.5">
                    {groupedResults[category].map(({ item, index }) => {
                      const Icon = CATEGORY_ICONS[item.category] || HelpCircle;
                      const isActive = index === selectedIndex;

                      return (
                        <div
                          key={item.id}
                          data-active={isActive}
                          onClick={() => executeResult(item)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 ${
                            isActive
                              ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 scale-[1.01] border-l-4 border-indigo-500 shadow-sm'
                              : 'text-slate-700 dark:text-slate-350 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 border-l-4 border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`p-1.5 rounded-lg ${
                                isActive
                                  ? 'bg-indigo-100/50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                                  : 'bg-slate-100/50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500'
                              }`}
                            >
                              <Icon className="w-4 h-4 shrink-0" />
                            </div>
                            <div className="text-left min-w-0">
                              <p className="text-xs font-bold truncate">
                                {item.title}
                              </p>
                              {item.subtitle && (
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Quick Badges or Indicators */}
                          <div className="flex items-center gap-1.5 shrink-0 pl-2">
                            {item.kind === 'action' && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-650 dark:text-indigo-300 border border-indigo-100/30 dark:border-indigo-900/30">
                                Action
                              </span>
                            )}
                            {item.kind === 'placeholder' && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-650 dark:text-amber-300 border border-amber-100/30 dark:border-amber-900/30">
                                Release 2
                              </span>
                            )}
                            {isActive && (
                              <CornerDownLeft className="w-3.5 h-3.5 text-indigo-500/80 dark:text-indigo-400/80 animate-pulse" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50/65 dark:bg-[#151722]/50 border-t border-slate-200/40 dark:border-slate-800/20 flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-550">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">↵</kbd>
              <span>to select</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span>AK Business OS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

