import React, { useState, useEffect } from "react";
import { MessageCircle, MoreHorizontal, Loader, Pencil } from "lucide-react";
import { makeRequest } from "../../../network/apiHelpers";
import {
  getBrandListings,
  getCreatorProfile,
} from "../../../network/networkCalls";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ProposalSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between">
      <div>
        <div className="h-6 w-48 bg-gray-200 rounded"></div>
        <div className="h-4 w-32 bg-gray-200 rounded mt-2"></div>
        <div className="flex gap-4 mt-2">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="h-8 w-28 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const OfferDetails = ({ job, creatorProfile, onUpdateOffer }) => {
  if (!creatorProfile) return null;

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            <img
              src={creatorProfile.profilePicture || "/api/placeholder/40/40"}
              alt={creatorProfile.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              Offer given to {creatorProfile.fullName}
            </h4>
            <p className="text-sm text-gray-600">{creatorProfile.email}</p>
          </div>
        </div>

        <button
          onClick={() => onUpdateOffer(job.offerId)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Pencil className="w-4 h-4" />
          Update Offer
        </button>
      </div>
    </div>
  );
};

const OfferUpdateModal = ({ offerId, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    contractTitle: "",
    amount: "",
    paymentOption: "fixed_price",
    details: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Update Offer Terms</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contract Title
            </label>
            <input
              type="text"
              id="contractTitle"
              value={formData.contractTitle}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Offer Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2">$</span>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full pl-8 p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Type
            </label>
            <select
              id="paymentOption"
              value={formData.paymentOption}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="fixed_price">Fixed Price</option>
              <option value="milestone">Milestone Based</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Offer Details
            </label>
            <textarea
              id="details"
              value={formData.details}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onUpdate(offerId, formData)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Update Offer
          </button>
        </div>
      </div>
    </div>
  );
};

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [creatorProfiles, setCreatorProfiles] = useState({});
  const [isUpdatingOffer, setIsUpdatingOffer] = useState(false);
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

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-4">
        <ProposalSkeleton />
        <ProposalSkeleton />
        <ProposalSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Your Jobs</h1>
        <button
          onClick={() => navigate("/brand/post-job")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Post a Job
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No jobs posted yet
          </h3>
          <p className="text-gray-600">
            Start by posting your first job to find creators.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-medium">{job.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Budget: {job.currency} {job.budget?.toLocaleString()}
                  </p>

                  <div className="flex gap-4 mt-2">
                    <span className="text-sm text-gray-600">
                      {job.applicationsCount || 0} Proposals
                    </span>
                    <span className="text-sm text-gray-600 flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {job.messagesCount || 0} Messages
                    </span>
                  </div>

                  {job.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-gray-100 rounded-full text-gray-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleViewProposals(job)}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  View Proposals
                </button>
              </div>

              {job.offerToCreatorId &&
                job.offerToCreatorId !== "000000000000000000000000" && (
                  <OfferDetails
                    job={job}
                    creatorProfile={creatorProfiles[job.offerToCreatorId]}
                    onUpdateOffer={(offerId) => {
                      setSelectedOffer(offerId);
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
          offerId={selectedOffer}
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
