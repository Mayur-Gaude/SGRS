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
        return "bg-red-500 text-white";

      default:
        return "bg-gray-100";
    }
  };

  return (
    <DeptAdminLayout>

      <div className="p-6">

        <h1 className="text-2xl font-bold mb-5">
          Violation History
        </h1>

        {violations.map((v) => (

          <div
            key={v._id}
            className="bg-white shadow rounded p-5 mb-4"
          >

            <div className="flex justify-between">

              <h2 className="font-semibold text-lg">
                {v.violation_type}
              </h2>

              <span
                className={`px-3 py-1 rounded text-sm ${getSeverityColor(
                  v.severity
                )}`}
              >
                {v.severity}
              </span>
            </div>

            <div className="mt-4 text-sm">

              <p>
                <span className="font-semibold">
                  User:
                </span>{" "}
                {v.user_id?.full_name}
              </p>

              <p className="mt-2">
                <span className="font-semibold">
                  Complaint:
                </span>{" "}
                {v.complaint_id?.title}
              </p>

              <p className="mt-2">
                <span className="font-semibold">
                  Complaint Number:
                </span>{" "}
                {v.complaint_id?.complaint_number}
              </p>

              <p className="mt-2">
                <span className="font-semibold">
                  Reason:
                </span>{" "}
                {v.reason}
              </p>

              <p className="mt-2">
                <span className="font-semibold">
                  Created By:
                </span>{" "}
                {v.reported_by?.full_name}
              </p>

              <p className="mt-2 text-gray-500">
                {new Date(v.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DeptAdminLayout>
  );
};

export default ViolationHistory;