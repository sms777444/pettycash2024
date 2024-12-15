import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { PersonBalance, formatCurrency, BalanceThresholds } from '../types';
import { Button } from './ui/Button';
import { setPersonThresholds } from '../utils/thresholds';

interface PersonBalanceTableProps {
  balances: PersonBalance[];
}

interface ThresholdModalProps {
  person: string;
  thresholds: BalanceThresholds;
  onClose: () => void;
  onSave: (thresholds: BalanceThresholds) => void;
}

function ThresholdModal({ person, thresholds, onClose, onSave }: ThresholdModalProps) {
  const [values, setValues] = useState(thresholds);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(values);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <h3 className="text-lg font-medium mb-4">Balance Thresholds for {person}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Low Balance Threshold
            </label>
            <input
              type="number"
              value={values.low}
              onChange={e => setValues({ ...values, low: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              step="100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Medium Balance Threshold
            </label>
            <input
              type="number"
              value={values.medium}
              onChange={e => setValues({ ...values, medium: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min={values.low}
              step="100"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="danger" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="success">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PersonBalanceTable({ balances }: PersonBalanceTableProps) {
  const [editingPerson, setEditingPerson] = useState<string | null>(null);

  const getStatusDisplay = (balance: PersonBalance) => {
    switch (balance.status) {
      case 'low':
        return {
          icon: AlertTriangle,
          text: `Low Balance (Below ${formatCurrency(balance.thresholds.low)})`,
          color: 'text-red-600 bg-red-50'
        };
      case 'medium':
        return {
          icon: AlertCircle,
          text: `Medium Balance (Below ${formatCurrency(balance.thresholds.medium)})`,
          color: 'text-amber-600 bg-amber-50'
        };
      case 'good':
        return {
          icon: CheckCircle,
          text: 'Good Balance',
          color: 'text-green-600 bg-green-50'
        };
    }
  };

  const handleSaveThresholds = (person: string, newThresholds: BalanceThresholds) => {
    setPersonThresholds(person, newThresholds);
    setEditingPerson(null);
    // Force a re-render by updating the parent component's state
    // This will be handled through the transactions state in App.tsx
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-blue-50">
          <h3 className="text-lg font-semibold text-blue-700">Person-wise Balance Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Person</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Receipts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Expenses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {balances.map((balance) => {
                const status = getStatusDisplay(balance);
                const StatusIcon = status.icon;
                
                return (
                  <tr key={balance.person} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {balance.person}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {formatCurrency(balance.receipts)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {formatCurrency(balance.expenses)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={balance.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(balance.balance)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${status.color}`}>
                        <StatusIcon className="w-4 h-4 mr-1.5" />
                        {status.text}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="primary"
                        icon={Settings}
                        onClick={() => setEditingPerson(balance.person)}
                        className="!p-2"
                      >
                        Set Thresholds
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editingPerson && (
        <ThresholdModal
          person={editingPerson}
          thresholds={balances.find(b => b.person === editingPerson)!.thresholds}
          onClose={() => setEditingPerson(null)}
          onSave={(thresholds) => handleSaveThresholds(editingPerson, thresholds)}
        />
      )}
    </>
  );
}