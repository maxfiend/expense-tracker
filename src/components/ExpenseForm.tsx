import React, { useState } from 'react';
import { Plus, X, Zap } from 'lucide-react';
import { Expense, NewExpense } from '../types/expense';
import { getDefaultCategories } from '../utils/expenseUtils';

interface ExpenseFormProps {
  onAddExpense: (expense: NewExpense) => void;   // note: no id here
  editingExpense?: Expense;
  onUpdateExpense?: (expense: Expense) => void;
  onCancelEdit?: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onAddExpense,
  editingExpense,
  onUpdateExpense,
  onCancelEdit,
}) => {
  const [amount, setAmount] = useState(editingExpense?.amount?.toString() || '');
  const [category, setCategory] = useState(editingExpense?.category || '');
  const [customCategory, setCustomCategory] = useState('');
  const [date, setDate] = useState(editingExpense?.date || new Date().toISOString().split('T')[0]);
  const [comment, setComment] = useState(editingExpense?.comment || '');
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const categories = getDefaultCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !(showCustomCategory ? customCategory : category)) return;

    const finalCategory = showCustomCategory ? customCategory : category;

    const expense: Expense | NewExpense = editingExpense
  ? {
      id: editingExpense.id,
      amount: parseFloat(amount),
      category: finalCategory,
      date,
      comment: comment.trim() || undefined,
      created_at: editingExpense.created_at || new Date().toISOString(),
    }
  : {
      amount: parseFloat(amount),
      category: finalCategory,
      date,
      comment: comment.trim() || undefined,
      created_at: new Date().toISOString(),
    };

   if (editingExpense && onUpdateExpense) {
  onUpdateExpense(expense as Expense);
} else {
  onAddExpense(expense as NewExpense);
}

    // Скинути форму
    setAmount('');
    setCategory('');
    setCustomCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setComment('');
    setShowCustomCategory(false);
  };

  const handleCancelEdit = () => {
    if (onCancelEdit) onCancelEdit();
    setAmount('');
    setCategory('');
    setCustomCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setComment('');
    setShowCustomCategory(false);
  };

  return (
    <div className="cyber-card rounded-lg p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-cyan-400 neon-text flex items-center gap-2">
          <Zap size={20} className="text-cyan-400" />
          {editingExpense ? 'Редагувати витрату' : 'Додати нову витрату'}
        </h2>
        {editingExpense && (
          <button
            onClick={handleCancelEdit}
            className="p-2 cyber-button cyber-danger rounded-md transition-all duration-300"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const target = e.target as HTMLElement;
            if (target.tagName !== 'TEXTAREA') {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent);
            }
          }
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-purple-400 mb-2 uppercase tracking-wide">
              Сума
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 cyber-input rounded-md font-mono text-cyan-300"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-400 mb-2 uppercase tracking-wide">
              Дата
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 cyber-input rounded-md font-mono text-cyan-300"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-400 mb-2 uppercase tracking-wide">
            Категорія
          </label>
          {showCustomCategory ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="flex-1 px-4 py-3 cyber-input rounded-md font-mono text-cyan-300"
                placeholder="Введіть власну категорію"
                required
              />
              <button
                type="button"
                onClick={() => setShowCustomCategory(false)}
                className="px-4 py-3 cyber-button rounded-md"
              >
                Відмінити
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 px-4 py-3 cyber-select rounded-md font-mono text-cyan-300"
                required
              >
                <option value="" disabled hidden>
                  Виберіть категорію
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowCustomCategory(true)}
                className="px-4 py-3 cyber-button rounded-md text-sm"
              >
                Власна
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-400 mb-2 uppercase tracking-wide">
            Коментар (необов’язково)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-3 cyber-input rounded-md resize-none font-mono text-cyan-300"
            rows={2}
            placeholder="// Додайте нотатку про цю витрату..."
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-3 cyber-button cyber-success py-4 px-6 rounded-md font-bold text-lg tracking-wide"
        >
          <Plus size={20} />
          {editingExpense ? 'Оновити витрату' : 'Додати витрату'}
        </button>
      </form>
    </div>
  );
};
