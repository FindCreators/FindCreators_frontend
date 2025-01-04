import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Users,
  Bell,
  UserCircle,
  MessageCircle,
} from "lucide-react";

const DashboardLayout = ({ userType }) => {
  const location = useLocation();
  // const isBrand = userType === "brand";

  const brandMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/brand" },
    { icon: PlusCircle, label: "Post New Job", path: "/brand/post-job" },
    { icon: ClipboardList, label: "My Jobs", path: "/brand/jobs" },
    { icon: Users, label: "Job In Progress", path: "/brand/in-progress-jobs" },
    { icon: MessageCircle, label: "Messages", path: "/chat" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 fixed w-full z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-3">
            <a
              href="/brand"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              FindCreators
            </a>
          </div>

          {/* Notifications and Profile */}
          <div className="flex items-center space-x-6">
            <button
              className="text-gray-400 hover:text-gray-600 focus:outline-none transition duration-150"
              aria-label="Notifications"
            >
              <Bell className="h-6 w-6" />
            </button>
            <Link
              to="/brand/profile" // Link to the profile page
              className="text-gray-400 hover:text-gray-600 focus:outline-none transition duration-150"
              aria-label="User Profile"
            >
              <UserCircle className="h-7 w-7" />
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row pt-[57px]">
        {/* Sidebar */}
        <aside className="w-full md:w-64 md:h-[calc(100vh-57px)] bg-white border-r border-gray-200 overflow-y-auto md:fixed md:left-0">
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
              {brandMenuItems.map((item) => {
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

        {/* Main Content */}
        <main className="flex-1 p-4 md:ml-64 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
