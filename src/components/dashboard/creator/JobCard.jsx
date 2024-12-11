const JobCard = ({ job, onApply }) => (
  <div className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{job.brand}</p>
      </div>
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        {job.budget}
      </span>
    </div>
    <p className="mt-4 text-sm text-gray-500">{job.description}</p>
    <div className="mt-6 flex justify-between items-center">
      <div className="flex items-center text-sm text-gray-500">
        <span>Posted {job.postedDate}</span>
        <span className="mx-2">•</span>
        <span>Deadline {job.deadline}</span>
      </div>
      <button
        onClick={() => onApply(job.id)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Apply Now
      </button>
    </div>
  </div>
);

export default JobCard;
