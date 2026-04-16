import SuperAdminLayout from "../../components/layout/SuperAdminLayout";

const Dashboard = () => {
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
    </div>
    </SuperAdminLayout>
  );
};

export default Dashboard;