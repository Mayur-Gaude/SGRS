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
      <div className="space-y-8 w-full">
        
        {/* PAGE TITLE */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            {isEdit ? "Update Category" : "Create Category"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? "Modify category information" : "Add a new complaint category to the system"}
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* FORM SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="Enter category name"
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
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-150"
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Enter description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-150"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SLA Response Hours
                </label>
                <input
                  type="number"
                  placeholder="Enter response hours"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-150"
                  value={form.sla_response_hours}
                  onChange={(e) =>
                    setForm({ ...form, sla_response_hours: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SLA Resolution Hours
                </label>
                <input
                  type="number"
                  placeholder="Enter resolution hours"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-150"
                  value={form.sla_resolution_hours}
                  onChange={(e) =>
                    setForm({ ...form, sla_resolution_hours: e.target.value })
                  }
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 pt-6 border-t border-gray-200 w-fit">
              <button 
                type="submit"
                className="bg-blue-400 hover:bg-blue-400 text-white px-8 py-2 rounded-lg font-medium transition-colors duration-150"
              >
                {isEdit ? "Update Category" : "Create Category"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/super-admin/categories")}
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

export default CreateCategory;