import { DomainEvent } from '../domain-event.interface';

export class ShipmentCreatedEvent implements DomainEvent<{
  shipmentId: string;
  orderId: string;
}> {
  readonly eventName = 'logistics.shipment.created';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { shipmentId: string; orderId: string },
    public readonly tenantId?: string,
  ) {}
}

export class PickupScheduledEvent implements DomainEvent<{
  shipmentId: string;
  scheduledAt: Date;
}> {
  readonly eventName = 'logistics.pickup.scheduled';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { shipmentId: string; scheduledAt: Date },
    public readonly tenantId?: string,
  ) {}
}

export class ShipmentPickedUpEvent implements DomainEvent<{
  shipmentId: string;
}> {
  readonly eventName = 'logistics.shipment.picked_up';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { shipmentId: string },
    public readonly tenantId?: string,
  ) {}
}

export class ShipmentInTransitEvent implements DomainEvent<{
  shipmentId: string;
  routeId: string;
}> {
  readonly eventName = 'logistics.shipment.in_transit';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { shipmentId: string; routeId: string },
    public readonly tenantId?: string,
  ) {}
}

export class ShipmentOutForDeliveryEvent implements DomainEvent<{
  shipmentId: string;
  routeId: string;
}> {
  readonly eventName = 'logistics.shipment.out_for_delivery';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { shipmentId: string; routeId: string },
    public readonly tenantId?: string,
  ) {}
}

export class ShipmentDeliveredEvent implements DomainEvent<{
  shipmentId: string;
  proofOfDeliveryId: string;
}> {
  readonly eventName = 'logistics.shipment.delivered';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { shipmentId: string; proofOfDeliveryId: string },
    public readonly tenantId?: string,
  ) {}
}

export class DeliveryFailedEvent implements DomainEvent<{
  shipmentId: string;
  reason: string;
}> {
  readonly eventName = 'logistics.delivery.failed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { shipmentId: string; reason: string },
    public readonly tenantId?: string,
  ) {}
}

export class ReturnInitiatedEvent implements DomainEvent<{
  returnId: string;
  shipmentId: string;
}> {
  readonly eventName = 'logistics.return.initiated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { returnId: string; shipmentId: string },
    public readonly tenantId?: string,
  ) {}
}

export class DriverAssignedEvent implements DomainEvent<{
  routeId: string;
  driverEmployeeId: string;
}> {
  readonly eventName = 'logistics.driver.assigned';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { routeId: string; driverEmployeeId: string },
    public readonly tenantId?: string,
  ) {}
}

export class VehicleAssignedEvent implements DomainEvent<{
  routeId: string;
  vehicleId: string;
}> {
  readonly eventName = 'logistics.vehicle.assigned';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { routeId: string; vehicleId: string },
    public readonly tenantId?: string,
  ) {}
}

export class RouteStartedEvent implements DomainEvent<{ routeId: string }> {
  readonly eventName = 'logistics.route.started';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { routeId: string },
    public readonly tenantId?: string,
  ) {}
}

export class RouteCompletedEvent implements DomainEvent<{ routeId: string }> {
  readonly eventName = 'logistics.route.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { routeId: string },
    public readonly tenantId?: string,
  ) {}
}

export class PodRecordedEvent implements DomainEvent<{
  proofOfDeliveryId: string;
  shipmentId: string;
}> {
  readonly eventName = 'logistics.pod.recorded';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { proofOfDeliveryId: string; shipmentId: string },
    public readonly tenantId?: string,
  ) {}
}

export class CodCollectedEvent implements DomainEvent<{
  shipmentId: string;
  amount: number;
}> {
  readonly eventName = 'logistics.cod.collected';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { shipmentId: string; amount: number },
    public readonly tenantId?: string,
  ) {}
}

export class CodReconciledEvent implements DomainEvent<{
  collectionId: string;
  status: string;
}> {
  readonly eventName = 'logistics.cod.reconciled';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { collectionId: string; status: string },
    public readonly tenantId?: string,
  ) {}
}

export class VehicleMaintenanceRequiredEvent implements DomainEvent<{
  vehicleId: string;
  description: string;
}> {
  readonly eventName = 'logistics.vehicle.maintenance.required';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: { vehicleId: string; description: string },
    public readonly tenantId?: string,
  ) {}
}
