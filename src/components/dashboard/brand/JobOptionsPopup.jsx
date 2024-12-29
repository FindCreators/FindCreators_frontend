import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../../../network/apiHelpers";
import { toast } from "react-hot-toast";

const JobOptionsPopup = ({ jobId, onClose, fetchJobs, buttonRef }) => {
  const navigate = useNavigate();
  const popupRef = useRef(null);

  const handleOutsideClick = (event) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target) &&
      !buttonRef.current.contains(event.target)
    ) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleEdit = () => {
    navigate(`/brand/jobs/${jobId}/edit`);
    onClose();
  };

  const handleRemove = async () => {
    try {
      await makeRequest({
        method: "DELETE",
        url: `/api/brand/jobs/${jobId}`,
      });
      toast.success("Job removed successfully");
      fetchJobs();
      onClose();
    } catch (error) {
      toast.error("Failed to remove job");
      console.error("Error removing job:", error);
    }
  };

  const handleMakePrivate = async () => {
    try {
      await makeRequest({
        method: "PATCH",
        url: `/api/brand/jobs/${jobId}/make-private`,
      });
      toast.success("Job made private successfully");
      fetchJobs();
      onClose();
    } catch (error) {
      toast.error("Failed to make job private");
      console.error("Error making job private:", error);
    }
  };

  return (
    <div ref={popupRef} className="relative">
      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
        <div
          className="py-1"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <button
            onClick={handleEdit}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
            role="menuitem"
          >
            Edit Posting
          </button>
          <button
            onClick={handleRemove}
            className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 hover:text-red-800 w-full text-left"
            role="menuitem"
          >
            Remove Posting
          </button>
          <button
            onClick={handleMakePrivate}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
            role="menuitem"
          >
            Make Private
          </button>
          <button
            onClick={onClose}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
            role="menuitem"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobOptionsPopup;
