
import { useState, useEffect } from "react";
import { 
  ArrowDown, 
  ArrowUp, 
  Calendar, 
  Search,
  Trash2,
  CreditCard,
  Wallet,
  Smartphone,
  Globe,
  Tag
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency, getTransactions, removeTransaction, getMonthlyTransactions } from "@/utils/finance";
import { Transaction } from "@/types/finance";
import { Sidebar } from "@/components/finance/Sidebar";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterPaymentMode, setFilterPaymentMode] = useState<string>("all");
  const [monthlyTransactions, setMonthlyTransactions] = useState<Record<string, Transaction[]>>({});
  const { toast } = useToast();

  useEffect(() => {
    // Load transactions
    const loadTransactions = () => {
      const allTransactions = getTransactions().sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setTransactions(allTransactions);
      setMonthlyTransactions(getMonthlyTransactions());
    };

    loadTransactions();
  }, []);

  const handleDeleteTransaction = (id: string) => {
    removeTransaction(id);
    
    // Update the transactions list
    setTransactions(prev => prev.filter(t => t.id !== id));
    
    toast({
      title: "Transaction deleted",
      description: "The transaction has been removed from your records.",
    });
  };

  const getPaymentModeIcon = (paymentMode?: string) => {
    switch(paymentMode) {
      case 'cash':
        return <Wallet className="h-4 w-4 mr-1" />;
      case 'upi':
        return <Smartphone className="h-4 w-4 mr-1" />;
      case 'netbanking':
        return <Globe className="h-4 w-4 mr-1" />;
      case 'card':
        return <CreditCard className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  // Filter transactions based on searchTerm, filterType and filterPaymentMode
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      filterType === "all" || 
      transaction.type === filterType;
    
    const matchesPaymentMode = 
      filterPaymentMode === "all" || 
      transaction.paymentMode === filterPaymentMode;
    
    return matchesSearch && matchesType && matchesPaymentMode;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Transactions History</h1>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="monthly">Monthly View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>
                  View and manage your income and expense transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search transactions..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    <Select 
                      value={filterType} 
                      onValueChange={(value: "all" | "income" | "expense") => setFilterType(value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select 
                      value={filterPaymentMode} 
                      onValueChange={(value) => setFilterPaymentMode(value)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Payment Mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Modes</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="netbanking">Net Banking</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {filteredTransactions.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              <div
                                className={`p-1.5 rounded-full inline-flex ${
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
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                                {new Date(transaction.date).toLocaleDateString('en-IN')}
                              </div>
                            </TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-normal">
                                {transaction.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {transaction.paymentMode && (
                                <div className="flex items-center">
                                  {getPaymentModeIcon(transaction.paymentMode)}
                                  <span className="capitalize">{transaction.paymentMode}</span>
                                </div>
                              )}
                            </TableCell>
                            <TableCell
                              className={`text-right font-medium ${
                                transaction.type === "income"
                                  ? "text-finance-success"
                                  : "text-finance-danger"
                              }`}
                            >
                              {transaction.type === "income" ? "+" : "-"}
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTransaction(transaction.id)}
                              >
                                <Trash2 className="h-4 w-4 text-gray-500 hover:text-finance-danger" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No transactions found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="monthly">
            {Object.entries(monthlyTransactions).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(monthlyTransactions).map(([month, monthTransactions]) => (
                  <Card key={month}>
                    <CardHeader>
                      <CardTitle>{month}</CardTitle>
                      <CardDescription>
                        {monthTransactions.length} transactions | Income: {
                          formatCurrency(monthTransactions.filter(t => t.type === 'income')
                            .reduce((sum, t) => sum + t.amount, 0))
                        } | Expense: {
                          formatCurrency(monthTransactions.filter(t => t.type === 'expense')
                            .reduce((sum, t) => sum + t.amount, 0))
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Type</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {monthTransactions.sort((a, b) => 
                              new Date(b.date).getTime() - new Date(a.date).getTime()
                            ).map((transaction) => (
                              <TableRow key={transaction.id}>
                                <TableCell>
                                  <div
                                    className={`p-1.5 rounded-full inline-flex ${
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
                                </TableCell>
                                <TableCell>
                                  {new Date(transaction.date).toLocaleDateString('en-IN')}
                                </TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="font-normal">
                                    {transaction.category}
                                  </Badge>
                                </TableCell>
                                <TableCell
                                  className={`text-right font-medium ${
                                    transaction.type === "income"
                                      ? "text-finance-success"
                                      : "text-finance-danger"
                                  }`}
                                >
                                  {transaction.type === "income" ? "+" : "-"}
                                  {formatCurrency(transaction.amount)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-gray-500">No transactions found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Transactions;
