const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");
  const hashedPassword = await bcrypt.hash('654321', 10);

  // 1. Seed Restaurant
  console.log("Seeding restaurant 'Spicy Hub'...");
  const restaurant = await prisma.restaurants.upsert({
    where: { slug: 'spicy-hub' },
    update: {},
    create: {
      id: 'rest-1',
      name: 'Spicy Hub',
      slug: 'spicy-hub',
      location: 'New Delhi, India',
      email: 'contact@spicyhub.com',
      isActive: true,
    }
  });

  // 2. Seed Tables
  console.log("Seeding tables...");
  const tableData = [
    { id: 'table-1', name: 'Table 1', code: 'T1', capacity: 2, qrCode: 'qr-t1' },
    { id: 'table-2', name: 'Table 2', code: 'T2', capacity: 4, qrCode: 'qr-t2' },
    { id: 'table-3', name: 'Table 3', code: 'T3', capacity: 4, qrCode: 'qr-t3' },
    { id: 'table-4', name: 'Table 4', code: 'T4', capacity: 6, qrCode: 'qr-t4' },
    { id: 'table-5', name: 'Table 5', code: 'T5', capacity: 2, qrCode: 'qr-t5' }
  ];

  for (const t of tableData) {
    await prisma.tables.upsert({
      where: { restaurantId_code: { restaurantId: restaurant.id, code: t.code } },
      update: { qrCode: t.qrCode, name: t.name, capacity: t.capacity },
      create: {
        id: t.id,
        restaurantId: restaurant.id,
        name: t.name,
        code: t.code,
        capacity: t.capacity,
        qrCode: t.qrCode,
        isActive: true,
      }
    });
  }

  // 3. Seed Users
  console.log("Seeding users...");
  await prisma.users.upsert({
    where: { email: 'admin@restobill.com' },
    update: { passwordHash: hashedPassword },
    create: {
      id: 'admin-id',
      name: 'Super Admin',
      email: 'admin@restobill.com',
      passwordHash: hashedPassword,
      role: 'SUPER_ADMIN',
      restaurantId: null,
      isActive: true,
    }
  });

  await prisma.users.upsert({
    where: { email: 'owner@restobill.com' },
    update: { passwordHash: hashedPassword },
    create: {
      id: 'owner-id',
      name: 'Restaurant Owner',
      email: 'owner@restobill.com',
      passwordHash: hashedPassword,
      role: 'RESTAURANT_OWNER',
      restaurantId: restaurant.id,
      isActive: true,
    }
  });

  // 4. Seed Categories
  console.log("Seeding categories...");
  const categoriesData = [
    { id: 'cat-mains', name: 'Mains', sortOrder: 1 },
    { id: 'cat-starters', name: 'Starters', sortOrder: 2 },
    { id: 'cat-breads', name: 'Breads', sortOrder: 3 },
    { id: 'cat-beverages', name: 'Beverages', sortOrder: 4 }
  ];

  for (const c of categoriesData) {
    await prisma.categories.upsert({
      where: { restaurantId_name: { restaurantId: restaurant.id, name: c.name } },
      update: { sortOrder: c.sortOrder },
      create: {
        id: c.id,
        restaurantId: restaurant.id,
        name: c.name,
        sortOrder: c.sortOrder,
        isActive: true,
      }
    });
  }

  // 5. Seed Menu Items
  console.log("Seeding menu items...");
  const menuData = [
    { id: 'item-1', name: 'Veg Pizza', price: 349, categoryId: 'cat-mains', imageUrl: '/images/veg_pizza.png', description: 'Fresh basil, bell peppers, olives, cherry tomatoes.' },
    { id: 'item-2', name: 'Pasta Alfredo', price: 299, categoryId: 'cat-mains', imageUrl: '/images/pasta_alfredo.png', description: 'Creamy fettuccine Alfredo pasta, garlic, cheese.' },
    { id: 'item-3', name: 'Paneer Butter Masala', price: 249, categoryId: 'cat-mains', imageUrl: '/images/paneer_butter_masala.png', description: 'Cottage cheese cubes cooked in rich tomato cashew butter gravy.' },
    { id: 'item-4', name: 'Samosa Crunch', price: 49, categoryId: 'cat-starters', imageUrl: '/images/samosa_crunch.png', description: 'Crispy fried pastry filled with spiced potato.' },
    { id: 'item-5', name: 'Garlic Naan', price: 39, categoryId: 'cat-breads', imageUrl: '/images/garlic_naan.png', description: 'Soft clay oven flatbread seasoned with minced garlic.' },
    { id: 'item-6', name: 'Chicken Burger', price: 199, categoryId: 'cat-mains', imageUrl: '/images/chicken_burger.png', description: 'Gourmet crispy chicken burger, lettuce, cheese.' },
    { id: 'item-7', name: 'Chicken Biryani', price: 249, categoryId: 'cat-mains', imageUrl: '/images/chicken_biryani.png', description: 'Fragrant basmati rice cooked with chicken pieces.' },
    { id: 'item-8', name: 'Tandoori Tikka', price: 299, categoryId: 'cat-starters', imageUrl: '/images/tandoori_tikka.png', description: 'Yogurt-marinated chicken breast cubes baked in charcoal oven.' },
    { id: 'item-9', name: 'Butter Chicken', price: 329, categoryId: 'cat-mains', imageUrl: '/images/butter_chicken.png', description: 'Tandoori grilled chicken cooked in cream tomato sauce.' },
    { id: 'item-10', name: 'Mutton Seekh', price: 349, categoryId: 'cat-starters', imageUrl: '/images/mutton_seekh.png', description: 'Skewered minced spiced mutton sausage.' },
    { id: 'item-11', name: 'Cold Coffee', price: 149, categoryId: 'cat-beverages', imageUrl: '/images/cold_coffee.png', description: 'Chilled rich coffee blended with chocolate sauce and cream.' }
  ];

  for (const item of menuData) {
    await prisma.menu_items.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        price: item.price,
        categoryId: item.categoryId,
        imageUrl: item.imageUrl,
        description: item.description,
      },
      create: {
        id: item.id,
        restaurantId: restaurant.id,
        categoryId: item.categoryId,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        isAvailable: true,
      }
    });
  }

  console.log("Seeding completed successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
