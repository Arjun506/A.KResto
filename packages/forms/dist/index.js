"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormsBuilderEngine = void 0;
class FormsBuilderEngine {
    validateField(value, rules) {
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
    validateForm(data, schema) {
        const errors = {};
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
exports.FormsBuilderEngine = FormsBuilderEngine;
