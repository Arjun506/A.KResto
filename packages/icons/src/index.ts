export interface IconMetadata {
  name: string;
  category: string;
  tags: string[];
}

export class IconsLibrary {
  private static registry = new Map<string, IconMetadata>();

  static registerIcon(name: string, meta: IconMetadata): void {
    this.registry.set(name, meta);
  }

  static getIcon(name: string): IconMetadata | undefined {
    return this.registry.get(name);
  }

  static searchIcons(query: string): IconMetadata[] {
    const term = query.toLowerCase();
    return Array.from(this.registry.values()).filter(
      (icon) =>
        icon.name.toLowerCase().includes(term) ||
        icon.tags.some((t) => t.toLowerCase().includes(term)),
    );
  }
}

// Register basic enterprise navigation icons
IconsLibrary.registerIcon('home', { name: 'Home', category: 'Navigation', tags: ['dashboard', 'main', 'landing'] });
IconsLibrary.registerIcon('settings', { name: 'Settings', category: 'Action', tags: ['config', 'setup', 'admin'] });
IconsLibrary.registerIcon('users', { name: 'Users', category: 'Social', tags: ['team', 'staff', 'operators'] });
IconsLibrary.registerIcon('billing', { name: 'Billing', category: 'Finance', tags: ['invoice', 'payments', 'stripe'] });
IconsLibrary.registerIcon('inventory', { name: 'Inventory', category: 'Supply', tags: ['stock', 'items', 'recipes'] });
