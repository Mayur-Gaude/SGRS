import UserSidebar from "./UserSidebar";

const UserLayout = ({ children }) => {
  return (
    <div className="flex">
      <UserSidebar />

      <div className="flex-1 bg-gray-100 min-h-screen p-6">
        {children}
      </div>
    </div>
  );
};

export default UserLayout;