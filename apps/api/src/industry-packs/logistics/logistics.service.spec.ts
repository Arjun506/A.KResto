import { Test, TestingModule } from '@nestjs/testing';
import { LogisticsService } from './logistics.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';

describe('LogisticsService', () => {
  let service: LogisticsService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      logistics_hubs: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      logistics_vehicles: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
      logistics_driver_assignments: {
        create: jest.fn(),
        findFirst: jest.fn(),
      },
      logistics_shipments: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
      logistics_packages: {
        create: jest.fn(),
      },
      logistics_routes: {
        create: jest.fn(),
        update: jest.fn(),
      },
      logistics_route_stops: {
        create: jest.fn(),
      },
      logistics_tracking_events: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      logistics_proof_of_delivery: {
        create: jest.fn(),
      },
      logistics_cod_collections: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      logistics_maintenance_records: {
        create: jest.fn(),
      },
      payment_transactions: {
        create: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogisticsService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<LogisticsService>(LogisticsService);
  });

  it('should process shipments state transitions correctly and validate state machine rules', async () => {
    prisma.logistics_shipments.findUnique.mockResolvedValue({
      id: 'ship_1',
      tenantId: 't_1',
      status: 'CREATED',
    });
    prisma.logistics_shipments.update.mockResolvedValue({
      id: 'ship_1',
      tenantId: 't_1',
      status: 'PICKUP_SCHEDULED',
    });
    prisma.logistics_tracking_events.create.mockResolvedValue({});

    const transition = await service.transitionShipmentStatus(
      'ship_1',
      'PICKUP_SCHEDULED',
    );

    expect(prisma.logistics_shipments.update).toHaveBeenCalled();
    expect(transition.status).toEqual('PICKUP_SCHEDULED');
    expect(eventBus.publish).toHaveBeenCalled();
  });

  it('should block invalid state machine transitions', async () => {
    prisma.logistics_shipments.findUnique.mockResolvedValue({
      id: 'ship_1',
      tenantId: 't_1',
      status: 'CREATED',
    });

    await expect(
      service.transitionShipmentStatus('ship_1', 'DELIVERED'),
    ).rejects.toThrow();
  });

  it('should plan delivery routes, record proof of delivery and settle COD reconciled transactions', async () => {
    prisma.logistics_vehicles.findUnique.mockResolvedValue({
      id: 'veh_1',
      status: 'ACTIVE',
    });
    prisma.logistics_routes.create.mockResolvedValue({
      id: 'route_1',
      tenantId: 't_1',
    });
    prisma.logistics_route_stops.create.mockResolvedValue({});
    prisma.logistics_shipments.update.mockResolvedValue({});
    prisma.logistics_proof_of_delivery.create.mockResolvedValue({
      id: 'pod_1',
    });
    prisma.logistics_shipments.findUnique.mockResolvedValue({
      id: 'ship_1',
      status: 'OUT_FOR_DELIVERY',
      tenantId: 't_1',
    });
    prisma.logistics_cod_collections.findUnique.mockResolvedValue({
      id: 'cod_1',
      driverCollectedAmount: 150.0,
      shipment: { tenantId: 't_1' },
    });
    prisma.logistics_cod_collections.update.mockResolvedValue({
      id: 'cod_1',
      settlementStatus: 'RECONCILED',
    });

    const route = await service.createRoute('t_1', {
      vehicleId: 'veh_1',
      driverEmployeeId: 'drv_1',
      shipmentIds: ['ship_1'],
    });

    const pod = await service.recordPOD('ship_1', 'John Doe', 'drv_1');
    const reconciliation = await service.reconcileCOD('cod_1');

    expect(route.id).toEqual('route_1');
    expect(pod.id).toEqual('pod_1');
    expect(reconciliation.settlementStatus).toEqual('RECONCILED');
    expect(prisma.payment_transactions.create).toHaveBeenCalled();
  });
});
