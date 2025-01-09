import React, { useRef, useState } from "react";
import {
  Camera,
  MapPin,
  Edit2,
  BadgeCheck,
  Instagram,
  Youtube,
  Twitter,
  Globe,
  Upload,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const InstagramVerificationModal = ({
  isOpen,
  onClose,
  onVerify,
  existingInstagramHandle,
}) => {
  const [instagramId, setInstagramId] = useState(existingInstagramHandle || "");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Verify Your Instagram
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Enter your Instagram username to verify your account and boost your
          credibility.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (instagramId.trim()) {
              onVerify(instagramId.trim());
            } else {
              toast.error("Please enter a valid Instagram username");
            }
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Username
            </label>
            <div className="flex items-center">
              <span className="mr-2 text-gray-500">@</span>
              <input
                type="text"
                value={instagramId}
                onChange={(e) => setInstagramId(e.target.value)}
                placeholder="yourinstagram"
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreatorProfileHeader = ({
  profile,
  onEdit,
  onUploadCover,
  onUploadPhoto,
  onInstagramVerify,
}) => {
  const photoInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [selectedCoverFile, setSelectedCoverFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isInstagramVerificationOpen, setIsInstagramVerificationOpen] =
    useState(false);

  const handleImageUpload = async (type) => {
    try {
      setIsUploading(true);
      const file = type === "profile" ? selectedPhotoFile : selectedCoverFile;

      if (!file) {
        toast.error("Please select an image first");
        return;
      }

      // Validate file size (2MB as per backend)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
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

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      if (type === "profile") {
        setPhotoPreview(null);
        setSelectedPhotoFile(null);
        onUploadPhoto &&
          onUploadPhoto(
            type,
            result.data?.profilePicture || result.profilePicture
          );
      } else {
        setCoverPreview(null);
        setSelectedCoverFile(null);
        onUploadCover &&
          onUploadCover(type, result.data?.coverImage || result.coverImage);
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
      setIsUploading(false);
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

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      if (type === "profile") {
        setPhotoPreview(previewUrl);
        setSelectedPhotoFile(file);
      } else {
        setCoverPreview(previewUrl);
        setSelectedCoverFile(file);
      }
    }
  };

  const cancelPreview = (type) => {
    if (type === "profile") {
      setPhotoPreview(null);
      setSelectedPhotoFile(null);
    } else {
      setCoverPreview(null);
      setSelectedCoverFile(null);
    }
  };

  // Find existing Instagram handle
  const existingInstagramHandle = profile?.socialHandles?.find(
    (handle) => handle.platform === "Instagram"
  )?.profileId;

  return (
    <div className="relative min-h-[400px]">
      {/* Cover Section */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600">
        {coverPreview ? (
          <div className="relative h-full">
            <img
              src={coverPreview}
              alt="Cover Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => handleImageUpload("cover")}
                disabled={isUploading}
                className="p-2 bg-green-500 hover:bg-green-600 rounded-lg text-white transition-colors disabled:opacity-50"
              >
                <Upload className="w-5 h-5" />
              </button>
              <button
                onClick={() => cancelPreview("cover")}
                className="p-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {profile?.coverImage && (
              <img
                src={`${profile.coverImage}?t=${new Date().getTime()}`}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/30" />
            <button
              onClick={() => coverInputRef.current.click()}
              className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/40 rounded-lg text-white transition-colors"
            >
              <Camera className="w-5 h-5" />
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
      </div>

      {/* Profile Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-48 pb-6 flex flex-col md:flex-row md:items-end md:gap-6 gap-4">
          {/* Profile Picture */}
          <div className="relative -mb-26 z-10 mx-auto md:mx-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-2xl border-4 border-white shadow-xl overflow-hidden relative">
              {photoPreview ? (
                <>
                  <img
                    src={photoPreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleImageUpload("profile")}
                      disabled={isUploading}
                      className="p-2 bg-green-500 hover:bg-green-600 rounded-lg text-white transition-colors disabled:opacity-50"
                    >
                      <Upload className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => cancelPreview("profile")}
                      className="p-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={`${profile?.profilePicture}?t=${new Date().getTime()}`}
                    alt={profile?.fullName}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => photoInputRef.current.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-all flex items-center justify-center group"
                  >
                    <Camera className="w-8 h-8 text-white transform scale-90 group-hover:scale-100 transition-transform" />
                  </button>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              ref={photoInputRef}
              className="hidden"
              onChange={(e) => handleFileSelect(e, "profile")}
            />
          </div>

          {/* Profile Details */}
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
                  className={`p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors relative ${platform.color}`}
                >
                  <platform.icon className="w-5 h-5" />
                  {platform.name === "Instagram" &&
                    !existingInstagramHandle && (
                      <button
                        onClick={() => setIsInstagramVerificationOpen(true)}
                        className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                      >
                        +
                      </button>
                    )}
                </a>
              ))}
            </div>

            {/* Instagram Verification Call to Action */}
            {!existingInstagramHandle && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsInstagramVerificationOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors"
                >
                  Verify Your Instagram
                </button>
              </div>
            )}

            {/* Instagram Verification Status */}
            {existingInstagramHandle && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
                <p className="text-yellow-700">
                  🕰 Your profile verification is under review.
                </p>
              </div>
            )}
          </div>

          {/* Stats */}
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

      <InstagramVerificationModal
        isOpen={isInstagramVerificationOpen}
        onClose={() => setIsInstagramVerificationOpen(false)}
        onVerify={(instagramId) => {
          onInstagramVerify(instagramId);
          setIsInstagramVerificationOpen(false);
        }}
        existingInstagramHandle={existingInstagramHandle}
      />
    </div>
  );
};

export default CreatorProfileHeader;
