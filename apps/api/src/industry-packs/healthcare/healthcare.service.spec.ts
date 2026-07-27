import { Test, TestingModule } from '@nestjs/testing';
import { HealthcareService } from './healthcare.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';

describe('HealthcareService', () => {
  let service: HealthcareService;
  let prisma: any;
  let eventBus: any;

  beforeEach(async () => {
    prisma = {
      hc_facilities: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      hc_departments: {
        create: jest.fn(),
      },
      hc_rooms: {
        create: jest.fn(),
      },
      hc_beds: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      hc_patient_profiles: {
        create: jest.fn(),
      },
      hc_appointments: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
      hc_emrs: {
        create: jest.fn(),
      },
      hc_prescriptions: {
        create: jest.fn(),
        update: jest.fn(),
      },
      hc_lab_orders: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      hc_insurance_claims: {
        create: jest.fn(),
      },
      payment_transactions: {
        create: jest.fn(),
      },
      crm_loyalty: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    eventBus = {
      publish: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthcareService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<HealthcareService>(HealthcareService);
  });

  it('should book doctor appointments and process inpatient ward admissions', async () => {
    prisma.hc_appointments.create.mockResolvedValue({
      id: 'appt_1',
      tenantId: 't_1',
      patientProfileId: 'pat_1',
      doctorEmployeeId: 'doc_1',
      dateTime: new Date(),
    });
    prisma.hc_beds.findUnique.mockResolvedValue({
      id: 'bed_1',
      status: 'AVAILABLE',
    });
    prisma.hc_beds.update.mockResolvedValue({
      id: 'bed_1',
      status: 'OCCUPIED',
    });

    const appt = await service.bookAppointment('t_1', {
      patientProfileId: 'pat_1',
      doctorEmployeeId: 'doc_1',
      dateTime: new Date().toISOString(),
    });
    const admit = await service.admitPatient('pat_1', 'room_1', 'bed_1');

    expect(prisma.hc_appointments.create).toHaveBeenCalled();
    expect(appt.id).toEqual('appt_1');
    expect(admit.status).toEqual('ADMITTED');
    expect(eventBus.publish).toHaveBeenCalled();
  });

  it('should submit insurance claims and log analytics aggregates', async () => {
    prisma.hc_appointments.findUnique.mockResolvedValue({
      id: 'appt_1',
      tenantId: 't_1',
      patient: { customerId: 'cust_1' },
    });
    prisma.hc_insurance_claims.create.mockResolvedValue({ id: 'claim_1' });
    prisma.payment_transactions.create.mockResolvedValue({ id: 'pay_1' });
    prisma.hc_appointments.findMany.mockResolvedValue([{ id: 'appt_1' }]);
    prisma.hc_facilities.findMany.mockResolvedValue([{ id: 'fac_1' }]);

    const claim = await service.submitInsuranceClaim(
      'appt_1',
      'POL-1002',
      'Allianz',
      120.0,
    );
    const analytics = await service.fetchHealthcareAnalytics('t_1');

    expect(prisma.hc_insurance_claims.create).toHaveBeenCalled();
    expect(claim.id).toEqual('claim_1');
    expect(analytics.facilitiesCount).toEqual(1);
    expect(analytics.appointmentsCount).toEqual(1);
  });
});
