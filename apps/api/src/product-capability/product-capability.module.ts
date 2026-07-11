import { Module } from '@nestjs/common';

import { ProductCapabilityController } from './product-capability.controller';
import { ProductCapabilityService } from './product-capability.service';

@Module({
  controllers: [ProductCapabilityController],
  providers: [ProductCapabilityService],
  exports: [ProductCapabilityService],
})
export class ProductCapabilityModule {}
