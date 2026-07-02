import React from "react";
import Constants from "expo-constants";
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

type IdRef = string | { _id?: string; id?: string; name?: string; full_name?: string };

type Media = {
  _id?: string;
  media_type?: string;
  media_url?: string;
  uploaded_by?: any;
};

type Timeline = {
  action?: string;
  description?: string;
  timestamp?: string;
};

type Complaint = {
  _id?: string;
  id?: string;
  complaint_number?: string;
  title?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updated_at?: string;
  email?: string;
  phone?: string;
  citizen_name?: string;
  area_name?: string;
  department_name?: string;
  category_name?: string;
  priority?: string;
  media?: Media[];
  timeline?: Timeline[];
  user_id?: IdRef;
  area_id?: IdRef;
  department_id?: IdRef;
  category_id?: IdRef;
};

const getBaseUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  const configUrl = (Constants.expoConfig as any)?.extra?.apiUrl || (Constants.manifest as any)?.extra?.apiUrl;
  const url = envUrl || configUrl || "";
  return url.replace(/\/$/, "");
};

const getName = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.name || value.full_name || "";
};

const toMediaUrl = (value?: string) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value) || value.startsWith("data:") || value.startsWith("file:")) {
    return value;
  }
  let normalized = value.replace(/\\/g, "/").replace(/^\/+/, "");
  const uploadsPos = normalized.toLowerCase().indexOf("uploads/");
  if (uploadsPos >= 0) {
    normalized = normalized.slice(uploadsPos);
  }
  const encoded = encodeURI(normalized);
  const base = getBaseUrl();
  return base ? `${base}/${encoded}` : encoded;
};

interface AdminComplaintDetailModalProps {
  visible: boolean;
  selectedComplaint: Complaint | null;
  onClose: () => void;
  statusOptions: string[];
  updatingStatus: boolean;
  onStatusUpdate: (status: string) => void;
}

const AdminComplaintDetailModal: React.FC<AdminComplaintDetailModalProps> = ({
  visible,
  selectedComplaint,
  onClose,
  statusOptions,
  updatingStatus,
  onStatusUpdate,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f9fafb" }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#e5e7eb",
            backgroundColor: "#fff",
          }}
        >
          <View>
            <Text style={{ fontSize: 14, color: "#666", fontWeight: "500" }}>
              Complaint #{selectedComplaint?.complaint_number || "N/A"}
            </Text>
            <Text
              style={{
                fontSize: 18,
                color: "#000",
                fontWeight: "700",
                marginTop: 4,
              }}
            >
              {selectedComplaint?.title || "No Title"}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Text style={{ fontSize: 24, color: "#666", fontWeight: "300" }}>
              ✕
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 12 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Description */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 13,
                color: "#666",
                fontWeight: "600",
                marginBottom: 6,
              }}
            >
              DESCRIPTION
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#333",
                lineHeight: 20,
              }}
            >
              {selectedComplaint?.description || "No description provided"}
            </Text>
          </View>

          {/* Media Gallery */}
          {selectedComplaint?.media && selectedComplaint.media.length > 0 && (
            <View
              style={{
                backgroundColor: "#fff",
                padding: 12,
                borderRadius: 8,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: "#e5e7eb",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: "#666",
                  fontWeight: "600",
                  marginBottom: 10,
                }}
              >
                MEDIA ({selectedComplaint.media.length})
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -12 }}>
                {selectedComplaint.media.map((item, idx) => (
                  <View
                    key={item._id || idx}
                    style={{ marginRight: 8, marginLeft: idx === 0 ? 0 : 0 }}
                  >
                    {item.media_type === "PHOTO" || !item.media_type ? (
                      <Image
                        source={{ uri: toMediaUrl(item.media_url) }}
                        style={{
                          width: 140,
                          height: 140,
                          borderRadius: 8,
                          backgroundColor: "#e5e7eb",
                        }}
                        resizeMode="cover"
                      />
                    ) : item.media_type === "VIDEO" ? (
                      <View
                        style={{
                          width: 140,
                          height: 140,
                          borderRadius: 8,
                          backgroundColor: "#000",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: "#fff", fontSize: 10 }}>VIDEO</Text>
                      </View>
                    ) : (
                      <View
                        style={{
                          width: 140,
                          height: 140,
                          borderRadius: 8,
                          backgroundColor: "#f3f4f6",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: "#666", fontSize: 10 }}>DOCUMENT</Text>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Citizen Info */}
          <View
            style={{
              backgroundColor: "#fff",
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: "#e5e7eb",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: "#666",
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              CITIZEN INFORMATION
            </Text>
            <View style={{ marginBottom: 6 }}>
              <Text style={{ fontSize: 12, color: "#888" }}>Name</Text>
              <Text style={{ fontSize: 14, color: "#000", fontWeight: "500" }}>
                {selectedComplaint?.citizen_name || getName(selectedComplaint?.user_id) || "Unknown"}
              </Text>
            </View>
            {(selectedComplaint?.email || (selectedComplaint?.user_id as any)?.email) && (
              <View style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 12, color: "#888" }}>Email</Text>
                <Text style={{ fontSize: 14, color: "#0066cc" }}>
                  {selectedComplaint?.email || (selectedComplaint?.user_id as any)?.email}
                </Text>
              </View>
            )}
            {(selectedComplaint?.phone || (selectedComplaint?.user_id as any)?.phone) && (
              <View>
                <Text style={{ fontSize: 12, color: "#888" }}>Phone</Text>
                <Text style={{ fontSize: 14, color: "#000" }}>
                  {selectedComplaint?.phone || (selectedComplaint?.user_id as any)?.phone}
                </Text>
              </View>
            )}
          </View>

          {/* Complaint Details */}
          <View
            style={{
              backgroundColor: "#fff",
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: "#e5e7eb",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: "#666",
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              COMPLAINT DETAILS
            </Text>
            <View
              style={{
                marginBottom: 8,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: "#888" }}>Area</Text>
                <Text style={{ fontSize: 14, color: "#000", fontWeight: "500" }}>
                  {selectedComplaint?.area_name || getName(selectedComplaint?.area_id) || "N/A"}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontSize: 12, color: "#888" }}>Department</Text>
                <Text style={{ fontSize: 14, color: "#000", fontWeight: "500" }}>
                  {selectedComplaint?.department_name || getName(selectedComplaint?.department_id) || "N/A"}
                </Text>
              </View>
            </View>
            <View
              style={{
                marginBottom: 8,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: "#888" }}>Category</Text>
                <Text style={{ fontSize: 14, color: "#000", fontWeight: "500" }}>
                  {selectedComplaint?.category_name || getName(selectedComplaint?.category_id) || "N/A"}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontSize: 12, color: "#888" }}>Priority</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 2,
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor:
                        selectedComplaint?.priority === "CRITICAL"
                          ? "#ef4444"
                          : selectedComplaint?.priority === "HIGH"
                          ? "#f97316"
                          : "#fbbf24",
                      marginRight: 6,
                    }}
                  />
                  <Text style={{ fontSize: 14, color: "#000", fontWeight: "500" }}>
                    {selectedComplaint?.priority || "NORMAL"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Status & Timeline */}
          <View
            style={{
              backgroundColor: "#fff",
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: "#e5e7eb",
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: "#666",
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              STATUS
            </Text>
            <View
              style={{
                marginBottom: 12,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#e5e7eb",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor:
                      (selectedComplaint?.status || "SUBMITTED").toUpperCase() ===
                      "RESOLVED"
                        ? "#10b981"
                        : (selectedComplaint?.status || "SUBMITTED").toUpperCase() ===
                          "REJECTED"
                        ? "#ef4444"
                        : (selectedComplaint?.status || "SUBMITTED").toUpperCase() ===
                          "IN_PROGRESS"
                        ? "#3b82f6"
                        : (selectedComplaint?.status || "SUBMITTED").toUpperCase() ===
                          "UNDER_REVIEW"
                        ? "#fbbf24"
                        : "#6b7280",
                    marginRight: 8,
                  }}
                />
                <Text style={{ fontSize: 14, color: "#000", fontWeight: "600" }}>
                  {(selectedComplaint?.status || "SUBMITTED").toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Dates */}
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 12, color: "#888" }}>Created</Text>
              <Text style={{ fontSize: 13, color: "#333" }}>
                {selectedComplaint?.createdAt
                  ? new Date(selectedComplaint.createdAt).toLocaleString()
                  : "N/A"}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 12, color: "#888" }}>Last Updated</Text>
              <Text style={{ fontSize: 13, color: "#333" }}>
                {selectedComplaint?.updated_at
                  ? new Date(selectedComplaint.updated_at).toLocaleString()
                  : selectedComplaint?.createdAt
                  ? new Date(selectedComplaint.createdAt).toLocaleString()
                  : "N/A"}
              </Text>
            </View>
          </View>

          {/* Timeline */}
          {selectedComplaint?.timeline && selectedComplaint.timeline.length > 0 && (
            <View
              style={{
                backgroundColor: "#fff",
                padding: 12,
                borderRadius: 8,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: "#e5e7eb",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: "#666",
                  fontWeight: "600",
                  marginBottom: 8,
                }}
              >
                ACTIVITY TIMELINE
              </Text>
              {selectedComplaint.timeline.map((entry, idx) => (
                <View
                  key={idx}
                  style={{
                    marginBottom: 10,
                    paddingBottom: 10,
                    borderBottomWidth:
                      selectedComplaint.timeline && idx < selectedComplaint.timeline.length - 1 ? 1 : 0,
                    borderBottomColor: "#e5e7eb",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: "#3b82f6",
                        marginRight: 8,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#000",
                        fontWeight: "600",
                      }}
                    >
                      {entry.action || "ACTION"}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#666",
                      marginLeft: 14,
                    }}
                  >
                    {entry.description || ""}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#999",
                      marginLeft: 14,
                      marginTop: 2,
                    }}
                  >
                    {entry.timestamp
                      ? new Date(entry.timestamp).toLocaleString()
                      : ""}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Status Update Buttons - Footer */}
        <View
          style={{
            backgroundColor: "#fff",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: "#e5e7eb",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: "#666",
              fontWeight: "600",
              marginBottom: 10,
            }}
          >
            UPDATE STATUS
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
            {statusOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => onStatusUpdate(opt)}
                disabled={updatingStatus}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 6,
                  backgroundColor:
                    opt === "UNDER_REVIEW"
                      ? "#fbbf24"
                      : opt === "IN_PROGRESS"
                      ? "#3b82f6"
                      : opt === "RESOLVED"
                      ? "#10b981"
                      : "#ef4444",
                  opacity: updatingStatus ? 0.6 : 1,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "600",
                    fontSize: 11,
                    textAlign: "center",
                  }}
                >
                  {opt === "UNDER_REVIEW"
                    ? "Under\nReview"
                    : opt === "IN_PROGRESS"
                    ? "In\nProgress"
                    : opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AdminComplaintDetailModal;

