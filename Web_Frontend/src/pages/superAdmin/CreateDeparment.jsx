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
      <div className="max-w-md mx-auto bg-white shadow-md p-6 rounded">
        <h2 className="text-xl mb-4 text-center">
          {isEdit ? "Update Department" : "Create Department"}
        </h2>

        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Department Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <Input
            type="text"
            placeholder="Department Code"
            value={form.code}
            disabled={isEdit}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value })
            }
          />

          <Input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <Input
            type="email"
            placeholder="Contact Email"
            value={form.contact_email}
            onChange={(e) =>
              setForm({ ...form, contact_email: e.target.value })
            }
          />

          <Input
            type="text"
            placeholder="Contact Phone"
            value={form.contact_phone}
            onChange={(e) =>
              setForm({ ...form, contact_phone: e.target.value })
            }
          />

          <Button text={isEdit ? "Update Department" : "Create Department"} />
        </form>
      </div>
    </SuperAdminLayout>
  );
};

export default CreateDepartment;