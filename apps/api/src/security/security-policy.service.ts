import { Injectable } from '@nestjs/common';

export enum SensitiveClassification {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  CONFIDENTIAL = 'CONFIDENTIAL',
  SENSITIVE = 'SENSITIVE',
  HIGHLY_SENSITIVE = 'HIGHLY_SENSITIVE',
}

@Injectable()
export class SecurityPolicyService {
  requiresEncryption(classification: SensitiveClassification): boolean {
    return (
      classification === SensitiveClassification.SENSITIVE ||
      classification === SensitiveClassification.HIGHLY_SENSITIVE
    );
  }

  requiresStepUp(action: string): boolean {
    const sensitiveActions = [
      'key.rotate',
      'export.bulk',
      'payment.settings.update',
      'healthcare.emr.decrypt',
    ];
    return sensitiveActions.includes(action);
  }

  maskValue(
    value: string,
    classification: SensitiveClassification,
    role: string,
  ): string {
    if (role === 'ADMIN' || role === 'PLATFORM_ADMIN') {
      return value;
    }

    if (classification === SensitiveClassification.HIGHLY_SENSITIVE) {
      if (value.length > 4) {
        return '*'.repeat(value.length - 4) + value.slice(-4);
      }
      return '****';
    }

    return value;
  }
}
