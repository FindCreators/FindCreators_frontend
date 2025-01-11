import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const OfferUpdateModal = ({ offerId, offerDetails, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    contractTitle: "",
    amount: "",
    paymentOption: "fixed_price",
    details: "",
  });

  useEffect(() => {
    if (offerDetails) {
      setFormData({
        contractTitle: offerDetails.title || "",
        amount: offerDetails.budget || "",
        paymentOption: offerDetails.paymentOption || "fixed_price",
        details: offerDetails.description || "",
      });
    }
  }, [offerDetails]);

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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Update Offer Terms</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update Offer
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferUpdateModal;
