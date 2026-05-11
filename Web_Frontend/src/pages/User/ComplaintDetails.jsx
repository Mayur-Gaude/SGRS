// import { useEffect, useState } from "react";
// import {
//   getComplaintById,
//   submitFeedback,
//   requestReopen,
// } from "../../api/complaint.api";
// import { useParams } from "react-router-dom";
// import UserLayout from "../../components/layout/UserLayout";

// const UserComplaintDetails = () => {
//   const { id } = useParams();

//   const [complaint, setComplaint] = useState(null);
//   const [timeline, setTimeline] = useState([]);

//   const [reopenReason, setReopenReason] = useState("");
//   const [feedback, setFeedback] = useState({
//     rating: 5,
//     comment: "",
//   });

//   const fetch = async () => {
//     const res = await getComplaintById(id);
//     setComplaint(res.data.data.complaint);
//     setTimeline(res.data.data.timeline);
//   };

//   useEffect(() => {
//     fetch();
//   }, []);

//   if (!complaint) return <p>Loading...</p>;

//   return (
//     <UserLayout>
//       <div className="p-6 bg-white shadow rounded">
//         <h2 className="text-xl font-bold">{complaint.title}</h2>

//         <p>{complaint.description}</p>
//         <p>Status: {complaint.status}</p>

//         {/* 🔁 REOPEN */}
//         {["RESOLVED", "CLOSED"].includes(complaint.status) && (
//           <div className="mt-4">
//             <h3>Request Reopen</h3>

//             <input
//               value={reopenReason}
//               onChange={(e) => setReopenReason(e.target.value)}
//               placeholder="Reason"
//               className="border p-2 w-full"
//             />

//             <button
//               onClick={async () => {
//                 await requestReopen(id, reopenReason);
//                 alert("Reopen requested");
//               }}
//               className="bg-orange-500 text-white px-3 mt-2"
//             >
//               Request
//             </button>
//           </div>
//         )}

//         {/* ⭐ FEEDBACK */}
//         {complaint.status === "RESOLVED" && (
//           <div className="mt-4">
//             <h3>Give Feedback</h3>

//             <select
//               value={feedback.rating}
//               onChange={(e) =>
//                 setFeedback({
//                   ...feedback,
//                   rating: Number(e.target.value),
//                 })
//               }
//               className="border p-2 w-full mb-2"
//             >
//               <option value={5}>⭐⭐⭐⭐⭐</option>
//               <option value={4}>⭐⭐⭐⭐</option>
//               <option value={3}>⭐⭐⭐</option>
//               <option value={2}>⭐⭐</option>
//               <option value={1}>⭐</option>
//             </select>

//             <textarea
//               value={feedback.comment}
//               onChange={(e) =>
//                 setFeedback({
//                   ...feedback,
//                   comment: e.target.value,
//                 })
//               }
//               className="border p-2 w-full mb-2"
//             />

//             <button
//               onClick={async () => {
//                 await submitFeedback(id, feedback);
//                 alert("Feedback submitted");
//               }}
//               className="bg-blue-500 text-white px-3"
//             >
//               Submit
//             </button>
//           </div>
//         )}

//         {/* 🕒 TIMELINE */}
//         <div className="mt-4">
//           <h3>Timeline</h3>

//           {timeline.map((t) => (
//             <div key={t._id} className="border p-2 mb-1">
//               <p>{t.action}</p>
//               <p>{t.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </UserLayout>
//   );
// };

// export default UserComplaintDetails;

import { useEffect, useState } from "react";
import {
  getComplaintDetails,
  submitFeedback,
  requestReopen,
} from "../../api/complaint.api";

import { useParams } from "react-router-dom";
import UserLayout from "../../components/layout/UserLayout";

const ComplaintDetails = () => {
  const { id } = useParams();

  const [data, setData] = useState(null);

  const [reopenReason, setReopenReason] = useState("");

  const [feedback, setFeedback] = useState({
    rating: 5,
    comment: "",
  });

  const fetchComplaint = async () => {
    try {
      const res = await getComplaintDetails(id);
      setData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, []);

  if (!data) {
    return (
      <UserLayout>
        <p className="p-6">Loading...</p>
      </UserLayout>
    );
  }

  const { complaint, timeline } = data;

  const canGiveFeedback =
    complaint.status === "RESOLVED" &&
    !complaint.feedback_submitted;

  const canReopen =
    ["RESOLVED", "CLOSED"].includes(complaint.status) &&
    complaint.status !== "REOPEN_REQUESTED";

  const getStatusColor = (status) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-200 text-green-800";

      case "REJECTED":
        return "bg-red-200 text-red-800";

      case "IN_PROGRESS":
        return "bg-yellow-200 text-yellow-800";

      case "REOPEN_REQUESTED":
        return "bg-orange-200 text-orange-800";

      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <UserLayout>
      <div className="p-6">

        {/* HEADER */}
        <div className="bg-white shadow rounded p-5">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {complaint.title}
            </h1>

            <span
              className={`px-3 py-1 rounded text-sm ${getStatusColor(
                complaint.status
              )}`}
            >
              {complaint.status}
            </span>
          </div>

          <p className="mt-4 text-gray-700">
            {complaint.description}
          </p>

          {/* Complaint Info */}
          <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
            <p>
              <span className="font-semibold">
                Complaint Number:
              </span>{" "}
              {complaint.complaint_number}
            </p>

            <p>
              <span className="font-semibold">
                Priority:
              </span>{" "}
              {complaint.priority}
            </p>

            <p>
              <span className="font-semibold">
                Pincode:
              </span>{" "}
              {complaint.pincode}
            </p>

            <p>
              <span className="font-semibold">
                Reopen Count:
              </span>{" "}
              {complaint.reopen_count || 0}
            </p>
          </div>
        </div>

        {/* REJECTION */}
        {complaint.status === "REJECTED" && (
          <div className="bg-red-100 p-5 rounded shadow mt-5">
            <h2 className="font-bold text-red-700">
              Complaint Rejected
            </h2>

            <p className="mt-2">
              {complaint.rejection_reason}
            </p>
          </div>
        )}

        {/* REOPEN PENDING */}
        {complaint.status === "REOPEN_REQUESTED" && (
          <div className="bg-orange-100 p-5 rounded shadow mt-5">
            <h2 className="font-bold text-orange-700">
              Reopen Request Pending
            </h2>

            <p className="mt-2">
              Admin is reviewing your reopen request.
            </p>
          </div>
        )}

        {/* FEEDBACK */}
        {canGiveFeedback && (
          <div className="bg-white shadow rounded p-5 mt-5">
            <h2 className="font-semibold mb-3">
              Submit Feedback
            </h2>

            <select
              value={feedback.rating}
              onChange={(e) =>
                setFeedback({
                  ...feedback,
                  rating: Number(e.target.value),
                })
              }
              className="border p-3 rounded w-full mb-3"
            >
              <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
              <option value={4}>⭐⭐⭐⭐ Good</option>
              <option value={3}>⭐⭐⭐ Average</option>
              <option value={2}>⭐⭐ Poor</option>
              <option value={1}>⭐ Very Poor</option>
            </select>

            <textarea
              placeholder="Write feedback"
              value={feedback.comment}
              onChange={(e) =>
                setFeedback({
                  ...feedback,
                  comment: e.target.value,
                })
              }
              className="border p-3 rounded w-full"
            />

            <button
              onClick={async () => {
                await submitFeedback(id, feedback);

                alert("Feedback submitted");

                fetchComplaint();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Submit Feedback
            </button>
          </div>
        )}

        {/* FEEDBACK SUBMITTED */}
        {complaint.feedback_submitted && (
          <div className="bg-green-100 p-5 rounded shadow mt-5">
            <h2 className="font-semibold text-green-700">
              Feedback Submitted
            </h2>

            <p className="mt-2">
              Complaint successfully closed.
            </p>
          </div>
        )}

        {/* REOPEN */}
        {canReopen && (
          <div className="bg-white shadow rounded p-5 mt-5">
            <h2 className="font-semibold text-orange-600">
              Request Reopen
            </h2>

            <textarea
              placeholder="Reason for reopening"
              value={reopenReason}
              onChange={(e) =>
                setReopenReason(e.target.value)
              }
              className="border p-3 rounded w-full mt-3"
            />

            <button
              onClick={async () => {
                if (!reopenReason) {
                  return alert("Reason required");
                }

                await requestReopen(id, reopenReason);

                alert("Reopen requested");

                fetchComplaint();
              }}
              className="bg-orange-500 text-white px-4 py-2 rounded mt-4"
            >
              Request Reopen
            </button>
          </div>
        )}

        {/* TIMELINE */}
        <div className="bg-white shadow rounded p-5 mt-5">
          <h2 className="font-semibold mb-4">
            Complaint Timeline
          </h2>

          {timeline.map((t) => (
            <div
              key={t._id}
              className="border-l-4 border-blue-500 pl-4 mb-4"
            >
              <p className="font-semibold">
                {t.action}
              </p>

              <p className="text-sm text-gray-600">
                {t.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
};

export default ComplaintDetails;