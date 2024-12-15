import { Transaction, PersonBalance, BalanceStatus } from '../types';
import { getPersonThresholds } from './thresholds';

const getBalanceStatus = (balance: number, thresholds: { low: number; medium: number }): BalanceStatus => {
  if (balance < thresholds.low) {
    return 'low';
  } else if (balance < thresholds.medium) {
    return 'medium';
  }
  return 'good';
};

export const calculateBalance = (transactions: Transaction[]): Balance => {
  return transactions.reduce(
    (acc, transaction) => {
      const amount = transaction.amount;
      if (transaction.type === 'receipt') {
        acc.receipts += amount;
        acc.total += amount;
      } else {
        acc.expenses += amount;
        acc.total -= amount;
      }
      return acc;
    },
    { total: 0, receipts: 0, expenses: 0 }
  );
};

export const calculatePersonBalances = (transactions: Transaction[]): PersonBalance[] => {
  // Get unique list of people
  const people = [...new Set(transactions.map(t => t.person))];

  return people.map(person => {
    const personTransactions = transactions.filter(t => t.person === person);
    const receipts = personTransactions
      .filter(t => t.type === 'receipt')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = personTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = receipts - expenses;
    const thresholds = getPersonThresholds(person);

    return {
      person,
      receipts,
      expenses,
      balance,
      thresholds,
      status: getBalanceStatus(balance, thresholds)
    };
  });
};