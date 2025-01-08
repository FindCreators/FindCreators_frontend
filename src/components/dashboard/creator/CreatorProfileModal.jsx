import React, { useState } from "react";
import {
  X,
  MapPin,
  Users,
  Star,
  Activity,
  Clock,
  Mail,
  Phone,
  Instagram,
  Calendar,
  Twitter,
  Linkedin,
  Youtube,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";

const CreatorProfileModal = ({ creator, isOpen, onClose }) => {
  const [imageError, setImageError] = useState(false);

  if (!isOpen) return null;

  const handleImageError = () => {
    setImageError(true);
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "";
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-semibold">Creator Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Profile Section */}
          <div className="flex flex-col sm:flex-row gap-6 mt-6">
            <div className="flex-shrink-0">
              <div className="relative w-10 h-10">
                {imageError || !creator.profilePicture ? (
                  <div className="w-16 h-16  flex items-center justify-center  bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full">
                    {getInitials(creator.fullName)}
                  </div>
                ) : (
                  <img
                    src={creator.profilePicture}
                    alt={creator.fullName || "Creator"}
                    className="w-full h-full object-cover rounded-full "
                    onError={handleImageError}
                  />
                )}
              </div>
            </div>

            <div className="flex-1 sm:pt-0">
              <div className="flex flex-wrap justify-between gap-4 md:ml-8 ml-0 mt-2 md:mt-0 items-start">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    {creator.fullName}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {creator.location?.city || "Unknown"},{" "}
                      {creator.location?.country || "Unknown"}
                    </span>
                    <span className="mx-2">•</span>
                    <Calendar className="w-4 h-4" />
                    <span>
                      Joined{" "}
                      {new Date(creator.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Message
                  </button>
                  <button className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Follow
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {[
                  {
                    icon: Star,
                    label: "Rating",
                    value: `${creator.rating || 5}(${
                      creator.reviewCount || 1
                    } reviews)`,
                  },
                  {
                    icon: Users,
                    label: "Followers",
                    value: creator.followers || 0,
                  },
                  {
                    icon: Activity,
                    label: "Engagement Rate",
                    value: `${creator.engagementRate || 0}%`,
                  },
                  {
                    icon: Clock,
                    label: "Minimum Rate",
                    value: `$${creator.minimumRate || 500}`,
                  },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                      <stat.icon className="w-4 h-4" />
                      {stat.label}
                    </div>
                    <div className="font-semibold">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            {/* Left Side */}
            <div className="col-span-2 space-y-6">
              {/* About */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-4">About</h3>
                <p className="text-gray-600">
                  {creator.bio || "No bio provided"}
                </p>
              </div>

              {/* Skills & Expertise */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Skills & Expertise
                </h3>
                <div className="space-y-4">
                  {/* Skills */}
                  <div>
                    <h4 className="text-sm text-gray-600 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {creator.skills?.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Niche */}
                  <div>
                    <h4 className="text-sm text-gray-600 mb-2">Niche</h4>
                    <div className="flex flex-wrap gap-2">
                      {creator.niche?.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-6">
              {/* Contact & Social */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-4">Contact & Social</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{creator.email}</span>
                  </div>
                  {creator.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{creator.phone}</span>
                    </div>
                  )}

                  {creator.socialHandles?.length > 0 && (
                    <div className="pt-4 mt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Social Media
                      </h4>
                      <div className="space-y-3">
                        {creator.socialHandles.map((social, idx) => (
                          <a
                            key={idx}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {social.platform.toLowerCase() === "instagram" ? (
                                <Instagram className="w-4 h-4 text-gray-400" />
                              ) : social.platform.toLowerCase() ===
                                "youtube" ? (
                                <YoutubeIcon className="w-4 h-4 text-gray-400" />
                              ) : social.platform.toLowerCase() ===
                                "twitter" ? (
                                <TwitterIcon className="w-4 h-4 text-gray-400" />
                              ) : social.platform.toLowerCase() ===
                                "linkedin" ? (
                                <LinkedinIcon className="w-4 h-4 text-gray-400" />
                              ) : null}
                              <span className="text-gray-600">
                                {social.platform}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {social.followers.toLocaleString()} followers
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Languages */}
              {creator.languages?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold mb-4">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {creator.languages.map((lang, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    ))}
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
