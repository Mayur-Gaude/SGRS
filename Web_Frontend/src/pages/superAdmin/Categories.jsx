import { useEffect, useState } from "react";
import {
  getCategories,
  deactivateCategory,
  updateCategory,
  getCategoriesByDepartment,
} from "../../api/category.api";
import { getDepartments } from "../../api/department.api";
import { useNavigate } from "react-router-dom";
import SuperAdminLayout from "../../components/layout/SuperAdminLayout";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");

  const navigate = useNavigate();

  // 🔥 Load all departments
  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await getDepartments();
      setDepartments(res.data.data);
    };
    fetchDepartments();
  }, []);

  // 🔥 Load categories
  const fetchCategories = async () => {
    const res = await getCategories();
    setCategories(res.data.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🔥 Handle filter
  const handleDepartmentChange = async (deptId) => {
    setSelectedDept(deptId);

    try {
      if (!deptId) {
        fetchCategories(); // show all
      } else {
        const res = await getCategoriesByDepartment(deptId);
        setCategories(res.data.data);
      }
    } catch (err) {
      alert("Error filtering categories");
    }
  };

  // 🔁 Toggle active
  const handleToggle = async (cat) => {
    try {
      if (cat.is_active) {
        await deactivateCategory(cat._id);
      } else {
        await updateCategory(cat._id, { is_active: true });
      }

      // 🔥 reload based on filter
      if (selectedDept) {
        handleDepartmentChange(selectedDept);
      } else {
        fetchCategories();
      }

    } catch (err) {
      alert("Error");
    }
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-8 w-full">

        {/* PAGE TITLE */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Categories
            </h1>
            <p className="text-gray-600 mt-2">
              Manage complaint categories and their assignments
            </p>
          </div>

          <button
            onClick={() => navigate("/super-admin/create-category")}
            className="bg-blue-400 hover:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-150"
          >
            + Create Category
          </button>
        </div>

        {/* FILTER SECTION */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Department
          </label>
          <select
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-150"
            value={selectedDept}
            onChange={(e) => handleDepartmentChange(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* CATEGORIES TABLE */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Category Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 last:border-b-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {cat.department_id?.name}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full font-semibold text-xs ${
                          cat.is_active
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {cat.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            navigate(`/super-admin/create-category/${cat._id}`)
                          }
                          className="bg-blue-400 hover:bg-blue-400 text-white px-3 py-1 rounded font-medium transition-colors duration-150"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleToggle(cat)}
                          className={`px-3 py-1 rounded font-medium text-white transition-colors duration-150 ${
                            cat.is_active
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {cat.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No categories found</p>
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default Categories;