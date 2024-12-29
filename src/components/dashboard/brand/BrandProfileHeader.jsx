import React, { useRef, useState } from "react";
import { Camera } from "lucide-react";
import toast from "react-hot-toast";
import EditProfileModal from "./EditProfileModal";

const BrandProfileHeader = ({
  profile,
  onEdit,
  onUploadCover,
  onUploadLogo,
}) => {
  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSection, setModalSection] = useState("basic");
  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
      handleImageUpload("logo", file);
    }
  };

  const handleCoverChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async (type, file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      let response;
      if (type === "logo") {
        console.log("Uploading logo with formData:", formData);
        response = await onUploadLogo(formData);
      }

      console.log("Response:", response);

      if (response?.data) {
        const updatedData = { [type]: response.data.url };
        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`
        );
      }
    } catch (error) {
      toast.error(`Failed to update ${type}`);
      console.error("Image upload error:", error);
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
    console.log("Updated Data:", updatedData);
    closeModal();
  };

  return (
    <div className="relative min-h-[320px]">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
        {coverPreview ? (
          <img
            src={coverPreview}
            alt="Cover Preview"
            className="w-full h-full object-cover opacity-40"
          />
        ) : (
          profile?.coverImage && (
            <img
              src={profile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover opacity-40"
            />
          )
        )}
        <button
          onClick={() => coverInputRef.current.click()}
          className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/40 rounded-lg text-white transition-colors"
        >
          <Camera className="w-5 h-5" />
        </button>
        <input
          type="file"
          accept="image/*"
          ref={coverInputRef}
          className="hidden"
          onChange={(event) => handleCoverChange(event)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 pt-20">
        <div className="flex flex-col md:flex-row items-end gap-6 pb-6">
          <div className="relative -mb-16 z-10">
            <div className="w-40 h-40 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={profile?.logo || "/api/placeholder/160/160"}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              )}
              <button
                onClick={() => logoInputRef.current.click()}
                className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center group"
              >
                <Camera className="w-8 h-8 text-white transform scale-90 group-hover:scale-100 transition-transform" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={logoInputRef}
                className="hidden"
                onChange={(event) => handleLogoChange(event)}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-white">
                {profile?.companyName || "Company Name"}
              </h1>
            </div>
          </div>
          <div className="flex gap-3 md:mb-4">
            <button
              onClick={() => openModal("basic")}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Edit Profile
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors font-medium">
              Preview
            </button>
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
