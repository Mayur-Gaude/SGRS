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
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-5">
          Appeal Reviews
        </h1>

        {appeals.map((a) => (
          <div
            key={a._id}
            className="bg-white shadow rounded p-5 mb-4"
          >
            <div className="flex justify-between">
              <h2 className="font-semibold text-lg">
                {a.user_id?.full_name}
              </h2>

              <span className="bg-yellow-200 px-3 py-1 rounded text-sm">
                {a.status}
              </span>
            </div>

            <div className="mt-4 text-sm">
              <p>
                <span className="font-semibold">
                  Appeal Reason:
                </span>{" "}
                {a.appeal_reason}
              </p>

              <p className="mt-2">
                <span className="font-semibold">
                  Ban Reason:
                </span>{" "}
                {a.ban_id?.ban_reason}
              </p>

              <p className="mt-2">
                <span className="font-semibold">
                  Ban Type:
                </span>{" "}
                {a.ban_id?.ban_type}
              </p>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={async () => {
                  await reviewAppeal(
                    a._id,
                    "APPROVED"
                  );

                  fetchAppeals();
                }}
                className="bg-green-500 text-white px-4 py-2 rounded"
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
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </SuperAdminLayout>
  );
};

export default AppealReview;