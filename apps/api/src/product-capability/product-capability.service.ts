import { Injectable } from '@nestjs/common';

import { productManifest } from './product-manifest/product-manifest';

@Injectable()
export class ProductCapabilityService {
  getProductManifest() {
    return productManifest;
  }

  // Sprint 6 milestone note:
  // Product CRUD persistence will be implemented once Prisma product models
  // are added. For now, controller methods are wired but return placeholders.

  listProducts() {
    return { items: [], total: 0 };
  }

  getProductById(id: string) {
    return { id };
  }

  createProduct(dto: any) {
    return { id: 'product-placeholder', ...dto };
  }

  updateProduct(id: string, dto: any) {
    return { id, ...dto };
  }

  publishProduct(id: string, dto: any) {
    return { id, ...dto };
  }
}
