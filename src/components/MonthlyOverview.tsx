import React from 'react';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Activity, Target } from 'lucide-react';
import { Expense } from '../types/expense';
import { getCurrentMonthTotal, getMonthlyTotals, formatCurrency } from '../utils/expenseUtils';

interface MonthlyOverviewProps {
  expenses: Expense[];
}

export const MonthlyOverview: React.FC<MonthlyOverviewProps> = ({ expenses }) => {
  const currentMonthTotal = getCurrentMonthTotal(expenses);
  const monthlyTotals = getMonthlyTotals(expenses);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const currentMonth = monthlyTotals[0];
  const previousMonth = monthlyTotals[1];

  const monthlyChange = currentMonth && previousMonth
    ? ((currentMonth.total - previousMonth.total) / previousMonth.total) * 100
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

      {/* Загальні витрати */}
      <div className="stat-card rounded-lg p-6 shadow-2xl">
        <p className="text-sm font-bold text-purple-400 uppercase tracking-wide font-mono mb-2">Загальні витрати</p>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-green-400 neon-text font-mono whitespace-nowrap overflow-hidden text-ellipsis">
            {formatCurrency(totalExpenses)}
          </p>
          <div className="w-16 h-16 bg-green-500/20 rounded-full border border-green-500/50 flex items-center justify-center flex-shrink-0">
            <span className="text-green-400 text-4xl font-mono leading-none select-none font-[monospace,Segoe UI Symbol,sans-serif]">
              ₴
            </span>
          </div>
        </div>
        <p className="text-sm text-purple-300 mt-3 font-mono">
          Всього {expenses.length} витрат{expenses.length !== 1 ? 'и' : ''}
        </p>
      </div>

      {/* Цього місяця */}
      <div className="stat-card rounded-lg p-6 shadow-2xl">
        <p className="text-sm font-bold text-purple-400 uppercase tracking-wide font-mono mb-2">Цього місяця</p>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-green-400 neon-text font-mono whitespace-nowrap overflow-hidden text-ellipsis">
            {formatCurrency(currentMonthTotal)}
          </p>
          <div className="p-4 bg-cyan-500/20 rounded-full border border-cyan-500/50 flex-shrink-0">
            <Calendar className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
        {monthlyChange !== 0 && (
          <div className="mt-3 flex items-center">
            {monthlyChange > 0 ? (
              <TrendingUp className="w-5 h-5 text-red-400 mr-2" />
            ) : (
              <TrendingDown className="w-5 h-5 text-green-400 mr-2" />
            )}
            <span className={`text-sm font-mono font-bold ${monthlyChange > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {Math.abs(monthlyChange).toFixed(1)}% порівняно з минулим місяцем
            </span>
          </div>
        )}
      </div>

      {/* Середньомісячні витрати */}
      <div className="stat-card rounded-lg p-6 shadow-2xl">
        <p className="text-sm font-bold text-purple-400 uppercase tracking-wide font-mono mb-2">Середньомісячні витрати</p>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-green-400 neon-text font-mono whitespace-nowrap overflow-hidden text-ellipsis">
            {formatCurrency(monthlyTotals.length > 0 ? totalExpenses / monthlyTotals.length : 0)}
          </p>
          <div className="p-4 bg-yellow-500/20 rounded-full border border-yellow-500/50 flex-shrink-0">
            <Activity className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Середня сума витрати */}
      <div className="stat-card rounded-lg p-6 shadow-2xl">
        <p className="text-sm font-bold text-purple-400 uppercase tracking-wide font-mono mb-2">Середня сума витрати</p>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-green-400 neon-text font-mono whitespace-nowrap overflow-hidden text-ellipsis">
            {formatCurrency(expenses.length > 0 ? totalExpenses / expenses.length : 0)}
          </p>
          <div className="p-4 bg-purple-500/20 rounded-full border border-purple-500/50 flex-shrink-0">
            <Target className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
