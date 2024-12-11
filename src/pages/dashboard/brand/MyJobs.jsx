import React from "react";
import { MessageCircle, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router";

const MyJobs = () => {
  const navigate = useNavigate();
  const handleViewProposals = (jobId) => {
    navigate(`/brand/jobs/${jobId}/proposals`);
  };

  const jobStatuses = [
    { label: "In progress", count: 2, id: "in-progress" },
    { label: "Action needed", count: 5, id: "action-needed" },
    { label: "Hiring", count: 4, id: "hiring" },
  ];

  const jobs = [
    {
      id: 1,
      title: "ReactJS Developer for API Integration",
      status: "in-progress",
      freelancer: {
        name: "Muhammad A.",
        avatar: "/api/placeholder/32/32",
        country: "Pakistan",
      },
      proposals: 4,
      messaged: 1,
      hired: 0,
      postedDate: "2 weeks ago",
    },
    {
      id: 2,
      title: "Kotlin Developer for React Native Feature",
      status: "in-progress",
      freelancer: {
        name: "Ahmad R.",
        avatar: "/api/placeholder/32/32",
        country: "Pakistan",
      },
      proposals: 6,
      messaged: 2,
      hired: 1,
      postedDate: "3 weeks ago",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Your jobs</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/brand/post-job")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Post a job
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-4 mb-6">
        {jobStatuses.map((status) => (
          <button
            key={status.id}
            className="px-4 py-2 rounded-full border border-gray-300 hover:border-gray-400"
          >
            {status.label} ({status.count})
          </button>
        ))}
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-lg shadow">
        {jobs.map((job, index) => (
          <div
            key={job.id}
            className={`p-6 ${
              index !== jobs.length - 1 ? "border-b border-gray-200" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <img
                  src={job.freelancer.avatar}
                  alt={job.freelancer.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Posted {job.postedDate}
                  </p>
                  <div className="mt-2 flex items-center gap-6">
                    <span className="inline-flex items-center text-sm text-gray-600">
                      {job.proposals} Proposals
                    </span>
                    <span className="inline-flex items-center text-sm text-gray-600">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {job.messaged} Messaged
                    </span>
                    <span className="inline-flex items-center text-sm text-gray-600">
                      {job.hired} Hired
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  className="text-green-600 hover:text-green-700 font-medium"
                  onClick={() => handleViewProposals(job.id)}
                >
                  View proposals
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyJobs;
