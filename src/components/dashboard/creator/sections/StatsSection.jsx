import React from "react";
import { Bar, Line } from "recharts";

const StatsSection = ({ profile }) => {
  const engagementData = [
    { month: "Jan", rate: 4.2 },
    { month: "Feb", rate: 4.8 },
    { month: "Mar", rate: 5.1 },
    { month: "Apr", rate: 4.9 },
    { month: "May", rate: 5.3 },
    { month: "Jun", rate: 5.7 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-medium mb-2">Engagement Rate</h3>
          <div className="text-3xl font-bold text-blue-600">
            {profile?.engagementRate}%
          </div>
          <div className="mt-4 h-40">
            <Line
              data={engagementData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              {/* Add Line chart configuration */}
            </Line>
          </div>
        </div>

        {/* Add more stat cards */}
      </div>
    </div>
  );
};

export default StatsSection;
