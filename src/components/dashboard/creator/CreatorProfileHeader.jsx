import React from "react";
import {
  Camera,
  MapPin,
  Edit2,
  BadgeCheck,
  Instagram,
  Youtube,
  Twitter,
  Globe,
} from "lucide-react";

const CreatorProfileHeader = ({
  profile,
  onEdit,
  onUploadCover,
  onUploadPhoto,
}) => {
  return (
    <div className="relative min-h-[400px]">
      {/* Cover Section */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="absolute inset-0 bg-black/30" />
        <button
          onClick={onUploadCover}
          className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/40 rounded-lg text-white transition-colors"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-48 pb-6 flex flex-col md:flex-row md:items-end md:gap-6 gap-4">
          {/* Profile Picture */}
          <div className="relative -mb-26 z-10 mx-auto md:mx-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-2xl border-4 border-white shadow-xl overflow-hidden">
              <img
                src={profile?.profilePicture}
                alt={profile?.fullName}
                className="w-full h-full object-cover"
              />
              <button
                onClick={onUploadPhoto}
                className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-all flex items-center justify-center group"
              >
                <Camera className="w-8 h-8 text-white transform scale-90 group-hover:scale-100 transition-transform" />
              </button>
            </div>
          </div>

          {/* Creator Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col items-center md:flex-row md:items-center gap-3 mb-2">
              <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                {profile?.fullName}
              </h1>
              {profile?.isVerified && (
                <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-300" />
              )}
            </div>

            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-4 mb-4 text-blue-100">
              {profile?.niche && (
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs sm:text-sm">
                  {profile.niche}
                </span>
              )}
              {profile?.location?.city && (
                <div className="flex items-center gap-1 text-xs sm:text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {profile.location.city}, {profile.location.country}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">
              {[
                {
                  name: "Instagram",
                  icon: Instagram,
                  color: "hover:text-pink-400",
                },
                { name: "Youtube", icon: Youtube, color: "hover:text-red-500" },
                {
                  name: "Twitter",
                  icon: Twitter,
                  color: "hover:text-blue-400",
                },
                {
                  name: "Portfolio",
                  icon: Globe,
                  color: "hover:text-green-400",
                },
              ].map((platform) => (
                <a
                  key={platform.name}
                  href="#"
                  className={`p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors ${platform.color}`}
                >
                  <platform.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Stats Preview */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 text-white/90 text-center">
            <div className="flex-1 min-w-[80px]">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">
                {profile?.followers || 0}
              </div>
              <div className="text-xs sm:text-sm text-white/70">Followers</div>
            </div>
            <div className="flex-1 min-w-[80px]">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">
                {profile?.reviewCount || 0}
              </div>
              <div className="text-xs sm:text-sm text-white/70">Reviews</div>
            </div>
            <div className="flex-1 min-w-[80px]">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">
                {profile?.engagementRate || 0}%
              </div>
              <div className="text-xs sm:text-sm text-white/70">Engagement</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-2 sm:gap-3">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors">
              Share Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfileHeader;
