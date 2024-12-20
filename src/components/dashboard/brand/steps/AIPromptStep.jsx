import React from "react";

const AIPromptStep = ({
  aiPrompt,
  setAiPrompt,
  isGenerating,
  handleGenerate,
}) => (
  <div className="max-w-2xl mx-auto">
    <h2 className="text-3xl font-semibold mb-8">
      Describe what you're looking for
    </h2>
    <div className="space-y-6">
      <div>
        <textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="E.g. I need a Figma designer to help create wireframes..."
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

export default AIPromptStep;
