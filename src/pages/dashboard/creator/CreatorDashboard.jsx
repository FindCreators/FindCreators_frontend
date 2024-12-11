import { Briefcase, CheckCircle, Clock } from "lucide-react";
import { Card, Stats } from "../../../components/shared/shared";
import ApplicationTracker from "../../../components/dashboard/creator/ApplicationTracker";

const CreatorDashboard = () => {
  const stats = [
    { icon: Briefcase, label: "Applied Jobs", value: "8" },
    { icon: CheckCircle, label: "Accepted", value: "3" },
    { icon: Clock, label: "Pending", value: "5" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Stats key={index} {...stat} />
        ))}
      </div>
      <Card>
        <ApplicationTracker applications={[]} />
      </Card>
    </div>
  );
};

export default CreatorDashboard;
