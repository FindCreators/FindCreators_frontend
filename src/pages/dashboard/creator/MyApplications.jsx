import React, { useState, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  Calendar,
  ExternalLink,
  DollarSign,
  Tag,
  IndianRupee,
} from "lucide-react";
import { makeRequest } from "../../../network/apiHelpers";
import { getBrandProfile } from "../../../network/networkCalls";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [brandDetails, setBrandDetails] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await makeRequest({
        url: "/api/creator-myApplication?page=1&limit=10",
      });
      setApplications(response.listings || []);

      const brandIds = [
        ...new Set(response.listings?.map((l) => l.brandId) || []),
      ];
      const brands = await Promise.all(brandIds.map(getBrandProfile));
      setBrandDetails(
        brands.reduce((acc, br) => {
          br.data?.forEach((b) => {
            acc[b.id] = b;
          });
          return acc;
        }, {})
      );
    } catch (error) {
      toast.error("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      default: "bg-blue-100 text-blue-800",
    };
    return statusColors[status?.toLowerCase()] || statusColors.default;
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-24 w-full bg-gray-200 rounded mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Applications
        </h1>
        <p className="text-gray-600">Track and manage your job applications</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <div className="flex flex-col items-center">
            <p className="text-lg mb-4 text-gray-600">No applications found</p>
            <button
              onClick={() => navigate("/creator/available-jobs")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Available Jobs
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => {
            const brand = brandDetails[app.brandId];
            const isExpanded = expandedId === app.id;

            return (
              <div
                key={app.id}
                className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer 
                  ${isExpanded ? "ring-2 ring-blue-500" : ""}`}
                onClick={() => setExpandedId(isExpanded ? null : app.id)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        {app.title || "Untitled Position"}
                      </h2>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {app.location?.city || "Remote"},{" "}
                        {app.location?.country}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status || "Pending"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 my-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      {app.currency || "$"}{" "}
                      {app.budget?.toLocaleString() || "N/A"}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {app.skills?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isExpanded ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="p-4 bg-gray-50 rounded-lg mt-4">
                      <h4 className="font-semibold mb-2">Brand Details</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          {brand?.companyName || "Company name unavailable"}
                        </p>
                        <p>{brand?.email}</p>
                        <p>{brand?.phone}</p>
                      </div>
                    </div>

                    <p className="mt-4 text-gray-700">{app.description}</p>
                  </div>

                  <button
                    className="mt-4 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(isExpanded ? null : app.id);
                    }}
                  >
                    {isExpanded ? "Show Less" : "Show More"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
