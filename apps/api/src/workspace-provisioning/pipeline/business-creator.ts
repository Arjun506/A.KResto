import { Injectable } from '@nestjs/common';
import { INDUSTRY_FEATURE_MAP } from '../../business/business.constants';

@Injectable()
export class BusinessCreator {
  async createBusiness(
    tx: any,
    input: {
      tenantId: string;
      industry: string;
      workspaceName: string;
    },
  ) {
    const { tenantId } = input;

    // Reuse existing BusinessService logic by directly using the same constants
    // that BusinessService currently uses.
    // (In later sprint, these will be moved into a shared domain layer.)
    //
    // This step registers enabled modules/features at tenant level.

    // NOTE: We intentionally keep this step minimal and aligned with
    // BusinessService.createWorkspace behavior (tenant_features only).
    const business = await tx.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true },
    });

    if (!business) {
      throw new Error('Workspace not found during Business creation');
    }

    // BusinessService currently provisions features based on industry.
    // That mapping lives in business.constants.ts; import it here to avoid duplication.
    // (This import is static so TS module resolution works in the pipeline folder.)
    const features = INDUSTRY_FEATURE_MAP[input.industry] ?? [
      'crm',
      'analytics',
    ];

    for (const featureKey of features) {
      await tx.tenant_features.create({
        data: { tenantId, featureKey, isEnabled: true },
      });
    }

    return { features };
  }
}
