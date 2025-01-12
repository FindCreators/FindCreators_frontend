// src/components/dashboard/brand/PostJobFlow.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import OpenAI from "openai";

import AIWelcomeStep from "./steps/AIWelcomeStep";
import AIPromptStep from "./steps/AIPromptStep";
import JobDetailsStep from "./steps/JobDetailsStep";
import BudgetStep from "./steps/BudgetStep";
import JobPreview from "./steps/JobPreview";
import { createJobListing } from "../../../network/networkCalls";

const TOTAL_STEPS = 5;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const PostJobFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    useAI: false,
    title: "",
    description: "",
    category: "",
    skills: [],
    budget: "",
    currency: "INR",
    duration: "",
    location: {
      city: "",
      country: "",
    },
    startDate: "",
    endDate: "",
    attachments: [],
    attachmentLink: "",
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

  const handleGenerate = async (jobTitle, additionalRequirements) => {
    setIsGenerating(true);
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an expert HR professional who creates detailed job postings.",
          },
          {
            role: "user",
            content: `Create a detailed job posting for the position of "${jobTitle}". 
            Additional requirements: ${additionalRequirements || ""}
            
            Include:
            1. A clear job title
            2. Detailed job description
            3. Required skills and qualifications (at least 5 relevant skills)
            4. Job category (choose from: Tech, Fashion, Lifestyle, Beauty, Food)
            
            Format the response as JSON with the following structure:
            {
              "title": "Job title",
              "description": "Detailed description",
              "category": "Job category",
              "skills": ["skill1", "skill2", ...]
            }`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const jobData = JSON.parse(completion.choices[0].message.content);

      // Update form data with AI-generated content
      setFormData((prev) => ({
        ...prev,
        title: jobData.title,
        description: jobData.description,
        category: jobData.category,
        skills: jobData.skills,
        useAI: true,
      }));

      toast.success("Job details generated successfully!");
      setStep(3); // Move to JobDetailsStep
    } catch (error) {
      console.error("Error generating job post:", error);
      toast.error("Failed to generate job post");
      throw error;
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

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        toast.error("End date must be after start date");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formPayload = new FormData();

      // Helper function to format dates to ISO string
      const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        // Set time to midnight UTC
        date.setUTCHours(0, 0, 0, 0);
        return date.toISOString(); // Will format as "YYYY-MM-DDT00:00:00.000Z"
      };

      // Add all fields to FormData with special handling for certain fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "location") {
          // Handle nested location object
          formPayload.append("location.country", value.country || "");
          formPayload.append("location.city", value.city || "");
        } else if (key === "skills") {
          // Join array of skills with commas
          formPayload.append(
            "skills",
            Array.isArray(value) ? value.join(",") : value
          );
        } else if (key === "attachments") {
          // Handle file attachments
          if (Array.isArray(value)) {
            value.forEach((file) => {
              formPayload.append("attachments", file);
            });
          }
        } else if (key === "startDate") {
          // Format start date
          formPayload.append("startDate", formatDate(value));
        } else if (key === "endDate") {
          // Format end date
          formPayload.append("endDate", formatDate(value));
        } else {
          // Handle all other fields normally
          formPayload.append(key, value);
        }
      });

      // Log the formatted dates for verification
      console.log("Formatted startDate:", formPayload.get("startDate"));
      console.log("Formatted endDate:", formPayload.get("endDate"));

      await createJobListing(formPayload);
      toast.success("Job posted successfully!");
      navigate("/brand/jobs");
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error(error.message || "Failed to post job");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <AIWelcomeStep setFormData={setFormData} setStep={setStep} />;
      case 2:
        return (
          <AIPromptStep
            isGenerating={isGenerating}
            handleGenerate={handleGenerate}
            setFormData={setFormData}
            setStep={setStep}
          />
        );
      case 3:
        return (
          <JobDetailsStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 4:
        return (
          <BudgetStep
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 5:
        return (
          <JobPreview
            formData={formData}
            setStep={setStep}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const calculateProgress = () => {
    return ((step - 1) / (TOTAL_STEPS - 1)) * 100;
  };

  const handleContinue = () => {
    if (step === TOTAL_STEPS) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

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

        {renderStep()}

        <div className="max-w-4xl mx-auto mt-8 flex items-center justify-end border-t border-gray-200 pt-6">
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/brand/dashboard")}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 rounded-lg"
            >
              Cancel
            </button>

            {step !== 2 && step !== 5 && (
              <button
                onClick={handleContinue}
                disabled={isSubmitting}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobFlow;
