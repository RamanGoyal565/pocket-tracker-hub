
import { Transaction, User } from "@/types/finance";

// Authentication utilities
export const registerUser = (user: User): boolean => {
  const users = getUsers();
  
  // Check if user already exists
  if (users.find(u => u.email === user.email)) {
    return false;
  }
  
  users.push(user);
  localStorage.setItem('financeUsers', JSON.stringify(users));
  return true;
};

export const loginUser = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  
  return null;
};

export const logoutUser = (): void => {
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

export const getUsers = (): User[] => {
  const usersJson = localStorage.getItem('financeUsers');
  return usersJson ? JSON.parse(usersJson) : [];
};

// Transaction utilities
export const addTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  transactions.push(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

export const getTransactions = (): Transaction[] => {
  const transactionsJson = localStorage.getItem('transactions');
  return transactionsJson ? JSON.parse(transactionsJson) : [];
};

export const removeTransaction = (id: string): void => {
  let transactions = getTransactions();
  transactions = transactions.filter(t => t.id !== id);
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

export const getTotalIncome = (): number => {
  const transactions = getTransactions();
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

export const getTotalExpense = (): number => {
  const transactions = getTransactions();
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

export const getBalance = (): number => {
  return getTotalIncome() - getTotalExpense();
};

export const getCategoryTotals = (): Record<string, number> => {
  const transactions = getTransactions();
  return transactions.reduce((categories: Record<string, number>, transaction) => {
    const { category, amount, type } = transaction;
    if (!categories[category]) {
      categories[category] = 0;
    }
    categories[category] += type === 'income' ? amount : -amount;
    return categories;
  }, {});
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};
