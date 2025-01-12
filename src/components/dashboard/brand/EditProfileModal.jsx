import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const EditProfileModal = ({
  isOpen,
  onClose,
  section,
  initialData,
  onSave,
}) => {
  const [formData, setFormData] = useState(initialData || {});

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData);
    }
  }, [isOpen, initialData]);
  console.log("initialData", initialData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFields = {};

    switch (section) {
      case "basic":
        const basicFields = ["companyName", "industry", "companySize"];
        basicFields.forEach((field) => {
          if (formData[field] && formData[field] !== initialData[field]) {
            updatedFields[field] = formData[field];
          }
        });
        if (
          formData.location &&
          (formData.location.city !== initialData?.location?.city ||
            formData.location.country !== initialData?.location?.country)
        ) {
          updatedFields.location = JSON.stringify({
            city: formData.location.city || "",
            country: formData.location.country || "",
          });
        }
        break;

      case "about":
        ["bio", "description"].forEach((field) => {
          if (formData[field] && formData[field] !== initialData[field]) {
            updatedFields[field] = formData[field];
          }
        });
        break;

      case "contact":
        ["website", "email", "phone"].forEach((field) => {
          if (formData[field] && formData[field] !== initialData[field]) {
            updatedFields[field] = formData[field];
          }
        });
        break;

      // Inside EditProfileModal component, update the social media section:

      case "social":
        const formatSocialHandlesForAPI = (handles) => {
          const formatted = [];
          if (handles?.linkedin) {
            formatted.push({
              platform: "LinkedIn",
              url: handles.linkedin,
              followers: 0,
              profileId: handles.linkedin.split("/").pop() || "",
            });
          }
          if (handles?.twitter) {
            formatted.push({
              platform: "Twitter",
              url: handles.twitter,
              followers: 0,
              profileId: handles.twitter.split("/").pop() || "",
            });
          }
          if (handles?.instagram) {
            formatted.push({
              platform: "Instagram",
              url: handles.instagram,
              followers: 0,
              profileId: handles.instagram.split("/").pop() || "",
            });
          }
          if (handles?.facebook) {
            formatted.push({
              platform: "Facebook",
              url: handles.facebook,
              followers: 0,
              profileId: handles.facebook.split("/").pop() || "",
            });
          }
          return JSON.stringify(formatted);
        };

        if (formData.socialHandles) {
          updatedFields.socialHandles = formatSocialHandlesForAPI(
            formData.socialHandles
          );
        }
        break;
    }

    if (Object.keys(updatedFields).length > 0) {
      if (Object.keys(updatedFields).length > 0) {
        onSave(updatedFields);
      } else {
        onSave(formData);
      }
    } else {
      onClose();
    }
  };

  console.log("formData", formData);

  const renderFields = () => {
    switch (section) {
      case "basic":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={formData.companyName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <select
                value={formData.industry || ""}
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Industry</option>
                {[
                  "Technology",
                  "Healthcare",
                  "Finance",
                  "Retail",
                  "Manufacturing",
                  "Education",
                  "Entertainment",
                ].map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Size
              </label>
              <select
                value={formData.companySize || ""}
                onChange={(e) =>
                  setFormData({ ...formData, companySize: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Company Size</option>
                {[
                  "1-10",
                  "11-50",
                  "51-200",
                  "201-500",
                  "501-1000",
                  "1000+",
                ].map((size) => (
                  <option key={size} value={size}>
                    {size} employees
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.location?.city || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
                        city: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.location?.country || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
                        country: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter country"
                />
              </div>
            </div>
          </>
        );

      case "about":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={formData.bio || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Brief bio about your company..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={6}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed description about your company..."
              />
            </div>
          </>
        );

      case "contact":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                value={formData.website || ""}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );

      case "social":
        return (
          <div className="space-y-4">
            {[
              { key: "facebook", label: "Facebook" },
              { key: "twitter", label: "Twitter" },
              { key: "instagram", label: "Instagram" },
              { key: "linkedin", label: "LinkedIn" },
            ].map((platform) => (
              <div key={platform.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {platform.label} URL
                </label>
                <input
                  type="url"
                  value={formData.socialHandles?.[platform.key] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialHandles: {
                        ...formData.socialHandles,
                        [platform.key]: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={`https://${platform.key}.com/...`}
                />
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="min-h-screen px-4 text-center">
        <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="relative p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Edit {section.charAt(0).toUpperCase() + section.slice(1)}{" "}
              Information
            </h3>

            <form onSubmit={handleSubmit}>
              {renderFields()}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
