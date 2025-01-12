import { BriefcaseIcon, Users, DollarSign, IndianRupee } from "lucide-react";

const BrandStats = () => {
  const stats = [
    {
      icon: BriefcaseIcon,
      label: "Active Jobs",
      value: "12",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Users,
      label: "Total Applications",
      value: "48",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      icon: IndianRupee,
      label: "Total Spent",
      value: "$24,500",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center">
              <div className={`${stat.iconBg} p-3 rounded-lg`}>
                <Icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                  {stat.value}
                </h3>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BrandStats;
