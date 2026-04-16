import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const UserSidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="w-64 h-screen bg-blue-900 text-white p-4">
      <h2 className="text-xl mb-6">User Panel</h2>

      <ul className="space-y-4">
        <li>
          <Link to="/user/dashboard">Dashboard</Link>
        </li>

        <li>
          <Link to="/user/create-complaint">Create Complaint</Link>
        </li>

        <li>
          <Link to="/user/complaints">My Complaints</Link>
        </li>

        <li>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="text-red-300"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserSidebar;