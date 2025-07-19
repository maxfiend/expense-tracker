import React, { useState, useEffect } from 'react';
import { Zap, Cpu, Shield, LogOut, Filter } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { Expense, NewExpense, ExpenseFilters } from './types/expense';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseFiltersComponent } from './components/ExpenseFilters';
import { ExpenseChart } from './components/ExpenseChart';
import { MonthlyOverview } from './components/MonthlyOverview';
import { filterExpenses, getUkrainianPlural, getDefaultCategories } from './utils/expenseUtils';
import { supabase } from './supabaseClient';
import { Auth } from './components/Auth';
import { CyberpunkBackground } from './components/CyberpunkCityBackground';
import { ToggleBurgerButton } from './components/ToggleBurgerButton';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>({
    category: '',
    dateFrom: '',
    dateTo: '',
  });
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [showMonthlyOverview, setShowMonthlyOverview] = useState(true);
  const [categories, setCategories] = useState<string[]>(() =>
    getDefaultCategories().sort((a, b) => a.localeCompare(b, 'uk'))
  );

  const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const check = () => setIsMobile(window.innerWidth < breakpoint);
      check();

      window.addEventListener('resize', check);
      return () => window.removeEventListener('resize', check);
    }, [breakpoint]);

    return isMobile;
  };

  const isMobile = useIsMobile();

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

  const handleDeleteCategory = async (categoryToDelete: string) => {
    if (!user) return;

    const { error: deleteExpensesError } = await supabase
      .from('expenses')
      .delete()
      .eq('category', categoryToDelete)
      .eq('user_id', user.id);

    if (deleteExpensesError) {
      console.error('Помилка видалення витрат:', deleteExpensesError);
      return;
    }

    setCategories((prev) => prev.filter((cat) => cat !== categoryToDelete));
    setExpenses((prev) => prev.filter((exp) => exp.category !== categoryToDelete));
    setFilters((prev) =>
      prev.category === categoryToDelete ? { ...prev, category: '' } : prev
    );
  };

  const filteredExpenses = filterExpenses(expenses, filters);
  const sortedExpenses = filteredExpenses.sort(
    (a, b) =>
      new Date(b.created_at || b.date).getTime() -
      new Date(a.created_at || a.date).getTime()
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--dark-bg)] to-[var(--deep-blue)] font-rajdhani overflow-x-hidden text-[#e0e0e0]">
        <Auth />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[var(--dark-bg)] to-[var(--deep-blue)] text-[#e0e0e0] font-rajdhani overflow-x-hidden">
      {/* Фоновая анимация под контентом */}
      <CyberpunkBackground />

      {/* Основной контент поверх */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Заголовок и кнопки */}
        <div className="text-center mb-4 sm:mb-10 select-none">
          <div className="relative mb-6 pt-12 md:pt-0">
            {/* Мобильная кнопка выхода */}
            <div className="absolute right-4 top-2 z-20 md:hidden">
              <button
                onClick={handleLogout}
                className="cyber-button px-4 py-2 text-sm font-bold text-red-400 border border-red-400 hover:bg-red-500/20 transition-all duration-300 rounded-md flex items-center gap-2 whitespace-nowrap"
                title="Вийти з акаунту"
              >
                <LogOut size={18} />
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4 ">
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

              {/* Десктопная кнопка выхода */}
              <div className="hidden md:block">
                <button
                  onClick={handleLogout}
                  className="cyber-button px-5 py-2 text-sm font-bold text-red-400 border border-red-400 hover:bg-red-500/20 transition-all duration-300 rounded-md flex items-center gap-2 whitespace-nowrap neon-scan"
                  title="Вийти з акаунту"
                >
                  <LogOut size={18} />
                  Вийти
                </button>
              </div>
            </div>
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

        {/* Статистика и фильтры */}

        {isMobile && (
          <div
            className="flex items-center justify-between mb-4 neon-arrow-container"
            style={{ '--arrow-line-left': '50px', '--arrow-head-left': '120px' } as React.CSSProperties}
          >
            <span className="text-sm font-mono text-purple-400 uppercase tracking-wide neon-arrow">
              {showMonthlyOverview ? 'Сховати загальні витрати' : 'Показати загальні витрати'}
            </span>
            <div className="arrow text-green-400 neon-text">➡</div>
            <ToggleBurgerButton
              isOpen={showMonthlyOverview}
              onClick={() => setShowMonthlyOverview(prev => !prev)}
              ariaLabel={showMonthlyOverview ? 'Сховати огляд витрат' : 'Показати огляд витрат'}
            />
          </div>
        )}

        {(!isMobile || showMonthlyOverview) && (
          <MonthlyOverview expenses={expenses} />
        )}

        <button
          onClick={() => setFiltersVisible(!filtersVisible)}
          className="mb-6 cyber-button flex items-center gap-2 px-4 py-2 rounded-md text-cyan-400 border border-cyan-400 hover:bg-cyan-400/10 transition w-full md:w-auto justify-center neon-scan"
          aria-label={filtersVisible ? 'Приховати фільтри' : 'Показати фільтри'}
        >
          <Filter size={20} />
          {filtersVisible ? 'Приховати фільтри' : 'Показати фільтри'}
        </button>

        <div
          className={`transition-[max-height,opacity] ease-in-out overflow-hidden duration-1000 ${filtersVisible ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <ExpenseFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            totalExpenses={expenses.length}
            filteredExpenses={filteredExpenses.length}
          />
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <ExpenseForm
              onAddExpense={handleAddExpense}
              categories={categories}
              setCategories={setCategories}
              onDeleteCategory={handleDeleteCategory}
            />
          </div>

          <div className="lg:col-span-2 space-y-8">
            <ExpenseList expenses={sortedExpenses} onDeleteExpense={handleDeleteExpense} />

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

        {/* Footer */}
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
      </main>
    </div>
  );
}

export default App;
