import React from "react";
import { Wand2 } from "lucide-react";

const AIWelcomeStep = ({ setFormData, setStep }) => (
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

export default AIWelcomeStep;
