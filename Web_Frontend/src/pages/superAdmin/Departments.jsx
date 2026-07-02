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
      <div className="space-y-8 w-full">
        
        {/* PAGE TITLE */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Departments
            </h1>
            <p className="text-gray-600 mt-2">
              Manage all departments and their status
            </p>
          </div>

          <button
            onClick={() => navigate("/super-admin/create-department")}
            className="bg-blue-400 hover:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-150"
          >
            + Create Department
          </button>
        </div>

        {/* DEPARTMENTS TABLE */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Department Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Contact Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {departments.map((dept) => (
                  <tr
                    key={dept._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 last:border-b-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {dept.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {dept.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {dept.contact_email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-semibold text-xs ${
                          dept.is_active
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {dept.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            navigate(`/super-admin/create-department/${dept._id}`)
                          }
                          className="bg-blue-400 hover:bg-blue-400 text-white px-3 py-1 rounded font-medium transition-colors duration-150"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleToggle(dept)}
                          className={`px-3 py-1 rounded font-medium text-white transition-colors duration-150 ${
                            dept.is_active
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {dept.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {departments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No departments found</p>
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Departments;