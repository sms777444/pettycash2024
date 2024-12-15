// Balance thresholds
export interface BalanceThresholds {
  low: number;
  medium: number;
}

export const DEFAULT_BALANCE_THRESHOLDS: BalanceThresholds = {
  low: 500,
  medium: 3500
} as const;

export type BalanceStatus = 'low' | 'medium' | 'good';

export interface PersonBalance {
  person: string;
  receipts: number;
  expenses: number;
  balance: number;
  status: BalanceStatus;
  thresholds: BalanceThresholds;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'receipt' | 'expense';
  category: string;
  person: string;
  project: string;
  billImage?: string | null;
}

export interface Balance {
  total: number;
  receipts: number;
  expenses: number;
}

export { formatDate, formatCurrency } from '../utils/formatting';