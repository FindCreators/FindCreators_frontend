import React, { useRef } from "react";
import { MapPin } from "lucide-react";

const JobDetailsStep = ({ formData, handleInputChange }) => {
  const descriptionRef = useRef(null);
  const countryRef = useRef(null);
  const cityRef = useRef(null);

  const handleDescriptionKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;
      const newValue = value.substring(0, start) + "\t" + value.substring(end);

      handleInputChange({
        target: {
          name: "description",
          value: newValue,
        },
      });

      // Set cursor position after the tab
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 1;
      }, 0);
    }
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    handleInputChange({
      target: {
        name: "attachments",
        value: files,
      },
    });
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
            value={formData.title}
            onChange={handleInputChange}
            placeholder="E.g. Content Creator for Product Launch Campaign"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
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
            value={formData.description}
            onChange={handleInputChange}
            onKeyDown={handleDescriptionKeyDown}
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your project requirements, goals, and expectations..."
            required
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
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
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
            value={formData.skills.join(", ")}
            onChange={handleSkillsChange}
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
              ref={countryRef}
              id="country-input"
              type="text"
              name="location.country"
              placeholder="Country"
              value={formData.location.country}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <input
              ref={cityRef}
              id="city-input"
              type="text"
              name="location.city"
              placeholder="City"
              value={formData.location.city}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="attachment-file-input"
            className="block text-sm font-medium text-gray-700 mb-2"
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
          {formData.attachments.length > 0 && (
            <div className="mt-2">
              <h3 className="text-sm font-medium text-gray-700 mb-1">
                Uploaded Files:
              </h3>
              <ul className="list-disc list-inside">
                {formData.attachments.map((file, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
            value={formData.attachmentLink}
            onChange={handleInputChange}
            placeholder="Enter attachment link"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default JobDetailsStep;
