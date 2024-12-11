import React from "react";

const ApplicationsList = ({ applications }) => (
  <div className="space-y-6">
    <h2 className="text-lg font-medium text-gray-900">Applications</h2>
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {applications?.map((application) => (
          <li key={application.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-gray-200" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {application.creatorName}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {application.proposal}
                </p>
              </div>
              <div>
                <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  View Details
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ApplicationsList;
