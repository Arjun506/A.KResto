import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtUser } from '../common/types/jwt-user.interface';
import { CreateKitchenStationDto } from './dto/create-kitchen-station.dto';

export const DEFAULT_KITCHEN_STATIONS = [
  { code: 'MAIN_KITCHEN', name: 'Main Kitchen', description: 'Central food assembly and general cooking station', displayOrder: 1 },
  { code: 'PIZZA', name: 'Pizza Station', description: 'Woodfired deck pizza and pasta station', displayOrder: 2 },
  { code: 'GRILL', name: 'Grill Station', description: 'Tandoor, kebabs, steaks and grilled entrees', displayOrder: 3 },
  { code: 'FRY', name: 'Fry Station', description: 'Deep fryers, appetizers and fast snacks', displayOrder: 4 },
  { code: 'BEVERAGE', name: 'Beverage Station', description: 'Barista coffees, cold drinks, juices and shakes', displayOrder: 5 },
  { code: 'DESSERT', name: 'Dessert Station', description: 'Pastries, ice creams, cakes and sweet dishes', displayOrder: 6 },
];

@Injectable()
export class KitchenStationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStations(user: JwtUser | undefined) {
    const tenantId = user?.tenantId ?? 'default';

    const existing = await this.prisma.kitchen_stations.findMany({
      where: { tenantId, isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    if (existing.length > 0) {
      return existing;
    }

    // Seed default stations for tenant if empty
    await this.prisma.kitchen_stations.createMany({
      data: DEFAULT_KITCHEN_STATIONS.map((s) => ({
        tenantId,
        name: s.name,
        code: s.code,
        description: s.description,
        displayOrder: s.displayOrder,
      })),
      skipDuplicates: true,
    });

    return this.prisma.kitchen_stations.findMany({
      where: { tenantId, isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async createStation(user: JwtUser | undefined, dto: CreateKitchenStationDto) {
    const tenantId = user?.tenantId ?? 'default';
    const code = dto.code.trim().toUpperCase();

    const existing = await this.prisma.kitchen_stations.findUnique({
      where: {
        tenantId_code: { tenantId, code },
      },
    });

    if (existing) {
      throw new ConflictException(`Station code '${code}' already exists for this tenant`);
    }

    return this.prisma.kitchen_stations.create({
      data: {
        tenantId,
        name: dto.name,
        code,
        description: dto.description ?? null,
        displayOrder: dto.displayOrder ?? 0,
      },
    });
  }
}
