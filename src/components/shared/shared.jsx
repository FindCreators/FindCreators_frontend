export const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

export const Stats = ({ icon: Icon, label, value }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
        <Icon className="h-6 w-6" />
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);
