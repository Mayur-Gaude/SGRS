
import { useEffect, useState } from "react";
import {
  getComplaintDetails,
  updateComplaintStatus,
  addRemark,
  resolveComplaint,
} from "../../api/complaint.api";

import { useParams, useNavigate } from "react-router-dom";
import DeptAdminLayout from "../../components/layout/DeptAdminLayout";

import { PhotoProvider, PhotoView } from "react-photo-view";
import { Eye, ImageIcon } from "lucide-react";

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const [remark, setRemark] = useState("");
  const [resolution, setResolution] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const fetchComplaint = async () => {
    const res = await getComplaintDetails(id);
    // console.log(res.data.data);
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

  const { complaint, timeline, media } = data;

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
      <div className="space-y-8 w-full">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">
              {complaint.title}
            </h1>
            <p className="text-gray-600 text-sm">
              Complaint ID: #{complaint.complaint_number}
            </p>
          </div>

          <span
            className={`inline-flex w-fit px-4 py-2 rounded-full text-sm font-semibold border whitespace-nowrap ${getStatusColor(
              complaint.status
            )}`}
          >
            {complaint.status.replace("_", " ")}
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Complaint Summary
            </h2>
            <p className="text-gray-700 text-base leading-relaxed">
              {complaint.description}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Complaint Evidence
                </h2>
                <p className="text-sm text-gray-500">
                  Uploaded by the complainant
                </p>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                <ImageIcon size={16} />
                {media?.length || 0} Image{media?.length !== 1 ? "s" : ""}
              </div>
            </div>

            {!media || media.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl py-12 text-center bg-gray-50">
                <ImageIcon size={40} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No complaint images uploaded.</p>
              </div>
            ) : (
              <PhotoProvider
                bannerVisible={false}
                maskOpacity={0.9}
                photoClosable
                pullClosable={false}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {media.map((item, index) => (
                    <PhotoView key={item._id} src={item.media_url}>
                      <div className="group cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-xl transition duration-300">
                        <div className="relative overflow-hidden">
                          <img
                            src={item.media_url}
                            alt={`Complaint ${index + 1}`}
                            className="h-56 w-full object-cover group-hover:scale-110 transition duration-500"
                          />

                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition">
                              <div className="bg-white rounded-full p-3 shadow-lg">
                                <Eye size={22} className="text-gray-700" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900">
                            Evidence #{index + 1}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Uploaded by {item.uploaded_by?.full_name || "User"}
                          </p>
                          {item.createdAt && (
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(item.createdAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </PhotoView>
                  ))}
                </div>
              </PhotoProvider>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Complaint Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 text-sm">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-gray-600 text-xs font-medium uppercase tracking-wide mb-1">
                  Priority
                </p>
                <p className="text-gray-900 font-semibold">{complaint.priority}</p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-gray-600 text-xs font-medium uppercase tracking-wide mb-1">
                  Risk Level
                </p>
                <p className="text-gray-900 font-semibold">{complaint.risk_level}</p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-gray-600 text-xs font-medium uppercase tracking-wide mb-1">
                  Risk Score
                </p>
                <p className="text-gray-900 font-semibold">{complaint.risk_score}</p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-gray-600 text-xs font-medium uppercase tracking-wide mb-1">
                  Pincode
                </p>
                <p className="text-gray-900 font-semibold">{complaint.pincode}</p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 sm:col-span-2 xl:col-span-1">
                <p className="text-gray-600 text-xs font-medium uppercase tracking-wide mb-1">
                  Risk Reason
                </p>
                <p className="text-gray-900 font-semibold">{complaint.risk_reasons}</p>
              </div>
            </div>
          </div>
        </div>

        {complaint.status === "RESOLVED" ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm w-full">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Activity Timeline
            </h2>

            <div className="space-y-0">
              {timeline.map((t, index) => (
                <div key={t._id} className="relative pb-6 last:pb-0">
                  <div className="flex gap-6">
                    {index !== timeline.length - 1 && (
                      <div className="absolute left-7 top-14 w-0.5 h-12 bg-gray-300"></div>
                    )}
                    <div className="relative z-10">
                      <div className="w-4 h-4 bg-indigo-600 rounded-full border-4 border-white mt-2"></div>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-semibold text-gray-900">{t.action}</p>
                      <p className="text-gray-600 text-sm mt-1">{t.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,7fr)_minmax(320px,3fr)] gap-8 items-start">
            <div className="space-y-8">
            {getNextStatuses(complaint.status).length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Update Status
                </h2>

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

            {complaint.status === "UNDER_REVIEW" && (
              <div className="bg-white border border-red-200 rounded-lg p-8 shadow-sm">
                <h2 className="text-lg font-semibold text-red-900 mb-4">
                  Reject Complaint
                </h2>

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

            {complaint.status === "REJECTED" && (
              <div className="bg-white border border-orange-200 rounded-lg p-8 shadow-sm">
                <h2 className="text-lg font-semibold text-orange-900 mb-2">
                  Complaint Rejected
                </h2>

                <p className="text-orange-700 text-sm mb-4">
                  <span className="font-semibold">Reason:</span>{" "}
                  {complaint.rejection_reason}
                </p>

                <button
                  onClick={() => navigate(`/dept-admin/violations/${complaint._id}`)}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200"
                >
                  Create Violation
                </button>
              </div>
            )}

            {complaint.status !== "RESOLVED" && (
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Add Remark
                </h2>

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

            {complaint.status === "IN_PROGRESS" && (
              <div className="bg-white border border-green-200 rounded-lg p-8 shadow-sm">
                <h2 className="text-lg font-semibold text-green-900 mb-4">
                  Resolve Complaint
                </h2>

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
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm h-fit">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Activity Timeline
              </h2>

              <div className="space-y-0">
                {timeline.map((t, index) => (
                  <div key={t._id} className="relative pb-6 last:pb-0">
                    <div className="flex gap-6">
                      {index !== timeline.length - 1 && (
                        <div className="absolute left-7 top-14 w-0.5 h-12 bg-gray-300"></div>
                      )}
                      <div className="relative z-10">
                        <div className="w-4 h-4 bg-indigo-600 rounded-full border-4 border-white mt-2"></div>
                      </div>
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
        )}
      </div>
    </DeptAdminLayout>
  );
};

export default ComplaintDetails;