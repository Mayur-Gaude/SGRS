import { useState, useEffect } from "react";
import {
  createArea,
  updateArea,
  getAreaById,
  getAreas,
} from "../../api/area.api";
import { getDepartments } from "../../api/department.api";
import { useNavigate, useParams } from "react-router-dom";
import SuperAdminLayout from "../../components/layout/SuperAdminLayout";
import GeoFenceMap from "../../components/map/GeoFenceMap";

const CreateArea = () => {
  const [form, setForm] = useState({
    name: "",
    department_id: "",
    pincode: "",
    ward: "",
    parent_area_id: "",
  });

  const [polygon, setPolygon] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [areas, setAreas] = useState([]);
  const [existingPolygon, setExistingPolygon] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // Load departments
  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await getDepartments();
      setDepartments(res.data.data);
    };
    fetchDepartments();
  }, []);

  // Load areas (for parent dropdown)
  useEffect(() => {
    const fetchAreas = async () => {
      const res = await getAreas();
      setAreas(res.data.data);
    };
    fetchAreas();
  }, []);

  // Load existing area (edit)
    useEffect(() => {
        if (isEdit) {
            const fetchArea = async () => {
            const res = await getAreaById(id);
            const data = res.data.data;

            setForm({
                name: data.name || "",
                department_id: data.department_id?._id || "",
                pincode: data.pincode || "",
                ward: data.ward || "",
                parent_area_id: data.parent_area_id?._id || "",
            });

            // 🔥 SET EXISTING POLYGON
            if (data.geo_boundary?.coordinates) {
                setExistingPolygon(data.geo_boundary.coordinates[0]);
            }
            };

            fetchArea();
        }
    }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const payload = {
            ...form,
            parent_area_id: form.parent_area_id || null,
            geo_boundary: polygon
                ? {
                    type: "Polygon",
                    coordinates: [polygon],
                }
                : undefined,
        };

      if (isEdit) {
        await updateArea(id, payload);
        alert("Area updated");
      } else {
        await createArea(payload);
        alert("Area created");
      }

      navigate("/super-admin/areas");

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-8 w-full">
        
        {/* PAGE TITLE */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            {isEdit ? "Update Area" : "Create Area"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? "Modify area information and boundaries" : "Add a new geographic area with boundaries"}
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* FORM SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area Name
                </label>
                <input
                  type="text"
                  placeholder="Enter area name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-150"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-150"
                  value={form.department_id}
                  onChange={(e) =>
                    setForm({ ...form, department_id: e.target.value })
                  }
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  placeholder="Enter pincode"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-150"
                  value={form.pincode}
                  onChange={(e) =>
                    setForm({ ...form, pincode: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ward
                </label>
                <input
                  type="text"
                  placeholder="Enter ward name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-150"
                  value={form.ward}
                  onChange={(e) =>
                    setForm({ ...form, ward: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Area (Optional)
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-150"
                  value={form.parent_area_id}
                  onChange={(e) =>
                    setForm({ ...form, parent_area_id: e.target.value })
                  }
                >
                  <option value="">No Parent (Top Level)</option>
                  {areas.map((area) => (
                    <option key={area._id} value={area._id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Draw Area Boundary
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <GeoFenceMap 
                    setPolygon={setPolygon} 
                    existingPolygon={existingPolygon}
                  />
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 pt-6 border-t border-gray-200 w-fit">
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg font-medium transition-colors duration-150"
              >
                {isEdit ? "Update Area" : "Create Area"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/super-admin/areas")}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default CreateArea;