import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4">
      <h2 className="text-xl mb-6">Super Admin</h2>

      <ul className="space-y-4">
        <li>
          <Link to="/super-admin/dashboard">Dashboard</Link>
        </li>

        <li>
          <Link to="/super-admin/departments">Departments</Link>
        </li>

        <li>
            <Link to="/super-admin/categories">Categories</Link>
        </li>

        <li>
          <Link to="/super-admin/areas">Areas</Link>
        </li>

        <li>
          <Link to="/super-admin/admins">Admins</Link>
        </li>
        
        <li>
          <button onClick={handleLogout} className="text-red-400">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;