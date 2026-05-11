import { useEffect, useState } from "react";

import {
  getViolationManagement,
} from "../../api/violation.api";

import { useNavigate } from "react-router-dom";

import SuperAdminLayout from "../../components/layout/SuperAdminLayout";

const ViolationManagement = () => {

  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchData = async () => {

      const res =
        await getViolationManagement();

      setUsers(res.data.data);
    };

    fetchData();

  }, []);

  const getActionColor = (action) => {

    switch (action) {

      case "WARNING":
        return "bg-yellow-100 text-yellow-700";

      case "TEMP_BAN":
        return "bg-orange-100 text-orange-700";

      case "PERMANENT_BAN":
        return "bg-red-500 text-white";

      default:
        return "bg-gray-100";
    }
  };

  return (
    <SuperAdminLayout>

      <div className="p-6">

        <h1 className="text-2xl font-bold mb-5">
          Violation Management
        </h1>

        {users.map((u) => (

          <div
            key={u.user._id}
            className="bg-white shadow rounded p-5 mb-5"
          >

            {/* HEADER */}
            <div className="flex justify-between">

              <div>
                <h2 className="text-xl font-semibold">
                  {u.user.full_name}
                </h2>

                <p className="text-sm text-gray-500">
                  {u.user.email}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded text-sm ${getActionColor(
                  u.suggested_action
                )}`}
              >
                {u.suggested_action}
              </span>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4 mt-5">

              <div className="bg-gray-100 p-3 rounded">
                <p className="text-sm text-gray-500">
                  Violations
                </p>

                <p className="text-2xl font-bold">
                  {u.violations.length}
                </p>
              </div>

              <div className="bg-gray-100 p-3 rounded">
                <p className="text-sm text-gray-500">
                  Total Score
                </p>

                <p className="text-2xl font-bold">
                  {u.total_score}
                </p>
              </div>

              <div className="bg-gray-100 p-3 rounded">
                <p className="text-sm text-gray-500">
                  Account Status
                </p>

                <p className="text-2xl font-bold">
                  {u.user.account_status}
                </p>
              </div>
            </div>

            {/* VIOLATIONS */}
            <div className="mt-5">

              <h3 className="font-semibold mb-3">
                Violations
              </h3>

              {u.violations.map((v) => (

                <div
                  key={v._id}
                  className="border rounded p-3 mb-2"
                >
                  <div className="flex justify-between">

                    <p className="font-semibold">
                      {v.violation_type}
                    </p>

                    <span className="text-sm">
                      {v.severity}
                    </span>
                  </div>

                  <p className="text-sm mt-1">
                    {v.reason}
                  </p>
                </div>
              ))}
            </div>

            {/* ACTIONS */}
            {u.user.account_status !== "BANNED" && (
              <div className="mt-5">

                <button
                  onClick={() =>
                    navigate(
                      `/super-admin/create-ban/${u.violations[0]._id}`
                    )
                  }
                  className="bg-red-500 text-white px-5 py-2 rounded"
                >
                  Create Ban
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </SuperAdminLayout>
  );
};

export default ViolationManagement;