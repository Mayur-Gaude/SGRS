
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AdminStatsCarousel from "../../components/AdminStatsCarrousel";
import { getComplaints } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";

type IdRef = string | { _id?: string; id?: string; name?: string; full_name?: string };

type Complaint = {
  _id?: string;
  id?: string;
  complaint_number?: string;
  title?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  user_id?: IdRef;
  area_id?: IdRef;
  department_id?: IdRef;
  category_id?: IdRef;
};

const normalizeList = <T,>(res: any): T[] => {
  if (Array.isArray(res)) return res as T[];
  if (Array.isArray(res?.data)) return res.data as T[];
  if (Array.isArray(res?.items)) return res.items as T[];
  return [];
};

const getName = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.name || value.full_name || "";
};

export default function AdminDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const authToken = useAuthStore((state) => state.token) || undefined;

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [loadingComplaints, setLoadingComplaints] = useState(false);

  const tags = ["All", "SUBMITTED", "UNDER_REVIEW", "RESOLVED", "REJECTED", "CLOSED"];
  const tagLabel: Record<string, string> = {
    All: "All",
    SUBMITTED: "Submitted",
    UNDER_REVIEW: "Under Review",
    RESOLVED: "Resolved",
    REJECTED: "Rejected",
    CLOSED: "Closed",
  };

  const loadComplaints = useCallback(async () => {
    if (!authToken) return;

    setLoadingComplaints(true);
    try {
      const complaintsRes = await getComplaints(authToken);
      setComplaints(normalizeList<Complaint>(complaintsRes));
    } catch (e: any) {
      Alert.alert("Unable to load complaints", e?.message || "Could not fetch complaint list.");
      setComplaints([]);
    } finally {
      setLoadingComplaints(false);
    }
  }, [authToken]);

  useFocusEffect(
    useCallback(() => {
      loadComplaints();
    }, [loadComplaints])
  );

  const filteredComplaints = useMemo(() => {
    const q = search.trim().toLowerCase();
    return complaints.filter((c) => {
      const statusMatch = activeTag === "All" || (c.status || "").toUpperCase() === activeTag;
      const titleMatch = (c.title || "").toLowerCase().includes(q);
      const numberMatch = (c.complaint_number || "").toLowerCase().includes(q);
      return statusMatch && (!q || titleMatch || numberMatch);
    });
  }, [complaints, activeTag, search]);

  const statsData: {
    id: string;
    title: string;
    value: number;
    icon: keyof typeof Feather.glyphMap;
    color: string;
  }[] = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => {
      const status = (c.status || "").toUpperCase();
      return status === "SUBMITTED" || status === "UNDER_REVIEW";
    }).length;
    const resolved = complaints.filter((c) => (c.status || "").toUpperCase() === "RESOLVED").length;
    const rejected = complaints.filter((c) => (c.status || "").toUpperCase() === "REJECTED").length;

    return [
      { id: "1", title: "Total", value: total, icon: "file-text", color: "#2563eb" },
      { id: "2", title: "Pending", value: pending, icon: "clock", color: "#f59e0b" },
      { id: "3", title: "Resolved", value: resolved, icon: "check-circle", color: "#16a34a" },
      { id: "4", title: "Rejected", value: rejected, icon: "x-circle", color: "#dc2626" },
    ];
  }, [complaints]);

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff", paddingTop: insets.top }}>
      {/* BLUE HEADER */}
      <View
        style={{
          backgroundColor: "#1d4ed8",
          paddingTop: 20,
          paddingBottom: 30,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "white",
            }}
          >
            Admin Dashboard
          </Text>

          <TouchableOpacity
            onPress={() => router.replace("/admin")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Feather name="log-out" size={18} color="white" />
            <Text style={{ color: "white", marginLeft: 6 }}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Component */}
        <AdminStatsCarousel stats={statsData} />
      </View>

      {/* WHITE SECTION */}
      <View style={{ flex: 1, padding: 20 }}>
        {/* Search Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#e2e8f0",
            borderRadius: 10,
            paddingHorizontal: 10,
          }}
        >
          <Feather name="search" size={18} color="#64748b" />
          <TextInput
            placeholder="Search complaints..."
            value={search}
            onChangeText={setSearch}
            style={{
              flex: 1,
              paddingVertical: 9,
              paddingLeft: 8,
            }}
          />
        </View>

        <View
          style={{
            marginTop: 12,
            marginBottom: 12,
            backgroundColor: "#eff6ff",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#bfdbfe",
            paddingVertical: 4,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
          >
            {tags.map((tag) => {
              const isActive = activeTag === tag;
              return (
                <TouchableOpacity
                  key={tag}
                  onPress={() => setActiveTag(tag)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 7,
                    marginRight: 6,
                    borderRadius: 10,
                    borderWidth: isActive ? 1 : 0,
                    borderColor: "#bfdbfe",
                    backgroundColor: isActive ? "#ffffff" : "transparent",
                  }}
                >
                  <Text
                    style={{
                      color: isActive ? "#1d4ed8" : "#334155",
                      fontWeight: isActive ? "700" : "600",
                      fontSize: 12,
                    }}
                  >
                    {tagLabel[tag] || tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 16 }}>
          {loadingComplaints ? (
            <View style={{ paddingTop: 24, alignItems: "center" }}>
              <ActivityIndicator color="#2563eb" />
              <Text style={{ color: "#64748b", marginTop: 8 }}>Loading complaints...</Text>
            </View>
          ) : filteredComplaints.length === 0 ? (
            <View style={{ paddingTop: 24, alignItems: "center" }}>
              <Text style={{ color: "#64748b" }}>No complaints found</Text>
            </View>
          ) : (
            filteredComplaints.map((item) => {
              const status = (item.status || "SUBMITTED").toUpperCase();
              const statusColor =
                status === "RESOLVED"
                  ? "#16a34a"
                  : status === "REJECTED"
                  ? "#dc2626"
                  : "#d97706";

              return (
                <View
                  key={item._id || item.id || item.complaint_number}
                  style={{
                    backgroundColor: "white",
                    borderWidth: 1,
                    borderColor: "#e2e8f0",
                    borderRadius: 10,
                    padding: 9,
                    marginBottom: 8,
                  }}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Text style={{ flex: 1, fontWeight: "700", fontSize: 13, color: "#0f172a", marginRight: 8 }}>
                      {item.title || "Untitled Complaint"}
                    </Text>
                    <Text style={{ color: statusColor, fontSize: 11, fontWeight: "700" }}>{status}</Text>
                  </View>

                  {!!item.complaint_number && (
                    <Text style={{ color: "#64748b", fontSize: 11, marginTop: 3 }}>#{item.complaint_number}</Text>
                  )}

                  <View style={{ marginTop: 6 }}>
                    {!!getName(item.user_id) && (
                      <Text style={{ color: "#475569", fontSize: 11 }}>Citizen: {getName(item.user_id)}</Text>
                    )}
                    {!!getName(item.area_id) && (
                      <Text style={{ color: "#475569", fontSize: 11 }}>Area: {getName(item.area_id)}</Text>
                    )}
                    {!!getName(item.department_id) && (
                      <Text style={{ color: "#475569", fontSize: 11 }}>Department: {getName(item.department_id)}</Text>
                    )}
                    {!!item.createdAt && (
                      <Text style={{ color: "#94a3b8", fontSize: 10, marginTop: 2 }}>
                        {new Date(item.createdAt).toLocaleString()}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
}