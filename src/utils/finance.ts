
import { Transaction, User, INCOME_CATEGORIES, EXPENSE_CATEGORIES, PAYMENT_MODES } from "@/types/finance";
import { v4 as uuidv4 } from "uuid";

// Sample Indian names for generating demo data
const indianNames = [
  "Aanya Sharma", "Arjun Patel", "Diya Singh", "Vihaan Reddy", "Advait Kumar",
  "Ishaan Joshi", "Ananya Gupta", "Kabir Mehta", "Zara Khan", "Vivaan Choudhury"
];

// Sample Indian transaction descriptions
const incomeDescriptions = [
  "Monthly Salary", "Freelance Project", "Dividend from SBI", "Rent from Flat", 
  "Interest from FD", "TCS Bonus", "Consulting Fee", "Mutual Fund Returns",
  "YouTube Revenue", "Family Business Income"
];

const expenseDescriptions = [
  "Groceries from DMart", "Swiggy Order", "Uber Ride", "Amazon Purchase",
  "Phone Bill - Jio", "Electricity Bill - BESCOM", "School Fees", "DTH Recharge",
  "Health Insurance", "Medicine from Apollo", "Movie Tickets - PVR",
  "Train Ticket - IRCTC", "Restaurant Bill", "Gas Cylinder Refill"
];

// Authentication utilities
export const registerUser = (user: User): boolean => {
  const users = getUsers();
  
  // Check if user already exists
  if (users.find(u => u.email === user.email)) {
    return false;
  }
  
  // Set default currency to INR for Indian users
  const newUser = { ...user, currency: "INR" };
  users.push(newUser);
  localStorage.setItem('financeUsers', JSON.stringify(users));
  
  // Generate sample data for new users
  if (localStorage.getItem('transactions') === null) {
    generateSampleTransactions();
  }
  
  return true;
};

export const loginUser = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Generate sample data for first login if no transactions exist
    if (getTransactions().length === 0) {
      generateSampleTransactions();
    }
    
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
  const user = getCurrentUser();
  const currencySymbol = user?.currency === "INR" ? "₹" : "$";
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: user?.currency || 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Function to generate realistic Indian financial data
export const generateSampleTransactions = (): void => {
  const transactions: Transaction[] = [];
  const today = new Date();
  
  // Generate last 3 months of transactions
  for (let i = 0; i < 90; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Generate 0-3 transactions per day
    const dailyTransactions = Math.floor(Math.random() * 4);
    
    for (let j = 0; j < dailyTransactions; j++) {
      const transactionType = Math.random() > 0.35 ? 'expense' : 'income'; // More expenses than income
      
      const categoryList = transactionType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
      const category = categoryList[Math.floor(Math.random() * categoryList.length)].name;
      
      const descriptions = transactionType === 'income' ? incomeDescriptions : expenseDescriptions;
      const description = descriptions[Math.floor(Math.random() * descriptions.length)];
      
      // Generate realistic amounts
      let amount;
      if (transactionType === 'income') {
        if (category === 'Salary') {
          amount = Math.floor(Math.random() * 50000) + 25000; // 25K-75K salary
        } else {
          amount = Math.floor(Math.random() * 10000) + 1000; // 1K-11K other income
        }
      } else {
        if (['Housing', 'Education', 'Insurance'].includes(category)) {
          amount = Math.floor(Math.random() * 15000) + 5000; // 5K-20K big expenses
        } else {
          amount = Math.floor(Math.random() * 2000) + 100; // 100-2100 regular expenses
        }
      }
      
      const paymentMode = PAYMENT_MODES[Math.floor(Math.random() * PAYMENT_MODES.length)];
      
      transactions.push({
        id: uuidv4(),
        amount,
        description,
        category,
        date: date.toISOString().split('T')[0],
        type: transactionType,
        paymentMode: paymentMode as any,
        tags: []
      });
    }
  }
  
  // Add one month's salary for the current month
  transactions.push({
    id: uuidv4(),
    amount: 45000,
    description: "Monthly Salary",
    category: "Salary",
    date: new Date().toISOString().split('T')[0],
    type: 'income',
    paymentMode: 'netbanking',
    tags: ['recurring']
  });
  
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

// Get transactions grouped by month
export const getMonthlyTransactions = (): Record<string, Transaction[]> => {
  const transactions = getTransactions();
  return transactions.reduce((months: Record<string, Transaction[]>, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    
    if (!months[monthYear]) {
      months[monthYear] = [];
    }
    
    months[monthYear].push(transaction);
    return months;
  }, {});
};

// Get transactions by category
export const getTransactionsByCategory = (type: 'income' | 'expense'): Record<string, number> => {
  const transactions = getTransactions().filter(t => t.type === type);
  
  return transactions.reduce((categories: Record<string, number>, transaction) => {
    const { category, amount } = transaction;
    
    if (!categories[category]) {
      categories[category] = 0;
    }
    
    categories[category] += amount;
    return categories;
  }, {});
};

// Get transactions by payment mode (for expenses)
export const getTransactionsByPaymentMode = (): Record<string, number> => {
  const transactions = getTransactions().filter(t => t.type === 'expense' && t.paymentMode);
  
  return transactions.reduce((modes: Record<string, number>, transaction) => {
    const paymentMode = transaction.paymentMode || 'other';
    
    if (!modes[paymentMode]) {
      modes[paymentMode] = 0;
    }
    
    modes[paymentMode] += transaction.amount;
    return modes;
  }, {});
};

