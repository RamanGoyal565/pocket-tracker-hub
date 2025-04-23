
import { supabase } from "@/utils/supabaseClient";
import { v4 as uuidv4 } from 'uuid';

// Use this only once to seed demo data!
export async function seedIndianFinanceData() {
  // Common Indian transaction categories
  const incomeCategories = ["Salary", "Freelance", "Interest", "Gift", "Other"];
  const expenseCategories = [
    "Groceries",
    "Transport",
    "Dining Out",
    "House Rent",
    "Shopping",
    "Electricity",
    "Education",
    "Medical",
    "Travel",
    "Mobile Recharge",
    "Other"
  ];

  const demoUser = {
    email: "demo@india.com",
    password: "password123",
    name: "Amit Sharma",
  };

  // Create demo user
  await supabase.auth.signUp({
    email: demoUser.email,
    password: demoUser.password,
    options: { data: { name: demoUser.name } }
  });

  // Create demo transactions for April/May 2025
  const transactions = [
    {
      id: uuidv4(),
      amount: 50000,
      description: "April Salary",
      category: "Salary",
      date: "2025-04-01",
      type: "income"
    },
    {
      id: uuidv4(),
      amount: 2000,
      description: "Received Freelance payment",
      category: "Freelance",
      date: "2025-04-10",
      type: "income"
    },
    {
      id: uuidv4(),
      amount: 300,
      description: "Interest from savings account",
      category: "Interest",
      date: "2025-04-12",
      type: "income"
    },
    {
      id: uuidv4(),
      amount: 15000,
      description: "Paid House Rent",
      category: "House Rent",
      date: "2025-04-03",
      type: "expense",
    },
    {
      id: uuidv4(),
      amount: 6000,
      description: "Shopping at D-Mart",
      category: "Shopping",
      date: "2025-04-07",
      type: "expense",
    },
    {
      id: uuidv4(),
      amount: 4000,
      description: "Trip to Goa",
      category: "Travel",
      date: "2025-04-14",
      type: "expense",
    },
    {
      id: uuidv4(),
      amount: 1200,
      description: "Dinner at Sagar Ratna",
      category: "Dining Out",
      date: "2025-04-16",
      type: "expense",
    },
    {
      id: uuidv4(),
      amount: 2100,
      description: "Monthly Groceries",
      category: "Groceries",
      date: "2025-04-05",
      type: "expense",
    },
    {
      id: uuidv4(),
      amount: 599,
      description: "Mobile Recharge",
      category: "Mobile Recharge",
      date: "2025-04-09",
      type: "expense",
    },
    {
      id: uuidv4(),
      amount: 350,
      description: "Doctor visit",
      category: "Medical",
      date: "2025-04-11",
      type: "expense",
    },
  ];

  for (const tr of transactions) {
    await supabase.from("transactions").insert(tr);
  }
  // You can run this function from a dev-only button or the console!
}
