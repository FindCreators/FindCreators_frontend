import React from "react";
import { MapPin, Mail, Phone, Globe, Award, Calendar } from "lucide-react";

const AboutSection = ({ profile }) => {
  console.log(profile);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main Info */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Bio</h2>
          <p className="text-gray-600 leading-relaxed">
            {profile?.bio || "No bio provided yet."}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Skills & Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {profile?.skills?.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
              >
                {skill}
              </span>
            )) || "No skills listed yet."}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Languages</h2>
          <div className="flex flex-wrap gap-4">
            {profile?.languages?.map((lang, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="font-medium">{lang.language}</span>
                <span className="text-gray-500">({lang.proficiency})</span>
              </div>
            )) || "No languages listed yet."}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span>
                {profile?.location?.city}, {profile?.location?.country}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <span>{profile?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <span>{profile?.phone}</span>
            </div>
            {profile?.portfolioUrl && (
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-400" />
                <a
                  href={profile.portfolioUrl}
                  className="text-blue-600 hover:underline"
                >
                  Portfolio Website
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Collaboration Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Minimum Rate</span>
              <span className="font-medium">
                {profile?.currency} {profile?.minimumRate}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Preferred Rate</span>
              <span className="font-medium">
                {profile?.currency} {profile?.preferredRate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
