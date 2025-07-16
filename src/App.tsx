import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Shield, LogOut } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { Expense, NewExpense, ExpenseFilters } from './types/expense';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseFiltersComponent } from './components/ExpenseFilters';
import { ExpenseChart } from './components/ExpenseChart';
import { MonthlyOverview } from './components/MonthlyOverview';
import { filterExpenses, getUkrainianPlural } from './utils/expenseUtils';
import { supabase } from './supabaseClient';
import { Auth } from './components/Auth';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>({
    category: '',
    dateFrom: '',
    dateTo: '',
  });
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  // Получаем пользователя при загрузке и подписываемся на изменения авторизации
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Выход
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Загрузка расходов
  const fetchExpenses = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })
      .eq('user_id', user.id);

    if (error) {
      console.error('Ошибка загрузки расходов:', error);
    } else if (data) {
      setExpenses(data);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  const handleAddExpense = async (expense: NewExpense) => {
    if (!user) return;

    const expenseWithUser = {
      ...expense,
      user_id: user.id,
      comment: expense.comment || null,
    };

    const { data, error } = await supabase
      .from('expenses')
      .insert([expenseWithUser])
      .select();

    if (error) {
      console.error('Ошибка добавления:', error);
    } else if (data && data.length > 0) {
      setExpenses(prev => [data[0], ...prev]);
    }
  };

  const handleUpdateExpense = async (expense: Expense) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('expenses')
      .update({
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        comment: expense.comment,
        created_at: expense.created_at,
      })
      .eq('id', expense.id)
      .eq('user_id', user.id)
      .select();

    if (error) {
      console.error('Ошибка обновления:', error);
    } else if (data && data.length > 0) {
      setExpenses(prev => prev.map(e => (e.id === expense.id ? data[0] : e)));
      setEditingExpense(undefined);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!user) return;
    if (!window.confirm('Ви впевнені, що хочете видалити цю витрату?')) return;

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Ошибка удаления:', error);
    } else {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleCancelEdit = () => {
    setEditingExpense(undefined);
  };

  const filteredExpenses = filterExpenses(expenses, filters);
  const sortedExpenses = filteredExpenses.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Auth />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-cyan-500/20 rounded-full border border-cyan-500/50 shadow-lg">
                <Cpu className="w-12 h-12 text-cyan-400" />
              </div>
              <h1
                className="glitch text-5xl font-bold text-cyan-400 neon-text"
                data-text="ТРЕКЕР ВИТРАТ"
              >
                ТРЕКЕР ВИТРАТ
              </h1>
              <div className="p-4 bg-purple-500/20 rounded-full border border-purple-500/50 shadow-lg">
                <Shield className="w-12 h-12 text-purple-400" />
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="cyber-button px-4 py-2 text-sm font-bold text-red-400 border border-red-400 hover:bg-red-500/10 transition-all duration-300 rounded-md flex items-center gap-2"
              title="Вийти з акаунту"
            >
              <LogOut size={16} />
              Вийти
            </button>
          </div>

          <p className="text-purple-300 max-w-3xl mx-auto text-lg font-mono leading-relaxed">
            <br />
            <span className="text-cyan-400">
              Ініціалізація протоколів відстеження витрат і аналіз моделей витрачання
            </span>
            <br />
            <span className="text-pink-400">
              для оптимального розподілу ресурсів та фінансової оптимізації
            </span>
          </p>
        </div>

        {/* Щомісячний огляд */}
        <MonthlyOverview expenses={expenses} />

        {/* Основна сітка контенту */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ліва колонка — форма та фільтри */}
          <div className="lg:col-span-1 space-y-8">
            <ExpenseForm
              onAddExpense={handleAddExpense}
              editingExpense={editingExpense}
              onUpdateExpense={handleUpdateExpense}
              onCancelEdit={handleCancelEdit}
            />

            <ExpenseFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
              totalExpenses={expenses.length}
              filteredExpenses={filteredExpenses.length}
            />
          </div>

          {/* Права колонка — список та графіки */}
          <div className="lg:col-span-2 space-y-8">
            <ExpenseList
              expenses={sortedExpenses}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
            />

            {filteredExpenses.length > 0 && (
              <ExpenseChart
                expenses={filteredExpenses}
                chartType={chartType}
                onChartTypeChange={setChartType}
                getUkrainianPlural={getUkrainianPlural}
              />
            )}
          </div>
        </div>

        {/* Футер */}
        <div className="mt-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <p className="text-purple-300 font-mono text-sm">
              Дані зашифровані та збережені локально. Зовнішні протоколи передачі даних відсутні.
            </p>
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
