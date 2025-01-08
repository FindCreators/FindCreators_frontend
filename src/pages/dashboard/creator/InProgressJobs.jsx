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

const InProgressJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [profiles, setProfiles] = useState({});
  const location = useLocation();
  const [selectedJob, setSelectedJob] = useState(null);
  const isBrandDashboard = location.pathname.includes("/brand/");
  const [showProfile, setShowProfile] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const renderActions = (job) => {
    console.log("isBrandDashboard", isBrandDashboard);
    if (!isBrandDashboard) {
      return (
        <button
          onClick={() => setSelectedJob(job)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Send className="w-4 h-4" />
          Submit Work
        </button>
      );
    }
    return null;
  };

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

  const renderProfile = (job) => {
    const brandId = job.brandId;
    const profileId = isBrandDashboard ? job.offerToCreatorId : job.brandId;
    const profile = profiles[profileId];

    const handleImageError = () => {
      setImageError(true);
    };

    const getInitials = (name) => {
      return name ? name.charAt(0).toUpperCase() : "";
    };

    if (!profile) return null;

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">
          {isBrandDashboard ? "Creator Details" : "Brand Details"}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            {(isBrandDashboard && profile.profilePicture) ||
            (!isBrandDashboard && profile.logo) ? (
              <div className="relative w-10 h-10">
                {imageError || !profile.profilePicture ? (
                  <div
                    className="w-full h-full flex items-center justify-center cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full"
                    onClick={() => setShowProfile(true)}
                  >
                    {getInitials(profile.fullName)}
                  </div>
                ) : (
                  <img
                    onClick={() => setShowProfile(true)}
                    src={profile.profilePicture}
                    alt={profile.fullName || "Creator"}
                    className="w-full h-full object-cover  rounded-full cursor-pointer"
                    onError={handleImageError}
                  />
                )}
              </div>
            ) : null}
            <span
              onClick={() => setShowProfile(true)}
              className="cursor-pointer"
            >
              {isBrandDashboard ? profile.fullName : profile.companyName}
            </span>
          </div>

          {profile.email && (
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{profile.email}</span>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{profile.phone}</span>
            </div>
          )}
        </div>
        <CreatorProfileModal
          brandId={brandId}
          creator={profile}
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
        />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          In Progress Jobs
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {allSkills.map((skill) => (
              <button
                key={skill}
                onClick={() =>
                  setSelectedSkills((prev) =>
                    prev.includes(skill)
                      ? prev.filter((s) => s !== skill)
                      : [...prev, skill]
                  )
                }
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

      <div className="grid gap-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
          >
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
                <p className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  {job.location?.city}, {job.location?.country}
                </p>
                <p className="text-gray-700 mb-4">{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
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
                    >
                      {job.externalLinks[0].title}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 md:text-right">
                <div className="flex items-center gap-1 text-green-600 font-medium">
                  <DollarSign className="w-4 h-4" />
                  {job.currency} {job.budget?.toLocaleString()}
                </div>

                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {new Date(job.createdAt).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {job.status}
                  </span>
                  <span className="text-sm text-gray-600">{job.duration}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {job.status}
                </span>
                <span className="text-sm text-gray-600">{job.duration}</span>
              </div>
              {renderActions(job)}
            </div>

            {renderProfile(job)}
          </div>
        ))}
      </div>
      {selectedJob && (
        <JobSubmission
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onSuccess={() => {
            fetchJobs();
            toast.success("Work submitted successfully!");
          }}
        />
      )}
    </div>
  );
};

export default InProgressJobs;
