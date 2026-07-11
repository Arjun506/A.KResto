import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { CommandResult } from './types';
import { getRegistryItems } from './command-center-registry';
import { fuzzyFilterAndRank } from './command-center-fuzzy';

export function useCommandCenter(isOpen: boolean, onClose: () => void) {
  const router = useRouter();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const role = user?.role || 'OWNER';

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Get all permitted registry items
  const allItems = useMemo(() => {
    return getRegistryItems(role);
  }, [role]);

  // Filter and rank items based on search query
  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      // By default, group static pages, quick actions, and recent-like entries
      // Return first 8 entries as defaults
      return allItems.slice(0, 10);
    }
    // Perform fuzzy search
    return fuzzyFilterAndRank(query, allItems);
  }, [query, allItems]);

  // Keep selectedIndex in bounds
  useEffect(() => {
    if (selectedIndex >= filteredResults.length) {
      setSelectedIndex(Math.max(0, filteredResults.length - 1));
    }
  }, [filteredResults, selectedIndex]);

  const executeResult = (item: CommandResult) => {
    onClose();

    if (item.kind === 'navigate' && item.payload?.href) {
      router.push(item.payload.href);
    } else if (item.kind === 'action') {
      const actionId = item.payload?.actionId;
      const href = item.payload?.href;
      
      if (actionId === 'OPEN_HELP') {
        window.dispatchEvent(new CustomEvent('open-help-center'));
      } else if (actionId === 'OPEN_AI') {
        window.dispatchEvent(new CustomEvent('open-ai-dock'));
      } else if (actionId === 'TRIGGER_TOUR') {
        window.dispatchEvent(new CustomEvent('start-product-tour'));
      } else if (actionId === 'TOGGLE_DARK_MODE') {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      } else {
        alert(`[Command Center] Triggered Action: ${item.title}\n(Action ID: ${actionId})`);
        if (href) {
          router.push(href);
        }
      }
    } else if (item.kind === 'placeholder') {
      alert(`[Command Center] Selected Item: ${item.title}\n(${item.category} - Details coming in Release 2)`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        executeResult(filteredResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return {
    query,
    setQuery,
    results: filteredResults,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    executeResult,
  };
}
