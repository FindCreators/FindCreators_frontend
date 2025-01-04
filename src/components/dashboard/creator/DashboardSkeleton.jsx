import React from "react";

const DashboardSkeleton = () => (
  <div className="space-y-6 p-4 sm:p-6 md:p-8 animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
      <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-xl p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div className="ml-4 flex-1">
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {[1, 2].map((section) => (
      <div key={section} className="bg-white rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 w-40 bg-gray-200 rounded"></div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex justify-between items-center py-4">
              <div className="space-y-2">
                <div className="h-5 w-48 bg-gray-200 rounded"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
              <div className="flex gap-4">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default DashboardSkeleton;
