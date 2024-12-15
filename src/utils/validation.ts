export const validateTransaction = (formData: {
  date: string;
  description: string;
  amount: string;
  person: string;
  category: string;
}) => {
  const errors: Record<string, string> = {};

  if (!formData.date) {
    errors.date = 'Date is required';
  }

  if (!formData.description.trim()) {
    errors.description = 'Description is required';
  }

  if (!formData.amount || Number(formData.amount) <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }

  if (!formData.person.trim()) {
    errors.person = 'Person is required';
  }

  if (!formData.category.trim()) {
    errors.category = 'Category is required';
  }

  return errors;
};