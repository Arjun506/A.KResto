import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleNavigationService } from './console-navigation.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ConsoleNavigationService', () => {
  let service: ConsoleNavigationService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      platform_packs: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsoleNavigationService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ConsoleNavigationService>(ConsoleNavigationService);
  });

  it('should compile navigation links merging default elements with active industry routes', async () => {
    prisma.platform_packs.findMany.mockResolvedValue([
      { code: 'rest-pack', status: 'ACTIVE' },
    ]);

    const result = await service.compileSidebarNavigation('t_1');

    expect(prisma.platform_packs.findMany).toHaveBeenCalled();
    expect(result.some((n) => n.id === 'nav_rest_kds')).toBe(true);
  });
});
