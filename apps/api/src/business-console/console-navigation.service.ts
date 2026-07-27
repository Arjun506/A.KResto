import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface NavItem {
  id: string;
  label: string;
  route: string;
  icon?: string;
}

@Injectable()
export class ConsoleNavigationService {
  constructor(private readonly prisma: PrismaService) {}

  async compileSidebarNavigation(tenantId: string) {
    const defaultNav: NavItem[] = [
      {
        id: 'nav_dash',
        label: 'Dashboard',
        route: '/console/dashboard',
        icon: 'dashboard',
      },
      {
        id: 'nav_staff',
        label: 'Staff Directory',
        route: '/console/staff',
        icon: 'people',
      },
      {
        id: 'nav_docs',
        label: 'Document Vault',
        route: '/console/documents',
        icon: 'folder',
      },
    ];

    // Fetch active industry packs route configurations
    const activePacks = await this.prisma.platform_packs.findMany({
      where: { status: 'ACTIVE' },
    });

    activePacks.forEach((pack) => {
      if (pack.code === 'rest-pack' || pack.code === 'restaurant') {
        defaultNav.push(
          {
            id: 'nav_rest_tables',
            label: 'Table Layout',
            route: '/console/restaurant/tables',
            icon: 'table',
          },
          {
            id: 'nav_rest_kds',
            label: 'Kitchen Tickets',
            route: '/console/restaurant/kds',
            icon: 'kitchen',
          },
        );
      }
      if (pack.code === 'hotel-pack') {
        defaultNav.push({
          id: 'nav_hotel_rooms',
          label: 'Room Registry',
          route: '/console/hotel/rooms',
          icon: 'hotel',
        });
      }
    });

    return defaultNav;
  }

  async pinNavigationItem(
    tenantId: string,
    userId: string,
    menuItemId: string,
    sortOrder: number,
  ) {
    return this.prisma.console_pinned_nav.create({
      data: {
        tenantId,
        userId,
        menuItemId,
        sortOrder,
      },
    });
  }
}
