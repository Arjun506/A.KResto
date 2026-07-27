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
    options?: Array<{
        label: string;
        value: any;
    }>;
    validation?: FieldValidation;
}
export interface FormSchema {
    fields: FormFieldMetadata[];
}
export declare class FormsBuilderEngine {
    validateField(value: any, rules: FieldValidation): string | null;
    validateForm(data: Record<string, any>, schema: FormSchema): Record<string, string>;
}
