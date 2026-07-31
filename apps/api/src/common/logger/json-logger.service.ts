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

  private formatValue(val: any): any {
    if (val === null || val === undefined) {
      return val;
    }
    if (val instanceof Error) {
      return {
        name: val.name,
        message: this.redact(val.message),
        stack: val.stack ? this.redact(val.stack) : undefined,
      };
    }
    if (typeof val === 'object') {
      if (typeof val.message === 'string' || typeof val.stack === 'string') {
        return {
          name: val.name || 'Error',
          message: this.redact(val.message || String(val)),
          stack: val.stack ? this.redact(val.stack) : undefined,
        };
      }
      try {
        return JSON.parse(this.redact(JSON.stringify(val)));
      } catch {
        return String(val);
      }
    }
    if (typeof val === 'string') {
      return this.redact(val);
    }
    return val;
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
    const formattedMessage = this.formatValue(message);
    const firstParam = optionalParams[0] ? this.formatValue(optionalParams[0]) : undefined;
    const secondParam = optionalParams[1] ? this.formatValue(optionalParams[1]) : undefined;

    const payload = {
      timestamp: new Date().toISOString(),
      level,
      service: 'api-service',
      environment: process.env.NODE_ENV || 'production',
      releaseVersion: process.env.RELEASE_VERSION || '1.0.0',
      message: formattedMessage,
      trace: level === 'ERROR' && firstParam ? firstParam : undefined,
      context: secondParam || (typeof optionalParams[0] === 'string' && !optionalParams[0].includes('\n') ? optionalParams[0] : undefined),
    };

    console.log(JSON.stringify(payload));
  }
}
