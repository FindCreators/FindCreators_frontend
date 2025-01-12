import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Calendar,
  Tag,
  Upload,
  X,
  FileText,
  Paperclip,
} from "lucide-react";

const JobDetailsStep = ({ formData, handleInputChange }) => {
  const descriptionRef = useRef(null);
  const countryRef = useRef(null);
  const cityRef = useRef(null);

  const [localFormData, setLocalFormData] = useState({
    title: formData.title,
    description: formData.description,
    category: formData.category,
    skills: formData.skills,
    location: {
      country: formData.location.country,
      city: formData.location.city,
    },
    attachments: formData.attachments,
    attachmentLink: formData.attachmentLink,
  });

  const [skillInput, setSkillInput] = useState(formData.skills.join(", "));
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setLocalFormData({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      skills: formData.skills,
      location: {
        country: formData.location.country,
        city: formData.location.city,
      },
      attachments: formData.attachments,
      attachmentLink: formData.attachmentLink,
    });
    setSkillInput(formData.skills.join(", "));
  }, [formData]);

  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setLocalFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setLocalFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Add immediate parent state update
    handleInputChange(e); // This will update parent state immediately
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      handleInputChange({
        target: {
          name: parent,
          value: {
            ...formData[parent],
            [child]: localFormData[parent][child],
          },
        },
      });
    } else {
      handleInputChange(e);
    }
  };

  const handleSkillsChange = (e) => {
    setSkillInput(e.target.value);
  };

  const handleSkillsBlur = () => {
    const skillsArray = skillInput
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

    handleInputChange({
      target: {
        name: "skills",
        value: skillsArray,
      },
    });
  };

  const handleSkillsKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSkillsBlur();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const updatedFiles = [...formData.attachments, ...files];
    setLocalFormData((prevData) => ({
      ...prevData,
      attachments: updatedFiles,
    }));
    handleInputChange({
      target: {
        name: "attachments",
        value: updatedFiles,
      },
    });
  };

  const removeFile = (index) => {
    const updatedFiles = formData.attachments.filter((_, i) => i !== index);
    setLocalFormData((prevData) => ({
      ...prevData,
      attachments: updatedFiles,
    }));
    handleInputChange({
      target: {
        name: "attachments",
        value: updatedFiles,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">
          Create Your Project
        </h2>
        <p className="text-gray-500">
          Fill in the details to post your project and find the perfect match.
        </p>
      </div>

      <div className="mt-10 space-y-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <label className="text-lg font-semibold text-gray-900">
              Basic Information
            </label>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="title-input"
                className="block text-sm font-medium text-gray-700"
              >
                Project Title
              </label>
              <input
                id="title-input"
                name="title"
                type="text"
                value={localFormData.title}
                onChange={handleLocalChange}
                onBlur={handleBlur}
                placeholder="E.g. Content Creator for Product Launch Campaign"
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="category-input"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category-input"
                name="category"
                value={localFormData.category}
                onChange={handleLocalChange}
                onBlur={handleBlur}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Select a category</option>
                <option value="Tech">Tech</option>
                <option value="Fashion">Fashion</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Beauty">Beauty</option>
                <option value="Food">Food</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="description-input"
                className="block text-sm font-medium text-gray-700"
              >
                Project Description
              </label>
              <textarea
                ref={descriptionRef}
                id="description-input"
                name="description"
                value={localFormData.description}
                onChange={handleLocalChange}
                rows={6}
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Describe your project requirements, goals, and expectations..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Tag className="w-5 h-5 text-blue-600" />
            <label className="text-lg font-semibold text-gray-900">
              Required Skills
            </label>
          </div>

          <div>
            <input
              id="skills-input"
              type="text"
              name="skills"
              placeholder="Enter skills separated by commas (e.g. Photoshop, Video Editing, Social Media)"
              value={skillInput}
              onChange={handleSkillsChange}
              onBlur={handleSkillsBlur}
              onKeyDown={handleSkillsKeyDown}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
            {formData.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium transition-colors hover:bg-blue-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <label className="text-lg font-semibold text-gray-900">
              Location
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                ref={countryRef}
                id="country-input"
                type="text"
                name="location.country"
                placeholder="Country"
                value={localFormData.location.country}
                onChange={handleLocalChange}
                onBlur={handleBlur}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <input
                ref={cityRef}
                id="city-input"
                type="text"
                name="location.city"
                placeholder="City"
                value={localFormData.location.city}
                onChange={handleLocalChange}
                onBlur={handleBlur}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Paperclip className="w-5 h-5 text-blue-600" />
            <label className="text-lg font-semibold text-gray-900">
              Attachments
            </label>
          </div>

          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const files = Array.from(e.dataTransfer.files);
                setLocalFormData((prevData) => ({
                  ...prevData,
                  attachments: [...prevData.attachments, ...files],
                }));
              }}
            >
              <div className="flex flex-col items-center space-y-2">
                <Upload className="w-8 h-8 text-blue-500" />
                <p className="text-sm text-gray-600">
                  Drag and drop files here, or{" "}
                  <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                    browse
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-500">Maximum file size: 10MB</p>
              </div>
            </div>

            {localFormData.attachments.length > 0 && (
              <div className="space-y-2">
                {localFormData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label
                htmlFor="attachment-link-input"
                className="block text-sm font-medium text-gray-700"
              >
                Or add a link to your files
              </label>
              <input
                id="attachment-link-input"
                type="text"
                name="attachmentLink"
                value={localFormData.attachmentLink}
                onChange={handleLocalChange}
                onBlur={handleBlur}
                placeholder="e.g. Google Drive, Dropbox, or other sharing link"
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsStep;
