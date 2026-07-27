import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  private redact(message: any): any {
    if (typeof message !== 'string') {
      return message;
    }

    // Centralized redaction rules matching passwords, tokens, card credentials, keys
    return message
      .replace(
        /(password|passwd|pass|pwd)["'\s:]+[^,\s"']+/gi,
        '$1":"[REDACTED]"',
      )
      .replace(
        /(token|secret|key|cvv|authorization)["'\s:]+[^,\s"']+/gi,
        '$1":"[REDACTED]"',
      );
  }

  log(message: any, ...optionalParams: any[]) {
    this.print('INFO', message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.print('ERROR', message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.print('WARN', message, optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.print('DEBUG', message, optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.print('VERBOSE', message, optionalParams);
  }

  private print(level: string, message: any, optionalParams: any[]) {
    const payload = {
      timestamp: new Date().toISOString(),
      level,
      service: 'api-service',
      environment: process.env.NODE_ENV || 'production',
      releaseVersion: process.env.RELEASE_VERSION || '1.0.0',
      message: this.redact(message),
      context: optionalParams[0] || undefined,
    };

    console.log(JSON.stringify(payload));
  }
}
