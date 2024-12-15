import React, { useState, useMemo } from 'react';
import { Trash2, FileCheck, FileX, Edit2, ArrowDown, ArrowUp, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Transaction, formatDate, formatCurrency } from '../types';
import { Button } from './ui/Button';
import { EditTransactionModal } from './EditTransactionModal';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onUpdateTransaction: (id: string, updates: Partial<Transaction>) => void;
}

type SortField = 'date' | 'amount' | 'description' | 'person' | 'project' | 'category' | 'type';
type SortDirection = 'asc' | 'desc';

export function TransactionList({ 
  transactions, 
  onDeleteTransaction,
  onUpdateTransaction 
}: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all' as 'all' | 'receipt' | 'expense',
    person: 'all',
    project: 'all',
    category: 'all',
    startDate: '',
    endDate: ''
  });
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({
    field: 'date',
    direction: 'desc'
  });

  // Get unique values for filter dropdowns
  const filterOptions = useMemo(() => ({
    people: ['all', ...new Set(transactions.map(t => t.person))],
    projects: ['all', ...new Set(transactions.map(t => t.project))],
    categories: ['all', ...new Set(transactions.map(t => t.category))]
  }), [transactions]);

  // Apply filters and sorting
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(t => {
      const matchesSearch = !filters.search || 
        t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.category.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.person.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.project.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesType = filters.type === 'all' || t.type === filters.type;
      const matchesPerson = filters.person === 'all' || t.person === filters.person;
      const matchesProject = filters.project === 'all' || t.project === filters.project;
      const matchesCategory = filters.category === 'all' || t.category === filters.category;
      const matchesDateRange = (!filters.startDate || t.date >= filters.startDate) &&
        (!filters.endDate || t.date <= filters.endDate);

      return matchesSearch && matchesType && matchesPerson && 
        matchesProject && matchesCategory && matchesDateRange;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.field) {
        case 'date':
          comparison = a.date.localeCompare(b.date);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
        case 'person':
          comparison = a.person.localeCompare(b.person);
          break;
        case 'project':
          comparison = a.project.localeCompare(b.project);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      return sortConfig.direction === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [transactions, filters, sortConfig]);

  // Calculate project summary
  const summary = useMemo(() => {
    return filteredAndSortedTransactions.reduce((acc, t) => {
      const key = t.project;
      if (!acc[key]) {
        acc[key] = { receipts: 0, expenses: 0, balance: 0 };
      }
      if (t.type === 'receipt') {
        acc[key].receipts += t.amount;
        acc[key].balance += t.amount;
      } else {
        acc[key].expenses += t.amount;
        acc[key].balance -= t.amount;
      }
      return acc;
    }, {} as Record<string, { receipts: number; expenses: number; balance: number }>);
  }, [filteredAndSortedTransactions]);

  const handleSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === 'asc' ? 
      <SortAsc className="w-4 h-4 ml-1" /> : 
      <SortDesc className="w-4 h-4 ml-1" />;
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow-md">
        <p className="text-gray-500">No transactions yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-medium">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />

            <select
              value={filters.type}
              onChange={e => setFilters(f => ({ ...f, type: e.target.value as typeof filters.type }))}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="receipt">Receipts</option>
              <option value="expense">Expenses</option>
            </select>

            <select
              value={filters.person}
              onChange={e => setFilters(f => ({ ...f, person: e.target.value }))}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {filterOptions.people.map(person => (
                <option key={person} value={person}>
                  {person === 'all' ? 'All People' : person}
                </option>
              ))}
            </select>

            <select
              value={filters.project}
              onChange={e => setFilters(f => ({ ...f, project: e.target.value }))}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {filterOptions.projects.map(project => (
                <option key={project} value={project}>
                  {project === 'all' ? 'All Projects' : project}
                </option>
              ))}
            </select>

            <select
              value={filters.category}
              onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {filterOptions.categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <input
                type="date"
                value={filters.startDate}
                onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))}
                className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))}
                className="w-1/2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Project Summary */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-medium text-gray-900">Project Summary</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {Object.entries(summary).map(([project, data]) => (
              <div key={project} className="px-6 py-4 flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{project}</h4>
                  <div className="mt-1 flex space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                      Receipts: {formatCurrency(data.receipts)}
                    </span>
                    <span className="flex items-center">
                      <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                      Expenses: {formatCurrency(data.expenses)}
                    </span>
                  </div>
                </div>
                <div className={`text-sm font-medium ${data.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Balance: {formatCurrency(data.balance)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    { field: 'date', label: 'Date' },
                    { field: 'description', label: 'Description' },
                    { field: 'person', label: 'Person' },
                    { field: 'project', label: 'Project' },
                    { field: 'category', label: 'Category' },
                    { field: 'amount', label: 'Amount' },
                    { field: 'type', label: 'Type' }
                  ].map(({ field, label }) => (
                    <th
                      key={field}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort(field as SortField)}
                    >
                      <div className="flex items-center">
                        {label}
                        <SortIcon field={field as SortField} />
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bill
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.person}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.project}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={transaction.type === 'receipt' ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === 'receipt' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {transaction.type === 'expense' && (
                        transaction.billImage ? (
                          <FileCheck className="w-5 h-5 text-green-500" title="Bill attached" />
                        ) : (
                          <FileX className="w-5 h-5 text-red-500" title="No bill" />
                        )
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Button
                        variant="primary"
                        icon={Edit2}
                        onClick={() => setEditingTransaction(transaction)}
                        className="!p-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        icon={Trash2}
                        onClick={() => onDeleteTransaction(transaction.id)}
                        className="!p-2"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onUpdate={(updates) => {
            onUpdateTransaction(editingTransaction.id, updates);
            setEditingTransaction(null);
          }}
        />
      )}
    </>
  );
}