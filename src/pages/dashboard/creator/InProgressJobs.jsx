import React, { useState, useEffect } from "react";
import {
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  Tag,
  Search,
  User,
  Mail,
  Phone,
  Send,
  IndianRupee,
  Menu,
} from "lucide-react";
import { makeRequest } from "../../../network/apiHelpers";
import {
  getBrandProfile,
  getCreatorProfile,
} from "../../../network/networkCalls";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import JobSubmission from "./JobSubmission";
import CreatorProfileModal from "../../../components/dashboard/creator/CreatorProfileModal";
import BrandProfileModal from "../../../components/dashboard/brand/BrandProfileModal";

const InProgressJobs = () => {
  // State declarations
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [imageError, setImageError] = useState({}); // Changed to object to track per profile

  const location = useLocation();
  const isBrandDashboard = location.pathname.includes("/brand/");

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await makeRequest({
        url: "/api/listings-inProgress?page=1&limit=10",
      });
      const jobsData = response.listings || [];
      setJobs(jobsData);
      await fetchProfiles(jobsData);
    } catch (error) {
      toast.error("Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleProfileClick = (job) => {
    setSelectedJob({ ...job, isProfileView: true });
    setShowProfile(true);
  };

  const handleSubmitWork = (job) => {
    setSelectedJob({ ...job, isProfileView: false });
  };

  const handleSubmissionSuccess = () => {
    fetchJobs();
    toast.success("Work submitted successfully!");
    setSelectedJob(null);
  };

  // useEffect hooks
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchProfiles = async (jobs) => {
    const profilePromises = jobs.map((job) => {
      const id = isBrandDashboard ? job.offerToCreatorId : job.brandId;
      const fetchFn = isBrandDashboard ? getCreatorProfile : getBrandProfile;
      return fetchFn(id)
        .then((response) => ({
          id,
          data: response.data?.[0] || response.data,
        }))
        .catch(() => ({ id, data: null }));
    });

    const profilesData = await Promise.all(profilePromises);
    const profilesMap = profilesData.reduce((acc, { id, data }) => {
      acc[id] = data;
      return acc;
    }, {});

    setProfiles(profilesMap);
  };

  const handleImageError = (profileId) => {
    setImageError((prev) => ({
      ...prev,
      [profileId]: true,
    }));
  };

  // Render functions
  const renderProfile = (job) => {
    const profileId = isBrandDashboard ? job.offerToCreatorId : job.brandId;
    const profile = profiles[profileId];

    if (!profile) return null;

    const hasImageError = imageError[profileId];
    const profileName = isBrandDashboard
      ? profile.fullName
      : profile.companyName;
    const profileImage = isBrandDashboard
      ? profile.profilePicture
      : profile.logo;

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">
          {isBrandDashboard ? "Creator Details" : "Brand Details"}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="relative w-10 h-10">
              {hasImageError || !profileImage ? (
                <div
                  className="w-full h-full flex items-center justify-center cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full"
                  onClick={() => handleProfileClick(job)}
                >
                  {profileName?.[0]?.toUpperCase()}
                </div>
              ) : (
                <img
                  src={profileImage}
                  alt={profileName || "Profile"}
                  className="w-full h-full object-cover rounded-full cursor-pointer"
                  onError={() => handleImageError(profileId)}
                  onClick={() => handleProfileClick(job)}
                />
              )}
            </div>
            <span
              className="cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => handleProfileClick(job)}
            >
              {profileName}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {profile.email && (
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm truncate">{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{profile.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Computed values
  const allSkills = [...new Set(jobs.flatMap((job) => job.skills || []))];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchTerm ||
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.every((skill) => job.skills?.includes(skill));

    return matchesSearch && matchesSkills;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-4 sm:p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            In Progress Jobs
          </h1>

          <div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg"
              >
                <Menu className="w-4 h-4" />
                Filters
              </button>
              {selectedSkills.length > 0 && (
                <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded-full">
                  {selectedSkills.length}
                </span>
              )}
            </div>
          </div>

          <div className={`mt-4 ${isFilterVisible || "hidden sm:block"}`}>
            <div className="flex flex-wrap gap-2">
              {allSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedSkills.includes(skill)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                    <p className="flex items-center gap-2 text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                        {job.location?.city}, {job.location?.country}
                      </span>
                    </p>
                  </div>

                  <p className="text-gray-700 text-sm sm:text-base">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {job.skills?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        {skill}
                      </span>
                    ))}
                  </div>

                  {job.externalLinks?.[0] && (
                    <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                      <ExternalLink className="w-4 h-4" />
                      <a
                        href={job.externalLinks[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm truncate"
                      >
                        {job.externalLinks[0].title}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex flex-row lg:flex-col justify-between lg:items-end gap-3 lg:min-w-[200px]">
                  <div className="flex items-center gap-1 text-green-600 font-medium">
                    <IndianRupee className="w-4 h-4" />
                    <span className="whitespace-nowrap">
                      {job.currency} {job.budget?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span className="whitespace-nowrap">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {job.status}
                    </span>
                    <span className="text-sm text-gray-600">
                      {job.duration}
                    </span>
                  </div>
                  {!isBrandDashboard && (
                    <button
                      onClick={() => handleSubmitWork(job)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Submit Work
                    </button>
                  )}
                </div>
              </div>

              {renderProfile(job)}
            </div>
          ))}
        </div>
      </div>

      {selectedJob && !selectedJob.isProfileView && (
        <JobSubmission
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onSuccess={handleSubmissionSuccess}
        />
      )}

      {showProfile &&
        selectedJob?.isProfileView &&
        (isBrandDashboard ? (
          <CreatorProfileModal
            isOpen={showProfile}
            onClose={() => {
              setShowProfile(false);
              setSelectedJob(null); // Clear selected job when closing profile
            }}
            creator={profiles[selectedJob?.offerToCreatorId]}
            brandId={selectedJob?.brandId}
          />
        ) : (
          <BrandProfileModal
            isOpen={showProfile}
            onClose={() => {
              setShowProfile(false);
              setSelectedJob(null); // Clear selected job when closing profile
            }}
            brand={profiles[selectedJob?.brandId]}
          />
        ))}
    </div>
  );
};

export default InProgressJobs;
