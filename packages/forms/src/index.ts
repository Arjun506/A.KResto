export interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

export interface FormFieldMetadata {
  name: string;
  label: string;
  type: 'text' | 'password' | 'email' | 'number' | 'checkbox' | 'select' | 'textarea';
  defaultValue?: any;
  options?: Array<{ label: string; value: any }>;
  validation?: FieldValidation;
}

export interface FormSchema {
  fields: FormFieldMetadata[];
}

export class FormsBuilderEngine {
  validateField(value: any, rules: FieldValidation): string | null {
    if (rules.required && (value === undefined || value === null || value === '')) {
      return rules.message || 'This field is required';
    }
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        return rules.message || `Minimum value is ${rules.min}`;
      }
      if (rules.max !== undefined && value > rules.max) {
        return rules.message || `Maximum value is ${rules.max}`;
      }
    }
    if (typeof value === 'string') {
      if (rules.min !== undefined && value.length < rules.min) {
        return rules.message || `Minimum length is ${rules.min} characters`;
      }
      if (rules.max !== undefined && value.length > rules.max) {
        return rules.message || `Maximum length is ${rules.max} characters`;
      }
      if (rules.pattern) {
        const regex = new RegExp(rules.pattern);
        if (!regex.test(value)) {
          return rules.message || 'Invalid format';
        }
      }
    }
    return null;
  }

  validateForm(data: Record<string, any>, schema: FormSchema): Record<string, string> {
    const errors: Record<string, string> = {};
    for (const field of schema.fields) {
      if (field.validation) {
        const err = this.validateField(data[field.name], field.validation);
        if (err) {
          errors[field.name] = err;
        }
      }
    }
    return errors;
  }
}
