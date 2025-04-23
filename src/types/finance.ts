
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
  paymentMode?: 'cash' | 'upi' | 'netbanking' | 'card' | 'other';
  tags?: string[];
}

export interface User {
  email: string;
  password: string;
  name: string;
  currency?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
}

// Indian specific categories
export const INCOME_CATEGORIES: Category[] = [
  { id: '1', name: 'Salary', type: 'income' },
  { id: '2', name: 'Business', type: 'income' },
  { id: '3', name: 'Freelance', type: 'income' },
  { id: '4', name: 'Investments', type: 'income' },
  { id: '5', name: 'Rent', type: 'income' },
  { id: '6', name: 'Interest', type: 'income' },
  { id: '7', name: 'Gifts', type: 'income' },
  { id: '8', name: 'Other', type: 'income' }
];

export const EXPENSE_CATEGORIES: Category[] = [
  { id: '1', name: 'Food', type: 'expense' },
  { id: '2', name: 'Groceries', type: 'expense' },
  { id: '3', name: 'Housing', type: 'expense' },
  { id: '4', name: 'Transportation', type: 'expense' },
  { id: '5', name: 'Shopping', type: 'expense' },
  { id: '6', name: 'Entertainment', type: 'expense' },
  { id: '7', name: 'Healthcare', type: 'expense' },
  { id: '8', name: 'Education', type: 'expense' },
  { id: '9', name: 'Bills', type: 'expense' },
  { id: '10', name: 'Travel', type: 'expense' },
  { id: '11', name: 'Insurance', type: 'expense' },
  { id: '12', name: 'Investment', type: 'expense' },
  { id: '13', name: 'Other', type: 'expense' }
];

// Common payment modes in India
export const PAYMENT_MODES = ['cash', 'upi', 'netbanking', 'card', 'other'];

