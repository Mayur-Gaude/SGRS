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

  const fetch = async () => {
    const res = await getReopenRequests();
    setRequests(res.data.data);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <DeptAdminLayout>
      <h2 className="text-xl mb-4">Reopen Requests</h2>

      {requests.map((r) => (
        <div key={r._id} className="bg-white p-4 shadow mb-3">
          <p className="font-bold">{r.complaint_id?.title}</p>
          <p>User: {r.user_id?.full_name}</p>
          <p>Reason: {r.reason}</p>

          <div className="flex gap-2 mt-2">
            <button
              onClick={async () => {
                await reviewReopen(r._id, "APPROVED");
                fetch();
              }}
              className="bg-green-500 text-white px-3"
            >
              Approve
            </button>

            <button
              onClick={async () => {
                await reviewReopen(r._id, "REJECTED");
                fetch();
              }}
              className="bg-red-500 text-white px-3"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </DeptAdminLayout>
  );
};

export default ReopenRequests;