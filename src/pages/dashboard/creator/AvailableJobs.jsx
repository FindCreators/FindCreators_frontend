// src/pages/dashboard/creator/AvailableJobs.jsx
import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { toast } from "react-hot-toast";
import JobCard from "../../../components/dashboard/creator/JobCard";
import { getListings, applyToJob } from "../../../network/networkCalls";
import Pagination from "../../../components/dashboard/creator/Pagination";
import ApplyJobModal from "../../../components/dashboard/creator/ApplyJobModal";

const AvailableJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    categories: [],
    budget: null,
    duration: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

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

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await getListings(filters);
      setJobs(response.data);
    } catch (error) {
      toast.error("Failed to fetch jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (jobId, quotedPrice, message) => {
    try {
      await applyToJob(jobId, quotedPrice, message);
      toast.success("Application submitted successfully");
      fetchJobs();
    } catch (error) {
      toast.error("Failed to submit application");
    }
  };

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      categories: [],
      budget: null,
      duration: [],
    });
  };

  const openModal = (jobId) => {
    setSelectedJobId(jobId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJobId(null);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Search and Filters Header */}
      <div className=" bg-gray-900 p-4 border-b border-gray-800 z-10">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Search Bar and Filter Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search job postings"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-full py-2.5 pl-10 pr-4 border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-700 hover:bg-gray-800 transition-colors ${
                showFilters ? "text-blue-500 border-blue-500" : "text-gray-300"
              }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-gray-800 rounded-lg p-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Categories */}
                <div>
                  <h3 className="text-gray-300 font-medium mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category)}
                          onChange={(e) => {
                            const newCategories = e.target.checked
                              ? [...filters.categories, category]
                              : filters.categories.filter(
                                  (c) => c !== category
                                );
                            handleFilterChange("categories", newCategories);
                          }}
                          className="rounded text-green-500 focus:ring-green-500 bg-gray-700 border-gray-600"
                        />
                        <span className="text-gray-300">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Budget Range */}
                <div>
                  <h3 className="text-gray-300 font-medium mb-4">
                    Budget Range
                  </h3>
                  <div className="space-y-2">
                    {budgetRanges.map((range) => (
                      <label
                        key={range.value}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="radio"
                          name="budget"
                          value={range.value}
                          checked={filters.budget === range.value}
                          onChange={(e) =>
                            handleFilterChange("budget", e.target.value)
                          }
                          className="text-green-500 focus:ring-green-500 bg-gray-700 border-gray-600"
                        />
                        <span className="text-gray-300">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <h3 className="text-gray-300 font-medium mb-4">Duration</h3>
                  <div className="space-y-2">
                    {durations.map((duration) => (
                      <label key={duration} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.duration.includes(duration)}
                          onChange={(e) => {
                            const newDurations = e.target.checked
                              ? [...filters.duration, duration]
                              : filters.duration.filter((d) => d !== duration);
                            handleFilterChange("duration", newDurations);
                          }}
                          className="rounded text-green-500 focus:ring-green-500 bg-gray-700 border-gray-600"
                        />
                        <span className="text-gray-300">{duration}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Applied Filters and Clear Button */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {[...filters.categories, filters.budget, ...filters.duration]
                    .filter(Boolean)
                    .map((filter, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
                      >
                        {filter}
                        <X
                          className="h-4 w-4 hover:text-white cursor-pointer"
                          onClick={() => {
                            // Remove the filter
                            const type = filters.categories.includes(filter)
                              ? "categories"
                              : filters.duration.includes(filter)
                              ? "duration"
                              : "budget";
                            if (type === "budget") {
                              handleFilterChange("budget", null);
                            } else {
                              const newFilters = filters[type].filter(
                                (f) => f !== filter
                              );
                              handleFilterChange(type, newFilters);
                            }
                          }}
                        />
                      </span>
                    ))}
                </div>
                {Object.values(filters).some((v) =>
                  Array.isArray(v) ? v.length > 0 : v
                ) && (
                  <button
                    onClick={clearFilters}
                    className="text-green-500 hover:text-green-400"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={() => openModal(job.id)}
                isApplied={job.applicants?.includes(
                  localStorage.getItem("userId")
                )}
              />
            ))}
          </div>
        )}
      </div>
      <ApplyJobModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onApply={handleApply}
        jobId={selectedJobId}
      />
    </div>
  );
};

export default AvailableJobs;
