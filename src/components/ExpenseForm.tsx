import React, { useState, useEffect } from 'react';
import { Plus, Zap } from 'lucide-react';
import { NewExpense } from '../types/expense';
import { getDefaultCategories } from '../utils/expenseUtils';

interface ExpenseFormProps {
  onAddExpense: (expense: NewExpense) => void;
}

const getTodayDate = (): string => {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tzOffset).toISOString().split('T')[0];
};

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [comment, setComment] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const categories = getDefaultCategories();

  // Обновляем дату при загрузке компонента, если устарела
  useEffect(() => {
    const today = getTodayDate();
    if (date !== today) {
      setDate(today);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !(showCustomCategory ? customCategory : category)) return;

    const finalCategory = showCustomCategory ? customCategory : category;

    const expense: NewExpense = {
      amount: parseFloat(amount),
      category: finalCategory,
      date,
      comment: comment.trim() || undefined,
      created_at: new Date().toISOString(),
    };

    onAddExpense(expense);

    // Сброс формы с актуальной датой
    setAmount('');
    setCategory('');
    setCustomCategory('');
    setDate(getTodayDate());
    setComment('');
    setShowCustomCategory(false);
  };

  return (
    <div className="cyber-card rounded-lg p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-cyan-400 neon-text flex items-center gap-2">
          <Zap size={20} className="text-cyan-400" />
          Додати нову витрату
        </h2>
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
            <div className="flex flex-col sm:flex-row gap-2">
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
                className="px-4 py-3 cyber-button rounded-md text-sm self-start sm:self-auto"
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
          Додати витрату
        </button>
      </form>
    </div>
  );
};
