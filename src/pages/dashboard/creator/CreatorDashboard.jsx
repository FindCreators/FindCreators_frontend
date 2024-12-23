import React, { useState, useEffect } from "react";
import { Briefcase, Clock, CheckCircle, DollarSign } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../../network/apiHelpers";

const CreatorDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    numberOfActiveApplications: 0,
    numberOfCompletedJobs: 0,
    totalEarned: 0,
    latestActiveListings: [],
    ratings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await makeRequest({
        url: "/api/creator-dashboard",
      });
      setDashboardData(response);
    } catch (error) {
      toast.error("Failed to load dashboard data");
      console.error("Dashboard fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      icon: Briefcase,
      label: "Active Applications",
      value: dashboardData.numberOfActiveApplications,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Clock,
      label: "Pending Reviews",
      value: dashboardData.ratings,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      icon: CheckCircle,
      label: "Completed Jobs",
      value: dashboardData.numberOfCompletedJobs,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: DollarSign,
      label: "Total Earned",
      value: `$${dashboardData.totalEarned.toLocaleString()}`,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Creator Dashboard</h1>
        <button
          onClick={() => navigate("/creator/available-jobs")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Jobs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Active Applications</h2>
            {dashboardData.latestActiveListings.length > 0 && (
              <button
                onClick={() => navigate("/creator/my-applications")}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                View All →
              </button>
            )}
          </div>
          {dashboardData.latestActiveListings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No active applications yet.</p>
              <button
                onClick={() => navigate("/creator/available-jobs")}
                className="text-blue-600 hover:text-blue-700 mt-2"
              >
                Browse available jobs →
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {dashboardData.latestActiveListings.map((application) => (
                <div
                  key={application.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{application.title}</h3>
                    <p className="text-sm text-gray-600">
                      {application.location.city},{" "}
                      {application.location.country}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      Posted: {formatDate(application.createdAt)}
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {application.currency}{" "}
                      {application.budget.toLocaleString()}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {application.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;
