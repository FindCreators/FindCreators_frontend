// src/components/dashboard/brand/steps/JobPreview.jsx
import React from "react";
import { ChevronLeft, MapPin, Calendar, Clock, Tag } from "lucide-react";

const JobPreview = ({ formData, setStep, handleSubmit }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
        <div>
          <h3 className="text-xl font-semibold mb-2">Title</h3>
          <p className="text-gray-600">{formData.title}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Description</h3>
          <p className="text-gray-600">{formData.description}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Category</h3>
          <p className="text-gray-600">{formData.category}</p>
        </div>
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
        <div>
          <h3 className="text-xl font-semibold mb-2">Location</h3>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {formData.location.city}, {formData.location.country}
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Budget</h3>
          <p className="text-gray-600">
            {formData.budget} {formData.currency}
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Duration</h3>
          <p className="text-gray-600">{formData.duration}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Start Date</h3>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {formatDate(formData.startDate)}
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">End Date</h3>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {formatDate(formData.endDate)}
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Deadline</h3>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {formatDate(formData.deadline)}
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Attachments</h3>
          {formData.attachments.length > 0 ? (
            <div className="flex flex-col gap-2">
              {formData.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <a
                    href={URL.createObjectURL(attachment)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {attachment.name}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No attachments available.</p>
          )}
        </div>
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
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setStep((prev) => prev - 1)}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Back
        </button>
      </div>
    </div>
  );
};

export default JobPreview;
