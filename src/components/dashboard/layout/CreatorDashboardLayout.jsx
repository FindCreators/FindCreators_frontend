import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  ClipboardCheck,
  Bell,
  UserCircle,
} from "lucide-react";

const CreatorDashboardLayout = () => {
  const location = useLocation();

  const creatorMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/creator" },
    {
      icon: Briefcase,
      label: "Available Jobs",
      path: "/creator/available-jobs",
    },
    {
      icon: ClipboardCheck,
      label: "My Applications",
      path: "/creator/my-applications",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 fixed w-full z-50">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-600">
              <Bell className="h-5 w-5" />
            </button>
            <button>
              <UserCircle className="h-6 w-6 text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-[57px]">
        <aside className="fixed left-0 w-64 h-[calc(100vh-57px)] bg-white border-r border-gray-200 overflow-y-auto">
          <div className="px-4 py-6">
            <div className="flex items-center mb-8">
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="ml-3 text-lg font-semibold text-gray-900">
                Creator Dashboard
              </h2>
            </div>
            <nav className="space-y-1">
              {creatorMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                      isActive
                        ? "bg-purple-50 text-purple-600"
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
        <main className="flex-1 ml-64 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CreatorDashboardLayout;
