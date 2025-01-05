import React, { useState, useEffect } from "react";
import {
  FileText,
  Link as LinkIcon,
  Download,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  UploadCloud,
  Briefcase,
} from "lucide-react";
import { makeRequest } from "../../../network/apiHelpers";
import { toast } from "react-hot-toast";
import { getBrandProfile } from "../../../network/networkCalls";

const JobDetailsCard = ({ listingId }) => {
  const [jobDetails, setJobDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await makeRequest({
          url: `/api/listings/?id=${listingId}`,
        });
        setJobDetails(response.data?.[0]);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (listingId) {
      fetchJobDetails();
    }
  }, [listingId]);

  if (isLoading) {
    return (
      <div className="animate-pulse flex items-center gap-2">
        <div className="h-5 bg-gray-200 rounded w-32"></div>
      </div>
    );
  }

  return jobDetails ? (
    <div className="flex items-center gap-2 text-gray-700">
      <Briefcase className="w-4 h-4" />
      <span className="font-medium">{jobDetails.title}</span>
    </div>
  ) : null;
};

const BrandInfo = ({ brandId }) => {
  const [brandProfile, setBrandProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBrandProfile = async () => {
      try {
        const data = await getBrandProfile(brandId);
        setBrandProfile(data.data?.[0]);
      } catch (error) {
        console.error("Error fetching brand profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (brandId) {
      fetchBrandProfile();
    }
  }, [brandId]);

  if (isLoading) {
    return (
      <div className="animate-pulse flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  return brandProfile ? (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
        <img
          src={brandProfile.logo}
          alt={brandProfile.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">
          {brandProfile.companyName}
        </p>
        <p className="text-xs text-gray-500">{brandProfile.industry}</p>
      </div>
    </div>
  ) : null;
};

const CreatorJobSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isResubmitModalOpen, setIsResubmitModalOpen] = useState(false);
  const [resubmitData, setResubmitData] = useState({
    message: "",
    links: [{ title: "", url: "" }],
    files: [],
  });

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await makeRequest({
        url: "/api/submission-all",
        method: "GET",
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

  const handleResubmit = async (submissionId) => {
    try {
      const formData = new FormData();
      formData.append("submissionId", submissionId);
      formData.append("message", resubmitData.message);
      formData.append("links", JSON.stringify(resubmitData.links));

      resubmitData.files.forEach((file) => {
        formData.append("files", file);
      });

      await makeRequest({
        url: "/api/resubmit-job",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Job resubmitted successfully");
      setIsResubmitModalOpen(false);
      setResubmitData({
        message: "",
        links: [{ title: "", url: "" }],
        files: [],
      });
      fetchSubmissions();
    } catch (error) {
      toast.error("Failed to resubmit job");
      console.error("Resubmit error:", error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return `inline-flex items-center px-3 py-1 rounded-full text-sm ${
      badges[status] || badges.pending
    }`;
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
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
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
        <h1 className="text-2xl font-semibold">My Job Submissions</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Total Submissions: {submissions.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="space-y-3">
                    {/* Job Title */}
                    <JobDetailsCard listingId={submission.listingId} />
                    {/* Brand Info */}
                    <BrandInfo brandId={submission.brandId} />
                  </div>
                </div>
                <span className={getStatusBadge(submission.status)}>
                  <span className="flex items-center gap-1">
                    {submission.status === "accepted" && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    {submission.status === "rejected" && (
                      <XCircle className="w-4 h-4" />
                    )}
                    {submission.status === "pending" && (
                      <Clock className="w-4 h-4" />
                    )}
                    {submission.status.charAt(0).toUpperCase() +
                      submission.status.slice(1)}
                  </span>
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700">{submission.message}</p>
              </div>

              {/* Attachments */}
              {submission.attachments?.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Attachments
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {submission.attachments.map((file) => (
                      <a
                        key={file.id}
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-md"
                      >
                        <FileText className="w-4 h-4" />
                        {file.fileName}
                        <Download className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* External Links */}
              {submission.links?.length > 0 && submission.links[0].url && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    External Links
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {submission.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-2 rounded-md"
                      >
                        <LinkIcon className="w-4 h-4" />
                        {link.title || "External Link"}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejection Message */}
              {submission.rejectionMessage && (
                <div className="mb-4 p-4 bg-red-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">
                        Rejection Feedback:
                      </h3>
                      <p className="text-sm text-red-700 mt-1">
                        {submission.rejectionMessage}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Resubmit Button for Rejected Submissions */}
              {submission.status === "rejected" && (
                <button
                  onClick={() => {
                    setSelectedSubmission(submission);
                    setIsResubmitModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <UploadCloud className="w-5 h-5" />
                  Resubmit Job
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Resubmit Modal */}
      {isResubmitModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Resubmit Job</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={resubmitData.message}
                  onChange={(e) =>
                    setResubmitData({
                      ...resubmitData,
                      message: e.target.value,
                    })
                  }
                  placeholder="Enter your submission message..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  External Links
                </label>
                {resubmitData.links.map((link, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Link Title"
                      value={link.title}
                      onChange={(e) => {
                        const newLinks = [...resubmitData.links];
                        newLinks[index].title = e.target.value;
                        setResubmitData({ ...resubmitData, links: newLinks });
                      }}
                      className="flex-1 p-2 border rounded-lg"
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...resubmitData.links];
                        newLinks[index].url = e.target.value;
                        setResubmitData({ ...resubmitData, links: newLinks });
                      }}
                      className="flex-1 p-2 border rounded-lg"
                    />
                  </div>
                ))}
                <button
                  onClick={() =>
                    setResubmitData({
                      ...resubmitData,
                      links: [...resubmitData.links, { title: "", url: "" }],
                    })
                  }
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Add Another Link
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attachments
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload files</span>
                        <input
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={(e) => {
                            setResubmitData({
                              ...resubmitData,
                              files: [...resubmitData.files, ...e.target.files],
                            });
                          }}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">Any file up to 10MB</p>
                  </div>
                </div>
                {resubmitData.files.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {Array.from(resubmitData.files).map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-500">{file.name}</span>
                        <button
                          onClick={() => {
                            const newFiles = Array.from(resubmitData.files);
                            newFiles.splice(index, 1);
                            setResubmitData({
                              ...resubmitData,
                              files: newFiles,
                            });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsResubmitModalOpen(false);
                  setResubmitData({
                    message: "",
                    links: [{ title: "", url: "" }],
                    files: [],
                  });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResubmit(selectedSubmission.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Resubmit Job
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
            When you submit work for jobs, they will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default CreatorJobSubmissions;
