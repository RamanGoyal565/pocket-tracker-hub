
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, CreditCard, DollarSign, Calendar, Wallet, Smartphone, Globe } from "lucide-react";
import {
  formatCurrency,
  getBalance,
  getTransactions,
  getTotalExpense,
  getTotalIncome,
  getTransactionsByCategory,
  getTransactionsByPaymentMode
} from "@/utils/finance";
import { Transaction } from "@/types/finance";
import { Sidebar } from "@/components/finance/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Badge } from "@/components/ui/badge";

const COLORS = ["#8B5CF6", "#10B981", "#EF4444", "#6366F1", "#14B8A6", "#F59E0B", "#EC4899", "#06B6D4"];
const PAYMENT_COLORS = {
  cash: "#10B981",
  upi: "#6366F1",
  netbanking: "#8B5CF6",
  card: "#F59E0B",
  other: "#64748B"
};

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
        .map(([name, value]) => ({ name, value, color: (PAYMENT_COLORS as any)[name] || "#64748B" }))
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
  
  // Helper for getting payment mode icon
  const getPaymentModeIcon = (paymentMode?: string) => {
    switch(paymentMode) {
      case 'cash':
        return <Wallet className="h-4 w-4 mr-1 text-green-500" />;
      case 'upi':
        return <Smartphone className="h-4 w-4 mr-1 text-indigo-500" />;
      case 'netbanking':
        return <Globe className="h-4 w-4 mr-1 text-purple-500" />;
      case 'card':
        return <CreditCard className="h-4 w-4 mr-1 text-amber-500" />;
      default:
        return null;
    }
  };
  
  const balance = getBalance();
  const totalIncome = getTotalIncome();
  const totalExpense = getTotalExpense();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Financial Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-white to-purple-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className={`h-4 w-4 ${balance >= 0 ? "text-finance-success" : "text-finance-danger"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
              <p className="text-xs text-muted-foreground">Current balance</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white to-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <ArrowUp className="h-4 w-4 text-finance-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
              <p className="text-xs text-muted-foreground">All time income</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white to-red-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <ArrowDown className="h-4 w-4 text-finance-danger" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalExpense)}</div>
              <p className="text-xs text-muted-foreground">All time expenses</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="payments">Payment Modes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Monthly Financial Overview</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar name="Income" dataKey="income" fill="#10B981" />
                      <Bar name="Expense" dataKey="expense" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentTransactions.length > 0 ? (
                        recentTransactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between border-b pb-2"
                          >
                            <div className="flex items-center">
                              <div
                                className={`p-2 rounded-full mr-3 ${
                                  transaction.type === "income"
                                    ? "bg-green-100"
                                    : "bg-red-100"
                                }`}
                              >
                                {transaction.type === "income" ? (
                                  <ArrowUp className="h-4 w-4 text-finance-success" />
                                ) : (
                                  <ArrowDown className="h-4 w-4 text-finance-danger" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <div className="flex items-center text-xs text-gray-500 gap-2">
                                  <Badge variant="outline" className="font-normal">{transaction.category}</Badge> 
                                  {transaction.paymentMode && (
                                    <span className="flex items-center">
                                      {getPaymentModeIcon(transaction.paymentMode)}
                                      <span className="capitalize">{transaction.paymentMode}</span>
                                    </span>
                                  )}
                                  <span>• {new Date(transaction.date).toLocaleDateString('en-IN')}</span>
                                </div>
                              </div>
                            </div>
                            <div
                              className={`font-bold ${
                                transaction.type === "income"
                                  ? "text-finance-success"
                                  : "text-finance-danger"
                              }`}
                            >
                              {transaction.type === "income" ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500">No recent transactions</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-finance-purple" />
                        <span>Budget Planning</span>
                      </li>
                      <li className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-finance-purple" />
                        <span>Bank Account Integration</span>
                      </li>
                      <li className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-2 text-finance-purple" />
                        <span>Financial Goals</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="income" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Income by Category</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incomeByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#10B981"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {incomeByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expenses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {expensesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expenses by Payment Mode</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentModeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {paymentModeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
