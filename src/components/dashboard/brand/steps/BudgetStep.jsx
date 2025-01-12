import React, { useState, useEffect } from "react";
import { Clock, DollarSign, Calendar, Info, IndianRupee } from "lucide-react";

const BudgetStep = ({ formData, handleInputChange }) => {
  const [localFormData, setLocalFormData] = useState({
    budget: formData.budget,
    currency: formData.currency || "USD",
    duration: formData.duration,
    startDate: formData.startDate,
    endDate: formData.endDate,
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    setLocalFormData({
      budget: formData.budget,
      currency: formData.currency || "USD",
      duration: formData.duration,
      startDate: formData.startDate,
      endDate: formData.endDate,
    });
  }, [formData]);

  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateDates = () => {
    const errors = {};
    if (localFormData.startDate && localFormData.endDate) {
      const start = new Date(localFormData.startDate);
      const end = new Date(localFormData.endDate);
      if (end < start) {
        errors.endDate = "End date must be after start date";
      }
    }
    return errors;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const errors = validateDates();
    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      handleInputChange(e);
    }
  };

  const currencies = [{ code: "INR", symbol: "₹", name: "Indian Rupee" }];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Project Budget</h2>
        <p className="text-gray-500">
          Define your budget and timeline for the project
        </p>
      </div>

      <div className="mt-10 space-y-8">
        {/* Budget Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <IndianRupee className="w-5 h-5 text-blue-600" />
            <label className="text-lg font-semibold text-gray-900">
              Budget Details
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Budget Amount
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                    {
                      currencies.find((c) => c.code === localFormData.currency)
                        ?.symbol
                    }
                  </span>
                </div>
                <input
                  type="number"
                  name="budget"
                  value={localFormData.budget}
                  onChange={handleLocalChange}
                  onBlur={handleBlur}
                  placeholder="0.00"
                  className="w-full pl-8 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                name="currency"
                value={localFormData.currency}
                onChange={handleLocalChange}
                onBlur={handleBlur}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <label className="text-lg font-semibold text-gray-900">
              Project Timeline
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Estimated Duration
              </label>
              <select
                name="duration"
                value={localFormData.duration}
                onChange={handleLocalChange}
                onBlur={handleBlur}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select duration</option>
                <option value="1 week">1 week</option>
                <option value="2 weeks">2 weeks</option>
                <option value="1 month">1 month</option>
                <option value="2 months">2 months</option>
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
                <option value="custom">Custom duration</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={localFormData.startDate}
                  onChange={handleLocalChange}
                  onBlur={handleBlur}
                  min={new Date().toISOString().split("T")[0]}
                  className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
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
                  className={`mt-1 w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-colors ${
                    validationErrors.endDate
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                />
                {validationErrors.endDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.endDate}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                The project timeline helps contractors understand your
                expectations and deadline requirements. Make sure to set
                realistic dates that allow for quality delivery of the work.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetStep;
