# Validation System

This directory contains reusable validation utilities and components for the patient dashboard application.

## Files

### `patient.validation.ts`
The main validation utility that provides comprehensive validation for patient forms.

**Features:**
- Complete form validation with detailed error messages
- Individual field validation
- Data sanitization
- TypeScript interfaces for type safety
- Custom React hook for easy integration

**Usage:**
```typescript
import { usePatientValidation, PatientValidator } from '../validations/patient.validation';

// Using the hook
const { validateForm, validateField, isFormValid, sanitizeFormData } = usePatientValidation();

// Using the class directly
const errors = PatientValidator.validateForm(formData);
const isValid = PatientValidator.isFormValid(formData);
const sanitizedData = PatientValidator.sanitizeFormData(formData);
```

### `ValidationError.tsx`
A reusable component for displaying validation errors consistently across the application.

**Usage:**
```typescript
import ValidationError from '../validations/ValidationError';

<ValidationError error={errors.fieldName} />
<ValidationError error={errors.fieldName} className="custom-error-class" />
```

### `index.ts`
Export file for easy importing of all validation utilities.

## Validation Rules

### Patient Form Validation Rules

| Field | Required | Min Length | Max Length | Pattern | Notes |
|-------|----------|------------|------------|---------|-------|
| firstName | Yes | 2 | 50 | Letters, spaces, hyphens, apostrophes | |
| lastName | Yes | 2 | 50 | Letters, spaces, hyphens, apostrophes | |
| middleName | No | - | 50 | Letters, spaces, hyphens, apostrophes | Optional |
| dob | Yes | - | - | Valid date | Must be between 1900 and today |
| status | Yes | - | - | Inquiry, Onboarding, Active, Churned | |
| city | Yes | 2 | 100 | Letters, spaces, hyphens, apostrophes | |
| state | Yes | 2 | 50 | Letters and spaces only | |
| zipCode | Yes | - | - | 5 digits or 5+4 format | US ZIP code format |

## Integration Example

```typescript
import { useState } from 'react';
import { usePatientValidation } from '../validations/patient.validation';
import ValidationError from '../validations/ValidationError';

function MyForm() {
  const { validateForm, sanitizeFormData } = usePatientValidation();
  const [form, setForm] = useState({ /* form data */ });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      const sanitizedData = sanitizeFormData(form);
      // Submit sanitized data
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={form.firstName}
        onChange={(e) => setForm({...form, firstName: e.target.value})}
        className={errors.firstName ? "border-red-500" : ""}
      />
      <ValidationError error={errors.firstName} />
      {/* More form fields */}
    </form>
  );
}
```

## Benefits

1. **Reusability**: Validation logic can be used across multiple components
2. **Consistency**: Standardized error messages and validation rules
3. **Type Safety**: Full TypeScript support with proper interfaces
4. **Maintainability**: Centralized validation logic for easy updates
5. **Performance**: Efficient validation with minimal re-renders
6. **User Experience**: Clear, helpful error messages
7. **Data Integrity**: Automatic data sanitization before submission 