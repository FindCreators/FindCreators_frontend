import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { makeRequest } from "../../../network/apiHelpers";
import { toast } from "react-hot-toast";
import {
  CalendarIcon,
  GlobeAltIcon,
  PencilIcon,
  ClipboardListIcon,
} from "@heroicons/react/outline";

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    budget: 0,
    skills: [],
    currency: "",
    category: "",
    duration: "",
    location: { country: "", city: "" },
    deadline: "",
  });
  const [initialJobData, setInitialJobData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const response = await makeRequest({
          url: `/api/listings?id=${jobId}`,
        });
        if (response.data && response.data.length > 0) {
          setJobData(response.data[0]);
          setInitialJobData(response.data[0]);
        } else {
          toast.error("Job data not found");
          navigate("/brand/jobs");
        }
      } catch (error) {
        toast.error("Failed to fetch job data");
        console.error("Error fetching job data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobData();
  }, [jobId, navigate]);

  useEffect(() => {
    const totalFields = Object.keys(jobData).length;
    const filledFields = Object.values(jobData).filter(
      (field) =>
        (Array.isArray(field) ? field.length > 0 : field) &&
        !(typeof field === "object" && Object.values(field).some((v) => !v))
    ).length;
    setProgress((filledFields / totalFields) * 100);
  }, [jobData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const changedFields = [];

    for (const key in jobData) {
      if (jobData[key] !== initialJobData[key]) {
        if (key === "location") {
          if (
            jobData.location.city !== initialJobData.location.city ||
            jobData.location.country !== initialJobData.location.country
          ) {
            changedFields.push({
              key: "location",
              value: JSON.stringify(jobData.location),
            });
          }
        } else if (key === "skills") {
          changedFields.push({
            key: "skills",
            value: JSON.stringify(jobData.skills),
          });
        } else if (key === "deadline") {
          const deadlineDate = new Date(jobData.deadline);
          const formattedDeadline = deadlineDate.toISOString();
          changedFields.push({ key: "deadline", value: formattedDeadline });
        } else {
          changedFields.push({ key, value: jobData[key] });
        }
      }
    }

    if (changedFields.length > 0) {
      try {
        await makeRequest({
          method: "PATCH",
          url: `/api/listings?id=${jobId}`,
          data: changedFields,
        });
        toast.success("Job updated successfully");
        navigate("/brand/jobs");
      } catch (error) {
        toast.error("Failed to update job");
        console.error("Error updating job:", error);
      }
    } else {
      toast.info("No changes detected");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Edit Job Posting
      </h1>

      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-right text-sm text-gray-500">
        {progress.toFixed(0)}% Complete
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <PencilIcon className="w-5 h-5 mr-2" />
            Title
          </label>
          <input
            type="text"
            value={jobData.title}
            onChange={(e) =>
              setJobData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter job title"
            required
          />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <ClipboardListIcon className="w-5 h-5 mr-2" />
            Description
          </label>
          <textarea
            value={jobData.description}
            onChange={(e) =>
              setJobData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Describe the job details"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Budget (INR)
            </label>
            <input
              type="number"
              value={jobData.budget}
              onChange={(e) =>
                setJobData((prev) => ({
                  ...prev,
                  budget: parseFloat(e.target.value),
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter budget"
              required
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>
            <input
              type="text"
              value={jobData.currency}
              onChange={(e) =>
                setJobData((prev) => ({ ...prev, currency: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter currency"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <input
              type="text"
              value={jobData.category}
              onChange={(e) =>
                setJobData((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter category"
              required
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration
            </label>
            <input
              type="text"
              value={jobData.duration}
              onChange={(e) =>
                setJobData((prev) => ({ ...prev, duration: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter duration"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <GlobeAltIcon className="w-5 h-5 mr-2" />
              Country
            </label>
            <input
              type="text"
              value={jobData.location.country}
              onChange={(e) =>
                setJobData((prev) => ({
                  ...prev,
                  location: { ...prev.location, country: e.target.value },
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter country"
              required
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <GlobeAltIcon className="w-5 h-5 mr-2" />
              City
            </label>
            <input
              type="text"
              value={jobData.location.city}
              onChange={(e) =>
                setJobData((prev) => ({
                  ...prev,
                  location: { ...prev.location, city: e.target.value },
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter city"
              required
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <CalendarIcon className="w-5 h-5 mr-2" />
            Deadline
          </label>
          <input
            type="datetime-local"
            value={jobData.deadline}
            onChange={(e) =>
              setJobData((prev) => ({ ...prev, deadline: e.target.value }))
            }
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Update Job
        </button>
      </form>
    </div>
  );
};

export default EditJob;
