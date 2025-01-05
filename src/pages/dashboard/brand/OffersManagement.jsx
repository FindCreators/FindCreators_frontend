import React, { useState, useEffect } from "react";
import { makeRequest } from "../../../network/apiHelpers";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Edit,
  DollarSign,
  X,
  Plus,
  Trash,
  User,
  Mail,
} from "lucide-react";
import { getCreatorProfile } from "../../../network/networkCalls";

const CreatorInfo = ({ creatorId }) => {
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCreator = async () => {
      if (!creatorId) return;

      try {
        const response = await getCreatorProfile(creatorId);

        if (isMounted && response.data && response.data[0]) {
          setCreator(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching creator:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCreator();

    return () => {
      isMounted = false;
    };
  }, [creatorId]);

  if (!creatorId) return null;

  if (loading) {
    return (
      <div className="flex items-center gap-3 mt-3 p-3 bg-gray-50 rounded-lg animate-pulse">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-3 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 mt-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0">
        {creator.profilePicture ? (
          <img
            src={creator.profilePicture}
            alt={creator.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
        )}
      </div>
      <div>
        <h4 className="font-medium text-gray-900">
          {creator.fullName || "Creator"}
        </h4>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Mail className="w-4 h-4" />
          <span>{creator.email}</span>
        </div>
      </div>
    </div>
  );
};

const OffersManagement = () => {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      const response = await makeRequest({
        url: "/api/offers-all",
      });
      setOffers(response.offers || []);
    } catch (error) {
      toast.error("Failed to load offers");
      console.error("Offers fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (offer) => {
    setEditMode(offer.id);
    setEditData({
      amount: offer.amount,
      details: offer.details,
      contractTitle: offer.contractTitle,
      paymentOption: offer.paymentOption,
      paymentSchedule: {
        type: offer.paymentSchedule.type,
        milestones: offer.paymentSchedule.milestones || [],
      },
    });
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditData(null);
  };

  const handleUpdateOffer = async (e) => {
    e.preventDefault();
    try {
      const formattedData = [
        { key: "amount", value: String(editData.amount) },
        { key: "details", value: editData.details },
        { key: "contractTitle", value: editData.contractTitle },
        { key: "paymentOption", value: editData.paymentOption },
        { key: "paymentScheduleType", value: editData.paymentSchedule.type },
      ];

      if (
        editData.paymentSchedule.type === "milestone" &&
        editData.paymentSchedule.milestones.length > 0
      ) {
        formattedData.push(
          {
            key: "milestoneDescriptions",
            value: editData.paymentSchedule.milestones
              .map((m) => m.description)
              .join(","),
          },
          {
            key: "milestoneAmounts",
            value: editData.paymentSchedule.milestones
              .map((m) => m.amount)
              .join(","),
          },
          {
            key: "milestoneDueDates",
            value: editData.paymentSchedule.milestones
              .map((m) => m.dueDate)
              .join(","),
          }
        );
      }

      await makeRequest({
        url: `/api/offer-update?id=${editMode}`,
        method: "PATCH",
        data: formattedData,
      });

      toast.success("Offer updated successfully");
      fetchOffers();
      setEditMode(null);
      setEditData(null);
    } catch (error) {
      toast.error("Failed to update offer");
      console.error("Update error:", error);
    }
  };

  const handleAddMilestone = () => {
    setEditData((prev) => ({
      ...prev,
      paymentSchedule: {
        ...prev.paymentSchedule,
        milestones: [
          ...(prev.paymentSchedule.milestones || []),
          {
            description: "",
            amount: 0,
            dueDate: new Date().toISOString().split("T")[0],
          },
        ],
      },
    }));
  };

  const handleRemoveMilestone = (index) => {
    setEditData((prev) => ({
      ...prev,
      paymentSchedule: {
        ...prev.paymentSchedule,
        milestones: prev.paymentSchedule.milestones.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const handleMilestoneChange = (index, field, value) => {
    setEditData((prev) => ({
      ...prev,
      paymentSchedule: {
        ...prev.paymentSchedule,
        milestones: prev.paymentSchedule.milestones.map((milestone, i) => {
          if (i === index) {
            return { ...milestone, [field]: value };
          }
          return milestone;
        }),
      },
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const renderEditForm = () => {
    if (!editData) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Edit Offer</h2>
              <button
                onClick={handleCancelEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateOffer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Title
                </label>
                <input
                  type="text"
                  value={editData.contractTitle}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      contractTitle: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={editData.amount}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      amount: Number(e.target.value),
                    }))
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details
                </label>
                <textarea
                  value={editData.details}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      details: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows="4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Type
                </label>
                <select
                  value={editData.paymentSchedule.type}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      paymentSchedule: {
                        ...prev.paymentSchedule,
                        type: e.target.value,
                      },
                    }))
                  }
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="whole">Single Payment</option>
                  <option value="milestone">Milestone Based</option>
                </select>
              </div>

              {editData.paymentSchedule.type === "milestone" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Milestones</h3>
                    <button
                      type="button"
                      onClick={handleAddMilestone}
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Milestone
                    </button>
                  </div>

                  {editData.paymentSchedule.milestones.map(
                    (milestone, index) => (
                      <div
                        key={index}
                        className="flex gap-4 items-start border p-4 rounded-lg"
                      >
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            placeholder="Description"
                            value={milestone.description}
                            onChange={(e) =>
                              handleMilestoneChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border rounded-lg"
                          />
                          <div className="flex gap-3">
                            <input
                              type="number"
                              placeholder="Amount"
                              value={milestone.amount}
                              onChange={(e) =>
                                handleMilestoneChange(
                                  index,
                                  "amount",
                                  Number(e.target.value)
                                )
                              }
                              className="w-full p-2 border rounded-lg"
                            />
                            <input
                              type="date"
                              value={milestone.dueDate.split("T")[0]}
                              onChange={(e) =>
                                handleMilestoneChange(
                                  index,
                                  "dueDate",
                                  `${e.target.value}T00:00:00Z`
                                )
                              }
                              className="w-full p-2 border rounded-lg"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMilestone(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Update Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Offers Management</h1>
      <div className="space-y-4">
        {offers.map((offer) => (
          <div key={offer.id} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{offer.contractTitle}</h3>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {formatDate(offer.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    offer.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : offer.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                </span>
                <div className="flex items-center gap-1 text-green-600 font-medium">
                  <DollarSign className="w-4 h-4" />
                  {offer.amount.toLocaleString()}
                </div>
                {offer.status !== "accepted" && (
                  <button
                    onClick={() => handleEdit(offer)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-600 mt-2">{offer.details}</p>
            <CreatorInfo creatorId={offer.creatorId} />

            {offer.paymentSchedule.type === "milestone" && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Milestones</h4>
                <div className="space-y-2">
                  {offer.paymentSchedule.milestones?.map((milestone, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm text-gray-600 border-b pb-2"
                    >
                      <span>{milestone.description}</span>
                      <div className="flex gap-4">
                        <span>${milestone.amount.toLocaleString()}</span>
                        <span>{formatDate(milestone.dueDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {offer.status === "rejected" && offer.rejectionMessage && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                <strong>Rejection reason:</strong> {offer.rejectionMessage}
              </div>
            )}
          </div>
        ))}
      </div>
      {editMode && renderEditForm()}
    </div>
  );
};

export default OffersManagement;
