"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconsLibrary = void 0;
class IconsLibrary {
    static registry = new Map();
    static registerIcon(name, meta) {
        this.registry.set(name, meta);
    }
    static getIcon(name) {
        return this.registry.get(name);
    }
    static searchIcons(query) {
        const term = query.toLowerCase();
        return Array.from(this.registry.values()).filter((icon) => icon.name.toLowerCase().includes(term) ||
            icon.tags.some((t) => t.toLowerCase().includes(term)));
    }
}
exports.IconsLibrary = IconsLibrary;
// Register basic enterprise navigation icons
IconsLibrary.registerIcon('home', { name: 'Home', category: 'Navigation', tags: ['dashboard', 'main', 'landing'] });
IconsLibrary.registerIcon('settings', { name: 'Settings', category: 'Action', tags: ['config', 'setup', 'admin'] });
IconsLibrary.registerIcon('users', { name: 'Users', category: 'Social', tags: ['team', 'staff', 'operators'] });
IconsLibrary.registerIcon('billing', { name: 'Billing', category: 'Finance', tags: ['invoice', 'payments', 'stripe'] });
IconsLibrary.registerIcon('inventory', { name: 'Inventory', category: 'Supply', tags: ['stock', 'items', 'recipes'] });
