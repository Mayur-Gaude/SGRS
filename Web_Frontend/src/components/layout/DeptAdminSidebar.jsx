import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const DeptAdminSidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, icon, label }) => (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive(to)
          ? "bg-indigo-600 text-white shadow-lg"
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <div className="w-64 h-screen fixed left-0 top-0 bg-gradient-to-b from-gray-900 to-gray-950 text-white p-6 flex flex-col shadow-lg border-r border-gray-800 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
          {/* <span className="text-2xl">🏛️</span> */}
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
            Dept Admin
          </h2>
        </div>
        <p className="text-gray-400 text-xs font-medium">Department Administration</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <NavLink
          to="/dept-admin/dashboard"
          // icon="📊"
          label="Dashboard"
        />
        <NavLink
          to="/dept-admin/complaints"
          // icon="📋"
          label="Assigned Complaints"
        />
      </nav>

      {/* Logout Button */}
      <div className="border-t border-gray-800 pt-4">
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200 font-medium border border-red-500/30 hover:border-red-500/50"
        >
          {/* <span className="text-lg">🚪</span> */}
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DeptAdminSidebar;