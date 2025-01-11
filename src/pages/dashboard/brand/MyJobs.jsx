import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  MoreHorizontal,
  Loader,
  Pencil,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Users,
  ArrowUpDown,
} from "lucide-react";
import { makeRequest } from "../../../network/apiHelpers";
import {
  getBrandListings,
  getCreatorProfile,
} from "../../../network/networkCalls";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CreatorProfileModal from "../../../components/dashboard/creator/CreatorProfileModal";
import OfferUpdateModal from "../../../components/dashboard/brand/OfferUpdateModal";

const ProposalSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between">
      <div className="space-y-3 w-full">
        <div className="h-6 w-48 bg-gray-200 rounded"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="flex gap-4">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const JobStatusBadge = ({ status }) => {
  const statusStyles = {
    active: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        statusStyles[status] || statusStyles.active
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const OfferDetails = ({ job, creatorProfile, onUpdateOffer }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "");

  if (!creatorProfile) return null;

  return (
    <>
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
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
                  className="w-full h-full object-cover rounded-full cursor-pointer ring-2 ring-white"
                  onError={() => setImageError(true)}
                />
              )}
            </div>
            <div>
              <button
                onClick={() => setShowProfile(true)}
                className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
              >
                Offer to {creatorProfile.fullName}
              </button>
              <p className="text-sm text-gray-600">{creatorProfile.email}</p>
              <p className="text-xs text-gray-500 mt-1">
                Offered on {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdateOffer(job.offerId, job);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-300 transition-all"
          >
            <Pencil className="w-4 h-4" />
            Update Offer
          </button>
        </div>
      </div>

      <CreatorProfileModal
        brandId={job.brandId}
        creator={creatorProfile}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </>
  );
};

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [creatorProfiles, setCreatorProfiles] = useState({});
  const [isUpdatingOffer, setIsUpdatingOffer] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();
  const fetchCreatorProfiles = async (creatorIds) => {
    const validCreatorIds = creatorIds.filter(
      (id) => id && id !== "000000000000000000000000"
    );

    if (validCreatorIds.length === 0) return;

    try {
      const profiles = await Promise.all(
        validCreatorIds.map(async (id) => {
          try {
            const response = await getCreatorProfile(id);
            return { id, data: response?.data?.[0] };
          } catch (error) {
            console.error(`Error fetching profile for creator ${id}:`, error);
            return { id, data: null };
          }
        })
      );

      const newProfiles = profiles.reduce((acc, { id, data }) => {
        if (data) {
          acc[id] = data;
        }
        return acc;
      }, {});

      setCreatorProfiles((prev) => ({ ...prev, ...newProfiles }));
    } catch (error) {
      console.error("Error fetching creator profiles:", error);
      toast.error("Failed to load some creator profiles");
    }
  };

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await getBrandListings(1, 10, {});
      const jobsData = response.data || [];
      setJobs(jobsData);

      const creatorIds = jobsData
        .map((job) => job.offerToCreatorId)
        .filter((id) => id && id !== "000000000000000000000000");

      if (creatorIds.length > 0) {
        await fetchCreatorProfiles(creatorIds);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);
  const filteredJobs = jobs
    .filter((job) => {
      const matchesSearch = job.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || job.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "budget") return b.budget - a.budget;
      if (sortBy === "proposals")
        return b.applicationsCount - a.applicationsCount;
      return 0;
    });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <ProposalSkeleton key={i} />
        ))}
      </div>
    );
  }
  const handleUpdateOffer = async (offerId, updatedData) => {
    try {
      await makeRequest({
        url: `/api/offer-update?id=${offerId}`,
        method: "PATCH",
        data: Object.entries(updatedData).map(([key, value]) => ({
          key,
          value: String(value),
        })),
      });
      toast.success("Offer updated successfully");
      setIsUpdatingOffer(false);
      setSelectedOffer(null);
      fetchJobs();
    } catch (error) {
      console.error("Error updating offer:", error);
      toast.error("Failed to update offer");
    }
  };

  const handleViewProposals = (job) => {
    navigate(`/brand/jobs/${job.id}/proposals`, {
      state: { jobDetails: job },
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Your Jobs</h1>
          <p className="text-gray-600 mt-1">
            Manage and track your job postings
          </p>
        </div>
        <button
          onClick={() => navigate("/brand/post-job")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          Post a Job
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Completed</option>
              <option value="pending">In Progress</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="budget">Highest Budget</option>
              <option value="proposals">Most Proposals</option>
            </select>
          </div>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No jobs posted yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start by posting your first job to find creators.
          </p>
          <button
            onClick={() => navigate("/brand/post-job")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Post Your First Job
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all border border-gray-100 hover:border-blue-200"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {job.title}
                    </h3>
                    <JobStatusBadge status={job.status || "active"} />
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {job.currency} {job.budget?.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {job.applicationsCount || 0} Proposals
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {job.messagesCount || 0} Messages
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {job.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/brand/jobs/${job.id}`);
                    }}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProposals(job);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Proposals
                  </button>
                </div>
              </div>

              {job.offerToCreatorId &&
                job.offerToCreatorId !== "000000000000000000000000" && (
                  <OfferDetails
                    job={job}
                    creatorProfile={creatorProfiles[job.offerToCreatorId]}
                    onUpdateOffer={(offerId, offerDetails) => {
                      setSelectedOffer({ offerId, offerDetails });
                      setIsUpdatingOffer(true);
                    }}
                  />
                )}
            </div>
          ))}
        </div>
      )}

      {isUpdatingOffer && (
        <OfferUpdateModal
          offerId={selectedOffer.offerId}
          offerDetails={selectedOffer.offerDetails}
          onClose={() => {
            setIsUpdatingOffer(false);
            setSelectedOffer(null);
          }}
          onUpdate={handleUpdateOffer}
        />
      )}
    </div>
  );
};

export default MyJobs;
