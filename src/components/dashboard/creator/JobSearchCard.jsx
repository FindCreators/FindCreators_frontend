import React from "react";

const JobSearchCard = ({ listing, isApplied, onApply }) => {
  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold">{listing.title}</h2>
      <p className="text-gray-600">{listing.description}</p>
      <div className="mt-2">
        <span className="text-sm text-gray-500">Budget: ${listing.budget}</span>
        <span className="text-sm text-gray-500 ml-4">
          Duration: {listing.duration}
        </span>
      </div>
      <div className="mt-2">
        <span className="text-sm text-gray-500">
          Skills: {listing.skills.join(", ")}
        </span>
      </div>
      <div className="mt-2">
        <span className="text-sm text-gray-500">
          Location: {listing.location.city}, {listing.location.country}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onApply(listing.id);
        }}
        disabled={isApplied}
        className={`px-6 py-2 mt-4 rounded-lg transition-all duration-200 w-full sm:w-auto ${
          isApplied
            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isApplied ? "Applied" : "Apply Now"}
      </button>
    </div>
  );
};

export default JobSearchCard;
