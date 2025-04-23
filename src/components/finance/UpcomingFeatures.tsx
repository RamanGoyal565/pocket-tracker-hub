
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, CreditCard } from "lucide-react";

export function UpcomingFeatures() {
  return (
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
  );
}
