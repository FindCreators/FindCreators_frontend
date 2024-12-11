const JobFilters = ({ onFilterChange }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
    <h3 className="text-lg font-medium text-gray-900">Filters</h3>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Category
      </label>
      <select
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        onChange={(e) => onFilterChange("category", e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="healthcare">Healthcare</option>
        <option value="technology">Technology</option>
        <option value="lifestyle">Lifestyle</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Budget Range
      </label>
      <select
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        onChange={(e) => onFilterChange("budget", e.target.value)}
      >
        <option value="">Any Budget</option>
        <option value="0-1000">$0 - $1,000</option>
        <option value="1000-5000">$1,000 - $5,000</option>
        <option value="5000+">$5,000+</option>
      </select>
    </div>
  </div>
);

export default JobFilters;
