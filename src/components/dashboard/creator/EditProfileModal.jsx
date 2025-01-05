import React, { useState } from "react";
import { X } from "lucide-react";

const EditProfileModal = ({ isOpen, onClose, section, profile, onSave }) => {
  const [formData, setFormData] = useState(profile || {});

  if (!isOpen) return null;

  const renderFields = () => {
    switch (section) {
      case "basic":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={formData.bio || ""}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
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
                />
              </div>
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
                      location: { ...formData.location, city: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </>
        );
      case "about":
        return (
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
              placeholder="Detailed description about yourself..."
            />
          </div>
        );
      case "portfolio":
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Portfolio URL
            </label>
            <input
              type="url"
              value={formData.portfolioUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, portfolioUrl: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      case "stats":
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Followers
            </label>
            <input
              type="number"
              value={formData.followers || ""}
              onChange={(e) =>
                setFormData({ ...formData, followers: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">
              Review Count
            </label>
            <input
              type="number"
              value={formData.reviewCount || ""}
              onChange={(e) =>
                setFormData({ ...formData, reviewCount: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">
              Engagement Rate
            </label>
            <input
              type="number"
              value={formData.engagementRate || ""}
              onChange={(e) =>
                setFormData({ ...formData, engagementRate: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      case "reviews":
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reviews
            </label>
            <textarea
              value={formData.reviews || ""}
              onChange={(e) =>
                setFormData({ ...formData, reviews: e.target.value })
              }
              rows={6}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Add your reviews here..."
            />
          </div>
        );
      case "contact":
        return (
          <>
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Portfolio URL
              </label>
              <input
                type="url"
                value={formData.portfolioUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, portfolioUrl: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );
      case "social":
        return (
          <div className="space-y-4">
            {(formData.socialHandles || []).map((handle, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <select
                    value={handle.platform || ""}
                    onChange={(e) => {
                      const newHandles = [...(formData.socialHandles || [])];
                      newHandles[index] = {
                        ...handle,
                        platform: e.target.value,
                        profileId: handle.url
                          ? handle.url.split("/").pop()
                          : "",
                      };
                      setFormData({ ...formData, socialHandles: newHandles });
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Platform</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Youtube">YouTube</option>
                    <option value="Twitter">Twitter</option>
                    <option value="LinkedIn">LinkedIn</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile URL
                  </label>
                  <input
                    type="url"
                    value={handle.url || ""}
                    onChange={(e) => {
                      const newHandles = [...(formData.socialHandles || [])];
                      const url = e.target.value;
                      newHandles[index] = {
                        ...handle,
                        url,
                        profileId: url.split("/").pop() || "",
                      };
                      setFormData({ ...formData, socialHandles: newHandles });
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Followers
                  </label>
                  <input
                    type="number"
                    value={handle.followers || ""}
                    onChange={(e) => {
                      const newHandles = [...(formData.socialHandles || [])];
                      newHandles[index] = {
                        ...handle,
                        followers: parseInt(e.target.value) || 0,
                      };
                      setFormData({ ...formData, socialHandles: newHandles });
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newHandles = formData.socialHandles.filter(
                      (_, i) => i !== index
                    );
                    setFormData({ ...formData, socialHandles: newHandles });
                  }}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove Platform
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  socialHandles: [
                    ...(formData.socialHandles || []),
                    { platform: "", url: "", followers: 0, profileId: "" },
                  ],
                });
              }}
              className="w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Add Social Platform
            </button>
          </div>
        );
      case "rates":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Rate
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={formData.minimumRate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, minimumRate: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={formData.currency || "USD"}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Rate
              </label>
              <input
                type="number"
                value={formData.preferredRate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, preferredRate: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );
      case "expertise":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <textarea
                value={(formData.skills || []).join(", ")}
                onChange={(e) => {
                  const skills = e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  setFormData({ ...formData, skills });
                }}
                placeholder="Enter skills separated by commas"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niche
              </label>
              <textarea
                value={(formData.niche || []).join(", ")}
                onChange={(e) => {
                  const niche = e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  setFormData({ ...formData, niche });
                }}
                placeholder="Enter niches separated by commas"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Languages
              </label>
              <textarea
                value={(formData.languages || []).join(", ")}
                onChange={(e) => {
                  const languages = e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  setFormData({ ...formData, languages });
                }}
                placeholder="Enter languages separated by commas"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

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

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSave(formData, section);
              }}
            >
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
