import React from "react";

const ApplicationTracker = ({ applications }) => (
  <div className="space-y-6">
    <h2 className="text-lg font-medium text-gray-900">My Applications</h2>
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {applications?.map((application) => (
          <li key={application.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {application.jobTitle}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {application.brand}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  application.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : application.status === "Accepted"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {application.status}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Applied on {application.appliedDate}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default ApplicationTracker;
