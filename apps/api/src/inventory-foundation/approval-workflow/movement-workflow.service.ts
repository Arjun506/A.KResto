import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateMovementWorkflowDto } from './update-movement-workflow.dto';

@Injectable()
export class MovementWorkflowService {
  constructor(private readonly prisma: PrismaService) {}

  async updateWorkflowStatus(
    movementId: string,
    dto: UpdateMovementWorkflowDto,
  ) {
    const movement = await this.prisma.stock_movements.findUnique({
      where: { id: movementId },
    });

    if (!movement) {
      throw new NotFoundException(`Stock movement ${movementId} not found`);
    }

    return this.prisma.stock_movements.update({
      where: { id: movementId },
      data: { workflowStatus: dto.status },
    });
  }
}
