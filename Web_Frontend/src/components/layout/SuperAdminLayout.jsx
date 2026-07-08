import Sidebar from "./Sidebar";

const SuperAdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 min-h-screen overflow-y-auto p-6">
        {children}
      </div>
    </div>
  );
};

export default SuperAdminLayout;