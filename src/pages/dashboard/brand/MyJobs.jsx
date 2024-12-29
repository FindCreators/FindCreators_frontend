import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, MoreHorizontal, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getBrandListings } from "../../../network/networkCalls";
import JobOptionsPopup from "../../../components/dashboard/brand/JobOptionsPopup";

const MyJobs = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalJobs: 0,
  });
  const [filters, setFilters] = useState({
    status: "all",
    categories: [],
    budget: null,
  });
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    "in-progress": 0,
    "action-needed": 0,
    hiring: 0,
  });
  const [selectedJobId, setSelectedJobId] = useState(null);
  const buttonRef = useRef(null);

  const jobStatuses = [
    { label: "All Jobs", count: statusCounts.all, id: "all" },
  ];

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await getBrandListings(
        pagination.page,
        pagination.limit,
        filters
      );

      setJobs(response.data || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: Math.ceil(response.total / prev.limit),
        totalJobs: response.total,
      }));

      const newStatusCounts = {
        all: response.data?.length || 0,
        "in-progress":
          response.data?.filter((job) => job.status === "in-progress").length ||
          0,
        "action-needed":
          response.data?.filter((job) => job.status === "action-needed")
            .length || 0,
        hiring:
          response.data?.filter((job) => job.status === "hiring").length || 0,
      };
      setStatusCounts(newStatusCounts);
    } catch (error) {
      toast.error("Failed to fetch jobs");
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [pagination.page, filters]);

  const handleViewProposals = (jobId, applicants) => {
    navigate(`/brand/jobs/${jobId}/proposals`, { state: { applicants } });
  };

  const handleStatusChange = (statusId) => {
    setFilters((prev) => ({ ...prev, status: statusId }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Your jobs</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/brand/post-job")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Post a job
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {jobStatuses.map((status) => (
          <button
            key={status.id}
            onClick={() => handleStatusChange(status.id)}
            className={`px-4 py-2 rounded-full border transition-colors whitespace-nowrap
              ${
                filters.status === status.id
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
          >
            {status.label} ({status.count})
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="w-8 h-8 animate-spin text-green-600" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No jobs found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow relative">
          {jobs.map((job, index) => (
            <div
              key={job.id}
              className={`p-6 ${
                index !== jobs.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Posted {formatDate(job.createdAt)}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-6">
                    <span className="inline-flex items-center text-sm text-gray-600">
                      {job.applicationsCount || 0} Proposals
                    </span>
                    <span className="inline-flex items-center text-sm text-gray-600">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {job.messagesCount || 0} Messaged
                    </span>
                    <span className="inline-flex items-center text-sm text-gray-600">
                      Budget: {job.currency} {job.budget}
                    </span>
                  </div>
                  {job.skills?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {job.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs bg-gray-100 rounded-full text-gray-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    className="text-green-600 hover:text-green-700 font-medium transition-colors"
                    onClick={() => handleViewProposals(job.id, job.applicants)}
                  >
                    View proposals
                  </button>
                  <button
                    ref={buttonRef}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setSelectedJobId(job.id)}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {selectedJobId === job.id && (
                <JobOptionsPopup
                  jobId={job.id}
                  onClose={() => setSelectedJobId(null)}
                  fetchJobs={fetchJobs}
                  buttonRef={buttonRef}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {[...Array(pagination.totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: i + 1 }))
              }
              className={`px-3 py-1 rounded ${
                pagination.page === i + 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;
