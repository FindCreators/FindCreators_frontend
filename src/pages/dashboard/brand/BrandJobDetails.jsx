import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash2,
  ArrowLeft,
  MessageCircle,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Briefcase,
  Tag,
  Users,
  Link as LinkIcon,
} from "lucide-react";
import { makeRequest } from "../../../network/apiHelpers";
import toast from "react-hot-toast";

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
        status
      )}`}
    >
      {status || "Unknown"}
    </span>
  );
};

const InfoCard = ({ icon: Icon, title, value, className = "" }) => (
  <div className={`bg-white rounded-lg p-4 shadow-sm ${className}`}>
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-5 h-5 text-gray-500" />
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
    </div>
    <p className="text-lg font-medium text-gray-900">{value}</p>
  </div>
);

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h3 className="text-xl font-semibold mb-2">Delete Job Listing</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this job listing? This action cannot
          be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Listing
          </button>
        </div>
      </div>
    </div>
  );
};

const BrandJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setIsLoading(true);
      const response = await makeRequest({
        url: `/api/listings/?id=${id}`,
        method: "GET",
      });
      // Access the first item from the data array
      if (response.data && response.data.length > 0) {
        const jobData = response.data[0];
        // Convert skills from string to array if needed
        const processedJob = {
          ...jobData,
          skills: Array.isArray(jobData.skills) ? jobData.skills : [],
          location: jobData.location || { city: "", country: "" },
          attachments:
            jobData.attachments?.map((attachment) => ({
              name: attachment.fileName,
              url: attachment.fileUrl,
            })) || [],
        };
        setJob(processedJob);
      } else {
        setJob(null);
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("Failed to load job details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await makeRequest({
        url: `/api/listings?listingId=${id}`,
        method: "DELETE",
      });
      toast.success("Job listing deleted successfully");
      navigate("/brand/jobs");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job listing");
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Job Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The job listing you're looking for doesn't exist or has been
            removed.
          </p>
          <button
            onClick={() => navigate("/brand/jobs")}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Go back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <button
          onClick={() => navigate("/brand/jobs")}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Jobs
        </button>

        <div className="flex items-center gap-3">
          <StatusBadge status={job.status} />
          <button
            onClick={() => navigate(`/brand/jobs/${id}/edit`)}
            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 border border-red-600 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Title Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold mb-2">{job.title}</h1>
          <p className="text-gray-600">Posted on {formatDate(job.createdAt)}</p>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard
            icon={DollarSign}
            title="Budget"
            value={`${job.currency} ${job.budget?.toLocaleString()}`}
          />
          <InfoCard
            icon={Clock}
            title="Duration"
            value={job.duration || "Not specified"}
          />
          <InfoCard
            icon={Users}
            title="Applications"
            value={`${job.applicationsCount || 0} Proposals`}
          />
        </div>

        {/* Detailed Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold">Location</h3>
              </div>
              <p className="text-gray-700">
                {job.location?.city && job.location?.country
                  ? `${job.location.city}, ${job.location.country}`
                  : "Location not specified"}
              </p>
            </div>

            {/* Category */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold">Category</h3>
              </div>
              <p className="text-gray-700">{job.category || "Not specified"}</p>
            </div>

            {/* Start Date */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold">Start Date</h3>
              </div>
              <p className="text-gray-700">{formatDate(job.startDate)}</p>
            </div>

            {/* End Date */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold">End Date</h3>
              </div>
              <p className="text-gray-700">{formatDate(job.endDate)}</p>
            </div>
          </div>

          {/* Attachments Section */}
          {job.attachments?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <LinkIcon className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold">Attachments</h3>
              </div>
              <div className="space-y-2">
                {job.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Tag className="w-4 h-4" />
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {attachment.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* View Proposals Button */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate(`/brand/jobs/${job.id}/proposals`)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Proposals ({job.applicationsCount || 0})
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default BrandJobDetails;
