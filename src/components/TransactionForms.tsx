import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Transaction } from '../types';
import { TransactionForm } from './TransactionForm';
import { Button } from './ui/Button';
import { ListManagementModal } from './ListManagementModal';
import { getCategories, addCategory, deleteCategory, editCategory } from '../utils/categories';
import { getPeople, deletePerson, editPerson } from '../utils/people';
import { getProjects, deleteProject, editProject } from '../utils/projects';

interface TransactionFormsProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export function TransactionForms({ onAddTransaction }: TransactionFormsProps) {
  const [managingList, setManagingList] = useState<'receiptCategories' | 'expenseCategories' | 'people' | 'projects' | null>(null);

  const getModalConfig = () => {
    switch (managingList) {
      case 'receiptCategories':
        return {
          title: 'Manage Receipt Categories',
          items: getCategories('receipt'),
          onDelete: (category: string) => deleteCategory('receipt', category),
          onEdit: (oldCategory: string, newCategory: string) => editCategory('receipt', oldCategory, newCategory)
        };
      case 'expenseCategories':
        return {
          title: 'Manage Expense Categories',
          items: getCategories('expense'),
          onDelete: (category: string) => deleteCategory('expense', category),
          onEdit: (oldCategory: string, newCategory: string) => editCategory('expense', oldCategory, newCategory)
        };
      case 'people':
        return {
          title: 'Manage People',
          items: getPeople(),
          onDelete: deletePerson,
          onEdit: editPerson
        };
      case 'projects':
        return {
          title: 'Manage Projects',
          items: getProjects(),
          onDelete: deleteProject,
          onEdit: editProject
        };
      default:
        return null;
    }
  };

  const modalConfig = getModalConfig();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-end gap-2">
        <Button
          variant="primary"
          icon={Settings}
          onClick={() => setManagingList('people')}
        >
          Manage People
        </Button>
        <Button
          variant="primary"
          icon={Settings}
          onClick={() => setManagingList('projects')}
        >
          Manage Projects
        </Button>
        <Button
          variant="primary"
          icon={Settings}
          onClick={() => setManagingList('receiptCategories')}
        >
          Manage Receipt Categories
        </Button>
        <Button
          variant="primary"
          icon={Settings}
          onClick={() => setManagingList('expenseCategories')}
        >
          Manage Expense Categories
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Add Receipt
          </h2>
          <TransactionForm 
            onAddTransaction={onAddTransaction} 
            defaultType="receipt"
            className="border-l-4 border-green-500"
          />
        </div>
        
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            Add Expense
          </h2>
          <TransactionForm 
            onAddTransaction={onAddTransaction} 
            defaultType="expense"
            className="border-l-4 border-red-500"
          />
        </div>
      </div>

      {modalConfig && (
        <ListManagementModal
          {...modalConfig}
          onClose={() => setManagingList(null)}
        />
      )}
    </div>
  );
}