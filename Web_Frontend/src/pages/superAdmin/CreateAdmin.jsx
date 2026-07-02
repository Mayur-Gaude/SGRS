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
      <div className="space-y-8 w-full">
        
        {/* PAGE TITLE */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            {isEdit ? "Edit Admin" : "Create Admin"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? "Modify administrator information" : "Add a new department administrator"}
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* FORM SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-150"
                  value={form.full_name}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-150"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="Enter phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-150"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value })
                  }
                />
              </div>

              {!isEdit && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-150"
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                </div>
              )}

              <div className={isEdit ? "md:col-span-2" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-150"
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
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Assigned Areas
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {areas.length > 0 ? (
                    areas.map((area) => (
                      <div key={area._id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`area-${area._id}`}
                          checked={form.area_ids.includes(area._id)}
                          onChange={() => handleAreaSelect(area._id)}
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
                    <p className="text-sm text-gray-500">
                      Select a department first to see available areas
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 pt-6 border-t border-gray-200 w-fit">
              <button 
                type="submit"
                className="bg-blue-400 hover:bg-blue-400 text-white px-8 py-2 rounded-lg font-medium transition-colors duration-150"
              >
                {isEdit ? "Update Admin" : "Create Admin"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/super-admin/admins")}
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

export default CreateAdmin;