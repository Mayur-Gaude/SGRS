import { useEffect, useState } from "react";
import {
  getAreas,
  deactivateArea,
  updateArea,
} from "../../api/area.api";
import { useNavigate } from "react-router-dom";
import SuperAdminLayout from "../../components/layout/SuperAdminLayout";

const Areas = () => {
  const [areas, setAreas] = useState([]);
  const navigate = useNavigate();

  const fetchAreas = async () => {
    const res = await getAreas();
    setAreas(res.data.data);
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleToggle = async (area) => {
    try {
      if (area.is_active) {
        await deactivateArea(area._id);
      } else {
        await updateArea(area._id, { is_active: true });
      }

      fetchAreas();

    } catch (err) {
      alert("Error");
    }
  };

  return (
    <SuperAdminLayout>
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl">Areas</h2>

          <button
            onClick={() => navigate("/super-admin/create-area")}
            className="bg-blue-500 text-white px-4 py-2"
          >
            + Create
          </button>
        </div>

        <div className="bg-white p-4 shadow-md">
          {areas.map((area) => (
            <div
              key={area._id}
              className="border p-3 mb-2 flex justify-between"
            >
              <div>
                <p className="font-bold">{area.name}</p>
                <p className="text-sm">
                  Dept: {area.department_id?.name}
                </p>
                <p className="text-xs">
                  Parent: {area.parent_area_id?.name || "None"}
                </p>

                <span
                  className={`text-xs ${
                    area.is_active ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {area.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    navigate(`/super-admin/create-area/${area._id}`)
                  }
                  className="bg-yellow-500 text-white px-3"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleToggle(area)}
                  className={`px-3 text-white ${
                    area.is_active ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {area.is_active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Areas;