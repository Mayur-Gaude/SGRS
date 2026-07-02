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
      <div className="space-y-8 w-full">

        {/* PAGE TITLE */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Create Ban
          </h1>
          <p className="text-gray-600 mt-2">
            Issue a temporary or permanent ban for user violations
          </p>
        </div>

        {/* VIOLATION DETAILS CARD */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Violation Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                User
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {violation.user_id?.full_name}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Violation Type
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {violation.violation_type}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Severity
              </p>
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold mt-1">
                {violation.severity}
              </span>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Suggested Action
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {violation.suggested_action}
              </p>
            </div>
          </div>
        </div>

        {/* BAN FORM CARD */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Ban Configuration
          </h2>

          <div className="space-y-6">

            {/* BAN TYPE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-150"
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-150"
                    placeholder="Enter number of days"
                  />
                </div>
              )}
            </div>

            {/* REASON */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-150"
                placeholder="Explain the reason for this ban"
                rows="4"
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 pt-6 border-t border-gray-200 w-fit">
              <button
                onClick={handleSubmit}
                className="bg-blue-400 hover:bg-blue-400 text-white px-8 py-2 rounded-lg font-medium transition-colors duration-150"
              >
                Create Ban
              </button>
              <button
                type="button"
                onClick={() => navigate("/super-admin/management")}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-150"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default CreateBan;