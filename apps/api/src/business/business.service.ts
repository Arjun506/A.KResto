import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PlanTier, Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import {
  DEFAULT_ROLE_PERMISSIONS,
  INDUSTRY_FEATURE_MAP,
  INDUSTRY_ROLE_MAP,
  SUPPORTED_CURRENCIES,
  SUPPORTED_INDUSTRIES,
  SUPPORTED_TIMEZONES,
  slugifyBusinessName,
} from './business.constants';
import { CreateBranchDto } from './dto/create-branch.dto';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { RegisterBusinessDto } from './dto/register-business.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import type {
  BusinessNameAvailabilityResponse,
  WorkspaceProvisionResponse,
} from './models/workspace-provision.response';

@Injectable()
export class BusinessService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // ─────────────────────────────────────────────
  // LOOKUP ENDPOINTS (PUBLIC)
  // ─────────────────────────────────────────────

  getIndustries() {
    return SUPPORTED_INDUSTRIES;
  }

  getCurrencies() {
    return SUPPORTED_CURRENCIES;
  }

  getTimezones() {
    return SUPPORTED_TIMEZONES;
  }

  async checkBusinessName(
    name: string,
  ): Promise<BusinessNameAvailabilityResponse> {
    const slug = slugifyBusinessName(name);

    if (!slug) {
      return {
        name,
        slug,
        available: false,
        reason:
          'Business name must contain at least one alphanumeric character',
      };
    }

    const [existingByName, existingBySlug] = await Promise.all([
      this.prisma.tenant.findFirst({
        where: { name: { equals: name, mode: 'insensitive' } },
        select: { id: true },
      }),
      this.prisma.tenant.findUnique({
        where: { slug },
        select: { id: true },
      }),
    ]);

    if (existingByName) {
      return {
        name,
        slug,
        available: false,
        reason: 'Business name is already registered',
      };
    }

    if (existingBySlug) {
      return {
        name,
        slug,
        available: false,
        reason: 'Business URL slug is already taken',
      };
    }

    return { name, slug, available: true };
  }

  // ─────────────────────────────────────────────
  // WORKSPACE PROVISIONING
  // ─────────────────────────────────────────────

  /** @deprecated Use createWorkspace — kept for backward compatibility */
  async register(
    dto: RegisterBusinessDto,
  ): Promise<WorkspaceProvisionResponse> {
    return this.createWorkspace(dto);
  }

  async createWorkspace(
    dto: CreateWorkspaceDto,
  ): Promise<WorkspaceProvisionResponse> {
    const nameCheck = await this.checkBusinessName(dto.businessName);
    if (!nameCheck.available) {
      throw new BadRequestException(
        nameCheck.reason ?? 'Business name is not available',
      );
    }

    const existingUser = await this.prisma.users.findUnique({
      where: { email: dto.ownerEmail },
    });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const slug = nameCheck.slug;
    const hashedPassword = await bcrypt.hash(dto.ownerPassword, 10);
    const workspaceSettings = this.buildWorkspaceSettings(dto);
    const features = INDUSTRY_FEATURE_MAP[dto.industry] ?? ['crm', 'analytics'];
    const rolesPermissions =
      INDUSTRY_ROLE_MAP[dto.industry] ?? DEFAULT_ROLE_PERMISSIONS;

    const result = await this.prisma.$transaction(async (tx) => {
      const duplicateName = await tx.tenant.findFirst({
        where: { name: { equals: dto.businessName, mode: 'insensitive' } },
      });
      if (duplicateName) {
        throw new BadRequestException('Business name is already registered');
      }

      const duplicateEmail = await tx.users.findUnique({
        where: { email: dto.ownerEmail },
      });
      if (duplicateEmail) {
        throw new BadRequestException('Email already registered');
      }

      const tenant = await tx.tenant.create({
        data: {
          name: dto.businessName,
          slug,
          location: dto.location ?? null,
          address: dto.address ?? null,
          currency: dto.currency ?? 'USD',
          timezone: dto.timezone ?? 'UTC',
          language: dto.language ?? 'en',
          industry: dto.industry,
          status: 'ACTIVE',
          settings: workspaceSettings,
        },
      });

      for (const featureKey of features) {
        await tx.tenant_features.create({
          data: { tenantId: tenant.id, featureKey, isEnabled: true },
        });
      }

      const branch = await tx.branch.create({
        data: {
          tenantId: tenant.id,
          name: 'Main Branch',
          code: 'MAIN',
          location: dto.location ?? null,
          isActive: true,
        },
      });

      for (const rp of rolesPermissions) {
        await tx.roles_permissions.create({
          data: {
            tenantId: tenant.id,
            roleName: rp.role,
            permissions: rp.perms,
          },
        });
      }

      const owner = await tx.users.create({
        data: {
          name: dto.ownerName,
          email: dto.ownerEmail,
          passwordHash: hashedPassword,
          role: UserRole.OWNER,
          tenantId: tenant.id,
        },
      });

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 14);

      const subscription = await tx.subscriptions.create({
        data: {
          tenantId: tenant.id,
          planName: dto.selectedPlan ?? PlanTier.TRIAL,
          status: 'TRIALING',
          billingEmail: dto.ownerEmail,
          currentPeriodStart: startDate,
          currentPeriodEnd: endDate,
        },
      });

      await tx.audit_logs.create({
        data: {
          tenantId: tenant.id,
          userId: owner.id,
          entity: 'Tenant',
          entityId: tenant.id,
          action: 'WORKSPACE_PROVISIONED',
          changes: [
            'provisioned workspace context',
            'seeded default settings',
            `initialized ${features.length} modules`,
            `configured ${rolesPermissions.length} roles`,
          ],
        },
      });

      return {
        tenant,
        owner,
        branch,
        subscription,
        features,
        rolesPermissions,
      };
    });

    const payload = {
      sub: result.owner.id,
      email: result.owner.email,
      role: result.owner.role,
      tenantId: result.tenant.id,
    } as const;

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      workspace: result.tenant,
      business: {
        id: result.tenant.id,
        name: result.tenant.name,
        slug: result.tenant.slug,
        industry: result.tenant.industry,
        status: result.tenant.status,
        currency: result.tenant.currency,
        timezone: result.tenant.timezone,
        language: result.tenant.language,
      },
      owner: {
        id: result.owner.id,
        name: result.owner.name,
        email: result.owner.email,
        role: result.owner.role,
        tenantId: result.tenant.id,
      },
      branch: {
        id: result.branch.id,
        name: result.branch.name,
        code: result.branch.code,
        isActive: result.branch.isActive,
      },
      subscription: {
        id: result.subscription.id,
        planName: result.subscription.planName,
        status: result.subscription.status,
        billingEmail: result.subscription.billingEmail,
        currentPeriodStart: result.subscription.currentPeriodStart,
        currentPeriodEnd: result.subscription.currentPeriodEnd,
      },
      modules: result.features,
      roles: result.rolesPermissions.map((role) => role.role),
    };
  }

  private buildWorkspaceSettings(dto: CreateWorkspaceDto) {
    return {
      profile: {
        name: dto.businessName,
        email: dto.ownerEmail,
        location: dto.location ?? null,
        address: dto.address ?? null,
      },
      operational: {
        currency: dto.currency ?? 'USD',
        timezone: dto.timezone ?? 'UTC',
        language: dto.language ?? 'en',
      },
      theme: {
        preset: dto.themePreset ?? 'glass-violet',
        primaryColor: '#6366F1',
        darkMode: true,
        logo: null,
      },
      localization: {
        timezone: dto.timezone ?? 'UTC',
        currency: dto.currency ?? 'USD',
        language: dto.language ?? 'en',
        dateFormat: 'YYYY-MM-DD',
        numberFormat: 'en-US',
      },
      dashboard_layout: {
        widgets: [
          'revenue_chart',
          'orders_count',
          'inventory_alert',
          'recent_activity',
        ],
        updatedAt: new Date().toISOString(),
      },
      notifications: { email: true, sms: false, inApp: true },
      ai_profile: {
        enabled: true,
        defaultModel: 'gemini-1.5-flash',
        systemPrompt: `You are the AI assistant for ${dto.businessName}. Help the owner optimize operations.`,
      },
      marketplace: {
        active: false,
        listingTitle: dto.businessName,
        tags: [dto.industry.toLowerCase()],
      },
      consumer_profile: {
        storefrontName: dto.businessName,
        customBanner: null,
        description: `Welcome to the official storefront of ${dto.businessName}`,
      },
    };
  }

  // ─────────────────────────────────────────────
  // SETTINGS
  // ─────────────────────────────────────────────

  async getSettings(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        tenant_features: true,
        branches: { orderBy: { createdAt: 'asc' } },
        roles_permissions: true,
        subscriptions: true,
        auditLogs: { take: 20, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!tenant) {
      throw new NotFoundException('Business context not found');
    }
    return tenant;
  }

  async updateSettings(tenantId: string, dto: UpdateSettingsDto) {
    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.logo !== undefined && { logo: dto.logo }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.currency !== undefined && { currency: dto.currency }),
        ...(dto.timezone !== undefined && { timezone: dto.timezone }),
        ...(dto.language !== undefined && { language: dto.language }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.settings !== undefined && {
          settings: dto.settings as Prisma.InputJsonObject,
        }),
      },
      include: {
        tenant_features: true,
        branches: { orderBy: { createdAt: 'asc' } },
        roles_permissions: true,
        subscriptions: true,
      },
    });
    return tenant;
  }

  // ─────────────────────────────────────────────
  // SUBSCRIPTION
  // ─────────────────────────────────────────────

  async getSubscription(tenantId: string) {
    const subscription = await this.prisma.subscriptions.findFirst({
      where: { tenantId: tenantId },
      orderBy: { createdAt: 'desc' },
    });
    if (!subscription) {
      throw new NotFoundException('No subscription found for this workspace');
    }
    return subscription;
  }

  // ─────────────────────────────────────────────
  // BRANCHES
  // ─────────────────────────────────────────────

  async getBranches(tenantId: string) {
    return this.prisma.branch.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createBranch(tenantId: string, dto: CreateBranchDto) {
    if (dto.code) {
      const existing = await this.prisma.branch.findUnique({
        where: { tenantId_code: { tenantId, code: dto.code } },
      });
      if (existing) {
        throw new BadRequestException(
          `Branch code "${dto.code}" is already in use for this workspace`,
        );
      }
    }

    return this.prisma.branch.create({
      data: {
        tenantId,
        name: dto.name,
        code: dto.code ?? null,
        location: dto.location ?? null,
        address: dto.address ?? null,
        phone: dto.phone ?? null,
        email: dto.email ?? null,
        isActive: true,
      },
    });
  }

  async updateBranch(tenantId: string, branchId: string, dto: UpdateBranchDto) {
    const branch = await this.prisma.branch.findFirst({
      where: { id: branchId, tenantId },
    });
    if (!branch) {
      throw new NotFoundException('Branch not found in this workspace');
    }

    if (dto.code && dto.code !== branch.code) {
      const codeConflict = await this.prisma.branch.findUnique({
        where: { tenantId_code: { tenantId, code: dto.code } },
      });
      if (codeConflict) {
        throw new BadRequestException(
          `Branch code "${dto.code}" is already in use for this workspace`,
        );
      }
    }

    return this.prisma.branch.update({
      where: { id: branchId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.code !== undefined && { code: dto.code }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  // ─────────────────────────────────────────────
  // TENANT FEATURES (CAPABILITY REGISTRY)
  // ─────────────────────────────────────────────

  async getFeatures(tenantId: string) {
    return this.prisma.tenant_features.findMany({
      where: { tenantId },
      orderBy: { featureKey: 'asc' },
    });
  }

  async updateFeature(
    tenantId: string,
    featureKey: string,
    dto: UpdateFeatureDto,
  ) {
    const feature = await this.prisma.tenant_features.findUnique({
      where: { tenantId_featureKey: { tenantId, featureKey } },
    });
    if (!feature) {
      throw new NotFoundException(
        `Feature "${featureKey}" is not registered for this workspace`,
      );
    }

    return this.prisma.tenant_features.update({
      where: { tenantId_featureKey: { tenantId, featureKey } },
      data: {
        isEnabled: dto.isEnabled,
        ...(dto.config !== undefined && {
          config: dto.config as Prisma.InputJsonObject,
        }),
      },
    });
  }

  async getLaunchStatus(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        branches: true,
        tenant_features: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Business workspace not found');
    }

    const [categoryCount, menuItemCount, tableWithQrCount, orderCount] =
      await Promise.all([
        this.prisma.categories.count({ where: { tenantId: tenantId } }),
        this.prisma.menu_items.count({ where: { tenantId: tenantId } }),
        this.prisma.tables.count({
          where: { tenantId: tenantId, qrCode: { not: null } },
        }),
        this.prisma.orders.count({ where: { tenantId: tenantId } }),
      ]);

    const settingsObj = (tenant.settings || {}) as Record<string, any>;
    const themeObj = (settingsObj.theme || {}) as Record<string, any>;
    const operationalObj = (settingsObj.operational || {}) as Record<
      string,
      any
    >;

    const hasProfile = !!(tenant.phone && tenant.address && tenant.email);
    const hasLogo = !!tenant.logo;
    const hasCover = !!(
      settingsObj.coverImage ||
      themeObj.cover ||
      themeObj.coverImage
    );
    const hasBranch = tenant.branches.length > 0;
    const hasMenu = categoryCount > 0;
    const hasProducts = menuItemCount > 0;
    const hasQr = tableWithQrCount > 0;

    const isPaymentConfigured = !!(
      settingsObj.paymentConfigured === true || settingsObj.paymentGateway
    );
    const isWebsitePublished = !!(
      settingsObj.websitePublished === true || settingsObj.websiteUrl
    );
    const isAkConnectEnabled = !!(
      settingsObj.akConnectEnabled === true ||
      tenant.tenant_features.some(
        (f) => f.featureKey === 'connect' && f.isEnabled,
      )
    );
    const hasOrders = orderCount > 0;

    const checklist = [
      {
        key: 'workspace_created',
        label: 'Workspace Created',
        description:
          'Your business cloud workspace is successfully provisioned and active.',
        completed: true,
        actionText: 'Completed',
        href: '/dashboard',
      },
      {
        key: 'industry_pack_installed',
        label: 'Industry Pack Installed',
        description: `Install industry capabilities (Current: ${tenant.industry}).`,
        completed: true,
        actionText: 'View Modules',
        href: '/dashboard',
      },
      {
        key: 'business_profile_completed',
        label: 'Business Profile Completed',
        description:
          'Provide phone number, address, and email to complete your profile.',
        completed: hasProfile,
        actionText: 'Update Profile',
        href: '/dashboard/pos',
      },
      {
        key: 'logo_uploaded',
        label: 'Logo Uploaded',
        description: 'Upload a brand logo for digital receipts and menus.',
        completed: hasLogo,
        actionText: 'Upload Logo',
        href: '/dashboard/pos',
      },
      {
        key: 'cover_image_uploaded',
        label: 'Cover Image Uploaded',
        description: 'Upload a cover banner for your web storefront.',
        completed: hasCover,
        actionText: 'Upload Cover',
        href: '/dashboard/pos',
      },
      {
        key: 'branch_created',
        label: 'Branch Created',
        description: 'Register at least one operational branch/location.',
        completed: hasBranch,
        actionText: 'Manage Branches',
        href: '/dashboard/pos',
      },
      {
        key: 'menu_added',
        label: 'Menu Categories Added',
        description: 'Create food/item categories to organize your menu.',
        completed: hasMenu,
        actionText: 'Add Category',
        href: '/dashboard/menu',
      },
      {
        key: 'products_added',
        label: 'Products / Items Added',
        description: 'Create dishes or catalog items with pricing.',
        completed: hasProducts,
        actionText: 'Add Product',
        href: '/dashboard/menu',
      },
      {
        key: 'qr_generated',
        label: 'QR Codes Generated',
        description:
          'Configure tables and generate digital QR codes for ordering.',
        completed: hasQr,
        actionText: 'Generate QRs',
        href: '/dashboard/qr-tables',
      },
      {
        key: 'payment_configured',
        label: 'Payment Gateway Configured',
        description:
          'Enable payment integrations for automated cashier checkout.',
        completed: isPaymentConfigured,
        actionText: 'Configure Payments',
        href: '/dashboard/pos',
      },
      {
        key: 'website_published',
        label: 'Website Published',
        description:
          'Publish your consumer-facing digital ordering storefront website.',
        completed: isWebsitePublished,
        actionText: 'Publish Storefront',
        href: '/dashboard/pos',
      },
      {
        key: 'ak_connect_enabled',
        label: 'AK Connect Enabled',
        description:
          'Enable delivery aggregates and SMS/WhatsApp notifications.',
        completed: isAkConnectEnabled,
        actionText: 'Enable AK Connect',
        href: '/dashboard/pos',
      },
      {
        key: 'first_order_completed',
        label: 'First Order Completed',
        description:
          'Process your first sale order through the POS billing terminal.',
        completed: hasOrders,
        actionText: 'Open POS Terminal',
        href: '/dashboard/pos',
      },
    ];

    const completedCount = checklist.filter((x) => x.completed).length;
    const totalCount = checklist.length;
    const percentage = Math.round((completedCount / totalCount) * 100);

    const missingConfig: string[] = [];
    if (!hasProfile) missingConfig.push('Business Profile');
    if (!hasLogo) missingConfig.push('Brand Logo');
    if (!hasCover) missingConfig.push('Cover Image');
    if (!hasBranch) missingConfig.push('Operational Branch');
    if (!hasMenu) missingConfig.push('Menu Categories');
    if (!hasProducts) missingConfig.push('Catalog Products');
    if (!hasQr) missingConfig.push('Table QR Codes');
    if (!isPaymentConfigured) missingConfig.push('Payment Gateway');
    if (!isWebsitePublished) missingConfig.push('Storefront Website');
    if (!isAkConnectEnabled) missingConfig.push('AK Connect Integration');

    const healthScore = Math.min(
      100,
      40 + Math.round((completedCount / totalCount) * 60),
    );

    const nextRecommendedStep = checklist.find((x) => !x.completed) || null;

    return {
      percentage,
      completedCount,
      totalCount,
      checklist,
      healthScore,
      missingConfig,
      nextRecommendedStep,
    };
  }
}
