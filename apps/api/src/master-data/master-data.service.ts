import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMasterDataDto,
  UpdateMasterDataDto,
} from './dto/master-data.dto';

type ListInput = {
  tenantId: string;
  resource: string;
  q?: string;
  page: number;
  pageSize: number;
  isActive?: boolean;
};

@Injectable()
export class MasterDataService {
  constructor(private readonly prisma: PrismaService) {}

  private getModel(resource: string) {
    const r = resource.toLowerCase();
    switch (r) {
      case 'categories':
        return (this.prisma as any).master_categories;

      case 'sub-categories':
      case 'subcategories':
        return (this.prisma as any).master_sub_categories;

      case 'brands':
        return (this.prisma as any).master_brands;

      case 'units':
        return (this.prisma as any).master_units;

      case 'taxes':
        return (this.prisma as any).master_taxes;

      case 'currencies':
        return (this.prisma as any).master_currencies;

      case 'countries':
        return (this.prisma as any).master_countries;

      case 'states':
        return (this.prisma as any).master_states;

      case 'cities':
        return (this.prisma as any).master_cities;

      case 'languages':
        return (this.prisma as any).master_languages;

      case 'price-lists':
      case 'pricelists':
        return (this.prisma as any).master_price_lists;

      case 'payment-methods':
      case 'paymentmethods':
        return (this.prisma as any).master_payment_methods;

      case 'attributes':
        return (this.prisma as any).master_attributes;

      case 'tags':
        return (this.prisma as any).master_tags;

      case 'labels':
        return (this.prisma as any).master_labels;

      case 'custom-fields':
      case 'customfields':
        return (this.prisma as any).master_custom_fields;

      case 'business-types':
      case 'businesstypes':
        return (this.prisma as any).master_business_types;

      case 'industry-types':
      case 'industrytypes':
        return (this.prisma as any).master_industry_types;

      default:
        throw new BadRequestException(
          `Unknown master data resource: ${resource}`,
        );
    }
  }

  async list(input: ListInput) {
    const { tenantId, resource, q, page, pageSize, isActive } = input;
    const model = this.getModel(resource);

    const where: any = {
      tenantId,
    };

    if (isActive !== undefined) where.isActive = isActive;
    if (q) {
      // Foundation approach: all supported master_* resources include `name`.
      // For `code`, we rely on the known master-data set (listed in getModel()).
      // This avoids invalid runtime reflection on Prisma models.
      const normalizedResource = resource.toLowerCase();
      const codeSupported = [
        'categories',
        'sub-categories',
        'brands',
        'units',
        'taxes',
        'currencies',
        'countries',
        'states',
        'cities',
        'languages',
        'price-lists',
        'payment-methods',
        'attributes',
        'tags',
        'labels',
        'custom-fields',
        'business-types',
        'industry-types',
        'subcategories',
        'pricelists',
        'paymentmethods',
        'customfields',
        'businesstypes',
        'industrytypes',
      ].includes(normalizedResource);

      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        ...(codeSupported
          ? [{ code: { contains: q, mode: 'insensitive' } }]
          : []),
      ];
    }

    const [items, total] = await Promise.all([
      model.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      model.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async getById({
    tenantId,
    resource,
    id,
  }: {
    tenantId: string;
    resource: string;
    id: string;
  }) {
    const model = this.getModel(resource);
    const item = await model.findFirst({ where: { tenantId, id } });
    if (!item) throw new NotFoundException('Master data item not found');
    return item;
  }

  async create({
    tenantId,
    resource,
    dto,
  }: {
    tenantId: string;
    resource: string;
    dto: CreateMasterDataDto;
  }) {
    const model = this.getModel(resource);
    return model.create({
      data: {
        tenantId,
        name: dto.name,
        code: dto.code,
        isActive: dto.isActive ?? true,
        metadata: dto.metadata ?? {},
      },
    });
  }

  async update({
    tenantId,
    resource,
    id,
    dto,
  }: {
    tenantId: string;
    resource: string;
    id: string;
    dto: UpdateMasterDataDto;
  }) {
    const model = this.getModel(resource);
    const existing = await model.findFirst({ where: { tenantId, id } });
    if (!existing) throw new NotFoundException('Master data item not found');

    return model.update({
      where: { id },
      data: {
        name: dto.name ?? existing.name,
        code: dto.code ?? existing.code,
        isActive: dto.isActive ?? existing.isActive,
        metadata: dto.metadata ?? existing.metadata,
      },
    });
  }

  async softDelete({
    tenantId,
    resource,
    id,
  }: {
    tenantId: string;
    resource: string;
    id: string;
  }) {
    const model = this.getModel(resource);
    const existing = await model.findFirst({ where: { tenantId, id } });
    if (!existing) throw new NotFoundException('Master data item not found');

    await model.update({
      where: { id },
      data: { isActive: false },
    });

    return { ok: true };
  }
}
