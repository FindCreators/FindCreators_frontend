import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";

const JobFilters = ({ onFilterChange, activeFilters = {} }) => {
  const [expanded, setExpanded] = useState({});

  const categories = [
    "Tech",
    "Fashion",
    "Beauty",
    "Lifestyle",
    "Gaming",
    "Food",
    "Travel",
    "Fitness",
    "Education",
    "Entertainment",
  ];

  const budgetRanges = [
    { label: "Under $1,000", value: "1000" },
    { label: "$1,000 - $5,000", value: "5000" },
    { label: "$5,000 - $10,000", value: "10000" },
    { label: "$10,000+", value: "10001" },
  ];

  const durations = ["1 week", "2 weeks", "1 month", "3 months", "6 months"];

  const FilterSection = ({ title, children, id }) => (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))}
        className="flex justify-between items-center w-full"
      >
        <span className="font-medium text-gray-700">{title}</span>
        <span
          className={`transform transition-transform ${
            expanded[id] ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>
      <div className={`mt-3 space-y-2 ${expanded[id] ? "block" : "hidden"}`}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search jobs..."
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <FilterSection title="Categories" id="categories">
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                onChange={(e) => {
                  const updatedCategories = e.target.checked
                    ? [...(activeFilters.categories || []), category]
                    : (activeFilters.categories || []).filter(
                        (c) => c !== category
                      );
                  onFilterChange("categories", updatedCategories);
                }}
                checked={activeFilters.categories?.includes(category)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-600">{category}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Budget Range" id="budget">
        {budgetRanges.map((range) => (
          <label key={range.value} className="flex items-center">
            <input
              type="radio"
              name="budget"
              value={range.value}
              onChange={(e) => onFilterChange("budget", e.target.value)}
              checked={activeFilters.budget === range.value}
              className="border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-600">{range.label}</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Duration" id="duration">
        {durations.map((duration) => (
          <label key={duration} className="flex items-center">
            <input
              type="checkbox"
              onChange={(e) => {
                const updatedDurations = e.target.checked
                  ? [...(activeFilters.durations || []), duration]
                  : (activeFilters.durations || []).filter(
                      (d) => d !== duration
                    );
                onFilterChange("durations", updatedDurations);
              }}
              checked={activeFilters.durations?.includes(duration)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-gray-600">{duration}</span>
          </label>
        ))}
      </FilterSection>

      <button
        onClick={() => onFilterChange("reset", true)}
        className="mt-6 w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default JobFilters;
