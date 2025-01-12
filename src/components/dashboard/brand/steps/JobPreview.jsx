import React, { useState } from "react";
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Clock,
  Tag,
  DollarSign,
  Briefcase,
  FileText,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  Share2,
  IndianRupee,
} from "lucide-react";

const JobPreview = ({ formData, setStep, handleSubmit }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [validationWarnings, setValidationWarnings] = useState([]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const validateJobPost = () => {
    const warnings = [];
    if (!formData.title) warnings.push("Job title is missing");
    if (!formData.description) warnings.push("Job description is missing");
    if (!formData.category) warnings.push("Category is not selected");
    if (!formData.skills || formData.skills.length === 0)
      warnings.push("No skills are specified");
    if (!formData.budget) warnings.push("Budget is not specified");
    if (!formData.startDate || !formData.endDate)
      warnings.push("Project dates are incomplete");
    return warnings;
  };

  const handlePostJob = () => {
    const warnings = validateJobPost();
    if (warnings.length > 0) {
      setValidationWarnings(warnings);
      return;
    }
    if (handleSubmit) {
      handleSubmit();
    }
  };

  const PreviewSection = ({ title, icon: Icon, children, className = "" }) => (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className="w-5 h-5 text-blue-600" />}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const Tag = ({ children, color = "blue" }) => (
    <span
      className={`px-3 py-1.5 bg-${color}-50 text-${color}-600 rounded-full text-sm font-medium`}
    >
      {children}
    </span>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Preview Your Job Post
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Review all the details of your job posting. Make sure everything is
          correct before publishing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <PreviewSection title="Basic Information" icon={Briefcase}>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Title
                </h4>
                <p className="text-lg font-medium text-gray-900">
                  {formData.title || "No title provided"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Category
                </h4>
                <Tag>{formData.category || "Not specified"}</Tag>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Location
                </h4>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">
                    {formData.location &&
                    (formData.location.city || formData.location.country)
                      ? `${formData.location.city || ""} ${
                          formData.location.city && formData.location.country
                            ? ","
                            : ""
                        } ${formData.location.country || ""}`
                      : "Location not specified"}
                  </span>
                </div>
              </div>
            </div>
          </PreviewSection>

          <PreviewSection title="Project Details" icon={FileText}>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Description
                </h4>
                <div className="prose prose-sm max-w-none text-gray-600">
                  {formData.description ? (
                    formData.description.split("\n").map((paragraph, index) => (
                      <p key={index} className="mb-2">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">
                      No description provided
                    </p>
                  )}
                </div>
              </div>
              {formData.skills && formData.skills.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <Tag key={index}>{skill}</Tag>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </PreviewSection>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <PreviewSection title="Budget & Timeline" icon={IndianRupee}>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">
                  Budget
                </h4>
                <div className="text-2xl font-bold text-gray-900">
                  {formData.budget
                    ? `${formData.currency || "$"}${formData.budget}`
                    : "Not specified"}
                </div>
              </div>

              {formData.duration && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Duration
                  </h4>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{formData.duration}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {formData.startDate && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      Start Date
                    </h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">
                        {formatDate(formData.startDate)}
                      </span>
                    </div>
                  </div>
                )}

                {formData.endDate && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">
                      End Date
                    </h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">
                        {formatDate(formData.endDate)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </PreviewSection>

          <PreviewSection title="Attachments & Links" icon={LinkIcon}>
            {formData.attachments && formData.attachments.length > 0 ? (
              <div className="space-y-2">
                {formData.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {attachment.name || `File ${index + 1}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No attachments uploaded</p>
            )}

            {formData.attachmentLink && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  External Link
                </h4>
                <a
                  href={formData.attachmentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span className="underline">{formData.attachmentLink}</span>
                </a>
              </div>
            )}
          </PreviewSection>
        </div>
      </div>

      {/* Validation Warnings */}
      {validationWarnings.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800 mb-1">
                Please address the following:
              </h4>
              <ul className="list-disc list-inside text-sm text-yellow-700">
                {validationWarnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-8 py-4 border-t border-gray-200">
        <button
          onClick={() => setStep((prev) => prev - 1)}
          className="flex items-center text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 mb-4 sm:mb-0"
        >
          <ChevronLeft className="h-5 w-5 mr-2" />
          Back to Edit
        </button>

        <div className="flex gap-4">
          <button
            onClick={handlePostJob}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Publish Job
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPreview;
