
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

const COLORS = ["#8B5CF6", "#10B981", "#EF4444", "#6366F1", "#14B8A6", "#F59E0B", "#EC4899", "#06B6D4"];

interface IncomeByCategoryChartProps {
  data: any[];
}

export function IncomeByCategoryChart({ data }: IncomeByCategoryChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income by Category</CardTitle>
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
              fill="#10B981"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-income-${index}`} fill={COLORS[index % COLORS.length]} />
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
