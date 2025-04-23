
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  CreditCard, 
  DollarSign, 
  Home, 
  LogOut, 
  Menu, 
  Minus,
  PieChart, 
  Plus, 
  Wallet, 
  X 
} from "lucide-react";

export const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/dashboard",
    },
    {
      title: "Add Income",
      icon: <Plus className="h-5 w-5 text-finance-success" />,
      path: "/add-income",
    },
    {
      title: "Add Expense",
      icon: <Minus className="h-5 w-5 text-finance-danger" />,
      path: "/add-expense",
    },
    {
      title: "Transactions",
      icon: <CreditCard className="h-5 w-5" />,
      path: "/transactions",
    },
  ];

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-4 w-4" />
      </Button>

      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out shadow-lg ${
          collapsed ? "-translate-x-full" : "translate-x-0"
        } lg:translate-x-0`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Wallet className="h-6 w-6 text-finance-purple" />
              <span className="text-xl font-bold ml-2 text-finance-purple-dark">FinTrack</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleSidebar}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="mt-8 flex-1">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link to={item.path}>
                    <Button
                      variant={location.pathname === item.path ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        location.pathname === item.path
                          ? "bg-finance-purple text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {item.icon}
                      <span className="ml-2">{item.title}</span>
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto">
            <Button
              variant="outline"
              className="w-full justify-start text-gray-600"
              onClick={logout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
