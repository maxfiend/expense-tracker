import React from 'react';
import { Filter, X, Search } from 'lucide-react';
import { ExpenseFilters } from '../types/expense';
import { getDefaultCategories } from '../utils/expenseUtils';

interface ExpenseFiltersProps {
  filters: ExpenseFilters;
  onFiltersChange: (filters: ExpenseFilters) => void;
  totalExpenses: number;
  filteredExpenses: number;
}

export const ExpenseFiltersComponent: React.FC<ExpenseFiltersProps> = ({
  filters,
  onFiltersChange,
  totalExpenses,
  filteredExpenses,
}) => {
  const categories = getDefaultCategories();

  const clearFilters = () => {
    onFiltersChange({ category: '', dateFrom: '', dateTo: '' });
  };

  const hasActiveFilters = filters.category || filters.dateFrom || filters.dateTo;

  return (
    <div className="cyber-card rounded-lg p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search size={20} className="text-cyan-400" />
          <h3 className="font-bold text-cyan-400 neon-text font-mono uppercase tracking-wide">Фільтри</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 cyber-button cyber-danger rounded-md px-3 py-2 text-sm transition-all duration-300"
          >
            <X size={16} />
            Очистити
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-purple-400 mb-2 uppercase tracking-wide">
            Категорія
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
            className="w-full px-4 py-3 cyber-select rounded-md font-mono text-cyan-300"
          >
            <option value="">// Всі категорії</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-400 mb-2 uppercase tracking-wide">
            Від дати
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
            className="w-full px-4 py-3 cyber-input rounded-md font-mono text-cyan-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-400 mb-2 uppercase tracking-wide">
            До дати
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
            className="w-full px-4 py-3 cyber-input rounded-md font-mono text-cyan-300"
          />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-cyan-500/30">
        <p className="text-sm text-purple-300 font-mono">
          {/* // Showing X of Y expenses */}
          // Показано <span className="text-cyan-400 font-bold">{filteredExpenses}</span> з <span className="text-cyan-400 font-bold">{totalExpenses}</span> витрат
        </p>
      </div>
    </div>
  );
};
