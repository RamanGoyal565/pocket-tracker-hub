
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, CreditCard, DollarSign, Calendar } from "lucide-react";
import { formatCurrency, getBalance, getTransactions, getTotalExpense, getTotalIncome } from "@/utils/finance";
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
} from "recharts";

const COLORS = ["#8B5CF6", "#C4B5FD", "#7E69AB", "#10B981", "#EF4444", "#6366F1", "#14B8A6", "#F59E0B"];

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    const allTransactions = getTransactions();
    setTransactions(allTransactions);
    
    // Get recent transactions (last 5)
    const recent = [...allTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    setRecentTransactions(recent);
  }, []);
  
  // Prepare data for charts
  const prepareBarChartData = () => {
    const categoryMap: Record<string, { income: number; expense: number }> = {};
    
    transactions.forEach((transaction) => {
      if (!categoryMap[transaction.category]) {
        categoryMap[transaction.category] = { income: 0, expense: 0 };
      }
      
      if (transaction.type === "income") {
        categoryMap[transaction.category].income += transaction.amount;
      } else {
        categoryMap[transaction.category].expense += transaction.amount;
      }
    });
    
    return Object.entries(categoryMap).map(([category, data]) => ({
      name: category,
      Income: data.income,
      Expense: data.expense,
    }));
  };
  
  const preparePieChartData = () => {
    const expensesByCategory: Record<string, number> = {};
    
    transactions
      .filter((t) => t.type === "expense")
      .forEach((transaction) => {
        if (!expensesByCategory[transaction.category]) {
          expensesByCategory[transaction.category] = 0;
        }
        expensesByCategory[transaction.category] += transaction.amount;
      });
    
    return Object.entries(expensesByCategory).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  };
  
  const balance = getBalance();
  const totalIncome = getTotalIncome();
  const totalExpense = getTotalExpense();
  const barChartData = prepareBarChartData();
  const pieChartData = preparePieChartData();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Financial Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className={`h-4 w-4 ${balance >= 0 ? "text-finance-success" : "text-finance-danger"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
              <p className="text-xs text-muted-foreground">Current balance</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <ArrowUp className="h-4 w-4 text-finance-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
              <p className="text-xs text-muted-foreground">All time income</p>
            </CardContent>
          </Card>
          
          <Card>
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
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Income vs Expenses by Category</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="Income" fill="#8B5CF6" />
                      <Bar dataKey="Expense" fill="#EF4444" />
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
                                <p className="text-xs text-gray-500">
                                  {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                                </p>
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
            
            <TabsContent value="expenses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
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
