import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Controllers
import { ProductRegistryController } from './registry/product-registry.controller';
import { ProductVersioningController } from './versioning/product-versioning.controller';
import { ProductPublishingController } from './publishing/product-publishing.controller';
import { ProductRelationshipsController } from './relationships/product-relationships.controller';
import { ProductLocalizationController } from './localization/product-localization.controller';
import { ProductDigitalController } from './digital/product-digital.controller';
import { ProductComplianceController } from './compliance/product-compliance.controller';
import { ProductCategoriesController } from './categories/product-categories.controller';
import { ProductAttributesController } from './attributes/product-attributes.controller';
import { ProductVariantsController } from './variants/product-variants.controller';
import { ProductBundlesController } from './bundles/product-bundles.controller';
import { ProductMediaController } from './media/product-media.controller';
import { ProductPricingController } from './pricing/product-pricing.controller';
import { ProductUomController } from './uom/product-uom.controller';
import { ProductSuppliersController } from './suppliers/product-suppliers.controller';
import { ProductTagsController } from './tags/product-tags.controller';
import { ProductLookupController } from './lookups/product-lookup.controller';

// Services & Repositories
import { ProductRegistryService } from './registry/product-registry.service';
import { ProductRegistryRepository } from './registry/product-registry.repository';
import { ProductVersioningService } from './versioning/product-versioning.service';
import { ProductPublishingService } from './publishing/product-publishing.service';
import { ProductRelationshipsService } from './relationships/product-relationships.service';
import { ProductLocalizationService } from './localization/product-localization.service';
import { ProductDigitalService } from './digital/product-digital.service';
import { ProductComplianceService } from './compliance/product-compliance.service';
import { ProductCategoriesService } from './categories/product-categories.service';
import { ProductAttributesService } from './attributes/product-attributes.service';
import { ProductVariantsService } from './variants/product-variants.service';
import { ProductBundlesService } from './bundles/product-bundles.service';
import { ProductMediaService } from './media/product-media.service';
import { ProductPricingService } from './pricing/product-pricing.service';
import { ProductUomService } from './uom/product-uom.service';
import { ProductSuppliersService } from './suppliers/product-suppliers.service';
import { ProductTagsService } from './tags/product-tags.service';
import { ProductLookupService } from './lookups/product-lookup.service';

@Module({
  controllers: [
    ProductRegistryController,
    ProductVersioningController,
    ProductPublishingController,
    ProductRelationshipsController,
    ProductLocalizationController,
    ProductDigitalController,
    ProductComplianceController,
    ProductCategoriesController,
    ProductAttributesController,
    ProductVariantsController,
    ProductBundlesController,
    ProductMediaController,
    ProductPricingController,
    ProductUomController,
    ProductSuppliersController,
    ProductTagsController,
    ProductLookupController,
  ],
  providers: [ProductRegistryService,
    ProductRegistryRepository,
    ProductVersioningService,
    ProductPublishingService,
    ProductRelationshipsService,
    ProductLocalizationService,
    ProductDigitalService,
    ProductComplianceService,
    ProductCategoriesService,
    ProductAttributesService,
    ProductVariantsService,
    ProductBundlesService,
    ProductMediaService,
    ProductPricingService,
    ProductUomService,
    ProductSuppliersService,
    ProductTagsService,
    ProductLookupService],
  exports: [
    ProductRegistryService,
    ProductVersioningService,
    ProductPublishingService,
    ProductRelationshipsService,
    ProductLocalizationService,
    ProductDigitalService,
    ProductComplianceService,
    ProductCategoriesService,
    ProductAttributesService,
    ProductVariantsService,
    ProductBundlesService,
    ProductMediaService,
    ProductPricingService,
    ProductUomService,
    ProductSuppliersService,
    ProductTagsService,
    ProductLookupService,
  ],
})
export class ProductFoundationModule {}
