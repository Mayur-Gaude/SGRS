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

  const getPercentage = (value) => {
    return stats.total > 0 ? Math.round((value / stats.total) * 100) : 0;
  };

  const StatRow = ({ label, value, color }) => {
    const percentage = getPercentage(value);
    const colorMap = {
      blue: "bg-blue-500",
      yellow: "bg-yellow-500",
      orange: "bg-orange-500",
      green: "bg-green-500",
    };

    return (
      <div className="py-4 border-b border-gray-200 last:border-b-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700 font-medium">{label}</span>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">{percentage}%</div>
              <div className="text-xs text-gray-500">of total</div>
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${colorMap[color]} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <DeptAdminLayout>
      <div className="space-y-8 w-full">
        {/* Header Section */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of assigned grievances and complaints</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Complaints</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm font-medium mb-2">Under Review</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm font-medium mb-2">In Progress</p>
            <p className="text-3xl font-bold text-orange-600">{stats.inProgress}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm font-medium mb-2">Resolved</p>
            <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
          </div>
        </div>

        {/* Statistics Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Complaint Distribution</h2>
          
          <StatRow label="Total Complaints" value={stats.total} color="blue" />
          <StatRow label="Under Review" value={stats.pending} color="yellow" />
          <StatRow label="In Progress" value={stats.inProgress} color="orange" />
          <StatRow label="Resolved" value={stats.resolved} color="green" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <p className="text-gray-600 text-sm font-medium mb-3">Resolution Rate</p>
            <div className="flex items-end gap-4">
              <div className="text-4xl font-bold text-indigo-600">
                {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
              </div>
              <p className="text-gray-600 text-sm pb-1">of complaints resolved</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <p className="text-gray-600 text-sm font-medium mb-3">Active Cases</p>
            <div className="flex items-end gap-4">
              <div className="text-4xl font-bold text-orange-600">
                {stats.pending + stats.inProgress}
              </div>
              <p className="text-gray-600 text-sm pb-1">awaiting attention</p>
            </div>
          </div>
        </div>
      </div>
    </DeptAdminLayout>
  );
};

export default DeptAdminDashboard;