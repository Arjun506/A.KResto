-- Order-to-cash inventory consumption support.

CREATE TABLE "menu_item_ingredients" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_item_ingredients_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "inventory_movements" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "orderId" TEXT,
    "orderItemId" TEXT,
    "type" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_movements_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "menu_item_ingredients_menuItemId_inventoryItemId_key"
    ON "menu_item_ingredients"("menuItemId", "inventoryItemId");

CREATE INDEX "menu_item_ingredients_restaurantId_idx"
    ON "menu_item_ingredients"("restaurantId");

CREATE INDEX "menu_item_ingredients_menuItemId_idx"
    ON "menu_item_ingredients"("menuItemId");

CREATE INDEX "menu_item_ingredients_inventoryItemId_idx"
    ON "menu_item_ingredients"("inventoryItemId");

CREATE INDEX "inventory_movements_restaurantId_idx"
    ON "inventory_movements"("restaurantId");

CREATE INDEX "inventory_movements_inventoryItemId_idx"
    ON "inventory_movements"("inventoryItemId");

CREATE INDEX "inventory_movements_orderId_idx"
    ON "inventory_movements"("orderId");

CREATE INDEX "inventory_movements_type_idx"
    ON "inventory_movements"("type");

CREATE INDEX "inventory_movements_createdAt_idx"
    ON "inventory_movements"("createdAt");

ALTER TABLE "menu_item_ingredients"
    ADD CONSTRAINT "menu_item_ingredients_restaurantId_fkey"
    FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "menu_item_ingredients"
    ADD CONSTRAINT "menu_item_ingredients_menuItemId_fkey"
    FOREIGN KEY ("menuItemId") REFERENCES "menu_items"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "menu_item_ingredients"
    ADD CONSTRAINT "menu_item_ingredients_inventoryItemId_fkey"
    FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "inventory_movements"
    ADD CONSTRAINT "inventory_movements_restaurantId_fkey"
    FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "inventory_movements"
    ADD CONSTRAINT "inventory_movements_inventoryItemId_fkey"
    FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
