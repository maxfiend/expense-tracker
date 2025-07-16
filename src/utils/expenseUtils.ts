import { Expense, ExpenseFilters, MonthlyTotal } from '../types/expense';
import { format, startOfMonth, endOfMonth, isWithinInterval, parse } from 'date-fns';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export function formatCurrency(amount: number): string {
  return amount.toLocaleString('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export const getDefaultCategories = (): string[] => [
  'Їжа', 'Транспорт', 'Розваги', 'Здоров’я', 'Освіта', 'Покупки', 'Інше'
];

export const filterExpenses = (expenses: Expense[], filters: ExpenseFilters): Expense[] => {
  return expenses.filter(expense => {
    const matchesCategory = !filters.category || expense.category === filters.category;
    
    let matchesDate = true;
    if (filters.dateFrom || filters.dateTo) {
      const expenseDate = new Date(expense.date);
      const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : new Date('1900-01-01');
      const toDate = filters.dateTo ? new Date(filters.dateTo) : new Date('2100-12-31');
      matchesDate = isWithinInterval(expenseDate, { start: fromDate, end: toDate });
    }
    
    return matchesCategory && matchesDate;
  });
};

export const getMonthlyTotals = (expenses: Expense[]): MonthlyTotal[] => {
  const monthlyMap = new Map<string, MonthlyTotal>();
  
  expenses.forEach(expense => {
    const monthKey = format(new Date(expense.date), 'yyyy-MM');
    const monthLabel = format(new Date(expense.date), 'MMM yyyy');
    
    if (monthlyMap.has(monthKey)) {
      const existing = monthlyMap.get(monthKey)!;
      existing.total += expense.amount;
      existing.count += 1;
    } else {
      monthlyMap.set(monthKey, {
        month: monthLabel,
        total: expense.amount,
        count: 1,
      });
    }
  });
  
  return Array.from(monthlyMap.values()).sort((a, b) => b.month.localeCompare(a.month));
};

export const getCategoryTotals = (expenses: Expense[]): { category: string; total: number; count: number }[] => {
  const categoryMap = new Map<string, { total: number; count: number }>();
  
  expenses.forEach(expense => {
    if (categoryMap.has(expense.category)) {
      const existing = categoryMap.get(expense.category)!;
      existing.total += expense.amount;
      existing.count += 1;
    } else {
      categoryMap.set(expense.category, {
        total: expense.amount,
        count: 1,
      });
    }
  });
  
  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.total - a.total);
};

export const getCurrentMonthTotal = (expenses: Expense[]): number => {
  const currentMonth = new Date();
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  
  return expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return isWithinInterval(expenseDate, { start, end });
    })
    .reduce((sum, expense) => sum + expense.amount, 0);
};

export const getUkrainianPlural = (count: number): string => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return 'витрата';
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return 'витрати';
  return 'витрат';
};