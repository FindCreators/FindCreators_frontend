import React from "react";
import { Star } from "lucide-react";

const ReviewsSection = ({ profile }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Reviews & Ratings</h2>

        <div className="space-y-6">
          {(profile?.reviews || []).map((review, index) => (
            <div
              key={index}
              className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <img
                    src={review.brandLogo}
                    alt={review.brandName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{review.brandName}</h3>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current text-yellow-400" />
                  <span className="font-medium">{review.rating}</span>
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;
