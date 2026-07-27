import { Test, TestingModule } from '@nestjs/testing';
import { SuperAdminService, Pilot, PilotStage } from './super-admin.service';
import { BadRequestException } from '@nestjs/common';

describe('SuperAdminService', () => {
  let service: SuperAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuperAdminService],
    }).compile();

    service = module.get<SuperAdminService>(SuperAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Pilot state machine and readiness evaluation', () => {
    it('should create pilot and log creation evidence', () => {
      const pilot: Pilot = {
        id: 'PILOT-R-001',
        name: 'Alpha Resto',
        industry: 'RESTAURANT',
        stage: 'DRAFT',
        setupProgress: 0,
        hasP0P1Defects: false,
        hasOutlet: false,
        hasTax: false,
        hasMenuItems: false,
        hasPos: false,
      };

      const created = service.createPilot(pilot);
      expect(created.id).toBe('PILOT-R-001');
      expect(service.getEvidenceLogs('PILOT-R-001').length).toBe(1);
    });

    it('should transition stages successfully for allowed sequences', () => {
      const pilot: Pilot = {
        id: 'PILOT-R-001',
        name: 'Alpha Resto',
        industry: 'RESTAURANT',
        stage: 'DRAFT',
        setupProgress: 0,
        hasP0P1Defects: false,
        hasOutlet: false,
        hasTax: false,
        hasMenuItems: false,
        hasPos: false,
      };
      service.createPilot(pilot);

      service.transitionPilotStage('PILOT-R-001', 'INVITED');
      expect(service.getPilot('PILOT-R-001')?.stage).toBe('INVITED');
    });

    it('should block transition to PILOT_ACTIVE if readiness evaluator check fails', () => {
      const pilot: Pilot = {
        id: 'PILOT-R-001',
        name: 'Alpha Resto',
        industry: 'RESTAURANT',
        stage: 'SETUP_IN_PROGRESS',
        setupProgress: 50,
        hasP0P1Defects: true,
        hasOutlet: false,
        hasTax: false,
        hasMenuItems: false,
        hasPos: false,
      };
      service.createPilot(pilot);

      expect(() => {
        service.transitionPilotStage('PILOT-R-001', 'PILOT_ACTIVE');
      }).toThrow(BadRequestException);
    });

    it('should permit transition to PILOT_ACTIVE if readiness evaluator check passes', () => {
      const pilot: Pilot = {
        id: 'PILOT-R-001',
        name: 'Alpha Resto',
        industry: 'RESTAURANT',
        stage: 'SETUP_IN_PROGRESS',
        setupProgress: 100,
        hasP0P1Defects: false,
        hasOutlet: true,
        hasTax: true,
        hasMenuItems: true,
        hasPos: true,
      };
      service.createPilot(pilot);

      service.transitionPilotStage('PILOT-R-001', 'PILOT_ACTIVE');
      expect(service.getPilot('PILOT-R-001')?.stage).toBe('PILOT_ACTIVE');
    });
  });

  describe('Invitation System', () => {
    it('should handle creation, accept, reuse prevention, and revocation lifecycle', () => {
      const token = 'token-123';
      service.createInvitation('PILOT-R-001', token);

      const resolvedId = service.acceptInvitation(token);
      expect(resolvedId).toBe('PILOT-R-001');

      // Reuse prevention check
      expect(() => service.acceptInvitation(token)).toThrow(BadRequestException);
    });

    it('should block expired tokens', () => {
      const token = 'expired-token';
      service.createInvitation('PILOT-R-001', token, -1000); // expired 1s ago

      expect(() => service.acceptInvitation(token)).toThrow(BadRequestException);
    });

    it('should block revoked tokens', () => {
      const token = 'revoked-token';
      service.createInvitation('PILOT-R-001', token);
      service.revokeInvitation(token);

      expect(() => service.acceptInvitation(token)).toThrow(BadRequestException);
    });
  });
});
