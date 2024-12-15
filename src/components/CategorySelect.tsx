import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/Button';

interface CategorySelectProps {
  value: string;
  categories: string[];
  onChange: (category: string) => void;
  onAddCategory: (category: string) => void;
}

export function CategorySelect({ 
  value, 
  categories, 
  onChange, 
  onAddCategory 
}: CategorySelectProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      onChange(newCategory.trim());
      setNewCategory('');
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <div className="space-y-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter new category"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddCategory();
            }
          }}
        />
        <div className="flex space-x-2">
          <Button type="button" onClick={handleAddCategory} className="flex-1">
            Add
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => setIsAdding(false)}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex space-x-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <Button
        type="button"
        onClick={() => setIsAdding(true)}
        className="px-2"
        title="Add new category"
      >
        <Plus className="w-5 h-5" />
      </Button>
    </div>
  );
}