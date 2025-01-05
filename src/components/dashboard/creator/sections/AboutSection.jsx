import React from "react";
import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Edit2,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  DollarSign,
} from "lucide-react";

const AboutSection = ({ profile, onEdit }) => {
  const formatCurrency = (amount, currency = "USD") => {
    if (!amount) return "Not specified";
    return `${currency} ${parseFloat(amount).toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main Content - Left Side */}
      <div className="md:col-span-2 space-y-6">
        {/* Bio Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Bio</h2>
            <button
              onClick={() => onEdit("basic")}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
            {profile?.bio || "No bio provided yet. Click edit to add your bio."}
          </p>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Skills & Expertise</h2>
            <button
              onClick={() => onEdit("expertise")}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          {profile?.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              No skills listed yet. Click edit to add your skills.
            </p>
          )}

          {/* Niche Section */}
          {profile?.niche && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Niche</h3>
              <div className="flex flex-wrap gap-2">
                {profile.niche.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Languages Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Languages</h2>
            <button
              onClick={() => onEdit("expertise")}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          {profile?.languages?.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {profile.languages.map((lang, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="font-medium">{lang}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              No languages listed yet. Click edit to add languages you speak.
            </p>
          )}
        </div>

        {/* Collaboration Preferences */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Collaboration Preferences</h2>
            <button
              onClick={() => onEdit("collab")}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          {profile?.collabPreferences?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.collabPreferences.map((pref, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm"
                >
                  {pref}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              No preferences set yet. Click edit to add your collaboration
              preferences.
            </p>
          )}
        </div>

        {/* Social Handles Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Social Handles</h2>
            <button
              onClick={() => onEdit("social")}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          {profile?.socialHandles?.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {profile.socialHandles.map((handle, index) => {
                let Icon;
                switch (handle.platform.toLowerCase()) {
                  case "instagram":
                    Icon = Instagram;
                    break;
                  case "youtube":
                    Icon = Youtube;
                    break;
                  case "twitter":
                    Icon = Twitter;
                    break;
                  case "linkedin":
                    Icon = Linkedin;
                    break;
                  default:
                    return null;
                }
                return (
                  <a
                    key={index}
                    href={handle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <Icon className="w-6 h-6" />
                    <span>{handle.platform}</span>
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              No social handles listed yet. Click edit to add your social
              handles.
            </p>
          )}
        </div>
      </div>

      {/* Sidebar - Right Side */}
      <div className="space-y-6">
        {/* Contact Information */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <button
              onClick={() => onEdit("contact")}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {profile?.location?.city && profile?.location?.country && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <span>
                  {profile.location.city}, {profile.location.country}
                </span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <span>{profile?.email || "Not provided"}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-blue-600" />
              </div>
              <span>{profile?.phone || "Not provided"}</span>
            </div>
            {profile?.portfolioUrl && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-blue-600" />
                </div>
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Portfolio Website
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Rates Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Rates</h2>
            <button
              onClick={() => onEdit("rates")}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Minimum Rate</span>
              </div>
              <span className="font-medium">
                {formatCurrency(profile?.minimumRate, profile?.currency)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Preferred Rate</span>
              </div>
              <span className="font-medium">
                {formatCurrency(profile?.preferredRate, profile?.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
