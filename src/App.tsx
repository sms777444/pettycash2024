import React, { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { TransactionForms } from './components/TransactionForms';
import { TransactionList } from './components/TransactionList';
import { Balance } from './components/Balance';
import { Dashboard } from './components/Dashboard';
import { Transaction } from './types';
import { loadFromStorage, saveToStorage } from './utils/storage';
import { calculateBalance } from './utils/calculations';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => 
    loadFromStorage('transactions', [])
  );

  const [view, setView] = useState<'transactions' | 'dashboard'>('transactions');

  useEffect(() => {
    saveToStorage('transactions', transactions);
  }, [transactions]);

  const balance = calculateBalance(transactions);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction = {
      ...newTransaction,
      id: crypto.randomUUID(),
    };
    setTransactions([transaction, ...transactions]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleUpdateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Wallet className="w-8 h-8 text-blue-600" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">
              Petty Cash Tracker
            </h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setView('transactions')}
              className={`px-4 py-2 rounded-md ${
                view === 'transactions'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setView('dashboard')}
              className={`px-4 py-2 rounded-md ${
                view === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <Balance balance={balance} />
          
          {view === 'transactions' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <TransactionForms onAddTransaction={handleAddTransaction} />
              </div>
              
              <div className="lg:col-span-2">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Recent Transactions
                </h2>
                <TransactionList
                  transactions={transactions}
                  onDeleteTransaction={handleDeleteTransaction}
                  onUpdateTransaction={handleUpdateTransaction}
                />
              </div>
            </div>
          ) : (
            <Dashboard transactions={transactions} />
          )}
        </div>
      </div>
    </div>
  );
}