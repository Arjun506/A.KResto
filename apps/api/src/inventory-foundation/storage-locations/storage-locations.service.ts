import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStorageLocationDto } from './create-location.dto';

@Injectable()
export class StorageLocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createLocation(dto: CreateStorageLocationDto) {
    return this.prisma.storage_locations.create({
      data: {
        warehouseId: dto.warehouseId,
        code: dto.code,
        name: dto.name,
        aisle: dto.aisle,
        rack: dto.rack,
        shelf: dto.shelf,
        bin: dto.bin,
        isColdStorage: dto.isColdStorage ?? false,
      },
    });
  }

  async listLocations(warehouseId: string) {
    return this.prisma.storage_locations.findMany({
      where: { warehouseId },
    });
  }
}
