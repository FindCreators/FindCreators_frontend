import React from "react";
import { Briefcase, Clock, CheckCircle, DollarSign } from "lucide-react";

const CreatorDashboard = () => {
  const stats = [
    {
      icon: Briefcase,
      label: "Applied Jobs",
      value: "8",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Clock,
      label: "Pending Reviews",
      value: "3",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      icon: CheckCircle,
      label: "Completed Jobs",
      value: "15",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: DollarSign,
      label: "Total Earned",
      value: "$12,500",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const activeApplications = [
    {
      id: 1,
      companyName: "HealthTech Inc",
      jobTitle: "Health App Promotion",
      status: "Under Review",
      appliedDate: "2024-12-15",
      budget: "$2,000",
    },
    {
      id: 2,
      companyName: "FitLife Products",
      jobTitle: "Fitness Product Launch",
      status: "Shortlisted",
      appliedDate: "2024-12-17",
      budget: "$3,500",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Creator Dashboard</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Browse Jobs
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
          <h2 className="text-xl font-semibold mb-4">Active Applications</h2>
          <div className="divide-y">
            {activeApplications.map((application) => (
              <div
                key={application.id}
                className="py-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">{application.jobTitle}</h3>
                  <p className="text-sm text-gray-600">
                    {application.companyName}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Applied:{" "}
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {application.budget}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                    {application.status}
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

export default CreatorDashboard;
