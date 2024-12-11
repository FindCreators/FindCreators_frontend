import React from "react";
import { BriefcaseIcon, Users, DollarSign } from "lucide-react";

const BrandDashboard = () => {
  const stats = [
    {
      icon: BriefcaseIcon,
      label: "Active Jobs",
      value: "12",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Users,
      label: "Total Applications",
      value: "48",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: DollarSign,
      label: "Total Spent",
      value: "$24,500",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center">
                <div className={`${stat.iconBg} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                    {stat.value}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Applications Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Applications
        </h2>
        <div className="text-gray-500">No applications yet</div>
      </div>
    </div>
  );
};

export default BrandDashboard;
