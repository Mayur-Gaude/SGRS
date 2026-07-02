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
      <div className="space-y-8 w-full">

        {/* PAGE TITLE */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Violation Management
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor user violations and manage account restrictions
          </p>
        </div>

        {/* USERS VIOLATIONS LIST */}
        <div className="space-y-6">
          {users.map((u) => (
            <div
              key={u.user._id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            >

              {/* HEADER SECTION */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {u.user.full_name}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {u.user.email}
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${getActionColor(
                    u.suggested_action.action
                  )}`}
                >
                  {u.suggested_action.action}
                  {u.suggested_action.duration ? ` (${u.suggested_action.duration} days)` : ""}
                </span>
              </div>

              {/* CONTENT SECTION */}
              <div className="p-6 space-y-6">

                {/* STATS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      Violations
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {u.violations.length}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      Total Score
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {u.total_score}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                      Account Status
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {u.user.account_status}
                    </p>
                  </div>
                </div>

                {/* VIOLATIONS TABLE */}
                {u.violations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                      Violation History
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                              Type
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                              Severity
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                              Reason
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {u.violations.map((v) => (
                            <tr
                              key={v._id}
                              className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 last:border-b-0"
                            >
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {v.violation_type}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
                                  {v.severity}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {v.reason}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ACTION BUTTON */}
                {u.user.account_status !== "BANNED" && (
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() =>
                        navigate(
                          `/super-admin/create-ban/${u.violations[0]._id}`
                        )
                      }
                      className="bg-blue-400 hover:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-150"
                    >
                      Create Ban
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No users with violations found</p>
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
};

export default ViolationManagement;