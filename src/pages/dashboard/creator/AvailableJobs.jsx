import JobCard from "../../../components/dashboard/creator/JobCard";
import JobFilters from "../../../components/dashboard/creator/JobFilters";

const AvailableJobs = () => {
  const handleApply = (jobId) => {
    console.log("Applying for job:", jobId);
  };

  const handleFilterChange = (filterType, value) => {
    console.log("Filter changed:", filterType, value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <JobFilters onFilterChange={handleFilterChange} />
      </div>
      <div className="lg:col-span-3 space-y-6">
        <JobCard
          job={{
            id: 1,
            title: "Healthcare App Promotion",
            brand: "HealthTech Inc",
            budget: "$2,000",
            description:
              "Looking for healthcare influencers to promote our new wellness app",
            postedDate: "2 days ago",
            deadline: "Dec 25, 2024",
          }}
          onApply={handleApply}
        />
      </div>
    </div>
  );
};

export default AvailableJobs;
