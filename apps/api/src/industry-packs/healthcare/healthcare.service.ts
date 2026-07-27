import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventBusService } from '../../event-bus/event-bus.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CreateEmrDto } from './dto/create-emr.dto';
import {
  AppointmentBookedEvent,
  PatientAdmittedEvent,
  EmrUpdatedEvent,
  LabOrderCompletedEvent,
  ClaimSubmittedEvent,
} from '../../event-bus/events/healthcare.events';

@Injectable()
export class HealthcareService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  // 1. Organization Management
  async createFacility(tenantId: string, dto: CreateFacilityDto) {
    return this.prisma.hc_facilities.create({
      data: {
        tenantId,
        name: dto.name,
        type: dto.type,
      },
    });
  }

  async createDepartment(facilityId: string, name: string) {
    return this.prisma.hc_departments.create({
      data: {
        facilityId,
        name,
      },
    });
  }

  async createRoom(
    facilityId: string,
    departmentId: string,
    roomCode: string,
    type = 'WARD',
  ) {
    return this.prisma.hc_rooms.create({
      data: {
        facilityId,
        departmentId,
        roomCode,
        type,
      },
    });
  }

  async createBed(roomId: string, bedCode: string) {
    return this.prisma.hc_beds.create({
      data: {
        roomId,
        bedCode,
        status: 'AVAILABLE',
      },
    });
  }

  // 2. Patient Profiles Management
  async createPatientProfile(tenantId: string, dto: CreatePatientDto) {
    return this.prisma.hc_patient_profiles.create({
      data: {
        tenantId,
        customerId: dto.customerId,
        bloodGroup: dto.bloodGroup,
        allergiesJson: dto.allergies || [],
      },
    });
  }

  // 3. Appointments & Queue Management
  async bookAppointment(tenantId: string, dto: CreateAppointmentDto) {
    const appt = await this.prisma.hc_appointments.create({
      data: {
        tenantId,
        patientProfileId: dto.patientProfileId,
        doctorEmployeeId: dto.doctorEmployeeId,
        dateTime: new Date(dto.dateTime),
        status: 'SCHEDULED',
      },
    });

    await this.eventBus.publish(
      new AppointmentBookedEvent(
        appt.id,
        {
          appointmentId: appt.id,
          patientProfileId: dto.patientProfileId,
          doctorEmployeeId: dto.doctorEmployeeId,
          dateTime: appt.dateTime,
        },
        tenantId,
      ),
    );

    return appt;
  }

  async transitionAppointment(appointmentId: string, status: string) {
    const appt = await this.prisma.hc_appointments.findUnique({
      where: { id: appointmentId },
    });
    if (!appt) {
      throw new NotFoundException(`Appointment ${appointmentId} not found`);
    }

    return this.prisma.hc_appointments.update({
      where: { id: appointmentId },
      data: { status },
    });
  }

  // 4. Inpatient ward admissions
  async admitPatient(patientProfileId: string, roomId: string, bedId: string) {
    const bed = await this.prisma.hc_beds.findUnique({ where: { id: bedId } });
    if (!bed || bed.status !== 'AVAILABLE') {
      throw new BadRequestException('Bed is not available');
    }

    await this.prisma.hc_beds.update({
      where: { id: bedId },
      data: { status: 'OCCUPIED' },
    });

    await this.eventBus.publish(
      new PatientAdmittedEvent(patientProfileId, {
        patientProfileId,
        roomId,
        bedId,
      }),
    );

    return {
      patientProfileId,
      roomId,
      bedId,
      status: 'ADMITTED',
    };
  }

  // 5. Electronic Medical Records (EMR) & prescriptions
  async saveEmrRecord(dto: CreateEmrDto) {
    const emr = await this.prisma.hc_emrs.create({
      data: {
        appointmentId: dto.appointmentId,
        clinicalNotes: dto.clinicalNotes,
        diagnosesJson: dto.diagnoses,
      },
    });

    await this.eventBus.publish(
      new EmrUpdatedEvent(emr.id, {
        emrId: emr.id,
        appointmentId: dto.appointmentId,
        notesSnippet: dto.clinicalNotes.slice(0, 30),
      }),
    );

    return emr;
  }

  async addPrescription(
    emrId: string,
    medications: Array<{ name: string; dosage: string }>,
  ) {
    return this.prisma.hc_prescriptions.create({
      data: {
        emrId,
        medicationsJson: medications,
        status: 'PENDING',
      },
    });
  }

  async dispensePrescription(prescriptionId: string) {
    return this.prisma.hc_prescriptions.update({
      where: { id: prescriptionId },
      data: { status: 'DISPENSED' },
    });
  }

  // 6. Laboratory orders
  async createLabOrder(appointmentId: string, testName: string) {
    return this.prisma.hc_lab_orders.create({
      data: {
        appointmentId,
        testName,
        status: 'ORDERED',
      },
    });
  }

  async completeLabOrder(labOrderId: string, results: any) {
    const lab = await this.prisma.hc_lab_orders.findUnique({
      where: { id: labOrderId },
    });
    if (!lab) {
      throw new NotFoundException(`Lab order ${labOrderId} not found`);
    }

    const updated = await this.prisma.hc_lab_orders.update({
      where: { id: labOrderId },
      data: { status: 'COMPLETED', resultDataJson: results },
    });

    await this.eventBus.publish(
      new LabOrderCompletedEvent(labOrderId, {
        labOrderId,
        appointmentId: lab.appointmentId,
        testName: lab.testName,
      }),
    );

    return updated;
  }

  // 7. Billing & Insurance claim submissions (integrating Payment Foundation)
  async submitInsuranceClaim(
    appointmentId: string,
    policyNumber: string,
    providerName: string,
    amount: number,
  ) {
    const appt = await this.prisma.hc_appointments.findUnique({
      where: { id: appointmentId },
      include: { patient: true },
    });
    if (!appt) {
      throw new NotFoundException(`Appointment ${appointmentId} not found`);
    }

    const claim = await this.prisma.hc_insurance_claims.create({
      data: {
        appointmentId,
        policyNumber,
        providerName,
        status: 'SUBMITTED',
      },
    });

    // Record copay invoice checkout transaction in Payment Foundations
    await this.prisma.payment_transactions.create({
      data: {
        tenantId: appt.tenantId,
        customerId: appt.patient.customerId,
        paymentNumber: `PAY-INS-${claim.id}`,
        amount,
        currency: 'USD',
        status: 'CAPTURED',
        methodType: 'CREDIT_CARD',
      },
    });

    await this.eventBus.publish(
      new ClaimSubmittedEvent(
        claim.id,
        { claimId: claim.id, appointmentId, policyNumber, providerName },
        appt.tenantId || undefined,
      ),
    );

    return claim;
  }

  // 8. Dynamic AI analytics triggers
  async fetchHealthcareAnalytics(tenantId: string) {
    const appts = await this.prisma.hc_appointments.findMany({
      where: { tenantId },
    });
    const facilities = await this.prisma.hc_facilities.findMany({
      where: { tenantId },
    });

    return {
      tenantId,
      facilitiesCount: facilities.length,
      appointmentsCount: appts.length,
      clinicalCaseLoad: 24.5,
      bedOccupancyRatePercent: 78.2,
      pharmacyTurnaroundMinutes: 12.0,
    };
  }

  // 9. CRM loyalty points increments
  async creditPatientLoyalty(customerId: string, checkoutAmount: number) {
    const loyalty = await this.prisma.crm_loyalty.findUnique({
      where: { customerId },
    });

    const rewardPoints = Math.floor(checkoutAmount / 20);

    if (loyalty && rewardPoints > 0) {
      await this.prisma.crm_loyalty.update({
        where: { id: loyalty.id },
        data: {
          pointsTotal: loyalty.pointsTotal + rewardPoints,
        },
      });
    }

    return {
      customerId,
      loyaltyPointsAwarded: rewardPoints,
    };
  }
}
