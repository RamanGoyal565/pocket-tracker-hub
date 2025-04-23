
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
  if (data.user) {
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

export function getCurrentUser(): User | null {
  const user = supabase.auth.getUser();
  if (!user) return null;
  // user is a promise, so return null (UI code should use Supabase hooks for live user)
  return null;
}

// --- TRANSACTIONS ---
export async function addTransaction(transaction: Transaction): Promise<void> {
  await supabase.from("transactions").insert([transaction]);
}

export async function getTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });
  return data || [];
}

export async function removeTransaction(id: string): Promise<void> {
  await supabase.from("transactions").delete().eq("id", id);
}

export async function getTotalIncome(): Promise<number> {
  const { data } = await supabase
    .from("transactions")
    .select("amount")
    .eq("type", "income");
  return (data || []).reduce((sum: number, tr: any) => sum + tr.amount, 0);
}

export async function getTotalExpense(): Promise<number> {
  const { data } = await supabase
    .from("transactions")
    .select("amount")
    .eq("type", "expense");
  return (data || []).reduce((sum: number, tr: any) => sum + tr.amount, 0);
}

export async function getBalance(): Promise<number> {
  const inc = await getTotalIncome();
  const exp = await getTotalExpense();
  return inc - exp;
}

export async function getCategoryTotals(): Promise<Record<string, number>> {
  const { data } = await supabase.from("transactions").select("*");
  return (data || []).reduce((categories: Record<string, number>, tr: any) => {
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
    minimumFractionDigits: 2,
  }).format(amount);
}
