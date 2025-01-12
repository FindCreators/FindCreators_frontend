// src/components/dashboard/brand/steps/AIPromptStep.jsx
import React, { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";

const AIPromptStep = ({
  isGenerating,
  handleGenerate,
  setFormData,
  setStep,
}) => {
  const [jobTitle, setJobTitle] = useState("");
  const [requirements, setRequirements] = useState("");
  const [promptType, setPromptType] = useState("title");

  const handleGenerateClick = async () => {
    try {
      await handleGenerate(jobTitle, requirements);
    } catch (error) {
      console.error("Generation error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          AI-Powered Job Creation
        </h2>
        <p className="text-gray-500">
          Let AI help you create a detailed job posting based on your
          requirements
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {promptType === "title" ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Enter Job Title
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Developer, UI/UX Designer"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500">
              Enter a clear job title and let AI suggest the details
            </p>

            <button
              onClick={() => {
                if (jobTitle.trim()) {
                  setPromptType("description");
                }
              }}
              disabled={!jobTitle.trim()}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              Next: Add Requirements
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <button
                  onClick={() => setPromptType("title")}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Edit
                </button>
              </div>
              <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                {jobTitle}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Additional Requirements (Optional)
              </label>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Add any specific requirements, qualifications, or responsibilities..."
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500">
                AI will generate a complete job post based on the title and your
                requirements
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPromptType("title")}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleGenerateClick}
                disabled={isGenerating}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Job Post...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Create Complete Job Post
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Smart Description</h3>
          <p className="text-sm text-blue-700">
            Generates detailed job descriptions with key responsibilities
          </p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Skill Matching</h3>
          <p className="text-sm text-blue-700">
            Identifies and suggests relevant skills for the position
          </p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Industry Standards</h3>
          <p className="text-sm text-blue-700">
            Follows best practices for job posting format and content
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIPromptStep;
