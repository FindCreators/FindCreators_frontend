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
      setDashboardData(response || {}); // Fallback to an empty object
    } catch (error) {
      toast.error("Failed to load dashboard data");
      console.error("Dashboard fetch error:", error);
      setDashboardData({}); // Fallback to an empty object in case of error
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      icon: Briefcase,
      label: "Active Applications",
      value: dashboardData?.latestActiveListings?.length || 0,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Clock,
      label: "Pending Reviews",
      value: dashboardData?.ratings || 0,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      icon: CheckCircle,
      label: "Completed Jobs",
      value: dashboardData?.numberOfCompletedJobs || 0,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: DollarSign,
      label: "Total Earned",
      value: `$${dashboardData?.totalEarned?.toLocaleString() || 0}`,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Fallback for null or undefined dates
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
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-center md:text-left">
          Creator Dashboard
        </h1>
        <button
          onClick={() => navigate("/creator/available-jobs")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto text-center"
        >
          Browse Jobs
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold">
              Active Applications
            </h2>
            {dashboardData?.latestActiveListings?.length > 0 && (
              <button
                onClick={() => navigate("/creator/my-applications")}
                className="mt-2 sm:mt-0 text-blue-600 hover:text-blue-700 text-sm"
              >
                View All →
              </button>
            )}
          </div>
          {dashboardData?.latestActiveListings?.length === 0 ? (
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
              {dashboardData?.latestActiveListings?.map((application) => (
                <div
                  key={application?.id}
                  className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center"
                >
                  <div className="mb-3 sm:mb-0">
                    <h3 className="font-medium text-sm sm:text-base">
                      {application?.title || "Untitled Job"}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {application?.location?.city || "Unknown City"},{" "}
                      {application?.location?.country || "Unknown Country"}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Posted: {formatDate(application?.createdAt)}
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {application?.currency || "$"}{" "}
                      {application?.budget
                        ? application.budget.toLocaleString()
                        : "N/A"}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-800">
                      {application?.status || "No Status"}
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
