import React from "react";
import {
  TrendingUp,
  Users,
  DollarSign,
  Award,
  IndianRupee,
} from "lucide-react";

const StatsSection = ({ profile }) => {
  const stats = [
    {
      icon: Users,
      label: "Followers",
      value: profile?.followers || 0,
    },
    {
      icon: TrendingUp,
      label: "Engagement Rate",
      value: `${profile?.engagementRate || 0}%`,
    },
    {
      icon: IndianRupee,
      label: "Total Earnings",
      value: `${profile?.currency} ${profile?.totalEarnings || 0}`,
    },
    {
      icon: Award,
      label: "Awards",
      value: profile?.awards || 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <stat.icon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;
