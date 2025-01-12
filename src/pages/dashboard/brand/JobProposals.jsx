import React, { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MessageCircle,
  Star,
  MapPin,
  Users,
  Loader,
  ArrowLeft,
  Clock,
  DollarSign,
  FileText,
  ChevronDown,
  Filter,
  BriefcaseIcon,
  IndianRupee,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCreatorsByIdArray } from "../../../network/networkCalls";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import CreatorProfileModal from "../../../components/dashboard/creator/CreatorProfileModal";

const ProposalSkeleton = () => (
  <div className="p-4 md:p-6 border-b border-gray-200 animate-pulse">
    <div className="flex flex-col md:flex-row gap-4 md:gap-6">
      <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0" />
      <div className="flex-1 space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-200 rounded w-64" />
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
          <div className="flex gap-2">
            <div className="w-24 h-10 bg-gray-200 rounded" />
            <div className="w-24 h-10 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const JobSummaryCard = ({ jobDetails, proposals = [] }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
          <BriefcaseIcon className="w-4 h-4" />
          <span>Job Details</span>
        </div>
        <h2 className="text-xl font-semibold mb-2">{jobDetails.title}</h2>
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <IndianRupee className="w-4 h-4" />
            <span>
              {jobDetails.currency} {jobDetails.budget?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{jobDetails.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>{jobDetails.applicationsCount || 0} proposals</span>
          </div>
        </div>
      </div>

      <div className="w-full md:w-64">
        <div className="bg-gray-100 h-2 rounded-full">
          <div
            className="bg-green-600 h-2 rounded-full transition-all"
            style={{
              width: `${
                (proposals.length / (jobDetails.applicationsCount || 1)) * 100
              }%`,
            }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center">
          {proposals.length} of {jobDetails.applicationsCount || 0} proposals
          loaded
        </p>
      </div>
    </div>
  </div>
);

const ProposalCard = ({ proposal, onHire, onChat }) => {
  const [imageError, setImageError] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);

  const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "");

  const formatFollowers = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };

  const creator = proposal?.creator || {};
  const truncatedBio =
    creator.bio?.length > 150 && !showFullBio
      ? `${creator.bio.slice(0, 150)}...`
      : creator.bio;

  return (
    <>
      <div className="p-4 md:p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="relative w-12 h-12 shrink-0">
            {imageError || !creator.profilePicture ? (
              <div
                className="w-full h-full flex items-center justify-center cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full"
                onClick={() => setIsProfileModalOpen(true)}
              >
                {getInitials(creator.fullName)}
              </div>
            ) : (
              <img
                src={creator.profilePicture}
                onClick={() => setIsProfileModalOpen(true)}
                alt={creator.fullName || "Creator"}
                className="w-full h-full object-cover rounded-full cursor-pointer"
                onError={() => setImageError(true)}
              />
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3
                  className="text-lg font-medium flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => setIsProfileModalOpen(true)}
                >
                  {creator.fullName}
                  {creator.isVerified && (
                    <span className="text-blue-500">✓</span>
                  )}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-2">
                  {creator.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {creator.location.city}, {creator.location.country}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {formatFollowers(creator.followers || 0)} followers
                  </div>
                  {creator.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {creator.rating}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onChat(proposal)}
                  className="p-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                  aria-label="Message creator"
                >
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => onHire(proposal)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors min-w-[80px]"
                >
                  Hire
                </button>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-gray-600">
                {truncatedBio}
                {creator.bio?.length > 150 && (
                  <button
                    onClick={() => setShowFullBio(!showFullBio)}
                    className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {showFullBio ? "Show less" : "Read more"}
                  </button>
                )}
              </p>
            </div>

            {creator.skills?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {creator.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4" />
                <span>Rate: ${creator.preferredRate}/hr</span>
              </div>
              <span>•</span>
              <span>${creator.totalEarned || 0} earned</span>
              {creator.languages?.length > 0 && (
                <>
                  <span>•</span>
                  <span>Speaks: {creator.languages.join(", ")}</span>
                </>
              )}
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                <span className="font-medium">Proposal Details:</span>
                <span>Quoted Price: ${proposal.quotedPrice}</span>
                {proposal.message && (
                  <>
                    <span>•</span>
                    <span>{proposal.message}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreatorProfileModal
        creator={creator}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

const JobProposals = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    rating: "all",
    location: "all",
    rate: "all",
  });

  const jobDetails = location.state?.jobDetails;
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!jobDetails) {
      setIsLoading(false);
      return;
    }

    const fetchProposals = async () => {
      if (!jobDetails.applications?.length) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Extract unique creator IDs from applications
        const creatorIds = [
          ...new Set(jobDetails.applications.map((app) => app.creatorId)),
        ];

        if (creatorIds.length === 0) {
          setIsLoading(false);
          return;
        }

        const response = await getCreatorsByIdArray(creatorIds, jobDetails.id);

        const mergedProposals = response.map((creatorData) => {
          const application = jobDetails.applications.find(
            (app) => app.creatorId === creatorData.id
          );

          return {
            creator: {
              id: creatorData.id,
              fullName: creatorData.fullName,
              profilePicture: creatorData.profilePicture,
              isVerified: creatorData.isVerified,
              location: creatorData.location,
              followers: creatorData.followers,
              rating: creatorData.rating,
              bio: creatorData.bio,
              skills: creatorData.skills,
              preferredRate: creatorData.preferredRate,
              totalEarned: creatorData.totalEarned,
              languages: creatorData.languages,
            },
            quotedPrice: application?.quotedPrice,
            message: application?.message,
            applicationId: creatorData.id,
          };
        });

        setProposals(mergedProposals);
      } catch (error) {
        console.error("Error fetching proposals:", error);
        toast.error("Failed to load proposals");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, [jobDetails]);

  const handleHire = (proposal) => {
    navigate("/brand/send-offer", {
      state: {
        proposal,
        jobDetails,
      },
    });
  };

  const handleChat = (proposal) => {
    const channelData = {
      creatorName: proposal?.creator?.fullName,
      creatorImage: proposal?.creator?.profilePicture,
      creatorId: proposal?.creator?.id,
      brandName: user.companyName,
      brandImage: user.logo,
      brandId: user.id,
    };
    navigate("/chat", { state: { channelData } });
  };

  const filteredProposals = proposals.filter((proposal) => {
    const creator = proposal?.creator || {};
    const searchTerm = searchQuery.toLowerCase();
    return (
      creator.fullName?.toLowerCase().includes(searchTerm) ||
      creator.bio?.toLowerCase().includes(searchTerm) ||
      creator.skills?.some((skill) => skill.toLowerCase().includes(searchTerm))
    );
  });

  if (!jobDetails) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center text-gray-600">
          <p className="mb-4">No job details available.</p>
          <button
            onClick={() => navigate("/brand/jobs")}
            className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to jobs list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/brand/jobs")}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold">{jobDetails.title}</h1>
            <p className="text-gray-600 mt-1">Review and manage proposals</p>
          </div>
        </div>

        <JobSummaryCard jobDetails={jobDetails} proposals={proposals} />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, skills, or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                filterMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {filterMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) =>
                      setFilters({ ...filters, rating: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All ratings</option>
                    <option value="4">4+ stars</option>
                    <option value="3">3+ stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={filters.location}
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All locations</option>
                    <option value="nearby">Nearby</option>
                    <option value="international">International</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate
                  </label>
                  <select
                    value={filters.rate}
                    onChange={(e) =>
                      setFilters({ ...filters, rate: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">Any rate</option>
                    <option value="low">$0 - $25</option>
                    <option value="medium">$25 - $50</option>
                    <option value="high">$50+</option>
                  </select>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setFilters({
                        rating: "all",
                        location: "all",
                        rate: "all",
                      });
                      setFilterMenuOpen(false);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Reset filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, i) => <ProposalSkeleton key={i} />)
        ) : filteredProposals.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-4">
              <FileText className="w-12 h-12 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No matching proposals" : "No proposals yet"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search terms or filters to find more proposals"
                : "When creators submit proposals, they'll appear here"}
            </p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">
                Showing {filteredProposals.length} of {proposals.length}{" "}
                proposals
              </p>
            </div>
            {filteredProposals.map((proposal) => (
              <ProposalCard
                key={proposal.applicationId}
                proposal={proposal}
                onHire={handleHire}
                onChat={handleChat}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default JobProposals;
