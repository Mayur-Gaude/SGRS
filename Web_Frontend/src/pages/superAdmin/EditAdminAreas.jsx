import { useEffect, useState } from "react";
import {
  updateAdminAreas,
  getAdmins,
} from "../../api/admin.api";
import { getAreas } from "../../api/area.api";
import { useParams, useNavigate } from "react-router-dom";
import SuperAdminLayout from "../../components/layout/SuperAdminLayout";

const EditAdminAreas = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [areas, setAreas] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);

  // Load admin + areas
  useEffect(() => {
    const fetchData = async () => {
      const adminRes = await getAdmins();
      const admin = adminRes.data.data.find((a) => a._id === id);

      const areaRes = await getAreas();

      // Filter only same department areas
      const filtered = areaRes.data.data.filter(
        (area) =>
          area.department_id?._id === admin.department_id?._id
      );

      setAreas(filtered);

      // Pre-select existing
      setSelectedAreas(admin.area_ids.map((a) => a._id));
    };

    fetchData();
  }, [id]);

  const handleToggle = (areaId) => {
    const updated = selectedAreas.includes(areaId)
      ? selectedAreas.filter((a) => a !== areaId)
      : [...selectedAreas, areaId];

    setSelectedAreas(updated);
  };

  const handleSubmit = async () => {
    try {
      await updateAdminAreas(id, selectedAreas);

      alert("Areas updated");
      navigate("/super-admin/admins");

    } catch (err) {
      alert("Error updating areas");
    }
  };

  return (
    <SuperAdminLayout>
      <div className="max-w-md mx-auto bg-white p-6 shadow-md">
        <h2 className="text-xl mb-4 text-center">
          Update Admin Areas
        </h2>

        {areas.map((area) => (
          <div key={area._id}>
            <input
              type="checkbox"
              checked={selectedAreas.includes(area._id)}
              onChange={() => handleToggle(area._id)}
            />
            <span className="ml-2">{area.name}</span>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white w-full p-2 mt-4"
        >
          Update Areas
        </button>
      </div>
    </SuperAdminLayout>
  );
};

export default EditAdminAreas;