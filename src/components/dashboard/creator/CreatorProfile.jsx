// src/components/dashboard/creator/CreatorProfile.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  Camera,
  MapPin,
  Briefcase,
  Star,
  Mail,
  Phone,
  Edit2,
  BadgeCheck,
  Globe,
  DollarSign,
  Heart,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
} from "lucide-react";
import CreatorProfileHeader from "./CreatorProfileHeader";
import EditProfileModal from "./EditProfileModal";
import AboutSection from "./sections/AboutSection";
import PortfolioSection from "./sections/PortfolioSection";
import StatsSection from "./sections/StatsSection";
import ReviewsSection from "./sections/ReviewsSection";
import { makeRequest } from "../../../network/apiHelpers";
import { getCreatorProfile } from "../../../network/networkCalls";

const CreatorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getCreatorProfile(localStorage.getItem("userId"));
      // Remove .json() since response is already JSON
      setProfile(response.data[0]); // Access the first item from data array
      console.log("Profile loaded:", response.data[0]); // Debug log
    } catch (error) {
      console.error("Profile fetch error:", error); // Debug log
      toast.error("Failed to load Creator profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (data) => {
    try {
      const response = await fetch("/api/creator/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      toast.success("Profile updated successfully");
      setActiveModal(null);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleImageUpload = async (type, file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);

      const response = await fetch("/api/creator/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setProfile((prev) => ({
        ...prev,
        [type === "profile" ? "profilePicture" : "coverImage"]: data.url,
      }));

      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
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

      {/* Navigation */}
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-4 px-2 border-b-2 transition-colors ${
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeSection === "about" && <AboutSection profile={profile} />}
        {activeSection === "portfolio" && (
          <PortfolioSection profile={profile} />
        )}
        {activeSection === "stats" && <StatsSection profile={profile} />}
        {activeSection === "reviews" && <ReviewsSection profile={profile} />}
      </div>

      {/* Edit Modals */}
      <EditProfileModal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        section={activeModal}
        profile={profile}
        onSave={handleUpdateProfile}
      />
    </div>
  );
};

export default CreatorProfile;
