import React from "react";
import { ChevronLeft, MapPin, Calendar, Clock, Tag } from "lucide-react";

const JobPreview = ({ formData, setStep, handleSubmit }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const handlePostJob = () => {
    if (handleSubmit) {
      handleSubmit();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Job Preview</h2>
        <p className="text-gray-600">
          Please review the details before posting the job.
        </p>
      </div>

      <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        {/* Title Section */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Title</h3>
          <p className="text-gray-600">
            {formData.title || "No title provided"}
          </p>
        </div>

        {/* Description Section */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Description</h3>
          <div className="text-gray-600 whitespace-pre-wrap">
            {formData.description || "No description provided"}
          </div>
        </div>

        {/* Category Section */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Category</h3>
          <p className="text-gray-600">
            {formData.category || "No category selected"}
          </p>
        </div>

        {/* Skills Section */}
        {formData.skills && formData.skills.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Location Section */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Location</h3>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {formData.location?.city && formData.location?.country
                ? `${formData.location.city}, ${formData.location.country}`
                : "Location not specified"}
            </span>
          </div>
        </div>

        {/* Budget Section */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Budget</h3>
          <p className="text-gray-600">
            {formData.budget
              ? `${formData.budget} ${formData.currency || "INR"}`
              : "Budget not specified"}
          </p>
        </div>

        {/* Duration Section */}
        {formData.duration && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Duration</h3>
            <p className="text-gray-600">{formData.duration}</p>
          </div>
        )}

        {/* Dates Section */}
        <div className="space-y-4">
          {formData.startDate && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Start Date</h3>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {formatDate(formData.startDate)}
                </span>
              </div>
            </div>
          )}

          {formData.endDate && (
            <div>
              <h3 className="text-xl font-semibold mb-2">End Date</h3>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {formatDate(formData.endDate)}
                </span>
              </div>
            </div>
          )}

          {formData.deadline && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Deadline</h3>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {formatDate(formData.deadline)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Attachments Section */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Attachments</h3>
          {formData.attachments && formData.attachments.length > 0 ? (
            <div className="flex flex-col gap-2">
              {formData.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{attachment.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No attachments available.</p>
          )}
        </div>

        {/* Attachment Link Section */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Attachment Link</h3>
          {formData.attachmentLink ? (
            <a
              href={formData.attachmentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {formData.attachmentLink}
            </a>
          ) : (
            <p className="text-gray-600">No attachment link available.</p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => setStep((prev) => prev - 1)}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="flex gap-4">
          <button
            onClick={handlePostJob}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Post Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPreview;
