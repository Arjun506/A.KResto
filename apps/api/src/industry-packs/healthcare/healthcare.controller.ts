import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HealthcareService } from './healthcare.service';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CreateEmrDto } from './dto/create-emr.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Healthcare Industry Pack — Operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('healthcare')
export class HealthcareController {
  constructor(private readonly service: HealthcareService) {}

  @Post('facilities')
  @ApiOperation({ summary: 'Register a hospital/clinic facility branch' })
  async createFacility(
    @Body() body: CreateFacilityDto & { tenantId?: string },
  ) {
    return this.service.createFacility(body.tenantId || 'GLOBAL', body);
  }

  @Post('facilities/:id/departments')
  @ApiOperation({ summary: 'Configure clinical departments' })
  async createDept(@Param('id') id: string, @Body() body: { name: string }) {
    return this.service.createDepartment(id, body.name);
  }

  @Post('facilities/:id/rooms')
  @ApiOperation({ summary: 'Configure wards/rooms' })
  async createRoom(
    @Param('id') id: string,
    @Body() body: { departmentId: string; roomCode: string; type?: string },
  ) {
    return this.service.createRoom(
      id,
      body.departmentId,
      body.roomCode,
      body.type,
    );
  }

  @Post('rooms/:id/beds')
  @ApiOperation({ summary: 'Configure physical beds' })
  async createBed(@Param('id') id: string, @Body() body: { bedCode: string }) {
    return this.service.createBed(id, body.bedCode);
  }

  @Post('patients')
  @ApiOperation({ summary: 'Register patients demographic stay profiles' })
  async createPatient(@Body() body: CreatePatientDto & { tenantId?: string }) {
    return this.service.createPatientProfile(body.tenantId || 'GLOBAL', body);
  }

  @Post('appointments')
  @ApiOperation({ summary: 'Request slots and book doctors' })
  async bookAppointment(
    @Body() body: CreateAppointmentDto & { tenantId?: string },
  ) {
    return this.service.bookAppointment(body.tenantId || 'GLOBAL', body);
  }

  @Patch('appointments/:id/status')
  @ApiOperation({ summary: 'Transition doctor queue and status checks' })
  async transitionAppt(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.service.transitionAppointment(id, body.status);
  }

  @Post('patients/:id/admit')
  @ApiOperation({ summary: 'Admit inpatient to a ward room and bed' })
  async admit(
    @Param('id') id: string,
    @Body() body: { roomId: string; bedId: string },
  ) {
    return this.service.admitPatient(id, body.roomId, body.bedId);
  }

  @Post('emr')
  @ApiOperation({ summary: 'Save EMR clinical consult records' })
  async saveEmr(@Body() body: CreateEmrDto) {
    return this.service.saveEmrRecord(body);
  }

  @Post('emr/:id/prescriptions')
  @ApiOperation({ summary: 'Add prescriptions' })
  async addRx(
    @Param('id') id: string,
    @Body() body: { medications: Array<{ name: string; dosage: string }> },
  ) {
    return this.service.addPrescription(id, body.medications);
  }

  @Patch('prescriptions/:id/dispense')
  @ApiOperation({ summary: 'Dispense pharmacy medicines' })
  async dispenseRx(@Param('id') id: string) {
    return this.service.dispensePrescription(id);
  }

  @Post('lab/orders')
  @ApiOperation({ summary: 'Request laboratory tests' })
  async createLabOrder(
    @Body() body: { appointmentId: string; testName: string },
  ) {
    return this.service.createLabOrder(body.appointmentId, body.testName);
  }

  @Patch('lab/orders/:id/complete')
  @ApiOperation({ summary: 'Upload laboratory results report' })
  async completeLabOrder(
    @Param('id') id: string,
    @Body() body: { resultData: any },
  ) {
    return this.service.completeLabOrder(id, body.resultData);
  }

  @Post('insurance/claims')
  @ApiOperation({ summary: 'Submit copay reimbursement claims' })
  async submitClaim(
    @Body()
    body: {
      appointmentId: string;
      policyNumber: string;
      providerName: string;
      amount: number;
    },
  ) {
    return this.service.submitInsuranceClaim(
      body.appointmentId,
      body.policyNumber,
      body.providerName,
      body.amount,
    );
  }

  @Get('analytics')
  @ApiOperation({
    summary: 'Retrieve clinic patient flow and bed occupancy analytics metrics',
  })
  async getAnalytics(@Query('tenantId') tenantId: string) {
    return this.service.fetchHealthcareAnalytics(tenantId || 'GLOBAL');
  }

  @Post('patients/:id/loyalty')
  @ApiOperation({ summary: 'Award loyalty points for patient copay checks' })
  async awardPoints(
    @Param('id') id: string,
    @Body() body: { amountSpent: number },
  ) {
    return this.service.creditPatientLoyalty(id, body.amountSpent);
  }
}
