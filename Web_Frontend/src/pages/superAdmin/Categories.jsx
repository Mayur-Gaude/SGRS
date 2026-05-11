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
      <div className="p-6">

        {/* Header */}
        <div className="flex justify-between mb-4">
          <h2 className="text-xl">Categories</h2>

          <button
            onClick={() => navigate("/super-admin/create-category")}
            className="bg-blue-500 text-white px-4 py-2"
          >
            + Create
          </button>
        </div>

        {/* 🔥 Department Filter */}
        <div className="mb-4">
          <select
            className="border p-2 w-full max-w-sm"
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

        {/* //clearin all filters
        <button onClick={() => handleDepartmentChange("")} className="bg-blue-500 text-white px-4 py-2">
          Clear Filter
        </button> */}

        {/* Category List */}
        <div className="bg-white p-4 shadow-md">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="border p-3 mb-2 flex justify-between"
            >
              <div>
                <p className="font-bold">{cat.name}</p>
                <p className="text-sm">
                  Dept: {cat.department_id?.name}
                </p>

                <span
                  className={`text-xs ${
                    cat.is_active ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {cat.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    navigate(`/super-admin/create-category/${cat._id}`)
                  }
                  className="bg-yellow-500 text-white px-3"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleToggle(cat)}
                  className={`px-3 text-white ${
                    cat.is_active ? "bg-red-500" : "bg-green-500"
                  }`}
                >
                  {cat.is_active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </SuperAdminLayout>
  );
};

export default Categories;