
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "@/utils/finance";

const PAYMENT_COLORS = {
  cash: "#10B981",
  upi: "#6366F1",
  netbanking: "#8B5CF6",
  card: "#F59E0B",
  other: "#64748B"
};

interface PaymentsByModeChartProps {
  data: any[];
}

export function PaymentsByModeChart({ data }: PaymentsByModeChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Payment Mode</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-mode-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
