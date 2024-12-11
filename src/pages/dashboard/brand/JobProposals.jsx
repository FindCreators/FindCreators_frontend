import React from "react";
import {
  Search,
  SlidersHorizontal,
  ThumbsUp,
  MessageCircle,
} from "lucide-react";

const JobProposals = () => {
  const proposals = [
    {
      id: 1,
      freelancer: {
        name: "Shahzaib A.",
        avatar: "/api/placeholder/48/48",
        title: "UI UX Design | Website Design | Mobile App Design",
        country: "Pakistan",
        rate: 60.0,
        earned: 50,
        jobSuccess: "50%",
      },
      message:
        "Hey Shaurya, I didn't hear anything back from you. I just wanted to follow up.",
      receivedDate: "2 weeks ago",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with Progress Steps */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-4">
          Expert Figma Designer Needed for Job Portal Website
        </h1>
        <p className="text-green-600 mb-6">30 invites left</p>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-green-600 rounded"
              style={{ width: "75%" }}
            />
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <button className="text-gray-600 font-medium">VIEW JOB POST</button>
          <button className="text-gray-600 font-medium">
            INVITE FREELANCERS
          </button>
          <button className="text-white font-medium bg-green-600 px-4 py-2 rounded">
            REVIEW PROPOSALS (4)
          </button>
          <button className="text-gray-600 font-medium">HIRE (0)</button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md">
          <SlidersHorizontal className="h-5 w-5" />
          Filters
        </button>
        <select className="px-4 py-2 border border-gray-300 rounded-md">
          <option>Best match</option>
        </select>
      </div>

      {/* Proposals List */}
      <div className="bg-white rounded-lg shadow">
        {proposals.map((proposal) => (
          <div key={proposal.id} className="p-6 border-b border-gray-200">
            <div className="flex gap-6">
              <img
                src={proposal.freelancer.avatar}
                alt={proposal.freelancer.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium">
                      {proposal.freelancer.name}
                    </h3>
                    <p className="text-gray-600">{proposal.freelancer.title}</p>
                    <p className="text-gray-500">
                      {proposal.freelancer.country}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full border border-gray-200">
                      <ThumbsUp className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="px-4 py-2 text-green-600 border border-green-600 rounded-md">
                      Message
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md">
                      Hire
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 mt-4">
                  <span>${proposal.freelancer.rate.toFixed(2)}</span>
                  <span>${proposal.freelancer.earned} earned</span>
                  <span>{proposal.freelancer.jobSuccess} Job Success</span>
                </div>

                <div className="mt-4">
                  <p className="text-gray-600">
                    <MessageCircle className="inline h-4 w-4 mr-2" />
                    Received {proposal.receivedDate}: {proposal.message}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobProposals;
