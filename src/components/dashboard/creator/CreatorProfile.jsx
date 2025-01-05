import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import CreatorProfileHeader from "./CreatorProfileHeader";
import EditProfileModal from "./EditProfileModal";
import AboutSection from "./sections/AboutSection";
import PortfolioSection from "./sections/PortfolioSection";
import StatsSection from "./sections/StatsSection";
import ReviewsSection from "./sections/ReviewsSection";
import {
  getCreatorProfile,
  updateCreatorProfile,
} from "../../../network/networkCalls";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

const CreatorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [activeSection, setActiveSection] = useState("about");
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    console.log("useEffect triggered");
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getCreatorProfile(localStorage.getItem("userId"));
      setProfile(response.data[0]);
      console.log("Profile loaded:", response.data[0]);
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast.error("Failed to load Creator profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (data, section) => {
    try {
      const sectionKeys = {
        basic: ["fullName", "bio", "location"],
        contact: ["email", "phone", "portfolioUrl"],
        social: ["socialHandles"],
        expertise: ["skills", "niche", "languages"],
        rates: ["minimumRate", "preferredRate", "currency"],
        collab: ["collabPreferences"],
      };

      const allowedKeys = sectionKeys[section] || [];

      const sectionData = Object.keys(data).reduce((acc, key) => {
        if (allowedKeys.includes(key) && data[key] !== undefined) {
          let value = data[key];

          if (key === "location" && typeof value === "object") {
            value = JSON.stringify(value);
          } else if (key === "socialHandles") {
            const formattedHandles = (value || []).map((handle) => ({
              platform: handle.platform,
              url: handle.url,
              followers: parseInt(handle.followers) || 0,
              profileId: handle.url.split("/").pop() || handle.profileId || "",
            }));
            value = JSON.stringify(formattedHandles);
          } else if (Array.isArray(value)) {
            value = JSON.stringify(value);
          }

          acc.push({
            key,
            value: value?.toString() || "",
          });
        }
        return acc;
      }, []);

      if (sectionData.length > 0) {
        const updatedProfile = await updateCreatorProfile(sectionData);
        setProfile(updatedProfile);
        toast.success("Profile updated successfully");
        setActiveModal(null);
      } else {
        setActiveModal(null);
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleImageUpload = async (type, imageUrl) => {
    try {
      const updateData = [
        {
          key: type === "profile" ? "profilePicture" : "coverImage",
          value: imageUrl,
        },
      ];

      await updateCreatorProfile(updateData);
      await fetchProfile();
    } catch (error) {
      console.error(`Error updating profile ${type}:`, error);
      toast.error(`Failed to update profile ${type}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-200 rounded-full mb-4"></div>
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </div>
    );
  }

  const sections = [
    { id: "about", label: "About" },
    { id: "portfolio", label: "Portfolio" },
    { id: "stats", label: "Statistics" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <CreatorProfileHeader
        profile={profile}
        onEdit={() => setActiveModal("basic")}
        onUploadCover={(file) => handleImageUpload("cover", file)}
        onUploadPhoto={(file) => handleImageUpload("profile", file)}
      />

      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-4 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-4 px-2 border-b-2 transition-colors flex-shrink-0 ${
                  activeSection === section.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeSection === "about" && (
          <AboutSection
            profile={profile}
            onEdit={(section) => setActiveModal(section)}
          />
        )}
        {activeSection === "portfolio" && (
          <PortfolioSection
            profile={profile}
            onEdit={() => setActiveModal("portfolio")}
          />
        )}
        {activeSection === "stats" && (
          <StatsSection
            profile={profile}
            onEdit={() => setActiveModal("stats")}
          />
        )}
        {activeSection === "reviews" && (
          <ReviewsSection
            profile={profile}
            onEdit={() => setActiveModal("reviews")}
          />
        )}
      </div>

      <EditProfileModal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        section={activeModal}
        profile={profile}
        onSave={handleUpdateProfile}
      />
      <div className="fixed bottom-4 right-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default CreatorProfile;
