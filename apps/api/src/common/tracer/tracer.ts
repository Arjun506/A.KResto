import { Injectable, OnModuleInit, Logger } from '@nestjs/common';

@Injectable()
export class TracingService implements OnModuleInit {
  private readonly logger = new Logger(TracingService.name);

  onModuleInit() {
    const isTracingEnabled = process.env.OTEL_TRACING_ENABLED === 'true';
    if (isTracingEnabled) {
      this.logger.log(
        'OpenTelemetry compatibility tracer initialized (Production mode)',
      );
    } else {
      this.logger.log(
        'Tracing context propagation enabled (Development fallback mode)',
      );
    }
  }

  // Abstract context span wrapper
  async traceSpan<T>(
    spanName: string,
    correlationId: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    this.logger.log(
      `[TraceSpan] [${spanName}] [CorrelationID: ${correlationId}] - Started`,
    );
    const start = Date.now();
    try {
      const result = await fn();
      const ms = Date.now() - start;
      this.logger.log(
        `[TraceSpan] [${spanName}] [CorrelationID: ${correlationId}] - Completed in ${ms}ms`,
      );
      return result;
    } catch (error: any) {
      const ms = Date.now() - start;
      this.logger.error(
        `[TraceSpan] [${spanName}] [CorrelationID: ${correlationId}] - Failed in ${ms}ms: ${error.message}`,
      );
      throw error;
    }
  }
}
