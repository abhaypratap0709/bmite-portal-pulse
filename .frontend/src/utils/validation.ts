// Comprehensive form validation utilities

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
  message?: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export class FormValidator {
  private rules: Record<string, ValidationRule[]> = {};

  addRule(field: string, rule: ValidationRule) {
    if (!this.rules[field]) {
      this.rules[field] = [];
    }
    this.rules[field].push(rule);
  }

  validate(field: string, value: any): string | null {
    const fieldRules = this.rules[field] || [];
    
    for (const rule of fieldRules) {
      const error = this.validateRule(value, rule);
      if (error) {
        return error;
      }
    }
    
    return null;
  }

  validateAll(data: Record<string, any>): ValidationErrors {
    const errors: ValidationErrors = {};
    
    for (const field in this.rules) {
      const error = this.validate(field, data[field]);
      if (error) {
        errors[field] = error;
      }
    }
    
    return errors;
  }

  private validateRule(value: any, rule: ValidationRule): string | null {
    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return rule.message || `${this.getFieldName(rule)} is required`;
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return null;
    }

    // Min length validation
    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      return rule.message || `${this.getFieldName(rule)} must be at least ${rule.minLength} characters`;
    }

    // Max length validation
    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      return rule.message || `${this.getFieldName(rule)} must be no more than ${rule.maxLength} characters`;
    }

    // Pattern validation
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return rule.message || `${this.getFieldName(rule)} format is invalid`;
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }

  private getFieldName(rule: ValidationRule): string {
    return rule.message?.split(' ')[0] || 'This field';
  }
}

// Common validation patterns
export const ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[0-9]{10}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  name: /^[a-zA-Z\s]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  url: /^https?:\/\/.+/,
  date: /^\d{4}-\d{2}-\d{2}$/,
};

// Predefined validators for common fields
export const createEmailValidator = (required = true) => {
  const validator = new FormValidator();
  validator.addRule('email', {
    required,
    pattern: ValidationPatterns.email,
    message: 'Please enter a valid email address',
  });
  return validator;
};

export const createPasswordValidator = (required = true) => {
  const validator = new FormValidator();
  validator.addRule('password', {
    required,
    minLength: 8,
    pattern: ValidationPatterns.password,
    message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  });
  return validator;
};

export const createNameValidator = (fieldName: string, required = true) => {
  const validator = new FormValidator();
  validator.addRule(fieldName, {
    required,
    minLength: 2,
    maxLength: 50,
    pattern: ValidationPatterns.name,
    message: `${fieldName} must be 2-50 characters and contain only letters`,
  });
  return validator;
};

export const createPhoneValidator = (required = true) => {
  const validator = new FormValidator();
  validator.addRule('phone', {
    required,
    pattern: ValidationPatterns.phone,
    message: 'Please enter a valid 10-digit phone number',
  });
  return validator;
};

// Form validation hooks
export const useFormValidation = (validator: FormValidator) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: string, value: any) => {
    const error = validator.validate(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error || '',
    }));
    return error;
  };

  const validateAll = (data: Record<string, any>) => {
    const newErrors = validator.validateAll(data);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const markFieldTouched = (field: string) => {
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }));
  };

  const clearErrors = () => {
    setErrors({});
    setTouched({});
  };

  const hasErrors = Object.values(errors).some(error => error !== '');
  const isFieldTouched = (field: string) => touched[field] || false;
  const getFieldError = (field: string) => errors[field] || '';

  return {
    errors,
    touched,
    validateField,
    validateAll,
    markFieldTouched,
    clearErrors,
    hasErrors,
    isFieldTouched,
    getFieldError,
  };
};

// Real-time validation hook
export const useRealTimeValidation = (validator: FormValidator, debounceMs = 300) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({});

  const validateField = useCallback((field: string, value: any) => {
    // Clear existing timer
    if (debounceTimers.current[field]) {
      clearTimeout(debounceTimers.current[field]);
    }

    // Set new timer
    debounceTimers.current[field] = setTimeout(() => {
      const error = validator.validate(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error || '',
      }));
    }, debounceMs);
  }, [validator, debounceMs]);

  const markFieldTouched = (field: string) => {
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }));
  };

  const clearErrors = () => {
    setErrors({});
    setTouched({});
    // Clear all timers
    Object.values(debounceTimers.current).forEach(timer => clearTimeout(timer));
    debounceTimers.current = {};
  };

  const getFieldError = (field: string) => {
    if (!touched[field]) return '';
    return errors[field] || '';
  };

  return {
    errors,
    touched,
    validateField,
    markFieldTouched,
    clearErrors,
    getFieldError,
  };
};

// Import React hooks
import { useState, useRef, useCallback } from 'react';
