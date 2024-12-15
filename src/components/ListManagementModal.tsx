import React, { useState } from 'react';
import { X, Trash2, Edit2, Check, XCircle } from 'lucide-react';
import { Button } from './ui/Button';

interface ListManagementModalProps {
  title: string;
  items: string[];
  onClose: () => void;
  onDelete: (item: string) => void;
  onEdit: (oldItem: string, newItem: string) => void;
}

export function ListManagementModal({
  title,
  items,
  onClose,
  onDelete,
  onEdit,
}: ListManagementModalProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = (item: string) => {
    setEditingItem(item);
    setEditValue(item);
  };

  const handleSaveEdit = (oldItem: string) => {
    if (editValue.trim() && editValue !== oldItem) {
      onEdit(oldItem, editValue.trim());
    }
    setEditingItem(null);
    setEditValue('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                {editingItem === item ? (
                  <div className="flex items-center space-x-2 flex-1">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      autoFocus
                    />
                    <Button
                      variant="success"
                      icon={Check}
                      onClick={() => handleSaveEdit(item)}
                      className="!p-2"
                    />
                    <Button
                      variant="danger"
                      icon={XCircle}
                      onClick={() => setEditingItem(null)}
                      className="!p-2"
                    />
                  </div>
                ) : (
                  <>
                    <span className="text-sm text-gray-900">{item}</span>
                    <div className="flex space-x-2">
                      <Button
                        variant="primary"
                        icon={Edit2}
                        onClick={() => handleStartEdit(item)}
                        className="!p-2"
                      />
                      <Button
                        variant="danger"
                        icon={Trash2}
                        onClick={() => onDelete(item)}
                        className="!p-2"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t">
          <Button variant="primary" onClick={onClose} fullWidth>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}