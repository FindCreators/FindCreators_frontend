// src/components/dashboard/creator/SendOffer.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createOffer } from "../../../network/networkCalls";
import toast from "react-hot-toast";

const SendOffer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { proposal, jobDetails } = location.state;
  const [amount, setAmount] = useState(proposal.quotedPrice);
  const [details, setDetails] = useState(
    `This is the offer from ${jobDetails.title}`
  );
  const [attachments, setAttachments] = useState(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [dueDate, setDueDate] = useState(jobDetails.deadline);

  // Extract creatorId from the applications array
  const creatorId = jobDetails.applications[0]?.creatorId;

  useEffect(() => {
    if (jobDetails) {
      setDetails(`This is the offer from ${jobDetails.title}`);
      setDueDate(jobDetails.deadline);
    }
  }, [jobDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeToTerms) {
      toast.error("You must agree to the terms and policy to continue.");
      return;
    }

    try {
      await createOffer(
        jobDetails.id,
        creatorId,
        amount,
        details,
        attachments,
        jobDetails.title
      );
      toast.success("Offer created successfully");
      navigate("/brand/jobs");
    } catch (error) {
      toast.error("Failed to create offer");
      console.error("Error creating offer:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Send an offer</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Contract terms
            </label>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Payment option
              </label>
              <select
                className="w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-green-500"
                disabled
              >
                <option value="fixed-price">Fixed-price</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Project amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Payment schedule
              </label>
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="whole-project"
                  name="payment-schedule"
                  value="whole-project"
                  className="mr-2"
                  defaultChecked
                />
                <label
                  htmlFor="whole-project"
                  className="text-gray-700 text-sm"
                >
                  Pay for the whole project
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="milestones"
                  name="payment-schedule"
                  value="milestones"
                  className="mr-2"
                />
                <label htmlFor="milestones" className="text-gray-700 text-sm">
                  Pay in installments with milestones
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Due date (optional)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Work description
            </label>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Contract title
              </label>
              <input
                type="text"
                value={jobDetails.title}
                readOnly
                className="w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Add a description of the work
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-green-500"
                rows="4"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Attach file
              </label>
              <input
                type="file"
                onChange={(e) => setAttachments(e.target.files[0])}
                className="w-full bg-gray-100 text-gray-700 border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-700 text-sm">
                Yes, I understand and agree to the Upwork Terms of Service,
                including the User Agreement and Privacy Policy.
              </span>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/brand/jobs")}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendOffer;
