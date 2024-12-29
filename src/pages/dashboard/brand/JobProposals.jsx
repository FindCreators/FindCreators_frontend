import React, { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MessageCircle,
  Star,
  MapPin,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCreatorsByIdArray } from "../../../network/networkCalls";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

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

const JobProposals = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const applicants = location.state?.applicants || [];
  const jobDetails = location.state?.jobDetails;
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchProposals();
  }, [applicants]);

  const fetchProposals = async () => {
    if (!applicants.length) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await getCreatorsByIdArray(applicants);
      setProposals(response);
    } catch (error) {
      toast.error("Failed to load proposals");
      console.error("Error fetching proposals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProposals = proposals.filter(
    (proposal) =>
      proposal.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatFollowers = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };

  const createChannel = (proposal) => {
    const channelData = {
      creatorName: proposal.fullName,
      creatorImage: proposal.profilePicture,
      creatorId: proposal.id,
      brandName: user.companyName,
      brandImage: user.logo,
      brandId: user.id,
    };
    navigate("/chat", { state: { channelData } });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-4">
          {jobDetails?.title || "View Proposals"}
        </h1>
        <div className="flex items-center gap-4 text-gray-600 mb-6">
          <span>{jobDetails?.applicationsCount || 0} proposals</span>
          <span>•</span>
          <span>
            {jobDetails?.budget} {jobDetails?.currency}
          </span>
          <span>•</span>
          <span>{jobDetails?.duration}</span>
        </div>
        <div className="bg-gray-100 h-2 rounded-full mb-4">
          <div
            className="bg-green-600 h-2 rounded-full transition-all"
            style={{
              width: `${
                (proposals.length / (jobDetails?.applicationsCount || 1)) * 100
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
            No proposals found
          </div>
        ) : (
          filteredProposals.map((proposal) => (
            <div
              key={proposal.id}
              className="p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex gap-6">
                <img
                  src={proposal.profilePicture}
                  alt={proposal.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        {proposal.fullName}
                        {proposal.isVerified && (
                          <span className="text-blue-500">✓</span>
                        )}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {proposal.location.city}, {proposal.location.country}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {formatFollowers(proposal.followers)} followers
                        </div>
                        {proposal.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {proposal.rating}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                        onClick={() => createChannel(proposal)}
                      >
                        <MessageCircle className="h-5 w-5 text-gray-600" />
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Hire
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 mt-3">{proposal.bio}</p>
                  {proposal.skills?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {proposal.skills.map((skill, index) => (
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
                    <span>Preferred Rate: ${proposal.preferredRate}/hr</span>
                    <span>•</span>
                    <span>${proposal.totalEarned} earned</span>
                    {proposal.languages?.length > 0 && (
                      <>
                        <span>•</span>
                        <span>Speaks: {proposal.languages.join(", ")}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobProposals;
