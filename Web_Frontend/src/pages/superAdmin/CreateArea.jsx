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
      <div className="max-w-md mx-auto bg-white p-6 shadow-md">
        <h2 className="text-xl mb-4 text-center">
          {isEdit ? "Update Area" : "Create Area"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <input
            type="text"
            placeholder="Area Name"
            className="border p-2 w-full mb-3"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          {/* Department */}
          <select
            className="border p-2 w-full mb-3"
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

          {/* Parent Area */}
          <select
            className="border p-2 w-full mb-3"
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

          <div className="mb-4">
            <p className="text-sm mb-2">Draw Area Boundary</p>
            <GeoFenceMap 
                setPolygon={setPolygon} 
                existingPolygon={existingPolygon}
            />
          </div>

          {/* Pincode */}
          <input
            type="text"
            placeholder="Pincode"
            className="border p-2 w-full mb-3"
            value={form.pincode}
            onChange={(e) =>
              setForm({ ...form, pincode: e.target.value })
            }
          />

          {/* Ward */}
          <input
            type="text"
            placeholder="Ward"
            className="border p-2 w-full mb-3"
            value={form.ward}
            onChange={(e) =>
              setForm({ ...form, ward: e.target.value })
            }
          />

          <button className="bg-blue-500 text-white w-full p-2">
            {isEdit ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </SuperAdminLayout>
  );
};

export default CreateArea;