// import { useEffect, useState } from "react";
// import { getUserComplaints } from "../../api/complaint.api";
// import UserLayout from "../../components/layout/UserLayout";
// import { useNavigate } from "react-router-dom";

// const Complaints = () => {
//   const [complaints, setComplaints] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetch = async () => {
//       const res = await getUserComplaints();
//       setComplaints(res.data.data);
//     };

//     fetch();
//   }, []);

//   return (
//     <UserLayout>
//       <div className="p-6">
//         <h2 className="text-xl mb-4">My Complaints</h2>

//         {complaints.map((c) => (
//           <div
//             key={c._id}
//             onClick={() => navigate(`/user/complaints/${c._id}`)}
//             className="bg-white p-4 shadow rounded mb-3 cursor-pointer hover:shadow-lg transition"
//           >
//             <div className="flex justify-between">
//               <h3 className="font-bold">{c.title}</h3>

//               <span
//                 className={`text-xs px-2 py-1 rounded ${
//                   c.status === "RESOLVED"
//                     ? "bg-green-200"
//                     : c.status === "IN_PROGRESS"
//                     ? "bg-yellow-200"
//                     : c.status === "REJECTED"
//                     ? "bg-red-200"
//                     : "bg-gray-200"
//                 }`}
//               >
//                 {c.status}
//               </span>
//             </div>

//             <p className="text-sm mt-1">{c.description}</p>

//             <p className="text-xs mt-2">
//               Category: {c.category_id?.name}
//             </p>
//           </div>
//         ))}
//       </div>
//     </UserLayout>
//   );
// };

// export default Complaints;

import { useEffect, useState } from "react";
import { getUserComplaints } from "../../api/complaint.api";
import UserLayout from "../../components/layout/UserLayout";
import { useNavigate } from "react-router-dom";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const res = await getUserComplaints();
      setComplaints(res.data.data);
    };
    fetch();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-200";
      case "IN_PROGRESS":
        return "bg-yellow-200";
      case "REOPEN_REQUESTED":
        return "bg-orange-200";
      case "REJECTED":
        return "bg-red-200";
      case "CLOSED":
        return "bg-gray-300";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <UserLayout>
      <div className="p-6">
        <h2 className="text-xl mb-4">My Complaints</h2>

        {complaints.map((c) => (
          <div
            key={c._id}
            onClick={() => navigate(`/user/complaints/${c._id}`)}
            className="bg-white p-4 shadow rounded mb-3 cursor-pointer hover:shadow-lg"
          >
            <div className="flex justify-between">
              <h3 className="font-bold">{c.title}</h3>

              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(c.status)}`}>
                {c.status}
              </span>
            </div>

            <p className="text-sm mt-1">{c.description}</p>
            <p className="text-xs mt-2">Category: {c.category_id?.name}</p>
          </div>
        ))}
      </div>
    </UserLayout>
  );
};

export default Complaints;