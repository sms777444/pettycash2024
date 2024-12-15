import React, { useState, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, TimeScale } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { Transaction, formatDate, formatCurrency } from '../types';
import { DateRangeFilter } from './DateRangeFilter';
import { PersonBalanceTable } from './PersonBalanceTable';
import { DailyExpensesList } from './DailyExpensesList';
import { calculatePersonBalances } from '../utils/calculations';
import { PieChart, BarChart2, Users, FolderOpen } from 'lucide-react';
import { getProjects } from '../utils/projects';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement,
  TimeScale
);

interface DashboardProps {
  transactions: Transaction[];
}

export function Dashboard({ transactions }: DashboardProps) {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return formatDate(date);
  });
  
  const [endDate, setEndDate] = useState(() => formatDate(new Date()));
  const [selectedPerson, setSelectedPerson] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const date = formatDate(t.date);
      const matchesDate = date >= startDate && date <= endDate;
      const matchesPerson = selectedPerson === 'all' || t.person === selectedPerson;
      const matchesProject = selectedProject === 'all' || t.project === selectedProject;
      return matchesDate && matchesPerson && matchesProject;
    });
  }, [transactions, startDate, endDate, selectedPerson, selectedProject]);

  const people = ['all', ...new Set(transactions.map(t => t.person))];
  const projects = ['all', ...getProjects()];

  // Calculate category distributions
  const expensesByCategory = useMemo(() => {
    const expenses = filteredTransactions.filter(t => t.type === 'expense');
    return expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredTransactions]);

  // Group receipts by date and category
  const receiptsByDateAndCategory = useMemo(() => {
    const receipts = filteredTransactions.filter(t => t.type === 'receipt');
    const categories = new Set(receipts.map(t => t.category));
    
    const data = Array.from(categories).map(category => ({
      label: category,
      data: receipts
        .filter(t => t.category === category)
        .reduce((acc, t) => {
          const date = new Date(t.date);
          acc[date.toISOString()] = (acc[date.toISOString()] || 0) + t.amount;
          return acc;
        }, {} as Record<string, number>)
    }));

    return data;
  }, [filteredTransactions]);

  // Chart configurations
  const expensePieChartData = {
    labels: Object.keys(expensesByCategory),
    datasets: [{
      data: Object.values(expensesByCategory),
      backgroundColor: [
        '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1',
        '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#84CC16'
      ],
    }]
  };

  const receiptBarChartData = {
    datasets: receiptsByDateAndCategory.map((category, index) => ({
      label: category.label,
      data: category.data,
      backgroundColor: [
        '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899',
        '#14B8A6', '#F97316', '#84CC16', '#6366F1', '#EF4444'
      ][index % 10],
      borderColor: 'transparent'
    }))
  };

  const barChartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          tooltipFormat: 'PP',
          displayFormats: {
            day: 'MMM d'
          }
        },
        stacked: true
      },
      y: {
        stacked: true,
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        position: 'top' as const
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw || 0;
            return `${context.dataset.label}: ${formatCurrency(value)}`;
          }
        }
      }
    }
  };

  // Calculate person balances
  const personBalances = useMemo(() => 
    calculatePersonBalances(filteredTransactions),
    [filteredTransactions]
  );

  // Get unique dates for daily expenses list
  const uniqueDates = [...new Set(
    filteredTransactions
      .map(t => formatDate(t.date))
      .sort((a, b) => b.localeCompare(a))
  )];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center bg-white border rounded-lg p-4">
            <Users className="w-5 h-5 text-gray-500 mr-2" />
            <select
              value={selectedPerson}
              onChange={(e) => setSelectedPerson(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {people.map(person => (
                <option key={person} value={person}>
                  {person === 'all' ? 'All People' : person}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center bg-white border rounded-lg p-4">
            <FolderOpen className="w-5 h-5 text-gray-500 mr-2" />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {projects.map(project => (
                <option key={project} value={project}>
                  {project === 'all' ? 'All Projects' : project}
                </option>
              ))}
            </select>
          </div>
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
        </div>

        <PersonBalanceTable balances={personBalances} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <PieChart className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Expense Distribution</h3>
          </div>
          <div className="h-64">
            <Pie data={expensePieChartData} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <BarChart2 className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Receipts by Category Over Time</h3>
          </div>
          <div className="h-64">
            <Bar data={receiptBarChartData} options={barChartOptions} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Expenses</h3>
        <div className="space-y-4">
          {uniqueDates.map(date => (
            <DailyExpensesList
              key={date}
              transactions={filteredTransactions}
              date={date}
            />
          ))}
        </div>
      </div>
    </div>
  );
}