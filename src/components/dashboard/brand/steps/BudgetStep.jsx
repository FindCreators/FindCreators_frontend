import React, { useState, useEffect } from "react";
import { Clock, Tag } from "lucide-react";

const BudgetStep = ({ formData, handleInputChange }) => {
  // Local state for form fields
  const [localFormData, setLocalFormData] = useState({
    budget: formData.budget,
    currency: formData.currency,
    duration: formData.duration,
    startDate: formData.startDate,
    endDate: formData.endDate,
  });

  // Update local state when props change
  useEffect(() => {
    setLocalFormData({
      budget: formData.budget,
      currency: formData.currency,
      duration: formData.duration,
      startDate: formData.startDate,
      endDate: formData.endDate,
    });
  }, [formData]);

  // Handle local changes
  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update parent state on blur
  const handleBlur = (e) => {
    handleInputChange(e);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-semibold mb-8">Set your budget</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Amount
          </label>
          <input
            type="number"
            name="budget"
            value={localFormData.budget}
            onChange={handleLocalChange}
            onBlur={handleBlur}
            placeholder="Enter budget amount"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <input
            type="text"
            name="duration"
            value={localFormData.duration}
            onChange={handleLocalChange}
            onBlur={handleBlur}
            placeholder="E.g. 1 month, 2 weeks"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={localFormData.startDate}
              onChange={handleLocalChange}
              onBlur={handleBlur}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={localFormData.endDate}
              onChange={handleLocalChange}
              onBlur={handleBlur}
              min={
                localFormData.startDate ||
                new Date().toISOString().split("T")[0]
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetStep;
