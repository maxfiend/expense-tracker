import React, { useState, useRef, useEffect } from 'react';
import { Filter, X, Search, ChevronDown } from 'lucide-react';
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

  const [showCategoryList, setShowCategoryList] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Закрываем список при клике вне компонента
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryList(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearFilters = () => {
    onFiltersChange({ category: '', dateFrom: '', dateTo: '' });
  };

  const hasActiveFilters = filters.category || filters.dateFrom || filters.dateTo;

  return (
    <div className="cyber-card mb-6 rounded-lg p-6 shadow-2xl flex flex-col items-center md:items-start neon-scan">
      <div className="flex items-center justify-between w-full mb-4 flex-col sm:flex-row gap-2">
        <div className="flex items-center gap-2">
          <Search size={20} className="text-cyan-400" />
          <h3 className="font-bold text-cyan-400 neon-text font-mono uppercase tracking-wide text-center sm:text-left">
            Фільтри
          </h3>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-center md:text-left">
        {/* Кастомный селект Категорія */}
        <div className="relative" ref={categoryRef}>
          <label className="block text-sm font-medium text-purple-400 mb-2 uppercase tracking-wide font-mono">
            Категорія
          </label>
          <button
            type="button"
            onClick={() => setShowCategoryList(!showCategoryList)}
            className="w-full px-4 py-3 rounded-md bg-gray-900 border border-cyan-600 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 font-mono text-left flex justify-between items-center"
            style={{ color: filters.category ? '#22d3ee' : '#22d3ee' }} // sienna (#A0522D) если выбрана категория, cyan (#22d3ee) если нет
          >
            <span>{filters.category || '// Всі категорії'}</span>
            <ChevronDown
              size={18}
              className={`text-cyan-400 transition-transform duration-300 ease-in-out ${
                showCategoryList ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showCategoryList && (
            <ul className="absolute z-20 mt-1 w-full bg-gray-900 border border-cyan-600 rounded-md max-h-60 overflow-auto shadow-lg">
              <li
                className="px-4 py-2 cursor-pointer hover:bg-cyan-700 text-cyan-300"
                onClick={() => {
                  onFiltersChange({ ...filters, category: '' });
                  setShowCategoryList(false);
                }}
              >
                // Всі категорії
              </li>
              {categories.map((category) => (
                <li
                  key={category}
                  className={`px-4 py-2 cursor-pointer hover:bg-cyan-700 ${
                    filters.category === category ? 'font-semibold' : 'text-cyan-300'
                  }`}
                  style={filters.category === category ? { color: 'text-cyan-300' } : undefined}
                  onClick={() => {
                    onFiltersChange({ ...filters, category });
                    setShowCategoryList(false);
                  }}
                >
                  {category}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Від дати */}
        <div>
          <label className="block text-sm font-medium text-purple-400 mb-2 uppercase tracking-wide font-mono">
            Від дати
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
            className="w-full px-4 py-3 cyber-input rounded-md font-mono text-cyan-300 bg-gray-900 border border-cyan-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 transition"
          />
        </div>

        {/* До дати */}
        <div>
          <label className="block text-sm font-medium text-purple-400 mb-2 uppercase tracking-wide font-mono">
            До дати
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
            className="w-full px-4 py-3 cyber-input rounded-md font-mono text-cyan-300 bg-gray-900 border border-cyan-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 transition"
          />
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-cyan-500/30 w-full text-center md:text-left">
        <p className="text-sm text-purple-300 font-mono">
          // Показано <span className="text-cyan-400 font-bold">{filteredExpenses}</span> з{' '}
          <span className="text-cyan-400 font-bold">{totalExpenses}</span> витрат
        </p>
      </div>
    </div>
  );
};
