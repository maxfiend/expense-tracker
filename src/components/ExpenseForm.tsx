import React, { useState, useEffect, useRef } from 'react';
import { Plus, Zap, Trash2 } from 'lucide-react';
import { NewExpense } from '../types/expense';
import { CustomCategoryInput } from './CustomCategoryInputProps';
import { ChevronDown } from 'lucide-react';

interface ExpenseFormProps {
  onAddExpense: (expense: NewExpense) => void;
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  onDeleteCategory: (categoryToDelete: string) => void;
}

const getTodayDate = (): string => {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tzOffset).toISOString().split('T')[0];
};

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onAddExpense,
  categories,
  setCategories,
  onDeleteCategory,
}) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [comment, setComment] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [showCategoryList, setShowCategoryList] = useState(false);

  const [contextCategory, setContextCategory] = useState<string | null>(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);

  // Новый стейт для ошибки
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowCategoryList(false);
        setContextMenuVisible(false);
        setContextCategory(null);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const today = getTodayDate();
    if (date !== today) {
      setDate(today);
    }
  }, []);

  useEffect(() => {
    if (category && !categories.includes(category)) {
      setCategory('');
    }
  }, [category, categories]);

  const formatCategory = (input: string) => {
    if (!input) return '';
    const trimmed = input.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  };

  const handleAddCustomCategory = () => {
    const rawInput = customCategory.trim();
    const isUkrainianText = (text: string) =>
      /^[А-ЩЬЮЯЄІЇҐа-щьюяєіїґ'’\-\s]+$/.test(text.trim());

    if (!rawInput) {
      setErrorMessage('Введіть категорію');
      return;
    }

    if (!isUkrainianText(rawInput)) {
      setErrorMessage('Категорія має містити лише українські літери та пробіли');
      return;
    }

    const formatted = formatCategory(rawInput);

    if (categories.includes(formatted)) {
      setErrorMessage('Така категорія вже існує');
      return;
    }

    setCategories((prev) =>
      [...prev, formatted].sort((a, b) => a.localeCompare(b, 'uk'))
    );

    setCategory(formatted);
    setShowCustomCategory(false);
    setCustomCategory('');
  };

  const handleDeleteCategoryClick = () => {
    if (contextCategory) {
      onDeleteCategory(contextCategory);
      setContextCategory(null);
      setContextMenuVisible(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const chosenCategory = showCustomCategory
      ? formatCategory(customCategory)
      : category;

    if (!amount || !chosenCategory) {
      setErrorMessage('Введіть суму і категорію');
      return;
    }

    const expense: NewExpense = {
      amount: parseFloat(amount),
      category: chosenCategory,
      date,
      comment: comment.trim() || undefined,
      created_at: new Date().toISOString(),
    };

    onAddExpense(expense);
    setAmount('');
    setCategory('');
    setCustomCategory('');
    setDate(getTodayDate());
    setComment('');
    setShowCustomCategory(false);
    setShowCategoryList(false);
  };

  return (
    <div
      className="cyber-card rounded-lg p-6 shadow-2xl relative neon-scan"
      ref={containerRef}
    >
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
              step="1"
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
            <CustomCategoryInput
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              onSubmit={handleAddCustomCategory}
              isVisible={showCustomCategory}
            />
          ) : (
            <div className="relative">
              <div
                className="border border-cyan-600 rounded-md cursor-pointer px-3 py-2 select-none flex items-center justify-between"
                onClick={() => setShowCategoryList((v) => !v)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowCategoryList((v) => !v);
                  }
                }}
              >
                <span
                  className={`text-cyan-400 ${category ? 'font-semibold text-white' : ''
                    }`}
                >
                  {category || 'Виберіть категорію'}
                </span>
                <span
                  className="absolute right-0 transform text-cyan-400 transition-transform duration-300 ease-in-out"
                  style={{
                    transform: showCategoryList
                      ? 'translateX(-50%) rotate(180deg)'
                      : 'translateX(-50%) rotate(0deg)'
                  }}
                >
                  <ChevronDown size={18} />
                </span>
              </div>

              {showCategoryList && (
                <div className="flex flex-col gap-1 max-h-40 overflow-auto mt-2 absolute left-0 right-0 z-10 bg-[#121212] border border-cyan-600 rounded-md shadow-lg">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className={`category-item py-1 rounded relative flex items-center justify-between cursor-pointer text-cyan-400 px-4 ${cat === category
                        ? 'bg-cyan-600 font-semibold'
                        : 'hover:bg-cyan-400 hover:text-black'
                        }`}
                      onClick={() => {
                        setCategory(cat);
                        setShowCategoryList(false);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setContextCategory(cat);
                        setContextMenuVisible(true);
                      }}
                    >
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setContextCategory(cat);
                          setContextMenuVisible(true);
                        }}
                        className="category-item__delete-btn p-1"
                        aria-label={`Видалити категорію ${cat}`}
                        style={{
                          color: '#ff0055',
                          textShadow: `
                           0 0 5px #ff0055,
                           0 0 10px #ff0055,
                           0 0 20px #ff3399,
                           0 0 30px #ff3399,
                           0 0 40px #ff66cc,
                           0 0 70px #ff66cc
                            `,
                          filter: 'drop-shadow(0 0 5px #ff3399) drop-shadow(0 0 10px #ff66cc)'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowCustomCategory(true);
                  setShowCategoryList(false);
                }}
                className="block w-full mt-2 px-4 py-3 cyber-button rounded-md text-sm neon-scan"
              >
                Власна категорія
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

      {/* Попап подтверждения удаления категории */}
      {contextMenuVisible && contextCategory && (
        <div
          className="fixed z-50 left-1/2 transform -translate-x-1/2 bg-[#222831] border border-cyan-600 rounded-md shadow-lg p-4 w-72"
          style={{ top: '20%', maxWidth: '90vw' }}
          onContextMenu={(e) => e.preventDefault()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-category-title"
        >
          <div
            id="delete-category-title"
            className="mb-3 text-center text-green-400 font-semibold"
          >
            Видалити категорію «{contextCategory}» та всі пов’язані витрати?
          </div>
          <div className="flex justify-around gap-4">
            <button
              onClick={handleDeleteCategoryClick}
              className="px-2 py-2 cyber-button rounded border hover:bg-gray-600"
              style={{
                backgroundColor: '#374151',
                color: '#ff0055',
                borderColor: '#ff0055',
                textShadow: `
      0 0 1px #ff0055,
      0 0 1px #ff3399
    `,
                filter: 'drop-shadow(0 0 4px #ff3399)'
              }}
            >
              Видалити
            </button>
            <button
              onClick={() => {
                setContextMenuVisible(false);
                setContextCategory(null);
              }}
              className="px-4 py-3 cyber-button rounded-md text-sm hover:bg-gray-600 neon-scan"
              style={{
                borderColor: 'rgba(6, 182, 212, 0.4)',
                filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.3))',
              }}
            >
              Скасувати
            </button>
          </div>
        </div>
      )}

      {/* Модалка ошибки */}
      {errorMessage && (
        <div
          className="fixed z-50 left-1/2 top-1/4 transform -translate-x-1/2 bg-[#222831] border border-red-600 rounded-md shadow-lg p-4 w-72 max-w-[90vw]"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="error-message-title"
          onClick={() => setErrorMessage(null)} // закрыть при клике вне (можно доработать)
        >
          <div
            id="error-message-title"
            className="mb-3 text-center text-red-500 font-semibold"
          >
            {errorMessage}
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => setErrorMessage(null)}
              className="px-4 py-2 cyber-button rounded-md text-sm hover:bg-gray-600 neon-scan"
              style={{
                borderColor: 'rgba(255, 0, 0, 0.6)',
                filter: 'drop-shadow(0 0 6px rgba(255, 0, 0, 0.7))',
              }}
            >
              Закрити
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
