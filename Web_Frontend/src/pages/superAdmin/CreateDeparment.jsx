import { useState, useEffect } from "react";
import {
  createDepartment,
  updateDepartment,
  getDepartmentById,
} from "../../api/department.api";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useNavigate, useParams } from "react-router-dom";
import SuperAdminLayout from "../../components/layout/SuperAdminLayout";

const CreateDepartment = () => {
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    contact_email: "",
    contact_phone: "",
  });

  const navigate = useNavigate();
  const { id } = useParams(); // 🔥 detect edit mode

  const isEdit = !!id;

  // 🔥 Fetch existing department data
  useEffect(() => {
    if (isEdit) {
      const fetchDepartment = async () => {
        try {
          const res = await getDepartmentById(id);
          const data = res.data.data;

          setForm({
            name: data.name || "",
            code: data.code || "",
            description: data.description || "",
            contact_email: data.contact_email || "",
            contact_phone: data.contact_phone || "",
          });

        } catch (err) {
          alert("Error loading department");
        }
      };

      fetchDepartment();
    }
  }, [id, isEdit]);

  // 🔥 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateDepartment(id, form);
        alert("Department updated successfully");
      } else {
        await createDepartment(form);
        alert("Department created successfully");
      }

      navigate("/super-admin/departments");

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
            {isEdit ? "Update Department" : "Create Department"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? "Modify department information" : "Add a new department to the system"}
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* FORM SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter department name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Code
                </label>
                <Input
                  type="text"
                  placeholder="Enter department code"
                  value={form.code}
                  disabled={isEdit}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value })
                  }
                />
                {isEdit && (
                  <p className="text-xs text-gray-500 mt-1">
                    Code cannot be changed after creation
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <Input
                  type="email"
                  placeholder="Enter contact email"
                  value={form.contact_email}
                  onChange={(e) =>
                    setForm({ ...form, contact_email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <Input
                  type="text"
                  placeholder="Enter contact phone number"
                  value={form.contact_phone}
                  onChange={(e) =>
                    setForm({ ...form, contact_phone: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Input
                  type="text"
                  placeholder="Enter department description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 pt-6 border-t border-gray-200 w-fit">
              <Button 
                text={isEdit ? "Update Department" : "Create Department"}
              />
              <button
                type="button"
                onClick={() => navigate("/super-admin/departments")}
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

export default CreateDepartment;