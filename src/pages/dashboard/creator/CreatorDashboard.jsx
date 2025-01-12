import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Clock,
  CheckCircle,
  DollarSign,
  MapPin,
  Calendar,
  IndianRupee,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../../network/apiHelpers";
import DashboardSkeleton from "../../../components/dashboard/creator/DashboardSkeleton";

const JobListSection = ({
  title,
  listings = [],
  onViewAll,
  emptyMessage,
  viewAllPath,
}) => (
  <div className="bg-white rounded-xl shadow-sm">
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold">
          {title}
        </h2>
        {(listings?.length ?? 0) > 0 && (
          <button
            onClick={onViewAll}
            className="mt-2 sm:mt-0 text-blue-600 hover:text-blue-700 text-sm"
          >
            View All →
          </button>
        )}
      </div>
      {(listings?.length ?? 0) === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>{emptyMessage}</p>
          <button
            onClick={() => onViewAll()}
            className="text-blue-600 hover:text-blue-700 mt-2"
          >
            Browse available jobs →
          </button>
        </div>
      ) : (
        <div className="divide-y">
          {listings.map((listing) => (
            <JobCard key={listing?.id ?? Math.random()} listing={listing} />
          ))}
        </div>
      )}
    </div>
  </div>
);

const JobCard = ({ listing }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <div className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="mb-3 sm:mb-0">
        <h3 className="font-medium text-sm sm:text-base">
          {listing?.title || "Untitled Job"}
        </h3>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>
            {listing?.location?.city || "Unknown City"},{" "}
            {listing?.location?.country || "Unknown Country"}
          </span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Posted: {formatDate(listing?.createdAt)}</span>
        </div>
        <span className="text-sm font-medium text-green-600">
          {listing?.currency || "$"}{" "}
          {listing?.budget ? listing.budget.toLocaleString() : "N/A"}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs sm:text-sm ${
            listing?.status?.toLowerCase() === "completed"
              ? "bg-green-100 text-green-800"
              : listing?.status?.toLowerCase() === "in progress"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {listing?.status || "No Status"}
        </span>
      </div>
    </div>
  );
};

const CreatorDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    completedJobs: 0,
    inProgressJobs: 0,
    totalEarned: 0,
    latestAppliedListings: [],
    latestInProgressListings: [],
    totalAppliedJobs: 0,
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
      setDashboardData({
        completedJobs: response?.completedJobs ?? 0,
        inProgressJobs: response?.inProgressJobs ?? 0,
        totalEarned: response?.totalEarned ?? 0,
        latestAppliedListings: response?.latestAppliedListings ?? [],
        latestInProgressListings: response?.latestInProgressListings ?? [],
        totalAppliedJobs: response?.totalAppliedJobs ?? 0,
      });
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
      label: "Applied Jobs",
      value: dashboardData?.totalAppliedJobs ?? 0,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Clock,
      label: "In Progress Jobs",
      value: dashboardData?.inProgressJobs ?? 0,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      icon: CheckCircle,
      label: "Completed Jobs",
      value: dashboardData?.completedJobs ?? 0,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: IndianRupee,
      label: "Total Earned",
      value: `$${(dashboardData?.totalEarned ?? 0).toLocaleString()}`,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
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

      <JobListSection
        title="In Progress Jobs"
        listings={dashboardData?.latestInProgressListings}
        onViewAll={() => navigate("/creator/in-progress-jobs")}
        emptyMessage="No in progress jobs yet."
        viewAllPath="/creator/in-progress-jobs"
      />

      <JobListSection
        title="Applied Jobs"
        listings={dashboardData?.latestAppliedListings}
        onViewAll={() => navigate("/creator/my-applications")}
        emptyMessage="No applied jobs yet."
        viewAllPath="/creator/my-applications"
      />
    </div>
  );
};

export default CreatorDashboard;
