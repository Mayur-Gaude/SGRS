import SuperAdminLayout from "../../components/layout/SuperAdminLayout";


const Dashboard = () => {
  // const stats = {
  //   totalViolations: violations.length,
  //   activeBans: bans.length,
  //   pendingAppeals: appeals.length,
  // };

  return (
    <SuperAdminLayout>
      <h1 className="text-xl">Welcome Super Admin 👑</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 shadow rounded">
            <h3>Total Departments</h3>
            <p className="text-xl font-bold">--</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
            <h3>Active Departments</h3>
            <p className="text-xl font-bold">--</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
            <h3>Admins</h3>
            <p className="text-xl font-bold">--</p>
        </div>

        {/* <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-4 shadow rounded">
            <h3>Total Violations</h3>
            <p className="text-2xl font-bold">
              {stats.totalViolations}
            </p>
          </div>

          <div className="bg-white p-4 shadow rounded">
            <h3>Active Bans</h3>
            <p className="text-2xl font-bold">
              {stats.activeBans}
            </p>
          </div>

          <div className="bg-white p-4 shadow rounded">
            <h3>Pending Appeals</h3>
            <p className="text-2xl font-bold">
              {stats.pendingAppeals}
            </p>
          </div>
        </div> */}
    </div>
    </SuperAdminLayout>
  );
};

export default Dashboard;