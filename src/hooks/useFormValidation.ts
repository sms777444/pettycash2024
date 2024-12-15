import { useState } from 'react';
import { validateTransaction } from '../utils/validation';

export function useFormValidation(initialData: any) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: any) => {
    const newErrors = validateTransaction(data);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validate,
    clearErrors
  };
}