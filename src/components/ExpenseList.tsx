import React, { useState } from 'react';
import { Edit3, Trash2, MessageSquare, Database } from 'lucide-react';
import { Expense } from '../types/expense';
import { formatCurrency, getUkrainianPlural  } from '../utils/expenseUtils';
import { format } from 'date-fns';

interface ExpenseListProps {
  expenses: Expense[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

const ITEMS_PER_PAGE = 10;



export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onEditExpense,
  onDeleteExpense,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE);

  const paginatedExpenses = expenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (expenses.length === 0) {
    return (
      <div className="cyber-card rounded-lg p-8 text-center">
        <Database size={48} className="mx-auto mb-4 text-purple-400 opacity-50" />
        <p className="text-purple-300 font-mono">// Витрат не знайдено. Створіть свій перший запис...</p>
      </div>
    );
  }

  return (
    <div className="cyber-card rounded-lg shadow-2xl">
      <div className="p-6 border-b border-cyan-500/30">
        <h2 className="text-xl font-bold text-cyan-400 neon-text font-mono uppercase tracking-wide">
          Останні витрати ({expenses.length} {getUkrainianPlural(expenses.length)})
        </h2>
        <p>Debug: count={expenses.length}, plural={getUkrainianPlural(expenses.length)}</p>
      </div>

      <div className="divide-y divide-cyan-500/20">
        {paginatedExpenses.map((expense: Expense) => (
          <div key={expense.id} className="expense-item p-6 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-xl font-bold text-green-400 neon-text font-mono">
                    {formatCurrency(expense.amount)}
                  </span>
                  <span className="category-badge inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {expense.category}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-purple-300 font-mono">
                  <span className="text-cyan-300">{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                  {expense.comment && (
                    <div className="flex items-center gap-1">
                      <MessageSquare size={14} className="text-pink-400" />
                      <span className="truncate max-w-xs text-pink-300">// {expense.comment}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onEditExpense(expense)}
                  className="p-3 cyber-button rounded-md transition-all duration-300"
                  title="Редагувати витрату"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => onDeleteExpense(expense.id)}
                  className="p-3 cyber-button cyber-danger rounded-md transition-all duration-300"
                  title="Видалити витрату"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4 border-t border-cyan-500/20">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="cyber-button px-4 py-2 text-sm"
            disabled={currentPage === 1}
          >
            Назад
          </button>
          <span className="text-purple-300 font-mono">
            Сторінка {currentPage} з {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="cyber-button px-4 py-2 text-sm"
            disabled={currentPage === totalPages}
          >
            Вперед
          </button>
        </div>
      )}
    </div>
  );
};