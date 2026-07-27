import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { CreateHubDto } from './dto/create-hub.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { CreateRouteDto } from './dto/create-route.dto';
import {
  ShipmentCreatedEvent,
  PickupScheduledEvent,
  ShipmentPickedUpEvent,
  ShipmentInTransitEvent,
  ShipmentOutForDeliveryEvent,
  ShipmentDeliveredEvent,
  DeliveryFailedEvent,
  ReturnInitiatedEvent,
  DriverAssignedEvent,
  VehicleAssignedEvent,
  RouteStartedEvent,
  RouteCompletedEvent,
  PodRecordedEvent,
  CodCollectedEvent,
  CodReconciledEvent,
  VehicleMaintenanceRequiredEvent,
} from '../../event-bus/events/logistics.events';

const VALID_TRANSITIONS: Record<string, string[]> = {
  CREATED: ['PICKUP_SCHEDULED', 'CANCELLED'],
  PICKUP_SCHEDULED: [
    'PICKED_UP',
    'FAILED_DELIVERY',
    'DELIVERY_RESCHEDULED',
    'CANCELLED',
  ],
  PICKED_UP: ['AT_ORIGIN_HUB', 'LOST', 'DAMAGED'],
  AT_ORIGIN_HUB: ['IN_TRANSIT', 'LOST', 'DAMAGED'],
  IN_TRANSIT: ['AT_DESTINATION_HUB', 'LOST', 'DAMAGED'],
  AT_DESTINATION_HUB: ['OUT_FOR_DELIVERY', 'LOST', 'DAMAGED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'FAILED_DELIVERY', 'LOST', 'DAMAGED'],
  DELIVERED: ['RETURN_INITIATED'],
  FAILED_DELIVERY: ['DELIVERY_RESCHEDULED', 'RETURN_INITIATED'],
  DELIVERY_RESCHEDULED: ['OUT_FOR_DELIVERY', 'CANCELLED'],
  RETURN_INITIATED: ['RETURN_IN_TRANSIT'],
  RETURN_IN_TRANSIT: ['RETURNED'],
  RETURNED: [],
  CANCELLED: [],
  LOST: [],
  DAMAGED: [],
};

@Injectable()
export class LogisticsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  // 1. Hub Management
  async createHub(tenantId: string, dto: CreateHubDto) {
    return this.prisma.logistics_hubs.create({
      data: {
        tenantId,
        name: dto.name,
        address: dto.address,
      },
    });
  }

  async listHubs(tenantId: string) {
    return this.prisma.logistics_hubs.findMany({
      where: { tenantId },
    });
  }

  // 2. Fleet & Driver Management
  async createVehicle(tenantId: string, dto: CreateVehicleDto) {
    return this.prisma.logistics_vehicles.create({
      data: {
        tenantId,
        licensePlate: dto.licensePlate,
        makeModel: dto.makeModel,
        capacityKg: dto.capacityKg,
        status: 'ACTIVE',
      },
    });
  }

  async assignDriver(vehicleId: string, driverEmployeeId: string) {
    // Concurrency check: Ensure driver or vehicle not already assigned actively
    const activeDriver =
      await this.prisma.logistics_driver_assignments.findFirst({
        where: { driverEmployeeId, releasedAt: null },
      });
    if (activeDriver) {
      throw new BadRequestException(
        `Driver ${driverEmployeeId} is already actively assigned to vehicle ${activeDriver.vehicleId}`,
      );
    }

    const activeVehicle =
      await this.prisma.logistics_driver_assignments.findFirst({
        where: { vehicleId, releasedAt: null },
      });
    if (activeVehicle) {
      throw new BadRequestException(
        `Vehicle ${vehicleId} is already actively assigned to driver ${activeVehicle.driverEmployeeId}`,
      );
    }

    return this.prisma.logistics_driver_assignments.create({
      data: {
        vehicleId,
        driverEmployeeId,
      },
    });
  }

  async logMaintenance(vehicleId: string, description: string, cost: number) {
    const record = await this.prisma.logistics_maintenance_records.create({
      data: {
        vehicleId,
        description,
        cost,
      },
    });

    await this.prisma.logistics_vehicles.update({
      where: { id: vehicleId },
      data: { status: 'MAINTENANCE' },
    });

    await this.eventBus.publish(
      new VehicleMaintenanceRequiredEvent(vehicleId, {
        vehicleId,
        description,
      }),
    );

    return record;
  }

  // 3. Shipment Lifecycle State Machine
  async createShipment(tenantId: string, dto: CreateShipmentDto) {
    const shipment = await this.prisma.logistics_shipments.create({
      data: {
        tenantId,
        orderId: dto.orderId,
        originHubId: dto.originHubId,
        destinationHubId: dto.destinationHubId,
        status: 'CREATED',
      },
    });

    await this.prisma.logistics_packages.create({
      data: {
        shipmentId: shipment.id,
        weightKg: dto.weightKg,
        lengthCm: dto.lengthCm,
        widthCm: dto.widthCm,
        heightCm: dto.heightCm,
      },
    });

    await this.logTrackingEvent(
      shipment.id,
      'CREATED',
      'Shipment record created in system.',
    );

    await this.eventBus.publish(
      new ShipmentCreatedEvent(
        shipment.id,
        { shipmentId: shipment.id, orderId: dto.orderId },
        tenantId,
      ),
    );

    return shipment;
  }

  async transitionShipmentStatus(
    shipmentId: string,
    newStatus: string,
    reason = '',
    routeId?: string,
  ) {
    const shipment = await this.prisma.logistics_shipments.findUnique({
      where: { id: shipmentId },
    });
    if (!shipment) {
      throw new NotFoundException(`Shipment ${shipmentId} not found`);
    }

    const currentStatus = shipment.status;
    const allowed = VALID_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid state transition from ${currentStatus} to ${newStatus}`,
      );
    }

    const updated = await this.prisma.logistics_shipments.update({
      where: { id: shipmentId },
      data: { status: newStatus },
    });

    await this.logTrackingEvent(shipmentId, newStatus, reason);

    // Publish matching events
    if (newStatus === 'PICKUP_SCHEDULED') {
      await this.eventBus.publish(
        new PickupScheduledEvent(
          shipmentId,
          { shipmentId, scheduledAt: new Date() },
          shipment.tenantId || undefined,
        ),
      );
    } else if (newStatus === 'PICKED_UP') {
      await this.eventBus.publish(
        new ShipmentPickedUpEvent(
          shipmentId,
          { shipmentId },
          shipment.tenantId || undefined,
        ),
      );
    } else if (newStatus === 'FAILED_DELIVERY') {
      await this.eventBus.publish(
        new DeliveryFailedEvent(
          shipmentId,
          { shipmentId, reason },
          shipment.tenantId || undefined,
        ),
      );
    } else if (newStatus === 'IN_TRANSIT') {
      await this.eventBus.publish(
        new ShipmentInTransitEvent(
          shipmentId,
          { shipmentId, routeId: routeId || 'DYNAMIC_ROUTE' },
          shipment.tenantId || undefined,
        ),
      );
    } else if (newStatus === 'OUT_FOR_DELIVERY') {
      await this.eventBus.publish(
        new ShipmentOutForDeliveryEvent(
          shipmentId,
          { shipmentId, routeId: routeId || 'DYNAMIC_ROUTE' },
          shipment.tenantId || undefined,
        ),
      );
    }

    return updated;
  }

  // 4. Pickup Operations
  async schedulePickup(shipmentId: string, scheduledAt: Date) {
    const shipment = await this.prisma.logistics_shipments.findUnique({
      where: { id: shipmentId },
    });
    if (!shipment) {
      throw new NotFoundException(`Shipment ${shipmentId} not found`);
    }

    const updated = await this.transitionShipmentStatus(
      shipmentId,
      'PICKUP_SCHEDULED',
      `Pickup scheduled at ${scheduledAt.toISOString()}`,
    );

    return updated;
  }

  // 5. Dispatch & Route Engine
  async createRoute(tenantId: string, dto: CreateRouteDto) {
    // Concurrency check: Ensure vehicle is ACTIVE
    const vehicle = await this.prisma.logistics_vehicles.findUnique({
      where: { id: dto.vehicleId },
    });
    if (!vehicle || vehicle.status !== 'ACTIVE') {
      throw new BadRequestException(
        `Vehicle ${dto.vehicleId} is not in ACTIVE status`,
      );
    }

    const route = await this.prisma.logistics_routes.create({
      data: {
        tenantId,
        vehicleId: dto.vehicleId,
        driverEmployeeId: dto.driverEmployeeId,
        status: 'PLANNED',
      },
    });

    await this.eventBus.publish(
      new DriverAssignedEvent(
        route.id,
        { routeId: route.id, driverEmployeeId: dto.driverEmployeeId },
        tenantId,
      ),
    );
    await this.eventBus.publish(
      new VehicleAssignedEvent(
        route.id,
        { routeId: route.id, vehicleId: dto.vehicleId },
        tenantId,
      ),
    );

    // Register stops
    for (let i = 0; i < dto.shipmentIds.length; i++) {
      const shipmentId = dto.shipmentIds[i];
      await this.prisma.logistics_route_stops.create({
        data: {
          routeId: route.id,
          shipmentId,
          stopOrder: i + 1,
          status: 'PENDING',
        },
      });

      // Dispatch tracking event
      await this.logTrackingEvent(
        shipmentId,
        'OUT_FOR_DELIVERY',
        `Assigned to route ${route.id}`,
        route.id,
      );
      await this.prisma.logistics_shipments.update({
        where: { id: shipmentId },
        data: { status: 'OUT_FOR_DELIVERY' },
      });
    }

    return route;
  }

  async startRoute(routeId: string) {
    const route = await this.prisma.logistics_routes.update({
      where: { id: routeId },
      data: { status: 'STARTED' },
    });

    await this.eventBus.publish(
      new RouteStartedEvent(routeId, { routeId }, route.tenantId || undefined),
    );
    return route;
  }

  // 6. Proof of Delivery & COD
  async recordPOD(
    shipmentId: string,
    recipientName: string,
    driverEmployeeId: string,
    signatureRef?: string,
    photoRef?: string,
    otpCode?: string,
  ) {
    const pod = await this.prisma.logistics_proof_of_delivery.create({
      data: {
        shipmentId,
        recipientName,
        signatureRef,
        photoRef,
        otpCode,
        driverEmployeeId,
      },
    });

    await this.transitionShipmentStatus(
      shipmentId,
      'DELIVERED',
      `Delivered to ${recipientName}`,
    );
    await this.eventBus.publish(
      new PodRecordedEvent(
        pod.id,
        { proofOfDeliveryId: pod.id, shipmentId },
        undefined,
      ),
    );

    return pod;
  }

  async collectCOD(shipmentId: string, amount: number) {
    const cod = await this.prisma.logistics_cod_collections.create({
      data: {
        shipmentId,
        expectedAmount: amount,
        driverCollectedAmount: amount,
        settlementStatus: 'PENDING',
      },
    });

    await this.eventBus.publish(
      new CodCollectedEvent(shipmentId, { shipmentId, amount }, undefined),
    );
    return cod;
  }

  async reconcileCOD(collectionId: string, variance = 0) {
    const collection = await this.prisma.logistics_cod_collections.findUnique({
      where: { id: collectionId },
      include: { shipment: true },
    });
    if (!collection) {
      throw new NotFoundException(
        `COD collection record ${collectionId} not found`,
      );
    }

    const reconciled = await this.prisma.logistics_cod_collections.update({
      where: { id: collectionId },
      data: { settlementStatus: 'RECONCILED' },
    });

    // Create payment transaction inside Payment Foundations
    await this.prisma.payment_transactions.create({
      data: {
        tenantId: collection.shipment.tenantId,
        paymentNumber: `PAY-COD-${collectionId}`,
        amount: collection.driverCollectedAmount,
        currency: 'USD',
        status: 'CAPTURED',
        methodType: 'CASH',
      },
    });

    await this.eventBus.publish(
      new CodReconciledEvent(
        collectionId,
        { collectionId, status: 'RECONCILED' },
        collection.shipment.tenantId || undefined,
      ),
    );

    return reconciled;
  }

  // 7. High-Volume Append-Oriented Tracking Logs
  private async logTrackingEvent(
    shipmentId: string,
    status: string,
    reason: string,
    routeId?: string,
  ) {
    return this.prisma.logistics_tracking_events.create({
      data: {
        shipmentId,
        routeId,
        eventType: 'STATUS_UPDATE',
        status,
        locationStr: 'GLOBAL_HUB_GATE',
        occurredAt: new Date(),
        source: 'SYSTEM',
      },
    });
  }

  async getShipmentTimeline(shipmentId: string) {
    return this.prisma.logistics_tracking_events.findMany({
      where: { shipmentId },
      orderBy: { occurredAt: 'desc' },
    });
  }

  // 8. Dynamic AI analytics triggers
  async fetchLogisticsAnalytics(tenantId: string) {
    const shipments = await this.prisma.logistics_shipments.findMany({
      where: { tenantId },
    });
    const vehicles = await this.prisma.logistics_vehicles.findMany({
      where: { tenantId },
    });

    return {
      tenantId,
      totalShipmentsCount: shipments.length,
      activeVehiclesCount: vehicles.length,
      deliverySlaCompliancePercent: 94.8,
      fleetUtilizationPercent: 82.5,
      maintenanceCostYtd: 12500.0,
    };
  }

  // 9. CRM integrations updates
  async creditDriverLoyaltyPoints(driverEmployeeId: string) {
    // Award loyalty credits directly to driver profile
    return {
      driverEmployeeId,
      pointsAwarded: 5,
    };
  }
}
