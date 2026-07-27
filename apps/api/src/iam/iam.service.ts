import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IamRepository } from './iam.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { EventBusService } from '../event-bus/event-bus.service';
import { UserCreatedEvent } from '../event-bus/events/system.events';

@Injectable()
export class IamService {
  constructor(
    private readonly iamRepository: IamRepository,
    private readonly eventBus: EventBusService,
  ) {}

  async getUserById(id: string) {
    const user = await this.iamRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async createUser(dto: CreateUserDto) {
    const existing = await this.iamRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(
        `User with email ${dto.email} already exists`,
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.iamRepository.createUser(dto, hashedPassword);

    await this.eventBus.publish(
      new UserCreatedEvent(
        user.id,
        { userId: user.id, email: user.email, role: String(user.role) },
        user.tenantId || undefined,
      ),
    );

    return user;
  }

  async updateUserProfile(id: string, dto: UpdateUserProfileDto) {
    await this.getUserById(id);
    return this.iamRepository.updateProfile(id, dto);
  }

  async listUsers(tenantId?: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const { items, total } = await this.iamRepository.listUsers(
      tenantId,
      skip,
      limit,
    );
    return {
      items,
      totalItems: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }
}
