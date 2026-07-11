import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';

/**
 * Initialize Sentry error monitoring
 * Captures all errors, exceptions, and performance metrics
 */
@Injectable()
export class SentryService {
  constructor(private configService: ConfigService) {
    this.initSentry();
  }

  private initSentry(): void {
    const sentryDsn = this.configService.get<string>('SENTRY_DSN');
    const nodeEnv = this.configService.get<string>('NODE_ENV');

    if (!sentryDsn) {
      console.warn('Sentry DSN not configured - error tracking disabled');
      return;
    }

    Sentry.init({
      dsn: sentryDsn,
      environment: nodeEnv,
      tracesSampleRate: nodeEnv === 'production' ? 0.1 : 1.0,
      profilesSampleRate: nodeEnv === 'production' ? 0.1 : 1.0,
      ignoreErrors: [
        // Ignore certain error patterns
        'Non-Error promise rejection captured',
      ],
    });

    console.log(`Sentry initialized for ${nodeEnv} environment`);
  }

  /**
   * Capture exception with context
   */
  captureException(error: Error, context: Record<string, unknown> = {}): void {
    Sentry.withScope((scope) => {
      for (const [key, value] of Object.entries(context)) {
        // sentry types expect a Context shape or null; enforce via Record<string, unknown>
        scope.setContext(key, value as Record<string, unknown>);
      }
      Sentry.captureException(error);
    });
  }

  /**
   * Capture message
   */
  captureMessage(
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
  ): void {
    Sentry.captureMessage(message, level);
  }

  /**
   * Set user context for tracking
   */
  setUserContext(userId: string, email?: string, restaurantId?: string): void {
    Sentry.setUser({
      id: userId,
      email,
      username: `restaurant:${restaurantId}`,
    });
  }

  /**
   * Clear user context
   */
  clearUserContext(): void {
    Sentry.setUser(null);
  }
}
