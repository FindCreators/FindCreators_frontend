import React, { useState, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCcw,
} from "lucide-react";
import { makeRequest } from "../../../network/apiHelpers";
import toast from "react-hot-toast";
import { getBrandProfile } from "../../../network/networkCalls";

const ReceivedOffers = () => {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [brandProfiles, setBrandProfiles] = useState({});
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [rejectionMessage, setRejectionMessage] = useState("");

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchBrandProfile = async (brandIds) => {
    try {
      const uniqueIds = [...new Set(brandIds)];
      const profiles = await Promise.all(
        uniqueIds.map(async (id) => {
          const response = await getBrandProfile(id);
          return { id, data: response.data[0] };
        })
      );

      const profileMap = profiles.reduce((acc, { id, data }) => {
        acc[id] = data;
        return acc;
      }, {});

      setBrandProfiles(profileMap);
    } catch (error) {
      console.error("Error fetching brand profiles:", error);
    }
  };

  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      const response = await makeRequest({ url: "/api/offers-all" });
      setOffers(response.offers || []);

      const brandIds = response.offers?.map((offer) => offer.brandId) || [];
      await fetchBrandProfile(brandIds);
    } catch (error) {
      toast.error("Failed to fetch offers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptOffer = async (offerId) => {
    try {
      await makeRequest({
        url: `/api/offer-accept?offerId=${offerId}`,
        method: "GET",
      });
      toast.success("Offer accepted successfully");
      fetchOffers();
    } catch (error) {
      toast.error("Failed to accept offer");
    }
  };

  const handleRejectOffer = async (offerId) => {
    try {
      if (!rejectionMessage.trim()) {
        toast.error("Please provide a rejection reason");
        return;
      }

      await makeRequest({
        url: `/api/offer-reject`,
        method: "POST",
        data: {
          offerId: offerId,
          message: rejectionMessage,
        },
      });
      toast.success("Offer rejected successfully");
      setRejectionModalOpen(false);
      setRejectionMessage("");
      setSelectedOfferId(null);
      fetchOffers();
    } catch (error) {
      console.error("Reject error:", error);
      toast.error("Failed to reject offer");
    }
  };

  const getStatusDisplay = (status) => {
    const statusConfig = {
      pending: {
        icon: AlertCircle,
        text: "Pending",
        color: "text-yellow-600 bg-yellow-50",
      },
      accepted: {
        icon: CheckCircle2,
        text: "Accepted",
        color: "text-green-600 bg-green-50",
      },
      rejected: {
        icon: XCircle,
        text: "Rejected",
        color: "text-red-600 bg-red-50",
      },
      revised: {
        icon: RefreshCcw,
        text: "Revised",
        color: "text-blue-600 bg-blue-50",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const StatusIcon = config.icon;

    return (
      <span
        className={`flex items-center gap-1 ${config.color} px-3 py-1 rounded-full`}
      >
        <StatusIcon className="w-4 h-4" />
        {config.text}
      </span>
    );
  };

  const renderActionButtons = (offer) => {
    if (offer.status === "accepted") return null;
    if (offer.status === "rejected") return null;

    return (
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => {
            setSelectedOfferId(offer.id);
            setRejectionModalOpen(true);
          }}
          className="border border-red-600 text-red-600 px-6 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          Reject Offer
        </button>
        <button
          onClick={() => handleAcceptOffer(offer.id)}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Accept Offer
        </button>
      </div>
    );
  };

  // Rejection Modal
  const RejectionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Reject Offer</h3>
        <textarea
          value={rejectionMessage}
          onChange={(e) => setRejectionMessage(e.target.value)}
          placeholder="Please provide a reason for rejection..."
          className="w-full p-3 border rounded-lg mb-4 h-32 resize-none"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setRejectionModalOpen(false);
              setRejectionMessage("");
              setSelectedOfferId(null);
            }}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => handleRejectOffer(selectedOfferId)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-8">Received Offers</h1>

      <div className="grid gap-6">
        {offers.map((offer) => {
          const brand = brandProfiles[offer.brandId];

          return (
            <div key={offer.id} className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      {offer.contractTitle}
                    </h2>
                    {brand && (
                      <div className="flex items-center gap-2 mb-4">
                        <img
                          src={brand.logo || "/api/placeholder/32/32"}
                          alt={brand.companyName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{brand.companyName}</p>
                          <p className="text-sm text-gray-600">{brand.email}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusDisplay(offer.status)}
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-6 text-gray-600">
                    <div className="flex items-center gap-2">
                      {/* <DollarSign className="w-5 h-5" /> */}
                      <span className="font-semibold">
                        {offer.amount.toLocaleString()} INR
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>
                        {new Date(offer.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      <span>
                        {offer.paymentOption === "fixed_price"
                          ? "Fixed Price"
                          : "Milestone Based"}
                      </span>
                    </div>
                  </div>

                  {offer.details && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium mb-2">Offer Details</h3>
                      <p className="text-gray-600">{offer.details}</p>
                    </div>
                  )}

                  {offer.paymentSchedule?.type === "milestone" &&
                    offer.paymentSchedule.milestones && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium mb-3">Milestones</h3>
                        <div className="space-y-3">
                          {offer.paymentSchedule.milestones.map(
                            (milestone, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-center"
                              >
                                <div>
                                  <p className="font-medium">
                                    {milestone.description}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Due:{" "}
                                    {new Date(
                                      milestone.dueDate
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <span className="font-medium">
                                  ${milestone.amount.toLocaleString()}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {offer.status === "rejected" && offer.rejectionMessage && (
                    <div className="bg-red-50 rounded-lg p-4 text-red-700">
                      <h3 className="font-medium mb-2">Rejection Reason</h3>
                      <p>{offer.rejectionMessage}</p>
                    </div>
                  )}

                  {renderActionButtons(offer)}
                </div>
              </div>
            </div>
          );
        })}

        {offers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No offers received yet</p>
          </div>
        )}
      </div>

      {rejectionModalOpen && <RejectionModal />}
    </div>
  );
};

export default ReceivedOffers;
