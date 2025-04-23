
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";
import { formatCurrency } from "@/utils/finance";

interface OverviewCardsProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

export function OverviewCards({ balance, totalIncome, totalExpense }: OverviewCardsProps) {
  return (
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
  );
}
