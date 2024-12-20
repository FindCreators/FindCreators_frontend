import React from "react";
import { Clock } from "lucide-react";

const ProjectTypeStep = ({ formData, setFormData, setStep }) => (
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

export default ProjectTypeStep;
