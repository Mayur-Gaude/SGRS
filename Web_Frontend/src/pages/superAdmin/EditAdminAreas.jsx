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
      <div className="space-y-8 w-full">
        
        {/* PAGE TITLE */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Update Admin Areas
          </h1>
          <p className="text-gray-600 mt-2">
            Modify area assignments for this administrator
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <div className="space-y-6">
            
            {/* AREAS SECTION */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Select Areas
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {areas.length > 0 ? (
                  areas.map((area) => (
                    <div key={area._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`area-${area._id}`}
                        checked={selectedAreas.includes(area._id)}
                        onChange={() => handleToggle(area._id)}
                        className="w-4 h-4 text-blue-400 border-gray-300 rounded focus:ring-2 focus:ring-blue-400 cursor-pointer"
                      />
                      <label 
                        htmlFor={`area-${area._id}`}
                        className="ml-3 text-sm text-gray-700 cursor-pointer"
                      >
                        {area.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 col-span-full">
                    No areas available for this department
                  </p>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 pt-6 border-t border-gray-200 w-fit">
              <button
                onClick={handleSubmit}
                className="bg-blue-400 hover:bg-blue-400 text-white px-8 py-2 rounded-lg font-medium transition-colors duration-150"
              >
                Update Areas
              </button>
              <button
                type="button"
                onClick={() => navigate("/super-admin/admins")}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default EditAdminAreas;