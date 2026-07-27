import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IamService } from './iam.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('IAM (Identity & Access Management)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('iam')
export class IamController {
  constructor(private readonly iamService: IamService) {}

  @Get('users')
  @ApiOperation({ summary: 'List users in organization or tenant' })
  async listUsers(
    @Query('tenantId') tenantId?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.iamService.listUsers(tenantId, Number(page), Number(limit));
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user identity & profile by ID' })
  async getUserById(@Param('id') id: string) {
    return this.iamService.getUserById(id);
  }

  @Post('users')
  @ApiOperation({ summary: 'Create new user identity' })
  async createUser(@Body() dto: CreateUserDto) {
    return this.iamService.createUser(dto);
  }

  @Patch('users/:id/profile')
  @ApiOperation({ summary: 'Update user profile details' })
  async updateUserProfile(
    @Param('id') id: string,
    @Body() dto: UpdateUserProfileDto,
  ) {
    return this.iamService.updateUserProfile(id, dto);
  }
}
