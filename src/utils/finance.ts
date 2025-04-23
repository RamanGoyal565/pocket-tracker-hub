
// Supabase-backed utility functions for authentication and transactions
import { supabase } from "./supabaseClient";
import { Transaction, User } from "@/types/finance";

// --- USER AUTH ---
export async function registerUser(user: User): Promise<boolean> {
  const { error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: { data: { name: user.name } }
  });
  return !error;
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (data?.user) {
    return {
      email: data.user.email!,
      password: password, // Not stored/used, just typed for compatibility
      name: data.user.user_metadata?.name || data.user.email!.split("@")[0],
    }
  }
  return null;
}

export function logoutUser(): void {
  supabase.auth.signOut();
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  if (!data?.user) return null;
  
  return {
    email: data.user.email!,
    password: '', // We don't store this
    name: data.user.user_metadata?.name || data.user.email!.split("@")[0],
  };
}

// --- TRANSACTIONS ---
export async function addTransaction(transaction: Transaction): Promise<void> {
  await supabase.from("transactions").insert([transaction]);
}

export async function getTransactions(): Promise<Transaction[]> {
  const response = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });
  
  return response.data || [];
}

export async function removeTransaction(id: string): Promise<void> {
  // Safely handle the case where eq method might not exist
  const query = supabase.from("transactions").delete();
  if ('eq' in query) {
    await query.eq("id", id);
  } else {
    // If eq doesn't exist, we're using the mock client
    console.error("Cannot delete transaction - Supabase not configured");
  }
}

export async function getTotalIncome(): Promise<number> {
  const response = await supabase
    .from("transactions")
    .select("amount")
    .eq("type", "income");
  
  return (response.data || []).reduce((sum: number, tr: any) => sum + tr.amount, 0);
}

export async function getTotalExpense(): Promise<number> {
  const response = await supabase
    .from("transactions")
    .select("amount")
    .eq("type", "expense");
  
  return (response.data || []).reduce((sum: number, tr: any) => sum + tr.amount, 0);
}

export async function getBalance(): Promise<number> {
  const inc = await getTotalIncome();
  const exp = await getTotalExpense();
  return inc - exp;
}

export async function getCategoryTotals(): Promise<Record<string, number>> {
  const response = await supabase.from("transactions").select("*");
  // Safely handle the case where response might not have a data property
  const transactions = 'data' in response ? response.data : [];
  
  return transactions.reduce((categories: Record<string, number>, tr: any) => {
    const { category, amount, type } = tr;
    if (!categories[category]) categories[category] = 0;
    categories[category] += type === 'income' ? amount : -amount;
    return categories;
  }, {});
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
