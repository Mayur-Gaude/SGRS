import { useState, useEffect } from "react";
import {
  createAdmin,
  updateAdmin,
  getAdmins,
  getAdminById,
} from "../../api/admin.api";
import { getDepartments } from "../../api/department.api";
import { getAreas } from "../../api/area.api";
import { useNavigate, useParams } from "react-router-dom";
import SuperAdminLayout from "../../components/layout/SuperAdminLayout";

const CreateAdmin = () => {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    department_id: "",
    area_ids: [],
  });

  const [departments, setDepartments] = useState([]);
  const [areas, setAreas] = useState([]);

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

  // Load areas
  const loadAreas = async (deptId) => {
    const res = await getAreas();
    const filtered = res.data.data.filter(
      (a) => a.department_id?._id === deptId
    );
    setAreas(filtered);
  };

  // 🔥 Load admin data (edit)
    useEffect(() => {
        if (isEdit) {
            const fetchAdmin = async () => {
            try {
                const res = await getAdminById(id);
                const admin = res.data.data;

                setForm({
                full_name: admin.full_name || "",
                email: admin.email || "",
                phone: admin.phone || "",
                password: "",
                department_id: admin.department_id?._id || "",
                area_ids: admin.area_ids.map((a) => a._id),
                });

                loadAreas(admin.department_id?._id);

            } catch (err) {
                alert("Error loading admin data");
            }
            };

            fetchAdmin();
        }
    }, [id]);

  const handleDepartmentChange = async (deptId) => {
    setForm({ ...form, department_id: deptId, area_ids: [] });
    loadAreas(deptId);
  };

  const handleAreaSelect = (areaId) => {
    const updated = form.area_ids.includes(areaId)
      ? form.area_ids.filter((a) => a !== areaId)
      : [...form.area_ids, areaId];

    setForm({ ...form, area_ids: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateAdmin(id, form);
        alert("Admin updated");
      } else {
        await createAdmin(form);
        alert("Admin created");
      }

      navigate("/super-admin/admins");

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <SuperAdminLayout>
      <div className="max-w-md mx-auto bg-white p-6 shadow-md">
        <h2 className="text-xl mb-4 text-center">
          {isEdit ? "Edit Admin" : "Create Admin"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 w-full mb-3"
            value={form.full_name}
            onChange={(e) =>
              setForm({ ...form, full_name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full mb-3"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Phone"
            className="border p-2 w-full mb-3"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          {!isEdit && (
            <input
              type="password"
              placeholder="Password"
              className="border p-2 w-full mb-3"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          )}

          <select
            className="border p-2 w-full mb-3"
            value={form.department_id}
            onChange={(e) => handleDepartmentChange(e.target.value)}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Areas */}
          {areas.map((area) => (
            <div key={area._id}>
              <input
                type="checkbox"
                checked={form.area_ids.includes(area._id)}
                onChange={() => handleAreaSelect(area._id)}
              />
              <span className="ml-2">{area.name}</span>
            </div>
          ))}

          <button className="bg-blue-500 text-white w-full p-2 mt-3">
            {isEdit ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </SuperAdminLayout>
  );
};

export default CreateAdmin;