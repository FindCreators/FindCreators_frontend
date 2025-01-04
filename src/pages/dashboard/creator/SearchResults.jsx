import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeRequest } from "../../../network/apiHelpers";
import JobSearchCard from "../../../components/dashboard/creator/JobSearchCard";
import { applyToJob } from "../../../network/networkCalls";
import toast from "react-hot-toast";
import ApplyJobModal from "../../../components/dashboard/creator/ApplyJobModal";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const navigate = useNavigate();
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await makeRequest({
          url: `/api/listings/?title=${encodeURIComponent(searchQuery)}`,
        });

        setResults(response.data || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery]);

  const openModal = (jobId) => {
    setSelectedJobId(jobId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJobId(null);
  };

  const handleApply = async (jobId, quotedPrice, message) => {
    try {
      await applyToJob(jobId, quotedPrice, message);
      toast.success("Application submitted successfully");
      closeModal();
    } catch (error) {
      toast.error("Failed to submit application");
    }
  };

  const viewJobDetails = (job) => {
    navigate(`/creator/available-jobs/${job.id}`, { state: { job } });
  };

  const isApplied = (job) => {
    const userId = localStorage.getItem("userId");
    return job.applications.some((app) => app.creatorId === userId);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">
        Search Results for "{searchQuery}"
      </h1>

      {results.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500">
            No jobs found matching "{searchQuery}". Try adjusting your search
            terms.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm">
              <JobSearchCard
                listing={job}
                onApply={() => openModal(job.id)}
                isApplied={isApplied(job)}
              />
            </div>
          ))}
        </div>
      )}

      <ApplyJobModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onApply={handleApply}
        jobId={selectedJobId}
      />
    </div>
  );
};

export default SearchResults;
