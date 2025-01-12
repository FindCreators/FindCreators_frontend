import React, { useState, useEffect, useRef } from "react";
import {
  Globe,
  Briefcase,
  Mail,
  Phone,
  Edit2,
  Building2,
  Building,
  Users2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Calendar,
  ChevronRight,
  Settings,
  LogOut,
  Camera,
  Upload,
  Loader2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import KYCVerification from "../../../components/dashboard/brand/KYCVerification";
import EditProfileModal from "../../../components/dashboard/brand/EditProfileModal";
import {
  getBrandProfile,
  updateBrandProfile,
} from "../../../network/networkCalls";

const BrandProfile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const userId = localStorage.getItem("userId");
  const logoInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getBrandProfile(userId);
      if (response.data && response.data.length > 0) {
        setProfile(response.data[0]);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast.error("Failed to load profile data");
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

      const filteredData = Object.keys(data).reduce((acc, key) => {
        if (validKeys.includes(key)) {
          acc[key] = data[key];
        }
        return acc;
      }, {});

      const transformedData = Object.keys(filteredData).map((key) => ({
        key,
        value: filteredData[key],
      }));

      await updateBrandProfile(transformedData);
      toast.success("Profile updated successfully");
      setActiveModal(null);
      await fetchProfile();
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Image size must be less than 2MB");
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      setSelectedLogoFile(file);
    }
  };

  const handleImageUpload = async () => {
    try {
      if (!selectedLogoFile) {
        toast.error("Please select an image first");
        return;
      }

      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", selectedLogoFile);

      const response = await fetch(
        "https://findcreators-537037621947.asia-south2.run.app/api/update-profile-image",
        {
          method: "PATCH",
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      const imageUrl = result.data?.logo || result.logo;
      await updateBrandProfile([{ key: "logo", value: imageUrl }]);

      setLogoPreview(null);
      setSelectedLogoFile(null);
      await fetchProfile();

      toast.success("Logo updated successfully");
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error(error.message || "Failed to update logo. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const cancelLogoPreview = () => {
    setLogoPreview(null);
    setSelectedLogoFile(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleEditSection = (section, data = null) => {
    setModalData(data || profile);
    setActiveModal(section);
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

  const calculateProfileCompletion = () => {
    const requiredFields = [
      "companyName",
      "industry",
      "companySize",
      "description",
      "email",
      "phone",
      "website",
      "location",
    ];

    const completedFields = requiredFields.filter((field) =>
      Boolean(profile?.[field])
    );
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  const completionPercentage = calculateProfileCompletion();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">Profile Settings</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-3">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white relative mb-4">
                    {logoPreview ? (
                      <>
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                          <button
                            onClick={handleImageUpload}
                            disabled={isUploading}
                            className="p-2 bg-green-600 hover:bg-green-700 rounded-full text-white transition-colors"
                          >
                            {isUploading ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Upload className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={cancelLogoPreview}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          src={`${
                            profile?.logo || "/api/placeholder/96/96"
                          }?t=${new Date().getTime()}`}
                          alt="Company Logo"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/api/placeholder/96/96";
                            e.target.onerror = null;
                          }}
                        />
                        <button
                          onClick={() => logoInputRef.current.click()}
                          className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <Camera className="w-8 h-8 text-white" />
                        </button>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={logoInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <h2 className="text-lg font-semibold text-gray-900">
                    {profile?.companyName || "Company Name"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {profile?.industry || "Industry"}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm">
                      {profile?.companySize} employees
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">
                      {profile?.location
                        ? `${profile.location.city}, ${profile.location.country}`
                        : "Location"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">
                      Profile Completion
                    </span>
                    <span className="text-sm text-gray-600">
                      {completionPercentage}%
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm divide-y">
                <button
                  onClick={() => handleEditSection("basic", profile)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-900">
                    Edit Profile
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  // onClick={() => navigate("/brand/settings")}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-900">
                    Company Settings
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  // onClick={() => navigate("/brand/notifications")}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-900">
                    Notifications
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-9 space-y-6">
            <KYCVerification />

            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    About Company
                  </h2>
                  <button
                    onClick={() => handleEditSection("about", profile)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed">
                  {profile?.description || (
                    <span className="text-gray-400 italic">
                      No description provided yet. Click edit to add a company
                      description.
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Contact Information
                    </h2>
                    <button
                      onClick={() =>
                        handleEditSection("contact", {
                          email: profile?.email || "",
                          phone: profile?.phone || "",
                          website: profile?.website || "",
                        })
                      }
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-gray-900">
                      {profile?.email || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="text-gray-900">
                      {profile?.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Website
                    </h3>
                    <p className="text-gray-900">
                      {profile?.website ? (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {profile.website}
                        </a>
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Social Media
                    </h2>
                    <button
                      onClick={() => {
                        const socialHandlesObject =
                          profile?.socialHandles?.reduce((acc, handle) => {
                            acc[handle.platform.toLowerCase()] = handle.url;
                            return acc;
                          }, {});

                        handleEditSection("social", {
                          ...profile,
                          socialHandles: socialHandlesObject || {
                            facebook: "",
                            twitter: "",
                            instagram: "",
                            linkedin: "",
                          },
                        });
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    {
                      icon: Linkedin,
                      platform: "LinkedIn",
                      url: profile?.socialHandles?.find(
                        (h) => h.platform.toLowerCase() === "linkedin"
                      )?.url,
                    },
                    {
                      icon: Twitter,
                      platform: "Twitter",
                      url: profile?.socialHandles?.find(
                        (h) => h.platform.toLowerCase() === "twitter"
                      )?.url,
                    },
                    {
                      icon: Facebook,
                      platform: "Facebook",
                      url: profile?.socialHandles?.find(
                        (h) => h.platform.toLowerCase() === "facebook"
                      )?.url,
                    },
                    {
                      icon: Instagram,
                      platform: "Instagram",
                      url: profile?.socialHandles?.find(
                        (h) => h.platform.toLowerCase() === "instagram"
                      )?.url,
                    },
                  ].map((social, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                        <social.icon className="w-4 h-4 text-gray-600" />
                      </div>
                      {social.url ? (
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {social.url.replace(/https?:\/\/(www\.)?/, "")}
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Not connected
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {(profile?.recentActivity || []).length > 0 ? (
                    profile.recentActivity.map((activity, index) => (
                      <div key={index} className="flex gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg ${
                            activity.type === "job"
                              ? "bg-blue-50"
                              : "bg-green-50"
                          } flex items-center justify-center flex-shrink-0`}
                        >
                          <activity.icon
                            className={`w-5 h-5 ${
                              activity.type === "job"
                                ? "text-blue-600"
                                : "text-green-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {activity.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.description}
                          </p>
                          <span className="text-xs text-gray-500 block mt-1">
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500">No recent activity</p>
                      <button
                        onClick={() => navigate("/brand/post-job")}
                        className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Post More jobs
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
