import { useState, useEffect } from "react";
import { createCategory,updateCategory,deactivateCategory,getCategoryById } from "../../api/category.api";
import { getDepartments } from "../../api/department.api";
import { useNavigate, useParams } from "react-router-dom";
import SuperAdminLayout from "../../components/layout/SuperAdminLayout";

const CreateCategory = () => {
  const [form, setForm] = useState({
    name: "",
    department_id: "",
    priority: "MEDIUM",
    sla_response_hours: "",
    sla_resolution_hours: "",
  });

  const [departments, setDepartments] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // 🔥 Load departments
  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await getDepartments();
      setDepartments(res.data.data);
    };
    fetchDepartments();
  }, []);

  // 🔥 Load category (edit)
  useEffect(() => {
    if (isEdit) {
      const fetchCategory = async () => {
        const res = await getCategoryById(id);
        const data = res.data.data;

        setForm({
          name: data.name || "",
          department_id: data.department_id?._id || "",
          priority: data.priority || "MEDIUM",
          sla_response_hours: data.sla_response_hours || "",
          sla_resolution_hours: data.sla_resolution_hours || "",
        });
      };
      fetchCategory();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateCategory(id, form);
        alert("Category updated");
      } else {
        await createCategory(form);
        alert("Category created");
      }

      navigate("/super-admin/categories");

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <SuperAdminLayout>
      <div className="max-w-md mx-auto bg-white p-6 shadow-md">
        <h2 className="text-xl mb-4 text-center">
          {isEdit ? "Update Category" : "Create Category"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <input
            type="text"
            placeholder="Category Name"
            className="border p-2 w-full mb-3"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          {/* Department Dropdown */}
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
                {dept.name} ({dept.code})
              </option>
            ))}
          </select>

          {/* Description */}
          <input
            type="text"
            placeholder="Description"
            className="border p-2 w-full mb-3"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* Priority */}
          <select
            className="border p-2 w-full mb-3"
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value })
            }
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>

          {/* SLA Response */}
          <input
            type="number"
            placeholder="SLA Response Hours"
            className="border p-2 w-full mb-3"
            value={form.sla_response_hours}
            onChange={(e) =>
              setForm({ ...form, sla_response_hours: e.target.value })
            }
          />

          {/* SLA Resolution */}
          <input
            type="number"
            placeholder="SLA Resolution Hours"
            className="border p-2 w-full mb-3"
            value={form.sla_resolution_hours}
            onChange={(e) =>
              setForm({ ...form, sla_resolution_hours: e.target.value })
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

export default CreateCategory;