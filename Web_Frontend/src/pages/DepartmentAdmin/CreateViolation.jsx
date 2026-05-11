import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { createViolation } from "../../api/violation.api";
import { getComplaintDetails } from "../../api/complaint.api";

import DeptAdminLayout from "../../components/layout/DeptAdminLayout";

const CreateViolation = () => {
  const { complaintId } = useParams();

  const [complaint, setComplaint] = useState(null);

  const [form, setForm] = useState({
    user_id: "",
    complaint_id: "",
    violation_type: "",
    severity: "LOW",
    reason: "",
  });

  useEffect(() => {
    const fetchComplaint = async () => {
      const res = await getComplaintDetails(complaintId);

      const complaintData = res.data.data.complaint;

      setComplaint(complaintData);

      setForm((prev) => ({
        ...prev,
        user_id: complaintData.user_id._id,
        complaint_id: complaintData._id,
      }));
    };

    fetchComplaint();
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await createViolation(form);
      
      alert(`
      Score: ${res.data.data.totalScore}
      Suggested Action: ${res.data.data.suggested_action}
      `);
      } catch (error) {
        alert(error.response?.data?.message);
      }
  };

  if (!complaint) {
    return (
      <DeptAdminLayout>
        <p>Loading...</p>
      </DeptAdminLayout>
    );
  }

  return (
    <DeptAdminLayout>
      <div className="p-6">

        <div className="bg-white shadow rounded p-5">
          <h1 className="text-2xl font-bold">
            Create Violation
          </h1>

          {/* Complaint Info */}
          <div className="mt-4 bg-gray-100 p-4 rounded">
            <p>
              <span className="font-semibold">
                Complaint:
              </span>{" "}
              {complaint.title}
            </p>

            <p>
              <span className="font-semibold">
                User:
              </span>{" "}
              {complaint.user_id?.full_name}
            </p>
          </div>

          {/* Violation Type */}
          <div className="mt-4">
            <label className="block mb-1">
              Violation Type
            </label>

            {/* <input
              placeholder="e.g Fake Complaint"
              value={form.violation_type}
              onChange={(e) =>
                setForm({
                  ...form,
                  violation_type: e.target.value,
                })
              }
              className="border p-3 rounded w-full"
            /> */}

            <select
              value={form.violation_type}
              onChange={(e) =>
                setForm({
                  ...form,
                  violation_type: e.target.value,
                })
              }
              className="border p-3 rounded w-full"
            >
              <option value="">
                Select Violation
              </option>

              <option value="FAKE_COMPLAINT">
                Fake Complaint
              </option>

              <option value="SPAM">
                Spam
              </option>

              <option value="ABUSIVE_LANGUAGE">
                Abusive Language
              </option>

              <option value="DUPLICATE_COMPLAINT">
                Duplicate Complaint
              </option>

              <option value="MISLEADING_INFORMATION">
                Misleading Information
              </option>
            </select>
          </div>

          {/* Severity */}
          <div className="mt-4">
            <label className="block mb-1">
              Severity
            </label>

            <select
              value={form.severity}
              onChange={(e) =>
                setForm({
                  ...form,
                  severity: e.target.value,
                })
              }
              className="border p-3 rounded w-full"
            >
              <option value="MINOR">LOW</option>
              <option value="MODERATE">MEDIUM</option>
              <option value="SEVERE">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          {/* Reason */}
          <div className="mt-4">
            <label className="block mb-1">
              Reason
            </label>

            <textarea
              placeholder="Explain violation"
              value={form.reason}
              onChange={(e) =>
                setForm({
                  ...form,
                  reason: e.target.value,
                })
              }
              className="border p-3 rounded w-full"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-red-500 text-white px-5 py-2 rounded mt-5"
          >
            Submit Violation
          </button>
        </div>
      </div>
    </DeptAdminLayout>
  );
};

export default CreateViolation;