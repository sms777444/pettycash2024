import { loadFromStorage, saveToStorage } from './storage';

const DEFAULT_RECEIPT_CATEGORIES = [
  'Salary',
  'Bonus',
  'Reimbursement',
  'Other Income'
];

const DEFAULT_EXPENSE_CATEGORIES = [
  'Office Supplies',
  'Travel',
  'Meals',
  'Utilities',
  'Miscellaneous'
];

export const getCategories = (type: 'receipt' | 'expense'): string[] => {
  const key = `${type}Categories`;
  return loadFromStorage(key, type === 'receipt' ? DEFAULT_RECEIPT_CATEGORIES : DEFAULT_EXPENSE_CATEGORIES);
};

export const addCategory = (type: 'receipt' | 'expense', category: string): string[] => {
  const key = `${type}Categories`;
  const categories = getCategories(type);
  if (!categories.includes(category)) {
    const updatedCategories = [...categories, category];
    saveToStorage(key, updatedCategories);
    return updatedCategories;
  }
  return categories;
};

export const deleteCategory = (type: 'receipt' | 'expense', category: string): string[] => {
  const key = `${type}Categories`;
  const categories = getCategories(type);
  const updatedCategories = categories.filter(c => c !== category);
  saveToStorage(key, updatedCategories);
  return updatedCategories;
};

export const editCategory = (type: 'receipt' | 'expense', oldCategory: string, newCategory: string): string[] => {
  const key = `${type}Categories`;
  const categories = getCategories(type);
  const updatedCategories = categories.map(c => c === oldCategory ? newCategory : c);
  saveToStorage(key, updatedCategories);
  return updatedCategories;
};