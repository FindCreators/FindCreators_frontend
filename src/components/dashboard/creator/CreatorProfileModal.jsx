import React from "react";
import {
  X,
  MapPin,
  Users,
  Star,
  Globe,
  Clock,
  DollarSign,
  Mail,
  Phone,
  Link,
  Calendar,
  Activity,
  Award,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const CreatorProfileModal = ({ creator, isOpen, onClose }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const formatSocialHandle = (handle) => {
    if (!handle) return null;
    return handle.startsWith("@") ? handle : `@${handle}`;
  };

  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return Facebook;
      case "twitter":
        return Twitter;
      case "instagram":
        return Instagram;
      case "linkedin":
        return Linkedin;
      default:
        return Link;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Creator Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500"></div>

        {/* Main Content */}
        <div className="px-8 pb-8">
          {/* Profile Header Section */}
          <div className="relative flex flex-col md:flex-row gap-6 -mt-12 mb-8">
            <div className="flex-shrink-0">
              <img
                src={creator.profilePicture || "/api/placeholder/120/120"}
                alt={creator.fullName}
                className="w-32 h-32 rounded-xl border-4 border-white object-cover shadow-lg"
              />
            </div>
            <div className="flex-1 pt-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    {creator.fullName}
                    {creator.isVerified && (
                      <span className="text-blue-500 bg-blue-50 p-1 rounded-full">
                        <Award className="w-5 h-5" />
                      </span>
                    )}
                  </h1>
                  <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
                    {creator.location?.city && creator.location?.country && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {creator.location.city}, {creator.location.country}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {creator.followers || 0} followers
                    </div>
                    {creator.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {creator.rating} ({creator.reviewCount} reviews)
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {formatDate(creator.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Message
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Follow
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Layout for Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Content - Left 2 Columns */}
            <div className="md:col-span-2 space-y-6">
              {/* About Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">About</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {creator.bio || "No bio available"}
                </p>
              </div>

              {/* Skills Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {creator.skills?.length > 0 ? (
                    creator.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No skills listed</p>
                  )}
                </div>
              </div>

              {/* Portfolio Section */}
              {creator.portfolioUrl && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4">Portfolio</h3>
                  <a
                    href={creator.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    <Link className="w-4 h-4" />
                    View Portfolio
                  </a>
                </div>
              )}
            </div>

            {/* Sidebar - Right Column */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    {creator.email}
                  </div>
                  {creator.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      {creator.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Work Preferences */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Work Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    Preferred Rate: ${creator.preferredRate}/hr
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    Total Earnings: ${creator.totalEarned}
                  </div>
                  {creator.engagementRate > 0 && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Activity className="w-4 h-4" />
                      Engagement Rate: {creator.engagementRate}%
                    </div>
                  )}
                </div>
              </div>

              {/* Languages */}
              {creator.languages?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4">Languages</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="w-4 h-4" />
                    {creator.languages.join(", ")}
                  </div>
                </div>
              )}

              {/* Social Handles */}
              {creator.socialHandles &&
                Object.keys(creator.socialHandles).length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Social Media</h3>
                    <div className="space-y-3">
                      {Object.entries(creator.socialHandles).map(
                        ([platform, handle]) => {
                          if (!handle) return null;
                          const IconComponent = getSocialIcon(platform);
                          return (
                            <div
                              key={platform}
                              className="flex items-center gap-2 text-gray-600"
                            >
                              <IconComponent className="w-4 h-4" />
                              {formatSocialHandle(handle)}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfileModal;
