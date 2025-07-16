import { Expense } from '../types/expense';

const STORAGE_KEY = 'expense-tracker-data';

export const loadExpenses = (): Expense[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading expenses:', error);
    return [];
  }
};

export const saveExpenses = (expenses: Expense[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  } catch (error) {
    console.error('Error saving expenses:', error);
  }
};