// src/components/dashboard/brand/PostJobFlow.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

import AIWelcomeStep from "./steps/AIWelcomeStep";
import AIPromptStep from "./steps/AIPromptStep";
import ProjectTypeStep from "./steps/ProjectTypeStep";
import JobDetailsStep from "./steps/JobDetailsStep";
import BudgetStep from "./steps/BudgetStep";
import JobPreview from "./steps/JobPreview";
import { createJobListing } from "../../../network/networkCalls";

const PostJobFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  const [formData, setFormData] = useState({
    useAI: false,
    projectType: "",
    title: "",
    description: "",
    category: "",
    skills: [],
    budget: 0,
    currency: "INR",
    duration: "",
    location: {
      city: "",
      country: "",
    },
    deadline: "",
    startDate: "",
    endDate: "",
    attachments: [],
    attachmentLink: "",
    tags: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Here you would typically call an AI service
      // For now, we'll simulate it
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setFormData((prev) => ({
        ...prev,
        title: "Content Creation for Product Launch",
        description: aiPrompt,
        category: "Tech",
        skills: ["Content Creation", "Social Media Marketing"],
      }));

      setStep(3);
    } catch (error) {
      toast.error("Failed to generate job post");
    } finally {
      setIsGenerating(false);
    }
  };

  const validateForm = () => {
    const requiredFields = ["title", "description", "category", "budget"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return false;
    }

    // Validate dates if provided
    const dates = {
      startDate: formData.startDate,
      endDate: formData.endDate,
      deadline: formData.deadline,
    };

    for (const [key, value] of Object.entries(dates)) {
      if (value && isNaN(new Date(value).getTime())) {
        toast.error(`Invalid ${key} format`);
        return false;
      }
    }

    return true;
  };

  const formatDates = (data) => {
    const now = new Date();
    const oneMonthFromNow = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate()
    );

    return {
      ...data,
      startDate: data.startDate
        ? new Date(data.startDate).toISOString()
        : now.toISOString(),
      endDate: data.endDate
        ? new Date(data.endDate).toISOString()
        : oneMonthFromNow.toISOString(),
      deadline: data.deadline
        ? new Date(data.deadline).toISOString()
        : oneMonthFromNow.toISOString(),
    };
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

      const jobData = formatDates({
        ...formData,
        budget: Number(formData.budget), // Ensure budget is a number
      });

      await createJobListing(jobData);
      toast.success("Job posted successfully!");
      navigate("/brand/jobs");
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error(error.message || "Failed to post job");
    }
  };

  const steps = [
    () => <AIWelcomeStep setFormData={setFormData} setStep={setStep} />,
    () => (
      <AIPromptStep
        aiPrompt={aiPrompt}
        setAiPrompt={setAiPrompt}
        isGenerating={isGenerating}
        handleGenerate={handleGenerate}
      />
    ),
    () => (
      <ProjectTypeStep
        formData={formData}
        setFormData={setFormData}
        setStep={setStep}
      />
    ),
    () => (
      <JobDetailsStep
        formData={formData}
        handleInputChange={handleInputChange}
      />
    ),
    () => (
      <BudgetStep formData={formData} handleInputChange={handleInputChange} />
    ),
    () => (
      <JobPreview
        formData={formData}
        setStep={setStep}
        handleSubmit={handleSubmit}
      />
    ),
  ];

  const calculateProgress = () => {
    const totalSteps = formData.useAI ? steps.length : steps.length - 1;
    const currentProgress = formData.useAI ? step : step - 1;
    return (currentProgress / totalSteps) * 100;
  };

  const handleContinue = () => {
    if (step === steps.length) {
      if (validateForm()) {
        handleSubmit();
      }
    } else {
      setStep(step + 1);
    }
  };

  const CurrentStep = steps[step - 1];

  return (
    <div className="min-h-screen bg-white">
      {step > 1 && (
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>
      )}

      <div className="p-8">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center text-gray-600 mb-6 hover:text-gray-900"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </button>
        )}

        <CurrentStep />

        <div className="max-w-2xl mx-auto mt-8 flex justify-end gap-4">
          <button
            onClick={() => navigate("/brand/jobs")}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>

          {step > 2 && (
            <button
              onClick={handleContinue}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {step === steps.length ? "Post Job" : "Continue"}
            </button>
          )}
        </div>
      </div>

      {/* Display any validation errors */}
      {step === steps.length && (
        <div className="max-w-2xl mx-auto mt-4">
          {Object.entries(formData).map(([key, value]) => {
            if (
              !value &&
              ["title", "description", "category", "budget"].includes(key)
            ) {
              return (
                <p key={key} className="text-red-500 text-sm">
                  {key.charAt(0).toUpperCase() + key.slice(1)} is required
                </p>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default PostJobFlow;
