import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Balance as BalanceType, formatCurrency } from '../types';
import { Card } from './ui/Card';

interface BalanceProps {
  balance: BalanceType;
}

export function Balance({ balance }: BalanceProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card
        title="Current Balance"
        value={formatCurrency(balance.total)}
        icon={DollarSign}
        iconColor="text-blue-600"
        bgColor="bg-blue-100"
        textColor="text-gray-900"
      />
      
      <Card
        title="Total Receipts"
        value={formatCurrency(balance.receipts)}
        icon={TrendingUp}
        iconColor="text-green-600"
        bgColor="bg-green-100"
        textColor="text-green-600"
      />
      
      <Card
        title="Total Expenses"
        value={formatCurrency(balance.expenses)}
        icon={TrendingDown}
        iconColor="text-red-600"
        bgColor="bg-red-100"
        textColor="text-red-600"
      />
    </div>
  );
}