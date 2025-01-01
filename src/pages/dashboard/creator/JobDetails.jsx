import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBrandProfile } from "../../../network/networkCalls";
import toast from "react-hot-toast";
import { Calendar, MapPin, Users, Clock, File, ArrowLeft } from "lucide-react";

const JobDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { job } = location.state;
  const [brand, setBrand] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBrandProfile = async () => {
      try {
        setIsLoading(true);
        const brandResponse = await getBrandProfile(job.brandId);
        setBrand(brandResponse.data[0]);
      } catch (error) {
        toast.error("Failed to fetch brand profile");
        console.error("Error fetching brand profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandProfile();
  }, [job.brandId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-500 to-indigo-600">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
      </div>
    );
  }

  if (!job || !brand) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-800 text-lg">
        Job or Brand details not found
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const daysUntilDeadline = (deadline) => {
    const days = Math.ceil(
      (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)
    );
    return days > 0 ? `${days} days left` : "Deadline passed";
  };
  console.log(job);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-200 min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-indigo-500 hover:text-indigo-700 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Job Details */}
          <div className="shadow-xl rounded-xl overflow-hidden transition-transform">
            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-6 border-b pb-3 border-gray-200">
                {job.title}
              </h1>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                  Job Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                  Skills Required
                </h2>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-full shadow-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                  Location
                </h2>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-6 h-6 text-indigo-500" />
                  <span>
                    {job.location.city}, {job.location.country}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                  Deadline
                </h2>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-6 h-6 text-indigo-500" />
                  <span>{daysUntilDeadline(job.deadline)}</span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                  Status
                </h2>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${
                    job.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {job.status}
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                  Attachments
                </h2>
                {job.attachments.length > 0 ? (
                  <div className="space-y-3">
                    {job.attachments.map((attachment, index) => {
                      const attachmentUrl =
                        typeof attachment === "string"
                          ? attachment
                          : attachment?.url || ""; // Ensure URL is always a string

                      return attachmentUrl ? (
                        <div key={index} className="flex items-center gap-3">
                          <File className="w-6 h-6 text-indigo-500" />
                          <a
                            href={attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-500 hover:underline"
                          >
                            {attachmentUrl.split("/").pop()}
                          </a>
                        </div>
                      ) : (
                        <p key={index} className="text-gray-600">
                          Invalid attachment
                        </p>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-600">No attachments available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Brand Details */}
          <div className=" shadow-xl rounded-xl overflow-hidden  transition-transform">
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3 border-gray-200">
                Brand Details
              </h2>

              <div className="flex items-center gap-5 mb-8">
                <img
                  src={brand.logo}
                  alt={brand.companyName}
                  className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-indigo-200"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {brand.companyName}
                  </h3>
                  <p className="text-gray-600 text-sm">{brand.bio}</p>
                  <p className="text-gray-600 text-sm">
                    {brand.location.city}, {brand.location.country}
                  </p>
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:underline text-sm"
                  >
                    {brand.website}
                  </a>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-gray-700">
                  Followers
                </h3>
                <p className="text-gray-600 text-lg">{brand.followers}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-gray-700">
                  Total Spent
                </h3>
                <p className="text-gray-600 text-lg">${brand.totalSpent}</p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-700">
                  Verification Status
                </h3>
                <p
                  className={`text-lg font-medium ${
                    brand.isVerified ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {brand.isVerified ? "Verified" : "Not Verified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
