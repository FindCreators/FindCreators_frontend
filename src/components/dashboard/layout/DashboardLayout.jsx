import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Users,
  Bell,
  UserCircle,
  MessageCircle,
  Menu,
  X,
  FileCheck,
} from "lucide-react";
import JobSearch from "../creator/JobSearch"; // Reusing the same search component
import CreatorSearch from "../brand/CreatorSearch";

const DashboardLayout = ({ userType }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const brandMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/brand" },
    { icon: PlusCircle, label: "Post New Job", path: "/brand/post-job" },
    { icon: ClipboardList, label: "My Jobs", path: "/brand/jobs" },
    { icon: Users, label: "Job In Progress", path: "/brand/in-progress-jobs" },
    {
      icon: FileCheck,
      label: "Job Submissions",
      path: "/brand/submissions",
    },
    {
      icon: ClipboardList,
      label: "Offers Management",
      path: "/brand/offers",
    },
    { icon: MessageCircle, label: "Messages", path: "/chat" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed w-full z-50">
        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between h-14 px-6">
          {/* Logo - Left */}
          <div className="w-48">
            <a
              href="/brand"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              FindCreators
            </a>
          </div>

          {/* Search - Center */}
          {/* Search - Center */}
          <div className="flex-1 max-w-2xl px-4">
            <CreatorSearch />
          </div>

          {/* Icons - Right */}
          <div className="w-48 flex items-center justify-end space-x-6">
            <Link
              to="/chat"
              className="text-gray-400 hover:text-gray-600 focus:outline-none transition duration-150"
              aria-label="Messages"
            >
              <MessageCircle className="h-6 w-6" />
            </Link>
            <button
              className="text-gray-400 hover:text-gray-600 focus:outline-none transition duration-150"
              aria-label="Notifications"
            >
              <Bell className="h-6 w-6" />
            </button>
            <Link
              to="/brand/profile"
              className="text-gray-400 hover:text-gray-600 focus:outline-none transition duration-150"
              aria-label="User Profile"
            >
              <UserCircle className="h-7 w-7" />
            </Link>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="sm:hidden flex flex-col px-4 py-2 space-y-2">
          <div className="flex items-center justify-between">
            <button
              className="p-2 text-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <a
              href="/brand"
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              FindCreators
            </a>

            <div className="flex items-center space-x-4">
              <Link
                to="/chat"
                className="text-gray-400 hover:text-gray-600 focus:outline-none transition duration-150"
                aria-label="Messages"
              >
                <MessageCircle className="h-6 w-6" />
              </Link>
              <button
                className="text-gray-400 hover:text-gray-600"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
              </button>
              <Link
                to="/brand/profile"
                className="text-gray-400 hover:text-gray-600"
                aria-label="User Profile"
              >
                <UserCircle className="h-6 w-6" />
              </Link>
            </div>
          </div>
          <div className="w-full">
            <JobSearch />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 sm:hidden">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="px-4 py-6 space-y-1">
              {brandMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
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
        </div>
      )}

      {/* Main Content Layout */}
      <div className="flex pt-[88px] sm:pt-[56px] md:flex-row flex-col">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 h-[calc(100vh-56px)] bg-white border-r border-gray-200 overflow-y-auto fixed left-0">
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
        <main className="flex-1 p-4 sm:p-8 md:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
