import React from "react";
import { BriefcaseIcon, Users, DollarSign, TrendingUp } from "lucide-react";

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
    {
      icon: TrendingUp,
      label: "Campaign ROI",
      value: "+28%",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  const recentJobs = [
    {
      id: 1,
      title: "Health App Promotion",
      budget: "$2,000",
      applications: 12,
      status: "active",
      postedDate: "2024-12-15",
    },
    {
      id: 2,
      title: "Fitness Product Launch",
      budget: "$3,500",
      applications: 8,
      status: "active",
      postedDate: "2024-12-17",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Brand Dashboard</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Post New Job
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className={`${stat.iconBg} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Job Posts</h2>
          <div className="divide-y">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="py-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="text-sm text-gray-600">
                    Posted on {new Date(job.postedDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {job.applications} applications
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {job.budget}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDashboard;
