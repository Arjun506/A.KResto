import { DomainEvent } from '../domain-event.interface';

export class AppointmentBookedEvent implements DomainEvent<{
  appointmentId: string;
  patientProfileId: string;
  doctorEmployeeId: string;
  dateTime: Date;
}> {
  readonly eventName = 'healthcare.appointment.booked';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      appointmentId: string;
      patientProfileId: string;
      doctorEmployeeId: string;
      dateTime: Date;
    },
    public readonly tenantId?: string,
  ) {}
}

export class PatientAdmittedEvent implements DomainEvent<{
  patientProfileId: string;
  roomId: string;
  bedId: string;
}> {
  readonly eventName = 'healthcare.patient.admitted';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      patientProfileId: string;
      roomId: string;
      bedId: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class EmrUpdatedEvent implements DomainEvent<{
  emrId: string;
  appointmentId: string;
  notesSnippet: string;
}> {
  readonly eventName = 'healthcare.emr.updated';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      emrId: string;
      appointmentId: string;
      notesSnippet: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class LabOrderCompletedEvent implements DomainEvent<{
  labOrderId: string;
  appointmentId: string;
  testName: string;
}> {
  readonly eventName = 'healthcare.lab.completed';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      labOrderId: string;
      appointmentId: string;
      testName: string;
    },
    public readonly tenantId?: string,
  ) {}
}

export class ClaimSubmittedEvent implements DomainEvent<{
  claimId: string;
  appointmentId: string;
  policyNumber: string;
  providerName: string;
}> {
  readonly eventName = 'healthcare.insurance.claim.submitted';
  readonly occurredOn = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly payload: {
      claimId: string;
      appointmentId: string;
      policyNumber: string;
      providerName: string;
    },
    public readonly tenantId?: string,
  ) {}
}
