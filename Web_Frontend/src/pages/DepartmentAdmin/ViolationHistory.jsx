import { useEffect, useState } from "react";

import { getViolations } from "../../api/violation.api";

import DeptAdminLayout from "../../components/layout/DeptAdminLayout";

const ViolationHistory = () => {

  const [violations, setViolations] = useState([]);

  useEffect(() => {

    const fetchViolations = async () => {

      const res = await getViolations();

      setViolations(res.data.data);
    };

    fetchViolations();

  }, []);

  const getSeverityColor = (severity) => {

    switch (severity) {

      case "LOW":
        return "bg-yellow-100 text-yellow-800";

      case "MEDIUM":
        return "bg-orange-100 text-orange-800";

      case "HIGH":
        return "bg-red-100 text-red-800";

      case "CRITICAL":
        return "bg-red-600 text-white";

      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DeptAdminLayout>

      <div className="space-y-6 w-full">

        {/* Header Section */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Violation History
          </h1>
          <p className="text-gray-600">Track and review all recorded violations</p>
        </div>

        {/* Summary */}
        <div className="text-sm text-gray-600">
          <p>Total violations: <span className="font-semibold text-gray-900">{violations.length}</span></p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {violations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Violation Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Complaint</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reason</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Severity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created By</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {violations.map((v) => (
                    <tr
                      key={v._id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 last:border-b-0"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{v.violation_type}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{v.user_id?.full_name || "N/A"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="font-medium text-gray-900 truncate">{v.complaint_id?.title}</p>
                          <p className="text-xs text-gray-600">#{v.complaint_id?.complaint_number}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 max-w-xs truncate">{v.reason}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(
                            v.severity
                          )}`}
                        >
                          {v.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{v.reported_by?.full_name || "N/A"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {new Date(v.createdAt).toLocaleDateString()} {new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No violations recorded yet</p>
            </div>
          )}
        </div>
      </div>
    </DeptAdminLayout>
  );
};

export default ViolationHistory;