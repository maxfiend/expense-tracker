import React, { useState } from 'react';
import { Trash2, MessageSquare, Database } from 'lucide-react';
import { Expense } from '../types/expense';
import { formatCurrency, getUkrainianPlural } from '../utils/expenseUtils';
import { format } from 'date-fns';
import { ToggleBurgerButton } from './ToggleBurgerButton';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onDeleteExpense,
}) => {
  const [showList, setShowList] = useState(true);

  if (expenses.length === 0) {
    return (
      <div className="cyber-card rounded-lg p-8 text-center">
        <Database size={48} className="mx-auto mb-4 text-purple-400 opacity-50" />
        <p className="text-purple-300 font-mono">// Витрат не знайдено. Створіть свій перший запис...</p>
      </div>
    );
  }

  return (
    <div className="cyber-card rounded-lg shadow-2xl max-w-4xl mx-auto">
      <div className="p-6 border-b border-cyan-500/30 flex items-center justify-between">
        <h2 className="text-xl font-bold neon-text font-mono uppercase tracking-wide text-center sm:text-left text-cyan-400">
          Останні витрати
          <br />
          <span className="text-purple-400">
            ({expenses.length} {getUkrainianPlural(expenses.length)})
          </span>
        </h2>

        <ToggleBurgerButton
          isOpen={showList}
          onClick={() => setShowList(!showList)}
          ariaLabel={showList ? 'Приховати список' : 'Показати список'}
        />
      </div>

      <div
        className={`transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden ${showList ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="divide-y divide-cyan-500/20 flex flex-col items-center max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400/50 scrollbar-track-transparent">
          {expenses.map((expense: Expense) => (
            <div
              key={expense.id}
              className="expense-item p-6 transition-all duration-300 max-w-2xl w-full"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-1">
                  <div className="flex flex-col mb-2">
                    <span
                      className="text-xl font-bold text-green-400 neon-text font-mono"
                      title={formatCurrency(expense.amount)}
                    >
                      {formatCurrency(expense.amount).length > 15
                        ? formatCurrency(expense.amount).slice(0, 15) + '…'
                        : formatCurrency(expense.amount)}
                    </span>
                    <span className="category-badge inline-flex w-max items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-1">
                      {expense.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-purple-300 font-mono">
                    <span className="text-cyan-300">
                      {format(new Date(expense.date), 'MMM dd, yyyy')}
                    </span>
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
      </div>
    </div>
  );
};
