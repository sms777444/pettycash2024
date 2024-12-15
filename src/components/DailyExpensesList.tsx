import React from 'react';
import { Transaction, formatDate, formatCurrency } from '../types';
import { FolderOpen } from 'lucide-react';

interface DailyExpensesListProps {
  transactions: Transaction[];
  date: string;
}

export function DailyExpensesList({ transactions, date }: DailyExpensesListProps) {
  const dailyTransactions = transactions.filter(
    t => formatDate(t.date) === date && t.type === 'expense'
  );

  if (dailyTransactions.length === 0) {
    return null;
  }

  // Group transactions by project
  const projectGroups = dailyTransactions.reduce((groups, transaction) => {
    const project = transaction.project;
    if (!groups[project]) {
      groups[project] = {
        transactions: [],
        total: 0
      };
    }
    groups[project].transactions.push(transaction);
    groups[project].total += transaction.amount;
    return groups;
  }, {} as Record<string, { transactions: Transaction[], total: number }>);

  const dayTotal = dailyTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div className="px-6 py-3 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">{formatDate(date)}</h3>
        <span className="text-red-600 font-medium">{formatCurrency(dayTotal)}</span>
      </div>
      
      <div className="divide-y divide-gray-200">
        {Object.entries(projectGroups).map(([project, group]) => (
          <div key={project} className="bg-gray-50">
            <div className="px-6 py-2 flex items-center justify-between bg-gray-100">
              <div className="flex items-center">
                <FolderOpen className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">{project}</span>
              </div>
              <span className="text-sm text-red-600 font-medium">
                {formatCurrency(group.total)}
              </span>
            </div>
            
            <div className="divide-y divide-gray-200">
              {group.transactions.map((transaction) => (
                <div key={transaction.id} className="px-6 py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                        <span>{transaction.category}</span>
                        <span>•</span>
                        <span>{transaction.person}</span>
                      </div>
                    </div>
                    <span className="text-sm text-red-600 font-medium">
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}