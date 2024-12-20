import React, { useState, useEffect } from "react";

const JobDetailsStep = ({ formData, handleInputChange }) => {
  // Local state for form fields to prevent focus issues
  const [localFormData, setLocalFormData] = useState({
    title: formData.title,
    description: formData.description,
    category: formData.category,
    skills: formData.skills,
    location: {
      country: formData.location.country,
      city: formData.location.city,
    },
  });

  // Update local state when prop changes
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
    });
  }, [formData]);

  // Handle immediate local updates
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
  };

  // Update parent state on blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    handleInputChange(e);
  };

  // Handle skills separately
  const [skillInput, setSkillInput] = useState(formData.skills.join(", "));

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

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-semibold mb-8">
        Tell us about your project
      </h2>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            id="title"
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
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={localFormData.description}
            onChange={handleLocalChange}
            onBlur={handleBlur}
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your project requirements, goals, and expectations..."
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Category
          </label>
          <select
            id="category"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills Required
          </label>
          <input
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="location.country"
              placeholder="Country"
              value={localFormData.location.country}
              onChange={handleLocalChange}
              onBlur={handleBlur}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              name="location.city"
              placeholder="City"
              value={localFormData.location.city}
              onChange={handleLocalChange}
              onBlur={handleBlur}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsStep;
