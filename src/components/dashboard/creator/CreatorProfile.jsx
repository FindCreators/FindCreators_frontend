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
import {
  getCreatorProfile,
  updateCreatorProfile,
} from "../../../network/networkCalls";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../network/apiClient";

const CreatorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [activeSection, setActiveSection] = useState("about");
  const navigate = useNavigate();

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

  const handleUpdateProfile = async (data) => {
    try {
      const validKeys = [
        "fullName",
        "bio",
        "email",
        "phone",
        "profilePicture",
        "portfolioUrl",
        "location",
        "skills",
        "niche",
        "languages",
        "minimumRate",
        "preferredRate",
        "currency",
        "collabPreferences",
        "socialHandles",
      ];

      // Log the keys in the data object
      console.log("Data keys:", Object.keys(data));

      // Filter the data to only include valid keys and changed values
      const filteredData = Object.keys(data).reduce((acc, key) => {
        if (validKeys.includes(key) && data[key] !== profile[key]) {
          acc[key] = data[key];
        }
        return acc;
      }, {});

      console.log("Filtered data:", filteredData);

      // Transform the filteredData object into an array of key-value objects
      const transformedData = Object.keys(filteredData).map((key) => ({
        key: key.toString(),
        value: filteredData[key]?.toString() || "",
      }));

      console.log("Transformed data:", transformedData);

      const updatedProfile = await updateCreatorProfile(transformedData);
      setProfile(updatedProfile);
      toast.success("Profile updated successfully");
      setActiveModal(null);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    }
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeSection === "about" && (
          <AboutSection
            profile={profile}
            onEdit={() => setActiveModal("about")}
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

      {/* Edit Modals */}
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
