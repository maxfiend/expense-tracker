import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Shield, LogOut, Filter } from 'lucide-react';
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
import { CyberpunkBackground } from './components/CyberpunkCityBackground';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>({
    category: '',
    dateFrom: '',
    dateTo: '',
  });
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  // Новое состояние для показа/скрытия фильтра
  const [filtersVisible, setFiltersVisible] = useState(false);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const fetchExpenses = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false })
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
      setExpenses((prev) => [data[0], ...prev]);
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
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    }
  };

  const filteredExpenses = filterExpenses(expenses, filters);
  const sortedExpenses = filteredExpenses.sort(
    (a, b) =>
      new Date(b.created_at || b.date).getTime() -
      new Date(a.created_at || a.date).getTime()
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A23]">
        <Auth />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0A0A23] text-white font-sans overflow-hidden">
      <CyberpunkBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-12 select-none">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-cyan-500/20 rounded-full border border-cyan-500/50 shadow-lg backdrop-blur-sm">
                <Cpu className="w-12 h-12 text-cyan-400" />
              </div>
              <h1
                className="glitch text-5xl font-extrabold mb-6 text-center md:text-left leading-tight"
                data-text="ТРЕКЕР ВИТРАТ"
                style={{
                  textShadow:
                    '0 0 5px #00fff7, 0 0 10px #00fff7, 0 0 20px #00fff7, 0 0 40px #ff0080',
                }}
              >
                ТРЕКЕР ВИТРАТ
              </h1>
              <div className="p-4 bg-purple-500/20 rounded-full border border-purple-500/50 shadow-lg backdrop-blur-sm">
                <Shield className="w-12 h-12 text-purple-400" />
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="cyber-button px-5 py-2 text-sm font-bold text-red-400 border border-red-400 hover:bg-red-500/20 transition-all duration-300 rounded-md flex items-center gap-2 whitespace-nowrap"
              title="Вийти з акаунту"
            >
              <LogOut size={18} />
              Вийти
            </button>
          </div>

          <p className="text-purple-300 max-w-3xl mx-auto text-lg font-mono leading-relaxed tracking-wide">
            <span className="text-cyan-400 font-semibold">
              Ініціалізація протоколів відстеження витрат і аналіз моделей витрачання
            </span>
            <br />
            <span className="text-pink-400 font-semibold">
              для оптимального розподілу ресурсів та фінансової оптимізації
            </span>
          </p>
        </div>

        <MonthlyOverview expenses={expenses} />

        {/* Кнопка-переключатель фильтра */}
        <button
          onClick={() => setFiltersVisible(!filtersVisible)}
          className="mb-6 cyber-button flex items-center gap-2 px-4 py-2 rounded-md text-cyan-400 border border-cyan-400 hover:bg-cyan-400/10 transition"
          aria-label={filtersVisible ? 'Приховати фільтри' : 'Показати фільтри'}
        >
          <Filter size={20} />
          {filtersVisible ? 'Приховати фільтри' : 'Показати фільтри'}
        </button>

        {/* Плавное сворачивание фильтра */}
        <div
          className={`transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden ${
            filtersVisible ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <ExpenseFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            totalExpenses={expenses.length}
            filteredExpenses={filteredExpenses.length}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <ExpenseForm onAddExpense={handleAddExpense} />
          </div>

          <div className="lg:col-span-2 space-y-8">
            <ExpenseList
              expenses={sortedExpenses}
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

        <footer className="mt-20 text-center select-none">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
            <p className="text-purple-300 font-mono text-sm max-w-xl">
              Дані зашифровані та збережені локально. Зовнішні протоколи передачі даних
              відсутні.
            </p>
            <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto rounded" />
        </footer>
      </div>
    </div>
  );
}

export default App;
