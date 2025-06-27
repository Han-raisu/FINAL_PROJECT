import { Link, useLocation } from "react-router-dom";
import { Sword, ChefHat } from "lucide-react";
import { useUserStore } from "./index";

const Header = () => {
  const location = useLocation();
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  const navItems = [
    { path: "/ingredients", icon: Sword, label: "食材管理" },
    { path: "/recipes", icon: ChefHat, label: "レシピ" },
    { path: "/login", icon: ChefHat, label: "ログイン" }
  ];

  return (
    <nav className="bg-white shadow-lg overflow-x-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 min-w-max space-x-4">
          <Link to="/" className="text-xl font-bold text-gray-800">
            <span className="whitespace-nowrap">TOPページ</span>
          </Link>

          <div className="flex space-x-4 overflow-x-auto ">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={isLoggedIn ? item.path : "/login"}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md  font-medium whitespace-nowrap text-xl ${
                  location.pathname === item.path
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
