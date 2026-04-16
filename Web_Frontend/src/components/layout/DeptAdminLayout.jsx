import DeptAdminSidebar from "./DeptAdminSidebar";

const DeptAdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <DeptAdminSidebar />

      <div className="ml-64 flex-1 overflow-y-auto p-6">
        {children}
      </div>
    </div>
  );
};

export default DeptAdminLayout;