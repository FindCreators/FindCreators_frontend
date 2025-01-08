import React, { useRef, useState } from "react";
import {
  Camera,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  X,
  Upload,
  Loader2, // Import a spinner icon from Lucide
} from "lucide-react";
import toast from "react-hot-toast";
import EditProfileModal from "./EditProfileModal";

const BrandProfileHeader = ({ profile, onEdit, onUploadSuccess }) => {
  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSection, setModalSection] = useState("basic");
  const [isUploading, setIsUploading] = useState(false); // State for loader

  const handleImageUpload = async (type) => {
    try {
      setIsUploading(true); // Start loading
      const file = type === "logo" ? selectedLogoFile : selectedCoverFile;

      if (!file) {
        toast.error("Please select an image first");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

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
      console.log("Upload response:", result);

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      // Get the URL from the response
      const imageUrl = result.data?.logo || result.logo;

      // Call parent handler with the new URL
      if (type === "logo") {
        setLogoPreview(null);
        setSelectedLogoFile(null);
        onUploadSuccess && onUploadSuccess("logo", imageUrl);
        // Force refresh the image by adding a timestamp
        const timeStamp = new Date().getTime();
        profile.logo = `${imageUrl}?t=${timeStamp}`;
      } else {
        setCoverPreview(null);
        setSelectedCoverFile(null);
        onUploadSuccess && onUploadSuccess("cover", imageUrl);
      }

      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`
      );
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast.error(
        error.message || `Failed to update ${type}. Please try again.`
      );
    } finally {
      setIsUploading(false); // Stop loading
    }
  };

  const handleFileSelect = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (2MB as per backend)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Image size must be less than 2MB");
        return;
      }

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      if (type === "logo") {
        setLogoPreview(previewUrl);
        setSelectedLogoFile(file);
      } else {
        setCoverPreview(previewUrl);
        setSelectedCoverFile(file);
      }
    }
  };

  const cancelPreview = (type) => {
    if (type === "logo") {
      setLogoPreview(null);
      setSelectedLogoFile(null);
    } else {
      setCoverPreview(null);
      setSelectedCoverFile(null);
    }
  };

  const openModal = (section) => {
    setModalSection(section);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (updatedData) => {
    closeModal();
  };

  return (
    <div className="relative min-h-[320px] bg-gray-100">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-900 overflow-hidden">
        {/* Cover Image Section */}
        {coverPreview ? (
          <div className="relative">
            <img
              src={coverPreview}
              alt="Cover Preview"
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => handleImageUpload("cover")}
                disabled={isUploading}
                className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors"
              >
                {isUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin" /> // Show spinner while uploading
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={() => cancelPreview("cover")}
                className="p-3 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {profile?.coverImage && (
              <img
                src={profile.coverImage}
                alt="Cover"
                className="w-full h-full object-cover opacity-50"
              />
            )}
            <button
              onClick={() => coverInputRef.current.click()}
              className="absolute top-4 right-4 p-3 bg-black/40 hover:bg-black/50 rounded-full text-white transition-colors"
            >
              <Camera className="w-6 h-6" />
            </button>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          ref={coverInputRef}
          className="hidden"
          onChange={(e) => handleFileSelect(e, "cover")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Profile Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-8 pb-6">
          {/* Logo Section */}
          <div className="relative">
            <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white relative">
              {logoPreview ? (
                <>
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleImageUpload("logo")}
                      disabled={isUploading}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors"
                    >
                      {isUploading ? (
                        <Loader2 className="w-5 h-5 animate-spin" /> // Show spinner while uploading
                      ) : (
                        <Upload className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => cancelPreview("logo")}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={`${profile?.logo}?t=${new Date().getTime()}`} // Add timestamp to force refresh
                    alt="Company Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/api/placeholder/160/160"; // Fallback image
                      e.target.onerror = null; // Prevent infinite loop
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
              onChange={(e) => handleFileSelect(e, "logo")}
            />
          </div>

          {/* Rest of the header content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              {profile?.companyName || "Company Name"}
            </h1>
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              {profile?.socialHandles?.map((handle) => {
                let Icon;
                switch (handle.platform.toLowerCase()) {
                  case "facebook":
                    Icon = Facebook;
                    break;
                  case "twitter":
                    Icon = Twitter;
                    break;
                  case "instagram":
                    Icon = Instagram;
                    break;
                  case "linkedin":
                    Icon = Linkedin;
                    break;
                  default:
                    return null;
                }
                return (
                  <a
                    key={handle.platform}
                    href={handle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-300 transition-colors"
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={closeModal}
        section={modalSection}
        initialData={profile}
        onSave={handleSave}
      />
    </div>
  );
};

export default BrandProfileHeader;
