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
    severity: "MINOR",
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
      
      // alert(`
      // Score: ${res.data.data.totalScore}
      // Suggested Action: ${res.data.data.suggested_action}
      // `);

      alert(`
        Score: ${res.data.data.totalScore}
        Suggested Action: ${res.data.data.suggested_action.action}
        Reason: ${res.data.data.suggested_action.reason}
      `);

      } catch (error) {
        alert(error.response?.data?.message);
      }
  };

  if (!complaint) {
    return (
      <DeptAdminLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600 text-lg">Loading violation form...</p>
        </div>
      </DeptAdminLayout>
    );
  }

  return (
    <DeptAdminLayout>
      <div className="space-y-6 w-full">

        {/* Header Section */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Violation
          </h1>
          <p className="text-gray-600">Record a violation for the rejected complaint</p>
        </div>

        {/* Complaint Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Complaint Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 text-xs font-medium uppercase tracking-wide mb-1">Complaint Title</p>
              <p className="text-gray-900 font-semibold">{complaint.title}</p>
            </div>

            <div>
              <p className="text-gray-600 text-xs font-medium uppercase tracking-wide mb-1">User</p>
              <p className="text-gray-900 font-semibold">{complaint.user_id?.full_name}</p>
            </div>

            <div>
              <p className="text-gray-600 text-xs font-medium uppercase tracking-wide mb-1">Complaint ID</p>
              <p className="text-gray-900 font-semibold">#{complaint.complaint_number}</p>
            </div>
          </div>
        </div>

        {/* Violation Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Violation Information</h2>

          <div className="space-y-6">
            {/* Violation Type and Severity - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Violation Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Violation Type
                </label>

                <select
                  value={form.violation_type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      violation_type: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">
                    Select Violation Type
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
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Severity Level
                </label>

                <select
                  value={form.severity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      severity: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="MINOR">Low</option>
                  <option value="MODERATE">Medium</option>
                  <option value="SEVERE">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            {/* Reason - Full Width */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Reason for Violation
              </label>

              <textarea
                placeholder="Explain the violation details and reasoning..."
                value={form.reason}
                onChange={(e) =>
                  setForm({
                    ...form,
                    reason: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows="6"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 mt-6"
          >
            Submit Violation
          </button>
        </div>

      </div>
    </DeptAdminLayout>
  );
};

export default CreateViolation;