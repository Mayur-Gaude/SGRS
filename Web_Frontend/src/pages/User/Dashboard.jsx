import { useEffect, useState } from "react";
import { getUserComplaints } from "../../api/complaint.api";
import UserLayout from "../../components/layout/UserLayout";

const UserDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
  });

  useEffect(() => {
    const fetch = async () => {
      const res = await getUserComplaints();
      const data = res.data.data;

      setStats({
        total: data.length,
        pending: data.filter((c) => c.status !== "RESOLVED").length,
        resolved: data.filter((c) => c.status === "RESOLVED").length,
      });
    };

    fetch();
  }, []);

  return (
    <UserLayout>
      <h1 className="text-2xl mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <h3>Total Complaints</h3>
          <p className="text-xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h3>Pending</h3>
          <p className="text-xl font-bold">{stats.pending}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h3>Resolved</h3>
          <p className="text-xl font-bold">{stats.resolved}</p>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;