// import { useEffect, useState } from "react";
// import { getAssignedComplaints } from "../../api/complaint.api";
// import { useNavigate } from "react-router-dom";
// import DeptAdminLayout from "../../components/layout/DeptAdminLayout";

// const AssignedComplaints = () => {
//   const [complaints, setComplaints] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetch = async () => {
//       const res = await getAssignedComplaints();
//       setComplaints(res.data.data);
//     };
//     fetch();
//   }, []);

//   return (
//     <DeptAdminLayout>
//       <h2 className="text-xl mb-4">Assigned Complaints</h2>

//       {complaints.map((c) => (
//         <div
//           key={c._id}
//           className="bg-white p-4 shadow rounded mb-3 cursor-pointer"
//           onClick={() =>
//             navigate(`/dept-admin/complaints/${c._id}`)
//           }
//         >
//           <div className="flex justify-between">
//             <h3 className="font-bold">{c.title}</h3>

//             <span className="text-xs bg-blue-200 px-2 rounded">
//               {c.status}
//             </span>
//           </div>

//           <p className="text-sm">{c.description}</p>

//           <p className="text-xs mt-2">
//             Category: {c.category_id?.name}
//           </p>

//           <p className="text-xs">
//             User: {c.user_id?.full_name}
//           </p>
//         </div>
//       ))}
//     </DeptAdminLayout>
//   );
// };

// export default AssignedComplaints;


import { useEffect, useState } from "react";
import { getAssignedComplaints } from "../../api/complaint.api";
import { useNavigate } from "react-router-dom";
import DeptAdminLayout from "../../components/layout/DeptAdminLayout";

const AssignedComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const res = await getAssignedComplaints();
      setComplaints(res.data.data);
    };
    fetch();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-orange-100 text-orange-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DeptAdminLayout>
      <div className="space-y-6 w-full">
        {/* Header Section */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Assigned Complaints</h1>
          <p className="text-gray-600">View and manage all assigned complaints</p>
        </div>

        {/* Summary */}
        <div className="text-sm text-gray-600">
          <p>Total complaints: <span className="font-semibold text-gray-900">{complaints.length}</span></p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {complaints.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr
                      key={c._id}
                      onClick={() => navigate(`/dept-admin/complaints/${c._id}`)}
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors duration-150 last:border-b-0"
                    >
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="font-medium text-gray-900 truncate">{c.title}</p>
                          <p className="text-sm text-gray-600 truncate mt-1">{c.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{c.category_id?.name || "N/A"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{c.user_id?.full_name || "Unknown"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(c.status)}`}>
                          {c.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No complaints assigned yet</p>
            </div>
          )}
        </div>
      </div>
    </DeptAdminLayout>
  );
};

export default AssignedComplaints;