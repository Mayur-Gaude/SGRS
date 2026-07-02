import { useEffect, useState } from "react";

import {
  getAppeals,
  reviewAppeal,
} from "../../api/violation.api";

import SuperAdminLayout from "../../components/layout/SuperAdminLayout";

const AppealReview = () => {
  const [appeals, setAppeals] = useState([]);

  const fetchAppeals = async () => {
    const res = await getAppeals();
    setAppeals(res.data.data);
  };

  useEffect(() => {
    fetchAppeals();
  }, []);

  return (
    <SuperAdminLayout>
      <div className="space-y-8 w-full">

        {/* PAGE TITLE */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Appeal Reviews
          </h1>
          <p className="text-gray-600 mt-2">
            Review and manage ban appeals from users
          </p>
        </div>

        {/* APPEALS TABLE */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Appeal Reason
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Ban Reason
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Ban Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {appeals.map((a) => (
                  <tr
                    key={a._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 last:border-b-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {a.user_id?.full_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {a.appeal_reason}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {a.ban_id?.ban_reason}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
                        {a.ban_id?.ban_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          a.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : a.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            await reviewAppeal(
                              a._id,
                              "APPROVED"
                            );
                            fetchAppeals();
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-medium transition-colors duration-150"
                        >
                          Approve
                        </button>

                        <button
                          onClick={async () => {
                            await reviewAppeal(
                              a._id,
                              "REJECTED"
                            );
                            fetchAppeals();
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-medium transition-colors duration-150"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {appeals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No appeals to review</p>
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default AppealReview;