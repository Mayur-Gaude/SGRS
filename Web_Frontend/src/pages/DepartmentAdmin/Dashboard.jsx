import { useEffect, useState } from "react";
import { getAssignedComplaints } from "../../api/complaint.api";
import DeptAdminLayout from "../../components/layout/DeptAdminLayout";

const DeptAdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    const fetch = async () => {
      const res = await getAssignedComplaints();
      const data = res.data.data;

      setStats({
        total: data.length,
        pending: data.filter((c) => c.status === "UNDER_REVIEW").length,
        inProgress: data.filter((c) => c.status === "IN_PROGRESS").length,
        resolved: data.filter((c) => c.status === "RESOLVED").length,
      });
    };

    fetch();
  }, []);

  const StatCard = ({ icon, title, value, bgColor, textColor }) => (
    <div
      className={`${bgColor} rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-l-4 ${textColor}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">
            {title}
          </p>
          <p className="text-4xl font-bold mt-3 text-gray-800">{value}</p>
        </div>
        {/* <div className="text-4xl opacity-20">{icon}</div> */}
      </div>
    </div>
  );

  return (
    <DeptAdminLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-2">Overview of assigned grievances and complaints</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            // icon="📊"
            title="Total Complaints"
            value={stats.total}
            bgColor="bg-blue-50"
            textColor="border-blue-500"
          />

          <StatCard
            // icon="⏳"
            title="Under Review"
            value={stats.pending}
            bgColor="bg-yellow-50"
            textColor="border-yellow-500"
          />

          <StatCard
            // icon="🔄"
            title="In Progress"
            value={stats.inProgress}
            bgColor="bg-orange-50"
            textColor="border-orange-500"
          />

          <StatCard
            // icon="✅"
            title="Resolved"
            value={stats.resolved}
            bgColor="bg-green-50"
            textColor="border-green-500"
          />
        </div>
      </div>
    </DeptAdminLayout>
  );
};

export default DeptAdminDashboard;