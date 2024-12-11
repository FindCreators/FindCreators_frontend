import React from "react";
import { Bell, Search, ChevronDown, UserCircle } from "lucide-react";

const BrandTopNav = () => (
  <nav className="bg-white border-b border-gray-200">
    <div className="px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold text-blue-600">FindCreators</h1>
        <div className="hidden md:flex items-center gap-6">
          <div className="relative group">
            <button className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
              Solutions <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          <div className="relative group">
            <button className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
              Resources <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          <button className="text-gray-600 hover:text-gray-900">Pricing</button>
          <button className="text-gray-600 hover:text-gray-900">About</button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-gray-600">
          <Bell className="h-5 w-5" />
        </button>
        <button>
          <UserCircle className="h-6 w-6 text-gray-400" />
        </button>
      </div>
    </div>
  </nav>
);

export default BrandTopNav;
