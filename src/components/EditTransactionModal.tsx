import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Transaction } from '../types';
import { Button } from './ui/Button';
import { CategorySelect } from './CategorySelect';
import { getCategories } from '../utils/categories';

interface EditTransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
  onUpdate: (updates: Partial<Transaction>) => void;
}

export function EditTransactionModal({ 
  transaction, 
  onClose, 
  onUpdate 
}: EditTransactionModalProps) {
  const [formData, setFormData] = useState({
    description: transaction.description,
    amount: transaction.amount.toString(),
    category: transaction.category,
  });

  const categories = getCategories(transaction.type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      description: formData.description,
      amount: Number(formData.amount),
      category: formData.category,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Edit Transaction</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              step="0.01"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <CategorySelect
              value={formData.category}
              categories={categories}
              onChange={(category) => setFormData({ ...formData, category })}
              onAddCategory={() => {}}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="danger" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="success">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}