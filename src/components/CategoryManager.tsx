import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/Button';

interface CategoryManagerProps {
  categories: string[];
  type: 'receipt' | 'expense';
  onDeleteCategory: (category: string) => void;
}

export function CategoryManager({ categories, type, onDeleteCategory }: CategoryManagerProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Manage {type === 'receipt' ? 'Receipt' : 'Expense'} Categories</h3>
      <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
        {categories.map(category => (
          <div key={category} className="p-4 flex justify-between items-center">
            <span className="text-sm text-gray-900">{category}</span>
            <Button
              variant="danger"
              icon={Trash2}
              onClick={() => onDeleteCategory(category)}
              className="!p-2"
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}