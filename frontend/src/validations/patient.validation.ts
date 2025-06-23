import { z } from 'zod';

// Zod schema for patient form validation
export const patientFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters long')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  middleName: z
    .string()
    .max(50, 'Middle name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]*$/, 'Middle name can only contain letters, spaces, hyphens, and apostrophes')
    .optional(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters long')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  dob: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((date) => {
      const dobDate = new Date(date);
      const today = new Date();
      const minDate = new Date('1900-01-01');
      
      if (isNaN(dobDate.getTime())) return false;
      if (dobDate > today) return false;
      if (dobDate < minDate) return false;
      
      const age = today.getFullYear() - dobDate.getFullYear();
      return age <= 120;
    }, 'Please enter a valid date of birth between 1900 and today'),
  status: z
    .string()
    .min(1, 'Status is required')
    .refine((value) => {
      const validStatuses = ['Inquiry', 'Onboarding', 'Active', 'Churned'];
      return validStatuses.includes(value);
    }, 'Please enter a valid status: Inquiry, Onboarding, Active, or Churned'),
  street: z
    .string()
    .min(1, 'Street address is required')
    .min(5, 'Street address must be at least 5 characters long')
    .max(200, 'Street address must be less than 200 characters'),
  city: z
    .string()
    .min(1, 'City is required')
    .min(2, 'City must be at least 2 characters long')
    .max(100, 'City must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'City can only contain letters, spaces, hyphens, and apostrophes'),
  state: z
    .string()
    .min(1, 'State is required')
    .min(2, 'State must be at least 2 characters long')
    .max(50, 'State must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'State can only contain letters and spaces'),
  zipCode: z
    .string()
    .min(1, 'Zip code is required')
    .regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)')
});

export type PatientFormData = z.infer<typeof patientFormSchema>;

export interface ValidationErrors {
  [key: string]: string;
}

export class PatientValidator {
  /**
   * Validates patient form data using Zod schema and returns validation errors
   */
  static validateForm(formData: PatientFormData): ValidationErrors {
    const result = patientFormSchema.safeParse(formData);
    
    if (result.success) {
      return {};
    }
    
    const errors: ValidationErrors = {};
    result.error.errors.forEach((error) => {
      const field = error.path[0] as string;
      errors[field] = error.message;
    });
    
    return errors;
  }

  /**
   * Validates a single field using Zod schema and returns error message
   */
  static validateField(fieldName: keyof PatientFormData, value: string): string | null {
    const formData: PatientFormData = {
      firstName: '',
      middleName: '',
      lastName: '',
      dob: '',
      status: 'Inquiry' as const,
      city: '',
      state: '',
      zipCode: '',
      street: ''
    };

    // Set the field value
    (formData as any)[fieldName] = value;

    // Validate the specific field
    const errors = this.validateForm(formData);
    return errors[fieldName] || null;
  }

  /**
   * Checks if the form is valid using Zod schema
   */
  static isFormValid(formData: PatientFormData): boolean {
    const result = patientFormSchema.safeParse(formData);
    return result.success;
  }

  /**
   * Gets field-specific validation rules
   */
  static getFieldValidationRules(fieldName: keyof PatientFormData) {
    const rules = {
      firstName: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s'-]+$/,
        patternMessage: 'Can only contain letters, spaces, hyphens, and apostrophes'
      },
      lastName: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s'-]+$/,
        patternMessage: 'Can only contain letters, spaces, hyphens, and apostrophes'
      },
      middleName: {
        required: false,
        maxLength: 50,
        pattern: /^[a-zA-Z\s'-]+$/,
        patternMessage: 'Can only contain letters, spaces, hyphens, and apostrophes'
      },
      dob: {
        required: true,
        minDate: '1900-01-01',
        maxDate: new Date().toISOString().split('T')[0]
      },
      status: {
        required: true,
        options: ['Inquiry', 'Onboarding', 'Active', 'Churned']
      },
      city: {
        required: true,
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-Z\s'-]+$/,
        patternMessage: 'Can only contain letters, spaces, hyphens, and apostrophes'
      },
      state: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s]+$/,
        patternMessage: 'Can only contain letters and spaces'
      },
      zipCode: {
        required: true,
        pattern: /^\d{5}(-\d{4})?$/,
        patternMessage: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)'
      },
      street: {
        required: true,
        minLength: 5,
        maxLength: 200,
        pattern: /^[a-zA-Z\s'-]+$/,
        patternMessage: 'Can only contain letters, spaces, hyphens, and apostrophes'
      }
    };

    return rules[fieldName];
  }

  /**
   * Sanitizes form data by trimming whitespace and normalizing
   */
  static sanitizeFormData(formData: PatientFormData): PatientFormData {
    return {
      firstName: formData.firstName.trim(),
      middleName: formData.middleName?.trim() || '',
      lastName: formData.lastName.trim(),
      dob: formData.dob,
      status: formData.status,
      city: formData.city.trim(),
      state: formData.state.trim(),
      zipCode: formData.zipCode.trim(),
      street: formData.street.trim()
    };
  }
}

/**
 * Hook for form validation
 */
export const usePatientValidation = () => {
  const validateForm = (formData: PatientFormData): ValidationErrors => {
    return PatientValidator.validateForm(formData);
  };

  const validateField = (fieldName: keyof PatientFormData, value: string): string | null => {
    return PatientValidator.validateField(fieldName, value);
  };

  const isFormValid = (formData: PatientFormData): boolean => {
    return PatientValidator.isFormValid(formData);
  };

  const sanitizeFormData = (formData: PatientFormData): PatientFormData => {
    return PatientValidator.sanitizeFormData(formData);
  };

  return {
    validateForm,
    validateField,
    isFormValid,
    sanitizeFormData
  };
};
