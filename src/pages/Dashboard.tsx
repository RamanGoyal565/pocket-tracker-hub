
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/finance/Sidebar";
import { 
  getBalance,
  getTransactions,
  getTotalExpense,
  getTotalIncome,
  getTransactionsByCategory,
  getTransactionsByPaymentMode
} from "@/utils/finance";
import { Transaction } from "@/types/finance";
import { OverviewCards } from "@/components/finance/OverviewCards";
import { MonthlyOverviewChart } from "@/components/finance/MonthlyOverviewChart";
import { RecentTransactions } from "@/components/finance/RecentTransactions";
import { IncomeByCategoryChart } from "@/components/finance/IncomeByCategoryChart";
import { ExpensesByCategoryChart } from "@/components/finance/ExpensesByCategoryChart";
import { PaymentsByModeChart } from "@/components/finance/PaymentsByModeChart";
import { UpcomingFeatures } from "@/components/finance/UpcomingFeatures";

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [expensesByCategory, setExpensesByCategory] = useState<any[]>([]);
  const [incomeByCategory, setIncomeByCategory] = useState<any[]>([]);
  const [paymentModeData, setPaymentModeData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  
  useEffect(() => {
    const allTransactions = getTransactions();
    setTransactions(allTransactions);
    
    // Get recent transactions (last 5)
    const recent = [...allTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    setRecentTransactions(recent);
    
    // Process expense by category data
    const expenseData = getTransactionsByCategory('expense');
    setExpensesByCategory(
      Object.entries(expenseData)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
    );
    
    // Process income by category data
    const incomeData = getTransactionsByCategory('income');
    setIncomeByCategory(
      Object.entries(incomeData)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
    );
    
    // Process payment mode data
    const paymentData = getTransactionsByPaymentMode();
    setPaymentModeData(
      Object.entries(paymentData)
        .map(([name, value]) => ({
          name,
          value,
          color:
            {
              cash: "#10B981",
              upi: "#6366F1",
              netbanking: "#8B5CF6",
              card: "#F59E0B",
              other: "#64748B"
            }[name] || "#64748B"
        }))
        .sort((a, b) => b.value - a.value)
    );
    
    // Generate monthly data
    const monthlyTransactions = generateMonthlyData(allTransactions);
    setMonthlyData(monthlyTransactions);
  }, []);
  
  // Prepare monthly data for charts
  const generateMonthlyData = (allTransactions: Transaction[]) => {
    const months: Record<string, { month: string, income: number, expense: number }> = {};
    
    allTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!months[monthYear]) {
        months[monthYear] = { month: monthYear, income: 0, expense: 0 };
      }
      
      if (transaction.type === 'income') {
        months[monthYear].income += transaction.amount;
      } else {
        months[monthYear].expense += transaction.amount;
      }
    });
    
    return Object.values(months).sort((a, b) => {
      const aDate = new Date(a.month.split(' ')[0] + " 1, " + a.month.split(' ')[1]);
      const bDate = new Date(b.month.split(' ')[0] + " 1, " + b.month.split(' ')[1]);
      return aDate.getTime() - bDate.getTime();
    }).slice(-6); // Last 6 months
  };
  
  const balance = getBalance();
  const totalIncome = getTotalIncome();
  const totalExpense = getTotalExpense();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Financial Dashboard</h1>
        <OverviewCards balance={balance} totalIncome={totalIncome} totalExpense={totalExpense} />
        <div className="mt-6">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="payments">Payment Modes</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              <MonthlyOverviewChart data={monthlyData} />
              <div className="grid gap-6 md:grid-cols-2">
                <RecentTransactions transactions={recentTransactions} />
                <UpcomingFeatures />
              </div>
            </TabsContent>
            <TabsContent value="income" className="space-y-6">
              <IncomeByCategoryChart data={incomeByCategory} />
            </TabsContent>
            <TabsContent value="expenses" className="space-y-6">
              <ExpensesByCategoryChart data={expensesByCategory} />
            </TabsContent>
            <TabsContent value="payments" className="space-y-6">
              <PaymentsByModeChart data={paymentModeData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
