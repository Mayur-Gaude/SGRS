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
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl">Department Admins</h2>

          <button
            onClick={() => navigate("/super-admin/create-admin")}
            className="bg-blue-500 text-white px-4 py-2"
          >
            + Create
          </button>
        </div>

        <div className="bg-white p-4 shadow-md">
          {admins.map((admin) => (
            <div
              key={admin._id}
              className="border p-3 mb-2 flex justify-between"
            >
              <div>
                <p className="font-bold">{admin.full_name}</p>
                <p className="text-sm">{admin.email}</p>
                <p className="text-sm">
                  Dept: {admin.department_id?.name}
                </p>

                <p className="text-xs">
                  Areas:{" "}
                  {admin.area_ids?.map((a) => a.name).join(", ")}
                </p>
              </div>

              <button
                onClick={() =>
                    navigate(`/super-admin/admins/${admin._id}/edit-areas`)
                }
                className="bg-yellow-500 text-white px-3"
                >
                Edit Areas
              </button>

              <button
                onClick={() =>
                    navigate(`/super-admin/create-admin/${admin._id}`)
                }
                className="bg-yellow-500 text-white px-3"
                >
                Edit
              </button>

              <button
                onClick={() => handleDeactivate(admin._id)}
                className="bg-red-500 text-white px-3"
              >
                Deactivate
              </button>
            </div>
          ))}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Admins;