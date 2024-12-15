import React from 'react';
import { PieChart, BarChart2 } from 'lucide-react';
import { Transaction } from '../types';
import { Card } from './ui/Card';

interface CategoryAnalysisProps {
  transactions: Transaction[];
}

interface CategoryTotal {
  category: string;
  total: number;
  count: number;
}

export function CategoryAnalysis({ transactions }: CategoryAnalysisProps) {
  const categoryTotals = transactions.reduce((acc: Record<string, CategoryTotal>, transaction) => {
    if (!acc[transaction.category]) {
      acc[transaction.category] = { category: transaction.category, total: 0, count: 0 };
    }
    
    if (transaction.type === 'expense') {
      acc[transaction.category].total += transaction.amount;
      acc[transaction.category].count += 1;
    }
    
    return acc;
  }, {});

  const sortedCategories = Object.values(categoryTotals)
    .sort((a, b) => b.total - a.total);

  const totalExpenses = sortedCategories.reduce((sum, cat) => sum + cat.total, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Category Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          title="Top Spending Category"
          value={sortedCategories[0]?.category || 'No expenses yet'}
          icon={PieChart}
          iconColor="text-purple-600"
          bgColor="bg-purple-100"
          textColor="text-gray-900"
        />
        
        <Card
          title="Number of Categories"
          value={String(Object.keys(categoryTotals).length)}
          icon={BarChart2}
          iconColor="text-indigo-600"
          bgColor="bg-indigo-100"
          textColor="text-gray-900"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Spent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transactions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                % of Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCategories.map((cat) => (
              <tr key={cat.category} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {cat.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                  ${cat.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {cat.count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {totalExpenses ? ((cat.total / totalExpenses) * 100).toFixed(1) : 0}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}