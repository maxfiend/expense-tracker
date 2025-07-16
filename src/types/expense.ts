export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  comment?: string;
  created_at: string;
}

export type NewExpense = Omit<Expense, 'id'>;

export interface ExpenseFilters {
  category: string;
  dateFrom: string;
  dateTo: string;
}

export interface MonthlyTotal {
  month: string;
  total: number;
  count: number;
}

