import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RestaurantCoreService } from './restaurant-core.service';
import { CreateRestaurantMenuItemDto } from './dto/create-menu-item.dto';
import { CreateRestaurantModifierDto } from './dto/create-modifier.dto';
import { CreateRestaurantTaxProfileDto } from './dto/create-tax-profile.dto';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';

@ApiTags('Restaurant Pack — Core')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('restaurant-core')
export class RestaurantCoreController {
  constructor(private readonly service: RestaurantCoreService) {}

  @Post('menu')
  @ApiOperation({ summary: 'Register a new menu category dish item' })
  async createMenuItem(
    @Body() body: CreateRestaurantMenuItemDto & { tenantId?: string },
  ) {
    return this.service.createMenuItem(body.tenantId || 'GLOBAL', body);
  }

  @Post('modifiers')
  @ApiOperation({ summary: 'Configure modifier options' })
  async createModifier(
    @Body() body: CreateRestaurantModifierDto & { tenantId?: string },
  ) {
    return this.service.createModifierOption(body.tenantId || 'GLOBAL', body);
  }

  @Post('recipes')
  @ApiOperation({
    summary:
      'Configure recipe composition matching dishes to raw inventory items',
  })
  async configureRecipe(
    @Body()
    body: {
      tenantId?: string;
      dishProductId: string;
      ingredients: { inventoryItemId: string; quantity: number }[];
    },
  ) {
    return this.service.configureRecipe(
      body.tenantId || 'GLOBAL',
      body.dishProductId,
      body.ingredients,
    );
  }

  @Post('taxes')
  @ApiOperation({ summary: 'Create tax profiles' })
  async createTaxProfile(
    @Body() body: CreateRestaurantTaxProfileDto & { tenantId?: string },
  ) {
    return this.service.createTaxProfile(body.tenantId || 'GLOBAL', body);
  }

  @Post('charges')
  @ApiOperation({ summary: 'Create service charges' })
  async configureServiceCharge(
    @Body() body: { tenantId?: string; label: string; rate: number },
  ) {
    return this.service.configureServiceCharge(
      body.tenantId || 'GLOBAL',
      body.label,
      body.rate,
    );
  }

  @Post('printers')
  @ApiOperation({ summary: 'Register printer parameters' })
  async configurePrinterProfile(
    @Body() body: { tenantId?: string; name: string; ipAddress: string },
  ) {
    return this.service.configurePrinterProfile(
      body.tenantId || 'GLOBAL',
      body.name,
      body.ipAddress,
    );
  }
}
