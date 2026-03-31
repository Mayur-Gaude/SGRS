
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AdminStatsCarousel from "../../components/AdminStatsCarrousel";

export default function AdminDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const statsData: {
    id: string;
    title: string;
    value: number;
    icon: keyof typeof Feather.glyphMap;
    color: string;
  }[] = [
    { id: "1", title: "Total", value: 120, icon: "file-text", color: "#2563eb" },
    { id: "2", title: "Pending", value: 35, icon: "clock", color: "#f59e0b" },
    { id: "3", title: "Resolved", value: 70, icon: "check-circle", color: "#16a34a" },
    { id: "4", title: "Rejected", value: 15, icon: "x-circle", color: "#dc2626" },
  ];

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
            paddingHorizontal: 12,
          }}
        >
          <Feather name="search" size={18} color="#64748b" />
          <TextInput
            placeholder="Search complaints..."
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingLeft: 8,
            }}
          />
        </View>
      </View>
    </View>
  );
}