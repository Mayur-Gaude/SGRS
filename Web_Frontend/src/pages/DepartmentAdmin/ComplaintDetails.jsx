import { useEffect, useState } from "react";
import {
  getComplaintDetails,
  updateComplaintStatus,
  addRemark,
  resolveComplaint,
  getComplaintMedia,
} from "../../api/complaint.api";
import { useParams } from "react-router-dom";
import DeptAdminLayout from "../../components/layout/DeptAdminLayout";

const ComplaintDetails = () => {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [remark, setRemark] = useState("");
  const [resolution, setResolution] = useState("");
  const [media, setMedia] = useState([]);
  const [rejectRemark, setRejectRemark] = useState("");

  const fetch = async () => {
    const res = await getComplaintDetails(id);
    setData(res.data.data);

    const mediaRes = await getComplaintMedia(id);
    setMedia(mediaRes.data.data);
  };

  const getNextStatuses = (status) => {
    switch (status) {
      case "SUBMITTED":
        return ["UNDER_REVIEW"];

      case "UNDER_REVIEW":
        return ["IN_PROGRESS", "REJECTED"];

      case "IN_PROGRESS":
        return ["RESOLVED"];

      case "RESOLVED":
        return [];

      default:
        return [];
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-100 text-green-800 border-green-300";
      case "IN_PROGRESS":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-300";
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  if (!data)
    return (
      <DeptAdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-3">⏳</div>
            <p className="text-gray-600 text-lg">Loading complaint details...</p>
          </div>
        </div>
      </DeptAdminLayout>
    );

  const { complaint, timeline } = data;

  return (
    <DeptAdminLayout>
      <div className="space-y-6 w-full">
        {/* Header Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 pr-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {complaint.title}
              </h1>
              <p className="text-gray-600 text-lg mb-4">Complaint ID: #{id}</p>
              <p className="text-gray-700 text-base leading-relaxed">{complaint.description}</p>
            </div>
            <span
              className={`px-6 py-3 rounded-lg font-semibold text-sm border whitespace-nowrap ${getStatusColor(
                complaint.status
              )}`}
            >
              {complaint.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {getNextStatuses(complaint.status).length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">Update Status</h3>
            <div className="flex gap-3 flex-wrap">
              {getNextStatuses(complaint.status).map((status) => (
                <button
                  key={status}
                  onClick={async () => {
                    await updateComplaintStatus(id, status);
                    fetch();
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 text-base"
                >
                  Move to {status.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add Remark Section */}
        {complaint.status !== "RESOLVED" && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">Add Remark</h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter your remark here..."
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
              />
              <button
                onClick={async () => {
                  await addRemark(id, remark);
                  setRemark("");
                  fetch();
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 text-base"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Reject Section */}
        {complaint.status === "UNDER_REVIEW" && (
          <div className="bg-white border border-red-200 rounded-lg p-8 shadow-sm">
            <h3 className="font-semibold text-red-900 mb-4 text-lg">
              Reject Complaint
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Provide reason for rejection..."
                value={rejectRemark}
                onChange={(e) => setRejectRemark(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-base"
              />
              <button
                onClick={async () => {
                  if (!rejectRemark) {
                    alert("Provide rejection reason");
                    return;
                  }

                  await updateComplaintStatus(id, "REJECTED");
                  await addRemark(id, `REJECTED: ${rejectRemark}`);

                  setRejectRemark("");
                  fetch();
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 text-base"
              >
                Reject
              </button>
            </div>
          </div>
        )}

        {/* Resolve Section */}
        {complaint.status === "IN_PROGRESS" && (
          <div className="bg-white border border-green-200 rounded-lg p-8 shadow-sm">
            <h3 className="font-semibold text-green-900 mb-4 text-lg">
              Resolve Complaint
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter resolution remark..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
              />
              <button
                onClick={async () => {
                  await resolveComplaint(id, resolution);
                  setResolution("");
                  fetch();
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 text-base"
              >
                Resolve
              </button>
            </div>
          </div>
        )}

        {/* Media Gallery */}
        {media.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-6 text-lg">Images & Media</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {media.map((m) => (
                <div
                  key={m._id}
                  className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <img
                    src={`http://localhost:5000/${m.media_url}`}
                    alt="Complaint media"
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-6 text-lg">Activity Timeline</h3>
          <div className="space-y-0">
            {timeline.map((t, index) => (
              <div
                key={t._id}
                className="relative pb-8 last:pb-0"
              >
                <div className="flex gap-6">
                  {/* Timeline line */}
                  {index !== timeline.length - 1 && (
                    <div className="absolute left-7 top-14 w-0.5 h-12 bg-gray-300"></div>
                  )}
                  {/* Timeline dot */}
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-indigo-600 rounded-full border-4 border-white mt-2"></div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <p className="font-semibold text-gray-900 text-base">{t.action}</p>
                    <p className="text-gray-600 text-sm mt-1">{t.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DeptAdminLayout>
  );
};

export default ComplaintDetails;