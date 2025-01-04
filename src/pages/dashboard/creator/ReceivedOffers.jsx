import React, { useState, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { makeRequest } from "../../../network/apiHelpers";
import toast from "react-hot-toast";
import { getBrandProfile } from "../../../network/networkCalls";

const ReceivedOffers = () => {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [brandProfiles, setBrandProfiles] = useState({});

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  console.log(brandProfiles);

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
                    {offer.status === "pending" ? (
                      <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                        <AlertCircle className="w-4 h-4" />
                        Pending
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4" />
                        Accepted
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-6 text-gray-600">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      <span className="font-semibold">
                        {offer.amount.toLocaleString()} USD
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

                  {offer.status === "pending" && (
                    <div className="flex justify-end mt-6">
                      <button
                        onClick={() => handleAcceptOffer(offer.id)}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Accept Offer
                      </button>
                    </div>
                  )}
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
    </div>
  );
};

export default ReceivedOffers;
