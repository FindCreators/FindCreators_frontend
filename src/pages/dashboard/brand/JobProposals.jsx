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
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCreatorsByIdArray } from "../../../network/networkCalls";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import CreatorProfileModal from "../../../components/dashboard/creator/CreatorProfileModal";

const ProposalSkeleton = () => (
  <div className="p-6 border-b border-gray-200 animate-pulse">
    <div className="flex gap-6">
      <div className="w-12 h-12 bg-gray-200 rounded-full" />
      <div className="flex-1">
        <div className="flex justify-between">
          <div>
            <div className="h-5 bg-gray-200 rounded w-48 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-64 mb-2" />
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

const ProposalCard = ({ proposal, onHire, onChat }) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const formatFollowers = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };

  const creator = proposal?.creator || {};

  return (
    <>
      <div className="p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <div className="flex gap-6">
          <img
            src={creator.profilePicture || "/api/placeholder/48/48"}
            alt={creator.fullName}
            onClick={() => setIsProfileModalOpen(true)}
            className="w-12 h-12 rounded-full object-cover cursor-pointer"
          />
          <div className="flex-1">
            <div className="flex justify-between">
              <div>
                <h3
                  className="text-lg font-medium flex items-center gap-2 cursor-pointer"
                  onClick={() => setIsProfileModalOpen(true)}
                >
                  {creator.fullName}
                  {creator.isVerified && (
                    <span className="text-blue-500">✓</span>
                  )}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
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
                  className="p-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  aria-label="Message creator"
                >
                  <MessageCircle className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => onHire(proposal)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Hire
                </button>
              </div>
            </div>

            <p className="text-gray-600 mt-3">{creator.bio}</p>

            {creator.skills?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {creator.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-4 mt-4 text-sm text-gray-600">
              <span>Preferred Rate: ${creator.preferredRate}/hr</span>
              <span>•</span>
              <span>${creator.totalEarned || 0} earned</span>
              {creator.languages?.length > 0 && (
                <>
                  <span>•</span>
                  <span>Speaks: {creator.languages.join(", ")}</span>
                </>
              )}
            </div>

            <div className="flex gap-4 mt-4 text-sm text-gray-600">
              <span>Quoted Price: ${proposal.quotedPrice}</span>
              {proposal.message && (
                <>
                  <span>•</span>
                  <span>Message: {proposal.message}</span>
                </>
              )}
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
  const jobDetails = location.state?.jobDetails;
  const user = useSelector((state) => state.auth.user);

  // Update the useEffect hook in JobProposals component:

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
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate("/brand/jobs")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold">{jobDetails.title}</h1>
        </div>

        <div className="flex items-center gap-4 text-gray-600 mb-6">
          <span>{jobDetails.applicationsCount || 0} proposals</span>
          <span>•</span>
          <span>
            {jobDetails.currency} {jobDetails.budget?.toLocaleString()}
          </span>
          <span>•</span>
          <span>{jobDetails.duration}</span>
        </div>

        <div className="bg-gray-100 h-2 rounded-full mb-4">
          <div
            className="bg-green-600 h-2 rounded-full transition-all"
            style={{
              width: `${
                (proposals.length / (jobDetails.applicationsCount || 1)) * 100
              }%`,
            }}
          />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
          <SlidersHorizontal className="h-5 w-5" />
          Filters
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, i) => <ProposalSkeleton key={i} />)
        ) : filteredProposals.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery
              ? "No proposals match your search"
              : "No proposals yet"}
          </div>
        ) : (
          filteredProposals.map((proposal) => (
            <ProposalCard
              key={proposal.applicationId}
              proposal={proposal}
              onHire={handleHire}
              onChat={handleChat}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default JobProposals;
