import React from "react";
import { Star } from "lucide-react";

const ReviewsSection = ({ profile }) => {
  const reviews = profile?.reviews || [];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={review.reviewerImage}
                alt={review.reviewerName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium">{review.reviewerName}</h3>
                <p className="text-gray-600">{review.date}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-2">{review.comment}</p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500">No reviews yet.</p>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
