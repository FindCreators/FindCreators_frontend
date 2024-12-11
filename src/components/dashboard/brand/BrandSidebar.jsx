import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BrandSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/brand" },
    { icon: PlusCircle, label: "Post New Job", path: "/brand/post-job" },
    { icon: ClipboardList, label: "My Jobs", path: "/brand/my-jobs" },
    { icon: Users, label: "Applications", path: "/brand/applications" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="px-4 py-6">
        <div className="flex items-center mb-8">
          <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="ml-3 text-lg font-semibold text-gray-900">
            Brand Dashboard
          </h2>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default BrandSidebar;
