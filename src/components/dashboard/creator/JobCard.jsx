// src/components/dashboard/creator/JobCard.jsx
import React from "react";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job, onApply, isApplied, onViewDetails }) => {
  console.log(isApplied);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const daysUntilDeadline = (deadline) => {
    const days = Math.ceil(
      (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return days > 0 ? `${days} days left` : "Deadline passed";
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
      onClick={() => onViewDetails(job)}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start">
          {/* Title and Category */}
          <div className="flex-1 mb-4 md:mb-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {job.title}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  job.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {job.status}
              </span>
            </div>
            <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
              {job.category}
            </span>
          </div>
          <div className="">
            <div className="text-2xl font-bold text-gray-900">
              {job.currency} {job.budget}
            </div>
            <span className="text-sm text-gray-500">{job.duration}</span>
          </div>
        </div>
        <p className="mt-4 text-gray-600 leading-relaxed">{job.description}</p>
        {job.skills?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Info Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-6 border-t">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {job.location.city}, {job.location.country}
            </span>
          </div>
          <div className="flex gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {daysUntilDeadline(job.deadline)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {job.applicationsCount} applications
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              Posted {formatDate(job.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-wrap gap-4 mb-4 sm:mb-0">
          {job.tags?.map((tag, index) => (
            <span key={index} className="text-sm text-gray-500">
              #{tag}
            </span>
          ))}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onApply(job.id);
          }}
          disabled={isApplied}
          className={`px-6 py-2 rounded-lg transition-all duration-200 w-full sm:w-auto ${
            isApplied
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isApplied ? "Applied" : "Apply Now"}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
