import { useEffect, useState } from "react";
import {
  getAdmins,
  deactivateAdmin,
} from "../../api/admin.api";
import { useNavigate } from "react-router-dom";
import SuperAdminLayout from "../../components/layout/SuperAdminLayout";

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();

  const fetchAdmins = async () => {
    const res = await getAdmins();
    setAdmins(res.data.data);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDeactivate = async (id) => {
    await deactivateAdmin(id);
    fetchAdmins();
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-8 w-full">

        {/* PAGE TITLE */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Department Admins
            </h1>
            <p className="text-gray-600 mt-2">
              Manage department administrators and their area assignments
            </p>
          </div>

          <button
            onClick={() => navigate("/super-admin/create-admin")}
            className="bg-blue-400 hover:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-150"
          >
            + Create Admin
          </button>
        </div>

        {/* ADMINS TABLE */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Assigned Areas
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {admins.map((admin) => (
                  <tr
                    key={admin._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 last:border-b-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {admin.full_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {admin.department_id?.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="text-xs">
                        {admin.area_ids?.length > 0 
                          ? admin.area_ids.map((a) => a.name).join(", ")
                          : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        {/* <button
                          onClick={() =>
                            navigate(`/super-admin/admins/${admin._id}/edit-areas`)
                          }
                          className="bg-blue-400 hover:bg-blue-400 text-white px-3 py-1 rounded font-medium transition-colors duration-150"
                        >
                          Edit Areas
                        </button> */}

                        <button
                          onClick={() =>
                            navigate(`/super-admin/create-admin/${admin._id}`)
                          }
                          className="bg-blue-400 hover:bg-blue-400 text-white px-3 py-1 rounded font-medium transition-colors duration-150"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeactivate(admin._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-medium transition-colors duration-150"
                        >
                          Deactivate
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {admins.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No department admins found</p>
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Admins;