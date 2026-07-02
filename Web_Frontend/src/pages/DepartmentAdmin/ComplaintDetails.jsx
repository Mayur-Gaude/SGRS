
import { useEffect, useState } from "react";
import {
  getComplaintDetails,
  updateComplaintStatus,
  addRemark,
  resolveComplaint,
} from "../../api/complaint.api";

import { useParams, useNavigate } from "react-router-dom";
import DeptAdminLayout from "../../components/layout/DeptAdminLayout";

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const [remark, setRemark] = useState("");
  const [resolution, setResolution] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const fetchComplaint = async () => {
    const res = await getComplaintDetails(id);
    setData(res.data.data);
  };

  useEffect(() => {
    fetchComplaint();
  }, []);

  if (!data) {
    return (
      <DeptAdminLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600 text-lg">Loading complaint details...</p>
        </div>
      </DeptAdminLayout>
    );
  }

  const { complaint, timeline } = data;

  const getStatusColor = (status) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-100 text-green-800 border-green-300";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-300";
      case "IN_PROGRESS":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "REOPEN_REQUESTED":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getNextStatuses = (status) => {
    switch (status) {
      case "SUBMITTED":
      case "REOPENED":
        return ["UNDER_REVIEW"];

      case "UNDER_REVIEW":
        return ["IN_PROGRESS"];

      case "IN_PROGRESS":
        return ["RESOLVED"];

      default:
        return [];
    }
  };

  return (
    <DeptAdminLayout>
      <div className="space-y-6 w-full">
        
        {/* HEADER */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 pr-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {complaint.title}
              </h1>
              <p className="text-gray-600">Complaint ID: #{complaint.complaint_number}</p>
            </div>

            <span className={`px-4 py-2 rounded-lg text-sm font-semibold border whitespace-nowrap ${getStatusColor(complaint.status)}`}>
              {complaint.status.replace("_", " ")}
            </span>
          </div>

          <p className="text-gray-700 text-base leading-relaxed mb-6">
            {complaint.description}
          </p>

          {/* Complaint Meta */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-gray-600 text-xs font-medium uppercase tracking-wide mb-1">Priority</p>
              <p className="text-gray-900 font-semibold">{complaint.priority}</p>
            </div>

            <div>
              <p className="text-gray-600 text-xs font-medium uppercase tracking-wide mb-1">Risk Level</p>
              <p className="text-gray-900 font-semibold">{complaint.risk_level}</p>
            </div>

            <div>
              <p className="text-gray-600 text-xs font-medium uppercase tracking-wide mb-1">Risk Score</p>
              <p className="text-gray-900 font-semibold">{complaint.risk_score}</p>
            </div>

            <div>
              <p className="text-gray-600 text-xs font-medium uppercase tracking-wide mb-1">Pincode</p>
              <p className="text-gray-900 font-semibold">{complaint.pincode}</p>
            </div>

            <div>
              <p className="text-gray-600 text-xs font-medium uppercase tracking-wide mb-1">Risk Reason</p>
              <p className="text-gray-900 font-semibold">{complaint.risk_reasons}</p>
            </div>
          </div>
        </div>

        {/* STATUS ACTIONS */}
        {getNextStatuses(complaint.status).length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h2>

            <div className="flex gap-3 flex-wrap">
              {getNextStatuses(complaint.status).map((s) => (
                <button
                  key={s}
                  onClick={async () => {
                    await updateComplaintStatus(id, s);
                    fetchComplaint();
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  Move to {s.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reject Complaint */}
        {complaint.status === "UNDER_REVIEW" && (
          <div className="bg-white border border-red-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-red-900 mb-4">Reject Complaint</h2>

            <textarea
              placeholder="Provide reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows="4"
            />

            <button
              onClick={async () => {
                if (!rejectReason) {
                  return alert("Rejection reason required");
                }

                await updateComplaintStatus(
                  complaint._id,
                  "REJECTED",
                  rejectReason
                );

                fetchComplaint();
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 mt-4"
            >
              Reject Complaint
            </button>
          </div>
        )}

        {/* CREATE VIOLATION */}
        {complaint.status === "REJECTED" && (
          <div className="bg-white border border-orange-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-orange-900 mb-2">Complaint Rejected</h2>

            <p className="text-orange-700 text-sm mb-4">
              <span className="font-semibold">Reason:</span> {complaint.rejection_reason}
            </p>

            <button
              onClick={() =>
                navigate(`/dept-admin/violations/${complaint._id}`)
              }
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Create Violation
            </button>
          </div>
        )}

        {/* REMARK */}
        {complaint.status !== "RESOLVED" && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Remark</h2>

            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter your remark here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows="4"
            />

            <button
              onClick={async () => {
                await addRemark(id, remark);
                setRemark("");
                fetchComplaint();
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 mt-4"
            >
              Add Remark
            </button>
          </div>
        )}

        {/* RESOLVE */}
        {complaint.status === "IN_PROGRESS" && (
          <div className="bg-white border border-green-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-green-900 mb-4">Resolve Complaint</h2>

            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Enter resolution details..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              rows="4"
            />

            <button
              onClick={async () => {
                await resolveComplaint(id, resolution);
                fetchComplaint();
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 mt-4"
            >
              Resolve Complaint
            </button>
          </div>
        )}

        {/* TIMELINE */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Activity Timeline</h2>

          <div className="space-y-0">
            {timeline.map((t, index) => (
              <div key={t._id} className="relative pb-6 last:pb-0">
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
                    <p className="font-semibold text-gray-900">{t.action}</p>
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