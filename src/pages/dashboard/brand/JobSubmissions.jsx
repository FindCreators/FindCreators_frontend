import React, { useState, useEffect } from "react";
import {
  FileText,
  Link as LinkIcon,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  UserCircle,
} from "lucide-react";
import { makeRequest } from "../../../network/apiHelpers";
import { toast } from "react-hot-toast";
import { getCreatorProfile } from "../../../network/networkCalls";
import CreatorProfileModal from "../../../components/dashboard/creator/CreatorProfileModal";

const CreatorInfo = ({ creatorId, brandId }) => {
  const [creatorProfile, setCreatorProfile] = useState(null);
  const [error, setError] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };

  useEffect(() => {
    const fetchCreatorProfile = async () => {
      try {
        console.log("Fetching profile for creator:", creatorId);
        const response = await getCreatorProfile(creatorId);
        console.log("Creator profile response:", response);

        // Check if response has data array and it's not empty
        if (response && response.data && response.data.length > 0) {
          setCreatorProfile(response.data[0]); // Take the first item from the array
        } else {
          setError("Invalid profile data");
        }
      } catch (error) {
        console.error("Error fetching creator profile:", error);
        setError(error.message);
      }
    };

    if (creatorId) {
      fetchCreatorProfile();
    }
  }, [creatorId]);

  if (error) {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <UserCircle className="w-6 h-6 text-gray-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Creator info unavailable</p>
        </div>
      </div>
    );
  }

  if (!creatorProfile) {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="relative w-10 h-10">
        {imageError || !creatorProfile.profilePicture ? (
          <div
            className="w-full h-full flex items-center justify-center cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full"
            onClick={() => setShowProfile(true)}
          >
            {getInitials(creatorProfile.fullName)}
          </div>
        ) : (
          <img
            onClick={() => setShowProfile(true)}
            src={creatorProfile.profilePicture}
            alt={creatorProfile.fullName || "Creator"}
            className="w-full h-full object-cover cursor-pointer rounded-full cursor-pointer"
            onError={handleImageError}
          />
        )}
      </div>
      <div>
        <h3
          className="font-medium text-gray-900 cursor-pointer"
          onClick={() => setShowProfile(true)}
        >
          {creatorProfile.fullName || "Anonymous Creator"}
        </h3>
        <p className="text-sm text-gray-500">
          {creatorProfile.email || "No email provided"}
        </p>
      </div>
      <CreatorProfileModal
        brandId={brandId}
        creator={creatorProfile}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </div>
  );
};

const JobSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await makeRequest({
        url: "/api/submission-all",
      });
      setSubmissions(response.submissions || []);
    } catch (error) {
      toast.error("Failed to load submissions");
      console.error("Submissions fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleAccept = async (submissionId) => {
    try {
      await makeRequest({
        url: `/api/submission-accept?submissionId=${submissionId}`,
        method: "GET",
      });
      toast.success("Submission accepted successfully");
      fetchSubmissions();
    } catch (error) {
      toast.error("Failed to accept submission");
      console.error("Accept submission error:", error);
    }
  };

  const handleReject = async () => {
    if (!selectedSubmission || !rejectionMessage.trim()) return;

    try {
      await makeRequest({
        url: "/api/submission-reject",
        method: "POST",
        data: {
          submissionId: selectedSubmission.id,
          message: rejectionMessage,
        },
      });
      toast.success("Submission rejected");
      setIsRejectionModalOpen(false);
      setRejectionMessage("");
      setSelectedSubmission(null);
      fetchSubmissions();
    } catch (error) {
      toast.error("Failed to reject submission");
      console.error("Reject submission error:", error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return `px-3 py-1 rounded-full text-sm ${badges[status] || badges.pending}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Job Submissions</h1>
        <div className="text-sm text-gray-500">
          Total Submissions: {submissions.length}
        </div>
      </div>

      <div className="space-y-4">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
              <CreatorInfo
                creatorId={submission.creatorId}
                brandId={submission.brandId}
              />
              <span className={getStatusBadge(submission.status)}>
                {submission.status.charAt(0).toUpperCase() +
                  submission.status.slice(1)}
              </span>
            </div>

            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-900">{submission.message}</div>
              <div className="text-sm text-gray-500 mt-2">
                Submitted on {formatDate(submission.createdAt)}
              </div>
            </div>

            {/* Attachments and Links */}
            <div className="space-y-4 mt-4">
              {submission.attachments?.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {submission.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-md transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      {attachment.fileName}
                      <Download className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              )}

              {submission.links?.length > 0 && submission.links[0].url && (
                <div className="flex flex-wrap gap-3">
                  {submission.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-2 rounded-md transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      {link.title || "External Link"}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Rejection Message if exists */}
            {submission.rejectionMessage && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                <p className="font-medium">Rejection Reason:</p>
                <p className="text-sm mt-1">{submission.rejectionMessage}</p>
              </div>
            )}

            {/* Action Buttons */}
            {submission.status === "pending" ||
              (submission.status === "revised" && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => handleAccept(submission.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setIsRejectionModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Rejection Modal */}
      {isRejectionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Reject Submission</h3>
            <textarea
              value={rejectionMessage}
              onChange={(e) => setRejectionMessage(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 border rounded-lg mb-4 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsRejectionModalOpen(false);
                  setRejectionMessage("");
                  setSelectedSubmission(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject Submission
              </button>
            </div>
          </div>
        </div>
      )}

      {submissions.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No Submissions Yet
          </h3>
          <p className="text-gray-500 mt-2">
            When creators submit their work, it will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobSubmissions;
