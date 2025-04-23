
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, CreditCard, Wallet, Smartphone, Globe } from "lucide-react";
import { Transaction } from "@/types/finance";
import { formatCurrency } from "@/utils/finance";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

function getPaymentModeIcon(paymentMode?: string) {
  switch (paymentMode) {
    case "cash":
      return <Wallet className="h-4 w-4 mr-1 text-green-500" />;
    case "upi":
      return <Smartphone className="h-4 w-4 mr-1 text-indigo-500" />;
    case "netbanking":
      return <Globe className="h-4 w-4 mr-1 text-purple-500" />;
    case "card":
      return <CreditCard className="h-4 w-4 mr-1 text-amber-500" />;
    default:
      return null;
  }
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
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
  );
}
