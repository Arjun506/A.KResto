import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PricingFormulaService {
  evaluateFormula(
    expression: string,
    variables: Record<string, number>,
  ): number {
    try {
      let parsed = expression;
      for (const [key, val] of Object.entries(variables)) {
        parsed = parsed.replace(new RegExp(`\\b${key}\\b`, 'g'), String(val));
      }

      const pattern = new RegExp('^[0-9\\s+\\-*\\/\\.\\(\\)]+$');
      if (!pattern.test(parsed)) {
        throw new BadRequestException(
          'Formula expression contains invalid characters',
        );
      }

      const result = eval(parsed);
      return Number(result) || 0;
    } catch (err) {
      throw new BadRequestException(
        `Formula evaluation failed: ${err.message}`,
      );
    }
  }
}
