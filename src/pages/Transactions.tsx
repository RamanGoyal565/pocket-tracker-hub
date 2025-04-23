
import { useState, useEffect } from "react";
import { 
  ArrowDown, 
  ArrowUp, 
  Calendar, 
  Search,
  Trash2
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
import { formatCurrency, getTransactions, removeTransaction } from "@/utils/finance";
import { Transaction } from "@/types/finance";
import { Sidebar } from "@/components/finance/Sidebar";
import { useToast } from "@/components/ui/use-toast";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const { toast } = useToast();

  useEffect(() => {
    // Load transactions
    const loadTransactions = () => {
      const allTransactions = getTransactions().sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setTransactions(allTransactions);
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

  // Filter transactions based on searchTerm and filterType
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      filterType === "all" || 
      transaction.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Transactions History</h1>
        
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
              
              <div className="flex gap-2">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  onClick={() => setFilterType("all")}
                  className={filterType === "all" ? "bg-finance-purple" : ""}
                >
                  All
                </Button>
                <Button
                  variant={filterType === "income" ? "default" : "outline"}
                  onClick={() => setFilterType("income")}
                  className={filterType === "income" ? "bg-finance-success" : ""}
                >
                  <ArrowUp className="mr-1 h-4 w-4" />
                  Income
                </Button>
                <Button
                  variant={filterType === "expense" ? "default" : "outline"}
                  onClick={() => setFilterType("expense")}
                  className={filterType === "expense" ? "bg-finance-danger" : ""}
                >
                  <ArrowDown className="mr-1 h-4 w-4" />
                  Expense
                </Button>
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
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
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
      </div>
    </div>
  );
};

export default Transactions;
