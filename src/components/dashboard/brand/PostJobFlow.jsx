import React, { useState } from "react";
import { Clock, Tag, Wand2, ChevronLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    budget: {
      type: "hourly",
      min: "",
      max: "",
      fixed: "",
    },
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

  const AIWelcomeStep = () => (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <Wand2 className="h-16 w-16 mx-auto mb-4 text-blue-500" />
        <h2 className="text-3xl font-semibold mb-4">
          Let's work on your job post!
        </h2>
        <p className="text-gray-600 mb-8">
          Get help from AI and be done in no time.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => {
            setFormData((prev) => ({ ...prev, useAI: true }));
            setStep(2);
          }}
          className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Get started using AI
        </button>
        <button
          onClick={() => {
            setFormData((prev) => ({ ...prev, useAI: false }));
            setStep(3);
          }}
          className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          I'll do it without AI
        </button>
      </div>
    </div>
  );

  const AIPromptStep = () => {
    const handleGenerate = async () => {
      setIsGenerating(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const dummyResponse = {
          title: "Senior Figma Designer for Website Redesign",
          description:
            "Looking for an experienced Figma designer to help with our website redesign project. The ideal candidate will have strong UI/UX skills and experience with modern design systems.",
          category: "ui-ux",
          skills: ["Figma", "UI Design", "Web Design"],
        };

        setFormData((prev) => ({
          ...prev,
          ...dummyResponse,
        }));
        setStep(3);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsGenerating(false);
      }
    };

    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-semibold mb-8">
          Describe what you're looking for
        </h2>

        <div className="space-y-6">
          <div>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="E.g. I need a Figma designer to help create wireframes and UI designs for a new mobile app..."
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-2">
              {150 - aiPrompt.length} characters left
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || aiPrompt.length < 10}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isGenerating ? "Generating..." : "Generate Job Post"}
          </button>
        </div>
      </div>
    );
  };

  const ProjectTypeStep = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-semibold mb-8">How can we help you?</h2>

      <div className="space-y-4">
        {[
          {
            type: "long-term",
            title: "Long term project",
            description:
              "More than thirty hours a week and/or will be longer than three months.",
          },
          {
            type: "short-term",
            title: "Short term project",
            description:
              "Less than thirty hours a week and/or will be shorter than three months.",
          },
        ].map((option) => (
          <div
            key={option.type}
            onClick={() => {
              setFormData((prev) => ({ ...prev, projectType: option.type }));
              setStep(4);
            }}
            className={`p-6 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors ${
              formData.projectType === option.type
                ? "border-blue-500 bg-blue-50"
                : ""
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-gray-600" />
                <h3 className="text-lg font-medium">{option.title}</h3>
              </div>
              <div
                className={`w-6 h-6 rounded-full border ${
                  formData.projectType === option.type
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
              />
            </div>
            <p className="text-gray-600 ml-9">{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const JobDetailsStep = () => (
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
            value={formData.title}
            onChange={handleInputChange}
            placeholder="E.g. Figma Designer needed for Website Redesign"
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
            value={formData.description}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your project requirements, goals, and any specific skills needed..."
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
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a category</option>
            <option value="web-design">Web Design</option>
            <option value="ui-ux">UI/UX Design</option>
            <option value="development">Development</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills Required
          </label>
          <div className="flex flex-wrap gap-2">
            {["Figma", "UI Design", "Web Design", "HTML", "CSS"].map(
              (skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      skills: prev.skills.includes(skill)
                        ? prev.skills.filter((s) => s !== skill)
                        : [...prev.skills, skill],
                    }));
                  }}
                  className={`px-4 py-2 rounded-full border ${
                    formData.skills.includes(skill)
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {skill}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const BudgetStep = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-semibold mb-8">Set your budget</h2>

      <div className="space-y-6">
        <div className="flex gap-4 mb-6">
          {[
            { type: "hourly", icon: Clock, label: "Hourly rate" },
            { type: "fixed", icon: Tag, label: "Fixed price" },
          ].map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.type}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    budget: { ...prev.budget, type: option.type },
                  }))
                }
                className={`flex-1 p-6 border rounded-lg ${
                  formData.budget.type === option.type
                    ? "border-blue-500 bg-blue-50"
                    : "hover:border-gray-400"
                }`}
              >
                <Icon className="h-6 w-6 mb-2" />
                <h3 className="font-medium">{option.label}</h3>
              </button>
            );
          })}
        </div>

        {formData.budget.type === "hourly" ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="budget.min"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                From ($/hr)
              </label>
              <input
                type="number"
                id="budget.min"
                name="budget.min"
                value={formData.budget.min}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="budget.max"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                To ($/hr)
              </label>
              <input
                type="number"
                id="budget.max"
                name="budget.max"
                value={formData.budget.max}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        ) : (
          <div>
            <label
              htmlFor="budget.fixed"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Budget ($)
            </label>
            <input
              type="number"
              id="budget.fixed"
              name="budget.fixed"
              value={formData.budget.fixed}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );

  const SummaryStep = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-semibold mb-8">Review Your Job Post</h2>

      <div className="space-y-6 bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Project Details</h3>
            <button
              onClick={() => setStep(3)}
              className="text-blue-500 hover:text-blue-600"
            >
              Edit
            </button>
          </div>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-gray-500">Project Type</dt>
              <dd className="mt-1">
                {formData.projectType === "long-term"
                  ? "Long term project"
                  : "Short term project"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Title</dt>
              <dd className="mt-1">{formData.title}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Description</dt>
              <dd className="mt-1 whitespace-pre-wrap">
                {formData.description}
              </dd>
            </div>
          </dl>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Skills & Category</h3>
            <button
              onClick={() => setStep(4)}
              className="text-blue-500 hover:text-blue-600"
            >
              Edit
            </button>
          </div>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-gray-500">Category</dt>
              <dd className="mt-1">{formData.category}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Required Skills</dt>
              <dd className="mt-1">
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </dd>
            </div>
          </dl>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Budget</h3>
            <button
              onClick={() => setStep(5)}
              className="text-blue-500 hover:text-blue-600"
            >
              Edit
            </button>
          </div>
          <dl>
            <dt className="text-sm text-gray-500">Budget Type</dt>
            <dd className="mt-1">
              {formData.budget.type === "hourly"
                ? `Hourly Rate: $${formData.budget.min} - $${formData.budget.max}/hr`
                : `Fixed Price: $${formData.budget.fixed}`}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );

  const steps = [
    AIWelcomeStep,
    AIPromptStep,
    ProjectTypeStep,
    JobDetailsStep,
    BudgetStep,
    SummaryStep,
  ];

  const CurrentStep = steps[step - 1];

  const handleSubmit = async () => {
    try {
      console.log("Submitting job:", formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/brand/jobs");
    } catch (error) {
      console.error("Error submitting job:", error);
    }
  };

  const calculateProgress = () => {
    const totalSteps = formData.useAI ? steps.length : steps.length - 1;
    const currentProgress = formData.useAI ? step : step - 1;
    return (currentProgress / totalSteps) * 100;
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

        <CurrentStep />

        <div className="max-w-2xl mx-auto mt-8 flex justify-end gap-4">
          <button
            onClick={() => navigate("/brand/jobs")}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          {step === steps.length ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Post Job
            </button>
          ) : (
            step > 2 && (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Continue
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PostJobFlow;
