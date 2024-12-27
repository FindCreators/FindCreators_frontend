import React, { useState, useEffect } from "react";
import {
  Building2,
  Globe,
  Users,
  Briefcase,
  Star,
  Mail,
  Phone,
  Edit2,
  LinkIcon,
  Award,
  TrendingUp,
  DollarSign,
  UserCheck,
} from "lucide-react";
import { Facebook, Twitter, Instagram, Link as LinkedIn } from "lucide-react";

import toast from "react-hot-toast";
import {
  getBrandProfile,
  updateBrandProfile,
  uploadBrandLogo,
} from "../../../network/networkCalls";
import BrandProfileHeader from "../../../components/dashboard/brand/BrandProfileHeader";
import EditProfileModal from "../../../components/dashboard/brand/EditProfileModal";

const BrandProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getBrandProfile(userId);
      setProfile(response.data[0]);
    } catch (error) {
      toast.error("Failed to load Brand profile");
      console.error("Profile fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdateProfile = async (data) => {
    try {
      const validKeys = [
        "companyName",
        "bio",
        "email",
        "phone",
        "logo",
        "website",
        "description",
        "location",
        "industry",
        "companySize",
        "socialHandles",
        "hiringBudget",
      ];

      // Log the keys in the data object
      console.log("Data keys:", Object.keys(data));

      // Filter the data to only include valid keys
      const filteredData = Object.keys(data).reduce((acc, key) => {
        if (validKeys.includes(key)) {
          acc[key] = data[key];
        }
        return acc;
      }, {});

      console.log("Filtered data:", filteredData);

      const updatedProfile = await updateBrandProfile(filteredData);
      setProfile(updatedProfile);
      toast.success("Profile updated successfully");
      setActiveModal(null);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    }
  };
  const handleImageUpload = async (type, file) => {
    try {
      const formData = new FormData();
      formData.append("image", file); // Ensure the key matches the Postman configuration

      // Log FormData contents for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      let response;
      if (type === "logo") {
        console.log("Uploading logo with formData:", formData);
        response = await uploadBrandLogo(formData);
      }
      // else if (type === "cover") {
      //     response = await uploadCoverImage(formData);
      // }
      console.log("Response:", response);

      if (response?.data) {
        // Update the profile with the new image URL
        const updatedData = { [type]: response.data.url }; // Assuming the API returns the uploaded URL
        // await handleUpdateProfile(updatedData); // Update the profile data with the new image URL
        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`
        );
      }
    } catch (error) {
      toast.error(`Failed to update ${type}`);
      console.error("Image upload error:", error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <BrandProfileHeader
        profile={profile}
        onEdit={() => {
          setModalData(profile);
          setActiveModal("basic");
        }}
        onUploadCover={(file) => handleImageUpload("cover", file)}
        onUploadLogo={(file) => handleImageUpload("logo", file)}
      />

      <div className="max-w-7xl mx-auto px-4 -mt-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="md:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14">
              {[
                {
                  icon: Briefcase,
                  label: "Active Jobs",
                  value: profile?.activeJobs?.length || 0,
                  trend: "+12%",
                  bgColor: "bg-blue-50",
                  textColor: "text-blue-600",
                },
                {
                  icon: UserCheck,
                  label: "Hired Creators",
                  value: profile?.hiredCreators?.length || 0,
                  trend: "+5%",
                  bgColor: "bg-green-50",
                  textColor: "text-green-600",
                },
                {
                  icon: DollarSign,
                  label: "Total Spent",
                  value: `$${profile?.totalSpent || 0}`,
                  trend: "+18%",
                  bgColor: "bg-purple-50",
                  textColor: "text-purple-600",
                },
                {
                  icon: Award,
                  label: "Success Rate",
                  value: `${profile?.successRate || 0}%`,
                  trend: "+3%",
                  bgColor: "bg-orange-50",
                  textColor: "text-orange-600",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div
                    className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                  <div className="text-2xl font-semibold mb-1">
                    {stat.value}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{stat.label}</span>
                    <span className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">About</h2>
                <button
                  onClick={() => {
                    setModalData(profile);
                    setActiveModal("about");
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {profile?.description || (
                  <span className="text-gray-400 italic">
                    No description provided yet. Click edit to add a company
                    description.
                  </span>
                )}
              </p>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
              <div className="space-y-6">
                {(profile?.recentActivity || []).map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg ${
                        activity.type === "job" ? "bg-blue-50" : "bg-green-50"
                      } flex items-center justify-center`}
                    >
                      <activity.icon
                        className={`w-5 h-5 ${
                          activity.type === "job"
                            ? "text-blue-600"
                            : "text-green-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {activity.description}
                      </p>
                      <span className="text-xs text-gray-500">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6 mt-14">
            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Contact Information</h2>
                <button
                  onClick={() => {
                    setModalData(profile);
                    setActiveModal("contact");
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { icon: Globe, label: "Website", value: profile?.website },
                  { icon: Mail, label: "Email", value: profile?.email },
                  { icon: Phone, label: "Phone", value: profile?.phone },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">
                        {item.label}
                      </label>
                      <p className="text-gray-900">
                        {item.value || "Not provided"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Social Media</h2>
                <button
                  onClick={() => {
                    setModalData(profile);
                    setActiveModal("social");
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Add Links
                </button>
              </div>
              <div className="space-y-4">
                {[
                  {
                    icon: Facebook,
                    name: "Facebook",
                    url: profile?.socialHandles?.facebook,
                  },
                  {
                    icon: Twitter,
                    name: "Twitter",
                    url: profile?.socialHandles?.twitter,
                  },
                  {
                    icon: Instagram,
                    name: "Instagram",
                    url: profile?.socialHandles?.instagram,
                  },
                  {
                    icon: LinkedIn,
                    name: "LinkedIn",
                    url: profile?.socialHandles?.linkedin,
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      social.url
                        ? "text-gray-700 hover:bg-gray-50"
                        : "text-gray-400 cursor-not-allowed"
                    } transition-colors`}
                  >
                    <social.icon className="w-5 h-5" />
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modals */}
      <EditProfileModal
        isOpen={!!activeModal}
        onClose={() => {
          setActiveModal(null);
          setModalData(null);
        }}
        section={activeModal}
        initialData={modalData}
        onSave={handleUpdateProfile}
      />
    </div>
  );
};

export default BrandProfile;
