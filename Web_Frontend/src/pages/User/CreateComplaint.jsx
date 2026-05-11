import { useState, useEffect } from "react";
import { createComplaint } from "../../api/complaint.api";
import { getDepartments } from "../../api/department.api";
import { getCategoriesByDepartment } from "../../api/category.api";
import { getAreas } from "../../api/area.api";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../components/layout/UserLayout";
import { uploadComplaintMedia } from "../../api/complaint.api";

const CreateComplaint = () => {
  const [form, setForm] = useState({
    department_id: "",
    category_id: "",
    area_id: "",
    title: "",
    description: "",
    pincode: "",
  });

  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [file, setFile] = useState(null);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const navigate = useNavigate();

  // Load departments
  useEffect(() => {
    const fetch = async () => {
      const res = await getDepartments();
      setDepartments(res.data.data);
    };
    fetch();
  }, []);

  useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setLatitude(pos.coords.latitude);
      setLongitude(pos.coords.longitude);
    },
    () => {
      alert("Location access denied");
    }
  );
}, []);

  // Load categories based on department
  const handleDepartmentChange = async (deptId) => {
    setForm((prev)=>({
      ...prev,
      department_id: deptId,
      category_id: "",
      area_id: "",
    }));

    const catRes = await getCategoriesByDepartment(deptId);
    setCategories(catRes.data.data);

    const areaRes = await getAreas();
    const filtered = areaRes.data.data.filter(
      (a) => a.department_id?._id === deptId &&
      a.is_active
    );
    setAreas(filtered);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    console.log("Submitting:", {
      ...form,
      latitude,
      longitude,
    });
    // 1️⃣ Create complaint
    const res = await createComplaint({
      ...form,
      latitude,
      longitude,
    });

    const complaintId = res.data.data._id;

    // 2️⃣ Upload media (if exists)
    if (file) {
      await uploadComplaintMedia(complaintId, file);
    }

    alert("Complaint submitted");
    navigate("/user/complaints");
  } catch (err) {
    alert(err.response?.data?.message || "Error");
  }
};

  return (
    <UserLayout>
      <div className="max-w-md mx-auto bg-white p-6 shadow-md">
      <h2 className="text-xl mb-4">Create Complaint</h2>

      <form onSubmit={handleSubmit}>
        {/* Department */}
        <select
          className="border p-2 w-full mb-3"
          value = {form.department_id}
          onChange={(e) => handleDepartmentChange(e.target.value)}
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Category */}
        <select
          className="border p-2 w-full mb-3"
          value = {form.category_id}
          onChange={(e) =>
            setForm((prev) =>({ ...prev, category_id: e.target.value }))
          }
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Area */}
        <select
          className="border p-2 w-full mb-3"
          value = {form.area_id}
          onChange={(e) =>
            setForm((prev)=>({ ...prev, area_id: e.target.value }))
          }
        >
          <option value="">Select Area</option>
          {areas.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name}
            </option>
          ))}
        </select>

        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full mb-3"
          value={form.title}
          onChange={(e) =>
            setForm((prev)=>({ ...prev, title: e.target.value }))
          }
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          className="border p-2 w-full mb-3"
          value = {form.description}
          onChange={(e) =>
            setForm((prev) =>({ ...prev, description: e.target.value }))
          }
        />

        {/* Pincode */}
        <input
          type="text"
          placeholder="Pincode"
          className="border p-2 w-full mb-3"
          value = {form.pincode}
          onChange={(e) =>
            setForm((prev)=>({ ...prev, pincode: e.target.value }))
          }
        />

        <input
           type="file"
           className="mb-3"
           onChange={(e) => setFile(e.target.files[0])}
        />

        <p className="text-xs mb-2">
            Location: {latitude}, {longitude}
        </p>

        <button className="bg-blue-500 text-white w-full p-2">
          Submit Complaint
        </button>
      </form>
    </div>
    </UserLayout>
  );
};

export default CreateComplaint;