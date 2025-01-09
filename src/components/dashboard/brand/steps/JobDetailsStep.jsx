import React, { useState, useEffect, useRef } from "react";
import { MapPin, Calendar, Tag } from "lucide-react";

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
      handleInputChange(e);
    } else {
      setLocalFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (name === "description") {
        handleInputChange(e);
      }
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    if (!name.includes(".") && name !== "description") {
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
    setLocalFormData((prevData) => ({
      ...prevData,
      attachments: [...prevData.attachments, ...files],
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-semibold mb-8">
        Tell us about your project
      </h2>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="title-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            id="title-input"
            name="title"
            type="text"
            value={localFormData.title}
            onChange={handleLocalChange}
            onBlur={handleBlur}
            placeholder="E.g. Content Creator for Product Launch Campaign"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="description-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            ref={descriptionRef}
            id="description-input"
            name="description"
            value={localFormData.description}
            onChange={handleLocalChange}
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your project requirements, goals, and expectations..."
          />
        </div>

        <div>
          <label
            htmlFor="category-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Category
          </label>
          <select
            id="category-input"
            name="category"
            value={localFormData.category}
            onChange={(e) => {
              handleLocalChange(e);
              handleBlur(e);
            }}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            htmlFor="skills-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Skills Required
          </label>
          <input
            id="skills-input"
            type="text"
            name="skills"
            placeholder="Enter skills separated by commas"
            value={skillInput}
            onChange={handleSkillsChange}
            onBlur={handleSkillsBlur}
            onKeyDown={handleSkillsKeyDown}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {formData.skills.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="country-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Location
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              ref={countryRef}
              id="country-input"
              type="text"
              name="location.country"
              placeholder="Country"
              value={localFormData.location.country}
              onChange={handleLocalChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              ref={cityRef}
              id="city-input"
              type="text"
              name="location.city"
              placeholder="City"
              value={localFormData.location.city}
              onChange={handleLocalChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="attachment-file-input"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Attachments
          </label>
          <input
            id="attachment-file-input"
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700">
            Uploaded Attachments
          </h3>
          <ul className="list-disc list-inside">
            {localFormData.attachments.map((file, index) => (
              <li key={index} className="text-sm text-gray-600">
                {file.name}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label
            htmlFor="attachment-link-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Attachment Link
          </label>
          <input
            id="attachment-link-input"
            type="text"
            name="attachmentLink"
            value={localFormData.attachmentLink}
            onChange={handleLocalChange}
            onBlur={handleBlur}
            placeholder="Enter attachment link"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default JobDetailsStep;
