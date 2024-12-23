// src/components/dashboard/brand/BrandDashboard.jsx
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
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    totalActiveListings: 0,
    totalApplications: 0,
    totalSpent: 0,
    latestActiveListings: [],
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
      icon: BriefcaseIcon,
      label: "Active Jobs",
      value: dashboardData.totalActiveListings,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Users,
      label: "Total Applications",
      value: dashboardData.totalApplications,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: DollarSign,
      label: "Total Spent",
      value: `$${dashboardData.totalSpent.toLocaleString()}`,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: TrendingUp,
      label: "Campaign ROI",
      value: "--",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Brand Dashboard</h1>
        <button
          onClick={() => navigate("/brand/post-job")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Post New Job
        </button>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <StatsSkeleton />
      ) : (
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
      )}

      {/* Recent Jobs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Job Posts</h2>
            {dashboardData.totalActiveListings > 0 && (
              <button
                onClick={() => navigate("/brand/jobs")}
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
          ) : dashboardData.latestActiveListings?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No active job posts yet.</p>
              <button
                onClick={() => navigate("/brand/post-job")}
                className="text-blue-600 hover:text-blue-700 mt-2"
              >
                Create your first job post →
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {dashboardData.latestActiveListings.map((job) => (
                <div
                  key={job.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {job.location.city}, {job.location.country}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(job.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="text-gray-500">
                        {job.applicationsCount} applications
                      </span>
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      {job.currency} {job.budget.toLocaleString()}
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      {job.status}
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

export default BrandDashboard;
