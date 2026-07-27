import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StepUpAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // Step-up verification: Check if a recent OTP/MFA verification exists in the last 15 minutes
    const stepUpToken =
      request.headers['x-step-up-token'] || request.query.stepUpToken;
    if (!stepUpToken) {
      throw new ForbiddenException(
        'Step-up verification required: Please complete MFA challenge',
      );
    }

    const verifiedSession = await this.prisma.security_mfa_challenges.findFirst(
      {
        where: {
          userId: user.id,
          challengeId: String(stepUpToken),
          expiresAt: { gte: new Date() },
        },
      },
    );

    if (!verifiedSession || verifiedSession.verifiedAt === null) {
      throw new ForbiddenException(
        'Invalid or expired step-up authentication session',
      );
    }

    return true;
  }
}
