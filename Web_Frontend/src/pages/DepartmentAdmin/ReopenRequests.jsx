// import { useEffect, useState } from "react";
// import {
//   getReopenRequests,
//   reviewReopen,
// } from "../../api/complaint.api";
// import DeptAdminLayout from "../../components/layout/DeptAdminLayout";

// const ReopenRequests = () => {
//   const [requests, setRequests] = useState([]);

//   const fetch = async () => {
//     const res = await getReopenRequests();
//     setRequests(res.data.data);
//   };

//   useEffect(() => {
//     fetch();
//   }, []);

//   return (
//     <DeptAdminLayout>
//       <h2 className="text-xl mb-4">Reopen Requests</h2>

//       {requests.map((r) => (
//         <div
//           key={r._id}
//           className="bg-white p-4 shadow mb-3 rounded"
//         >
//           <p className="font-bold">
//             {r.complaint_id?.title}
//           </p>

//           <p className="text-sm">
//             User: {r.user_id?.full_name}
//           </p>

//           <p className="text-sm text-gray-600">
//             Reason: {r.reason}
//           </p>

//           <div className="flex gap-2 mt-3">
//             <button
//               onClick={async () => {
//                 await reviewReopen(r._id, "APPROVED");
//                 fetch();
//               }}
//               className="bg-green-500 text-white px-3 py-1"
//             >
//               Approve
//             </button>

//             <button
//               onClick={async () => {
//                 await reviewReopen(r._id, "REJECTED");
//                 fetch();
//               }}
//               className="bg-red-500 text-white px-3 py-1"
//             >
//               Reject
//             </button>
//           </div>
//         </div>
//       ))}
//     </DeptAdminLayout>
//   );
// };

// export default ReopenRequests;


import { useEffect, useState } from "react";
import {
  getReopenRequests,
  reviewReopen,
} from "../../api/complaint.api";
import DeptAdminLayout from "../../components/layout/DeptAdminLayout";

const ReopenRequests = () => {
  const [requests, setRequests] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);

  const fetch = async () => {
    const res = await getReopenRequests();
    setRequests(res.data.data);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleReview = async (id, status) => {
    setActionLoading(id);
    try {
      await reviewReopen(id, status);
      fetch();
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DeptAdminLayout>
      <div className="space-y-6 w-full">

        {/* Header Section */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Reopen Requests
          </h1>
          <p className="text-gray-600">Review and manage complaint reopen requests</p>
        </div>

        {/* Summary */}
        <div className="text-sm text-gray-600">
          <p>Pending requests: <span className="font-semibold text-gray-900">{requests.length}</span></p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {requests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Complaint</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reason</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr
                      key={r._id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 last:border-b-0"
                    >
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="font-medium text-gray-900 truncate">{r.complaint_id?.title}</p>
                          <p className="text-xs text-gray-600">#{r.complaint_id?.complaint_number}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{r.user_id?.full_name || "N/A"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 max-w-xs truncate">{r.reason}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              await handleReview(r._id, "APPROVED");
                            }}
                            disabled={actionLoading === r._id}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
                          >
                            Approve
                          </button>

                          <button
                            onClick={async () => {
                              await handleReview(r._id, "REJECTED");
                            }}
                            disabled={actionLoading === r._id}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No reopen requests pending</p>
            </div>
          )}
        </div>
      </div>
    </DeptAdminLayout>
  );
};

export default ReopenRequests;