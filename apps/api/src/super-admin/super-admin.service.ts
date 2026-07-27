import { Injectable, BadRequestException } from '@nestjs/common';

export type PilotStage =
  | 'DRAFT'
  | 'INVITED'
  | 'REGISTRATION_STARTED'
  | 'TENANT_PROVISIONED'
  | 'SETUP_IN_PROGRESS'
  | 'PILOT_ACTIVE'
  | 'PILOT_BLOCKED'
  | 'PILOT_COMPLETED'
  | 'CANCELLED';

export interface Pilot {
  id: string;
  name: string;
  industry: 'RESTAURANT' | 'RETAIL';
  stage: PilotStage;
  setupProgress: number; // 0 to 100
  hasP0P1Defects: boolean;
  hasOutlet: boolean;
  hasTax: boolean;
  hasMenuItems: boolean;
  hasPos: boolean;
}

export interface Invitation {
  token: string;
  pilotId: string;
  expiresAt: Date;
  isUsed: boolean;
  isRevoked: boolean;
}

@Injectable()
export class SuperAdminService {
  private readonly pilotsStore = new Map<string, Pilot>();
  private readonly invitationsStore = new Map<string, Invitation>();
  private readonly evidenceLogs: { timestamp: Date; event: string; pilotId: string }[] = [];

  // Create new pilot record
  createPilot(pilot: Pilot): Pilot {
    this.pilotsStore.set(pilot.id, pilot);
    this.logEvidence(pilot.id, `Pilot record created in stage ${pilot.stage}`);
    return pilot;
  }

  getPilot(id: string): Pilot | undefined {
    return this.pilotsStore.get(id);
  }

  // State transitions verification
  transitionPilotStage(id: string, target: PilotStage): Pilot {
    const pilot = this.pilotsStore.get(id);
    if (!pilot) {
      throw new BadRequestException(`Pilot ${id} not found`);
    }

    const current = pilot.stage;
    let allowed = false;

    if (current === 'DRAFT' && target === 'INVITED') allowed = true;
    if (current === 'INVITED' && target === 'REGISTRATION_STARTED') allowed = true;
    if (current === 'REGISTRATION_STARTED' && target === 'TENANT_PROVISIONED') allowed = true;
    if (current === 'TENANT_PROVISIONED' && target === 'SETUP_IN_PROGRESS') allowed = true;
    if (current === 'SETUP_IN_PROGRESS' && target === 'PILOT_ACTIVE') {
      const evaluation = this.evaluateReadiness(pilot);
      if (evaluation.status === 'READY_FOR_FIRST_ORDER') {
        allowed = true;
      } else {
        throw new BadRequestException(`Readiness gate failed: ${evaluation.blockers.join(', ')}`);
      }
    }
    if (current === 'PILOT_ACTIVE' && target === 'PILOT_COMPLETED') allowed = true;
    if (target === 'CANCELLED' || target === 'PILOT_BLOCKED') allowed = true;

    if (!allowed) {
      throw new BadRequestException(`Invalid transition from ${current} to ${target}`);
    }

    pilot.stage = target;
    this.logEvidence(id, `Transitioned to stage ${target}`);
    return pilot;
  }

  // Invitation generator
  createInvitation(pilotId: string, token: string, ttlMs = 86400000): Invitation {
    const expiresAt = new Date(Date.now() + ttlMs);
    const invitation: Invitation = {
      token,
      pilotId,
      expiresAt,
      isUsed: false,
      isRevoked: false,
    };
    this.invitationsStore.set(token, invitation);
    this.logEvidence(pilotId, `Invitation generated for token: ${token.substring(0, 5)}...`);
    return invitation;
  }

  // Accept invitation check
  acceptInvitation(token: string): string {
    const invitation = this.invitationsStore.get(token);
    if (!invitation) {
      throw new BadRequestException('Invalid invitation token');
    }
    if (invitation.isUsed) {
      throw new BadRequestException('Invitation has already been used');
    }
    if (invitation.isRevoked) {
      throw new BadRequestException('Invitation has been revoked');
    }
    if (invitation.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Invitation token has expired');
    }

    invitation.isUsed = true;
    this.logEvidence(invitation.pilotId, `Invitation token accepted`);
    return invitation.pilotId;
  }

  // Revoke invitation
  revokeInvitation(token: string) {
    const invitation = this.invitationsStore.get(token);
    if (invitation) {
      invitation.isRevoked = true;
      this.logEvidence(invitation.pilotId, `Invitation token revoked`);
    }
  }

  // Readiness evaluator
  evaluateReadiness(pilot: Pilot): { status: string; blockers: string[] } {
    const blockers: string[] = [];

    if (pilot.stage === 'DRAFT' || pilot.stage === 'INVITED') {
      blockers.push('Workspace setup not completed');
    }
    if (!pilot.hasOutlet) {
      blockers.push('Outlet settings missing');
    }
    if (!pilot.hasTax) {
      blockers.push('Taxes not configured');
    }
    if (!pilot.hasMenuItems) {
      blockers.push('Sellable menu items missing');
    }
    if (!pilot.hasPos) {
      blockers.push('POS terminal register missing');
    }
    if (pilot.hasP0P1Defects) {
      blockers.push('Open P0/P1 defects identified');
    }

    return {
      status: blockers.length === 0 ? 'READY_FOR_FIRST_ORDER' : 'BLOCKERS_IDENTIFIED',
      blockers,
    };
  }

  private logEvidence(pilotId: string, event: string) {
    this.evidenceLogs.push({ timestamp: new Date(), event, pilotId });
  }

  getEvidenceLogs(pilotId: string) {
    return this.evidenceLogs.filter(e => e.pilotId === pilotId);
  }
}
