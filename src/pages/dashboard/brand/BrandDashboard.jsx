import React, { useState, useEffect } from "react";
import {
  BriefcaseIcon,
  Users,
  DollarSign,
  TrendingUp,
  MapPin,
  Calendar,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../../network/apiHelpers";

const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center">
          <div className="bg-gray-200 animate-pulse w-12 h-12 rounded-lg" />
          <div className="ml-4 flex-1">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3 mb-2" />
            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const JobCardSkeleton = () => (
  <div className="py-4 border-b border-gray-200">
    <div className="flex justify-between items-center">
      <div className="flex-1">
        <div className="h-5 bg-gray-200 animate-pulse rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
      </div>
      <div className="flex items-center gap-4">
        <div className="h-4 bg-gray-200 animate-pulse rounded w-24" />
        <div className="h-4 bg-gray-200 animate-pulse rounded w-20" />
        <div className="h-6 bg-gray-200 animate-pulse rounded w-16" />
      </div>
    </div>
  </div>
);

const BrandDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    activeJobs: 0,
    completedJobs: 0,
    inProgressJobs: 0,
    totalSpent: 0,
    latestActiveListings: [],
    latestInProgressListings: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await makeRequest({
        url: "/api/brand-dashboard",
      });
      setDashboardData({
        activeJobs: response?.activeJobs || 0,
        completedJobs: response?.completedJobs || 0,
        inProgressJobs: response?.inProgressJobs || 0,
        totalSpent: response?.totalSpent || 0,
        latestActiveListings: response?.latestActiveListings || [],
        latestInProgressListings: response?.latestInProgressListings || [],
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
      icon: BriefcaseIcon,
      label: "Active Jobs",
      value: dashboardData?.activeJobs || 0,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: TrendingUp,
      label: "In Progress Jobs",
      value: dashboardData?.inProgressJobs || 0,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      icon: Users,
      label: "Completed Jobs",
      value: dashboardData?.completedJobs || 0,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: DollarSign,
      label: "Total Spent",
      value: `$${(dashboardData?.totalSpent || 0).toLocaleString()}`,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderJobList = (jobs = [], title, emptyMessage, viewAllPath) => (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          {(jobs?.length ?? 0) > 0 && (
            <button
              onClick={() => navigate(viewAllPath)}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              View All →
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="divide-y">
            {[1, 2, 3].map((i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : (jobs?.length ?? 0) === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>{emptyMessage}</p>
            <button
              onClick={() => navigate("/brand/post-job")}
              className="text-blue-600 hover:text-blue-700 mt-2"
            >
              Create more job post →
            </button>
          </div>
        ) : (
          <div className="divide-y">
            {jobs.map((job) => (
              <div
                key={job?.id}
                className="py-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium text-gray-900">
                    {job?.title || "Untitled Job"}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {job?.location?.city || "Unknown"},{" "}
                        {job?.location?.country || "Unknown"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(job?.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-gray-500">
                      {job?.applicationsCount || 0} applications
                    </span>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    {job?.currency || "$"} {(job?.budget || 0).toLocaleString()}
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    {job?.status || "Unknown"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-semibold">Brand Dashboard</h1>
        <button
          onClick={() => navigate("/brand/post-job")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mt-4 md:mt-0"
        >
          Post New Job
        </button>
      </div>

      {isLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      )}

      {renderJobList(
        dashboardData?.latestInProgressListings,
        "In Progress Job Posts",
        "No in progress job posts yet.",
        "/brand/in-progress-jobs"
      )}

      {renderJobList(
        dashboardData?.latestActiveListings,
        "Recent Job Posts",
        "No active job posts yet.",
        "/brand/jobs"
      )}
    </div>
  );
};

export default BrandDashboard;
