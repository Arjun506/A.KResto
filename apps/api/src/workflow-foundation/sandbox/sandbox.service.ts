import { Injectable } from '@nestjs/common';

@Injectable()
export class SandboxService {
  async evaluateExpression(
    expression: string,
    context: Record<string, any>,
  ): Promise<any> {
    // Regex parsing to evaluate safe expressions (e.g. amount > 5000) without arbitrary code execution
    const matches = expression.match(/^\s*(\w+)\s*([><=!]+)\s*([\d\w'"]+)\s*$/);
    if (!matches) {
      // Fallback for simple truthy validation
      return !!context[expression.trim()];
    }

    const [, field, operator, valueStr] = matches;
    const fieldValue = context[field];
    const rawValue = valueStr.replace(/['"]/g, '');
    const numValue = parseFloat(rawValue);
    const targetValue = isNaN(numValue) ? rawValue : numValue;

    switch (operator) {
      case '>':
        return fieldValue > targetValue;
      case '<':
        return fieldValue < targetValue;
      case '==':
        return fieldValue == targetValue;
      case '!=':
        return fieldValue != targetValue;
      case '>=':
        return fieldValue >= targetValue;
      case '<=':
        return fieldValue <= targetValue;
      default:
        return false;
    }
  }
}
