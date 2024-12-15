import React, { useState, useRef } from 'react';
import { PlusCircle, Camera, Upload } from 'lucide-react';
import { Transaction, formatDate } from '../types';
import { Button } from './ui/Button';
import { CategorySelect } from './CategorySelect';
import { getCategories, addCategory } from '../utils/categories';
import { getPeople, addPerson } from '../utils/storage';
import { getProjects, addProject } from '../utils/projects';
import { useFormValidation } from '../hooks/useFormValidation';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  defaultType: 'receipt' | 'expense';
  className?: string;
}

export function TransactionForm({ 
  onAddTransaction, 
  defaultType,
  className = ''
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    date: formatDate(new Date()),
    description: '',
    amount: '',
    type: defaultType,
    category: getCategories(defaultType)[0] || '',
    person: getPeople()[0] || '',
    project: getProjects()[0] || '',
    billImage: null as string | null
  });

  const [categories, setCategories] = useState(() => getCategories(defaultType));
  const [people, setPeople] = useState(() => getPeople());
  const [projects, setProjects] = useState(() => getProjects());
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newPerson, setNewPerson] = useState('');
  const [newProject, setNewProject] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { errors, validate, clearErrors } = useFormValidation(formData);

  const handleAddCategory = (newCategory: string) => {
    const updatedCategories = addCategory(defaultType, newCategory);
    setCategories(updatedCategories);
  };

  const handleAddPerson = () => {
    if (newPerson.trim()) {
      const updatedPeople = addPerson(newPerson.trim());
      setPeople(updatedPeople);
      setFormData(prev => ({ ...prev, person: newPerson.trim() }));
      setNewPerson('');
      setIsAddingPerson(false);
    }
  };

  const handleAddProject = () => {
    if (newProject.trim()) {
      const updatedProjects = addProject(newProject.trim());
      setProjects(updatedProjects);
      setFormData(prev => ({ ...prev, project: newProject.trim() }));
      setNewProject('');
      setIsAddingProject(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, billImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate(formData)) {
      onAddTransaction({
        date: formData.date,
        description: formData.description,
        amount: Number(formData.amount),
        type: defaultType,
        category: formData.category,
        person: formData.person,
        project: formData.project,
        billImage: formData.billImage
      });
      setFormData(prev => ({
        ...prev,
        description: '',
        amount: '',
        billImage: null
      }));
      clearErrors();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 bg-white p-6 rounded-lg shadow-md ${className}`}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Person</label>
          {isAddingPerson ? (
            <div className="mt-1 space-y-2">
              <input
                type="text"
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter person name"
                autoFocus
              />
              <div className="flex space-x-2">
                <Button type="button" onClick={handleAddPerson} variant="success">
                  Add
                </Button>
                <Button type="button" onClick={() => setIsAddingPerson(false)} variant="danger">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-1 flex space-x-2">
              <select
                value={formData.person}
                onChange={(e) => setFormData({ ...formData, person: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {people.map(person => (
                  <option key={person} value={person}>{person}</option>
                ))}
              </select>
              <Button type="button" onClick={() => setIsAddingPerson(true)}>
                New
              </Button>
            </div>
          )}
          {errors.person && <p className="mt-1 text-sm text-red-600">{errors.person}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Project</label>
        {isAddingProject ? (
          <div className="mt-1 space-y-2">
            <input
              type="text"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter project name"
              autoFocus
            />
            <div className="flex space-x-2">
              <Button type="button" onClick={handleAddProject} variant="success">
                Add
              </Button>
              <Button type="button" onClick={() => setIsAddingProject(false)} variant="danger">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-1 flex space-x-2">
            <select
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {projects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
            <Button type="button" onClick={() => setIsAddingProject(true)}>
              New
            </Button>
          </div>
        )}
        {errors.project && <p className="mt-1 text-sm text-red-600">{errors.project}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
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
          {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <CategorySelect
            value={formData.category}
            categories={categories}
            onChange={(category) => setFormData({ ...formData, category })}
            onAddCategory={handleAddCategory}
          />
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>
      </div>

      {defaultType === 'expense' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Bill Image</label>
          <div className="mt-1 flex items-center space-x-4">
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              icon={Upload}
              className="flex-1"
            >
              Upload Bill
            </Button>
            <Button
              type="button"
              onClick={() => {/* Implement camera capture */}}
              icon={Camera}
              className="flex-1"
            >
              Take Photo
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          {formData.billImage && (
            <div className="mt-2">
              <img
                src={formData.billImage}
                alt="Bill"
                className="h-32 w-auto object-contain"
              />
            </div>
          )}
        </div>
      )}

      <Button type="submit" icon={PlusCircle} fullWidth variant={defaultType === 'receipt' ? 'success' : 'primary'}>
        Add {defaultType === 'receipt' ? 'Receipt' : 'Expense'}
      </Button>
    </form>
  );
}