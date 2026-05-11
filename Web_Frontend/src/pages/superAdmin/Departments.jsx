import { useEffect, useState } from "react";
import {
  getDepartments,
  deactivateDepartment,
  updateDepartment,
  activateDepartment,
} from "../../api/department.api";
import { useNavigate } from "react-router-dom";
import SuperAdminLayout from "../../components/layout/SuperAdminLayout";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  const fetchDepartments = async () => {
    const res = await getDepartments();
    setDepartments(res.data.data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // 🔁 Toggle Active Status
    const handleToggle = async (dept) => {
        try {
            if (dept.is_active) {
                await deactivateDepartment(dept._id);
            } else {
                await activateDepartment(dept._id); // 🔥 use new API
            }

            fetchDepartments();

        } catch (err) {
            alert("Error updating status");
        }
    };

  return (
    <SuperAdminLayout>
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl">Departments</h2>

          <button
            onClick={() => navigate("/super-admin/create-department")}
            className="bg-blue-500 text-white px-4 py-2"
          >
            + Create
          </button>
        </div>

        <div className="bg-white shadow-md p-4">
          {departments.map((dept) => (
            <div
              key={dept._id}
              className="border p-4 mb-3 flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{dept.name}</p>
                <p className="text-sm">{dept.code}</p>
                <p className="text-xs">{dept.contact_email}</p>

                <span
                  className={`text-xs ${
                    dept.is_active ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {dept.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex gap-2">
                {/* ✏️ Edit */}
                <button
                  onClick={() =>
                    navigate(`/super-admin/create-department/${dept._id}`)
                  }
                  className="bg-yellow-500 text-white px-3"
                >
                  Edit
                </button>

                {/* 🔁 Toggle */}
                <button
                  onClick={() => handleToggle(dept)}
                  className={`px-3 text-white ${
                    dept.is_active ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {dept.is_active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Departments;