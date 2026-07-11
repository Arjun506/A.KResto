export type MenuCategory = {
  id: string;
  restaurantId: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
};

export type MenuVariant = {
  id: string;
  name: string;
  priceDelta: string;
  isActive: boolean;
};

export type MenuAddon = {
  id: string;
  name: string;
  price: string;
  isActive: boolean;
};

export type MenuItem = {
  id: string;
  restaurantId: string;
  categoryId?: string | null;
  name: string;
  description?: string | null;
  price: string;
  imageUrl?: string | null;
  isAvailable: boolean;
  categories?: MenuCategory | null;
  menu_item_variants?: MenuVariant[];
  menu_item_addons?: MenuAddon[];
};

export type CreateMenuItemRequest = {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId?: string;
  isAvailable?: boolean;
  variants?: Array<{
    name: string;
    priceDelta: number;
  }>;
  addons?: Array<{
    name: string;
    price: number;
  }>;
};
