import React from "react";
import { Instagram } from "lucide-react";

const ReviewsSection = ({ profile, onEdit }) => {
  // Find existing Instagram handle
  const existingInstagramHandle = profile?.socialHandles?.find(
    (handle) => handle.platform === "Instagram"
  )?.profileId;

  return (
    <div>
      {/* Instagram Verification Alert */}
      {!existingInstagramHandle && (
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-l-4 border-pink-500 p-4 mb-6 flex items-center">
          <div className="mr-4">
            <Instagram className="w-10 h-10 text-pink-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Boost Your Credibility
            </h3>
            <p className="text-gray-600 mb-3">
              Verify your Instagram account to showcase your authentic reach and
              build trust with potential collaborators.
            </p>
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Verify Instagram
            </button>
          </div>
        </div>
      )}

      {/* Existing Reviews Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Reviews{" "}
            {existingInstagramHandle ? `(@${existingInstagramHandle})` : ""}
          </h2>
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Edit Reviews
          </button>
        </div>

        {/* Placeholder for Reviews */}
        {!profile?.reviews || profile.reviews.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No reviews yet. Start showcasing your work!</p>
          </div>
        ) : (
          // Implement actual review rendering here
          <div>{/* Render reviews */}</div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
