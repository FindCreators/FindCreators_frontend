// src/components/dashboard/creator/ApplyJobModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";

const ApplyJobModal = ({ isOpen, onClose, onApply, jobId }) => {
  const [quotedPrice, setQuotedPrice] = useState("");
  const [message, setMessage] = useState("");

  const handleApply = () => {
    onApply(jobId, quotedPrice, message);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-medium">Apply for Job</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Quoted Price</label>
            <input
              type="number"
              value={quotedPrice}
              onChange={(e) => setQuotedPrice(e.target.value)}
              className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-full py-2.5 pl-4 pr-4 border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg py-2.5 pl-4 pr-4 border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              rows="4"
            ></textarea>
          </div>
          <button
            onClick={handleApply}
            className="w-full bg-blue-500 text-white py-2.5 rounded-full hover:bg-blue-600 transition-colors"
          >
            Submit Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobModal;
