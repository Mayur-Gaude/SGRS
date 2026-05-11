import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { createBan } from "../../api/violation.api";
import { getViolationById } from "../../api/violation.api";

import SuperAdminLayout from "../../components/layout/SuperAdminLayout";

const CreateBan = () => {

  const { violationId } = useParams();

  const navigate = useNavigate();

  const [violation, setViolation] = useState(null);

  const [form, setForm] = useState({
    violation_id: violationId,
    ban_type: "TEMPORARY",
    duration_days: 7,
    ban_reason: "",
  });

  useEffect(() => {

    const fetchViolation = async () => {

      try {

        const res =
          await getViolationById(violationId);

        setViolation(res.data.data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchViolation();

  }, []);

  const handleSubmit = async () => {

    try {

      await createBan(form);

      alert("Ban created successfully");

      navigate("/super-admin/management");

    } catch (error) {

      alert(error.response?.data?.message);
    }
  };

  if (!violation) {

    return (
      <SuperAdminLayout>
        <p className="p-6">Loading...</p>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>

      <div className="p-6">

        <div className="bg-white shadow rounded p-5">

          <h1 className="text-2xl font-bold">
            Create Ban
          </h1>

          {/* USER INFO */}
          <div className="mt-5 bg-gray-100 p-4 rounded">

            <p>
              <span className="font-semibold">
                User:
              </span>{" "}
              {violation.user_id?.full_name}
            </p>

            <p className="mt-2">
              <span className="font-semibold">
                Violation:
              </span>{" "}
              {violation.violation_type}
            </p>

            <p className="mt-2">
              <span className="font-semibold">
                Severity:
              </span>{" "}
              {violation.severity}
            </p>

            <p className="mt-2">
              <span className="font-semibold">
                Suggested Action:
              </span>{" "}
              {violation.suggested_action}
            </p>
          </div>

          {/* BAN TYPE */}
          <div className="mt-5">

            <label className="block mb-2">
              Ban Type
            </label>

            <select
              value={form.ban_type}
              onChange={(e) =>
                setForm({
                  ...form,
                  ban_type: e.target.value,
                })
              }
              className="border p-3 rounded w-full"
            >
              <option value="TEMPORARY">
                TEMPORARY
              </option>

              <option value="PERMANENT">
                PERMANENT
              </option>
            </select>
          </div>

          {/* DURATION */}
          {form.ban_type === "TEMPORARY" && (

            <div className="mt-5">

              <label className="block mb-2">
                Duration (Days)
              </label>

              <input
                type="number"
                value={form.duration_days}
                onChange={(e) =>
                  setForm({
                    ...form,
                    duration_days: e.target.value,
                  })
                }
                className="border p-3 rounded w-full"
              />
            </div>
          )}

          {/* REASON */}
          <div className="mt-5">

            <label className="block mb-2">
              Ban Reason
            </label>

            <textarea
              value={form.ban_reason}
              onChange={(e) =>
                setForm({
                  ...form,
                  ban_reason: e.target.value,
                })
              }
              className="border p-3 rounded w-full"
              placeholder="Explain reason for ban"
            />
          </div>

          {/* ACTION */}
          <button
            onClick={handleSubmit}
            className="bg-red-500 text-white px-5 py-2 rounded mt-6"
          >
            Create Ban
          </button>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default CreateBan;