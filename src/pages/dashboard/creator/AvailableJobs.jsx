import React, { useState, useEffect, useRef } from "react";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import {
  X as XIcon,
  Tag as TagIcon,
  IndianRupee as IndianRupeeIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  Trash as TrashIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import JobCard from "../../../components/dashboard/creator/JobCard";
import { getListings, applyToJob } from "../../../network/networkCalls";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/dashboard/creator/Pagination";
import ApplyJobModal from "../../../components/dashboard/creator/ApplyJobModal";
import { makeRequest } from "../../../network/apiHelpers";

const AvailableJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchDebounceRef = useRef(null);
  const searchContainerRef = useRef(null);

  const [filters, setFilters] = useState({
    search: "",
    category: [],
    budget: null,
    duration: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const navigate = useNavigate();

  const category = [
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
    { label: "Under ₹1,000", value: "1000" },
    { label: "₹1,000 - ₹5,000", value: "5000" },
    { label: "₹5,000 - ₹10,000", value: "10000" },
    { label: "₹10,000+", value: "10001" },
  ];

  const durations = ["1 week", "2 weeks", "1 month", "3 months", "6 months"];

  useEffect(() => {
    fetchJobs();

    // Click outside listener for search suggestions
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filters]);

  const fetchSearchSuggestions = async (query) => {
    if (!query) {
      setSearchSuggestions([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await makeRequest({
        url: `/api/search-suggestion?query=${encodeURIComponent(query)}`,
      });
      setSearchSuggestions(response || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (value) => {
    handleFilterChange("search", value);

    // Debounce search suggestions
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      fetchSearchSuggestions(value);
    }, 300);
  };

  const handleSuggestionClick = (suggestion) => {
    handleFilterChange("search", suggestion.title);
    setShowSuggestions(false);
    fetchJobs();
  };

  const fetchJobs = async () => {
    try {
      setIsLoading(true);

      // Create query parameters
      const queryParams = new URLSearchParams({
        page: 1,
        limit: 10,
        ...(filters.search && { title: filters.search }),
        ...(filters.budget && { budget: filters.budget }),
        ...(filters.category.length > 0 && {
          category: filters.category.join(","),
        }),
      });

      const response = await makeRequest({
        url: `/api/listings?${queryParams.toString()}`,
      });

      // Sort jobs based on filters
      let sortedJobs = [...(response.data || [])];

      // Sort by category match if category filter is applied
      if (filters.category.length > 0) {
        sortedJobs.sort((a, b) => {
          const aMatchesCategory = filters.category.includes(a.category)
            ? 1
            : 0;
          const bMatchesCategory = filters.category.includes(b.category)
            ? 1
            : 0;
          return bMatchesCategory - aMatchesCategory;
        });
      }

      // Sort by budget match if budget filter is applied
      if (filters.budget) {
        const budgetValue = parseInt(filters.budget);
        sortedJobs.sort((a, b) => {
          if (filters.budget === "10001") {
            // For "10000+" filter
            return b.budget - a.budget;
          }
          // Sort by how close the budget is to the filter value
          const aDiff = Math.abs(a.budget - budgetValue);
          const bDiff = Math.abs(b.budget - budgetValue);
          return aDiff - bDiff;
        });
      }

      setJobs(sortedJobs);
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
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [type]: value,
      };

      // Log the updated filters for debugging
      console.log("Updated Filters:", newFilters);

      return newFilters;
    });
  };
  const clearFilters = () => {
    setFilters({
      search: "",
      category: [],
      budget: null,
      duration: [],
    });
  };

  useEffect(() => {
    // Debounce the API call to avoid too many requests
    const timer = setTimeout(() => {
      fetchJobs();
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);
  const openModal = (jobId) => {
    setSelectedJobId(jobId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJobId(null);
  };

  const viewJobDetails = (job) => {
    navigate(`/creator/available-jobs/${job.id}`, { state: { job } });
  };

  const isApplied = (job) => {
    const userId = localStorage.getItem("userId");
    return job.applications.some((app) => app.creatorId === userId);
  };

  const getJobPriority = (job) => {
    let priority = 0;

    // Increase priority for category match
    if (
      filters.category.length > 0 &&
      filters.category.includes(job.category)
    ) {
      priority += 2;
    }

    // Increase priority for budget match
    if (filters.budget) {
      const budgetValue = parseInt(filters.budget);
      if (filters.budget === "10001" && job.budget >= 10000) {
        priority += 1;
      } else if (Math.abs(job.budget - budgetValue) <= 1000) {
        priority += 1;
      }
    }

    return priority;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Search and Filters Header */}
      <div className=" bg-gray-900 p-4 border-b border-gray-800 z-10">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Search Bar and Filter Toggle */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative" ref={searchContainerRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search job postings"
                  value={filters.search}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onFocus={() => filters.search && setShowSuggestions(true)}
                  className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-xl py-3 pl-12 pr-4 border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                />
                {isSearching ? (
                  <Loader2 className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 animate-spin" />
                ) : (
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                )}
              </div>
              <div className="absolute right-4 top-1">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-colors ${
                    showFilters
                      ? "text-blue-500 border-blue-500 bg-blue-100 hover:bg-blue-200"
                      : "text-gray-300 border-gray-700 hover:bg-gray-800"
                  }`}
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  <span className="hidden sm:block">Filters</span>
                </button>
              </div>

              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-10">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <Search className="h-4 w-4 text-gray-400" />
                      {suggestion.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 mt-4 border border-gray-700/50 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Categories Section */}
                <div className="space-y-4">
                  <h3 className="text-gray-200 font-medium flex items-center gap-2">
                    <TagIcon className="w-5 h-5 text-blue-400" />
                    Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          const newCategories = filters.category.includes(cat)
                            ? filters.category.filter((c) => c !== cat)
                            : [...filters.category, cat];
                          handleFilterChange("category", newCategories);
                        }}
                        className={`px-4 py-2 rounded-xl transition-all ${
                          filters.category.includes(cat)
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/50"
                            : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 border-transparent"
                        } border backdrop-blur-sm`}
                      >
                        <span className="flex items-center gap-2">
                          {filters.category.includes(cat) && (
                            <CheckIcon className="w-4 h-4" />
                          )}
                          {cat}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Range Section */}
                <div className="space-y-4">
                  <h3 className="text-gray-200 font-medium flex items-center gap-2">
                    <IndianRupeeIcon className="w-5 h-5 text-green-400" />
                    Budget Range
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {budgetRanges.map((range) => (
                      <button
                        key={range.value}
                        onClick={() =>
                          handleFilterChange("budget", range.value)
                        }
                        className={`p-4 rounded-xl transition-all text-left ${
                          filters.budget === range.value
                            ? "bg-green-500/20 text-green-400 border-green-500/50"
                            : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 border-transparent"
                        } border backdrop-blur-sm relative group`}
                      >
                        <span className="text-sm font-medium block">
                          {range.label}
                        </span>
                        {filters.budget === range.value && (
                          <CheckCircleIcon className="w-4 h-4 absolute top-2 right-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Filters Section */}
              {(filters.category.length > 0 || filters.budget) && (
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-wrap gap-2">
                      {filters.category.map((filter) => (
                        <span
                          key={filter}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-sm"
                        >
                          <TagIcon className="w-3.5 h-3.5" />
                          {filter}
                          <button
                            onClick={() => {
                              const newCategories = filters.category.filter(
                                (c) => c !== filter
                              );
                              handleFilterChange("category", newCategories);
                            }}
                            className="ml-1 hover:text-blue-300 transition-colors"
                          >
                            <XIcon className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                      {filters.budget && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-sm">
                          <IndianRupeeIcon className="w-3.5 h-3.5" />
                          {
                            budgetRanges.find((r) => r.value === filters.budget)
                              ?.label
                          }
                          <button
                            onClick={() => handleFilterChange("budget", null)}
                            className="ml-1 hover:text-green-300 transition-colors"
                          >
                            <XIcon className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      )}
                    </div>
                    <button
                      onClick={clearFilters}
                      className="text-gray-400 hover:text-white text-sm font-medium flex items-center gap-2 group px-3 py-1.5 rounded-lg hover:bg-gray-700/50 transition-all"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Clear filters
                    </button>
                  </div>
                </div>
              )}
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
              <div
                key={job.id}
                className={`transition-all duration-300 ${
                  getJobPriority(job) > 0
                    ? "scale-102 ring-2 ring-green-500/20"
                    : ""
                }`}
              >
                <JobCard
                  job={job}
                  onApply={() => openModal(job.id)}
                  onViewDetails={viewJobDetails}
                  isApplied={isApplied(job)}
                  priority={getJobPriority(job)}
                />
              </div>
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
