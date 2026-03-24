import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AdminStatsCarousel from "../../components/AdminStatsCarrousel";

export default function SuperAdminDashboard() {
  const router = useRouter();

  const statsData = [
    { id: "1", title: "Total Complaints", value: 320, icon: "file-text", color: "#2563eb" },
    { id: "2", title: "Pending", value: 85, icon: "clock", color: "#f59e0b" },
    { id: "3", title: "Resolved", value: 200, icon: "check-circle", color: "#16a34a" },
    { id: "4", title: "Rejected", value: 35, icon: "x-circle", color: "#dc2626" },
  ] as any;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      
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
            Super Admin Dashboard
          </Text>

          <TouchableOpacity
            onPress={() => router.replace("/super-admin/index")}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Feather name="log-out" size={18} color="white" />
            <Text style={{ color: "white", marginLeft: 6 }}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <AdminStatsCarousel stats={statsData} />
      </View>

      {/* WHITE SECTION */}
      <ScrollView style={{ flex: 1, padding: 20 }}>

        {/* Department Management */}
        <View
          style={{
            backgroundColor: "#f8fafc",
            padding: 18,
            borderRadius: 12,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 6 }}>
            Department Management
          </Text>

          <Text style={{ color: "#64748b", marginBottom: 10 }}>
            Manage all departments responsible for handling grievances. 
            Create new departments, update department details, and assign 
            them to specific complaint categories.
          </Text>

          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => router.push("/super-admin/departments")}
          >
            <Text style={{ color: "#2563eb", fontWeight: "600", marginRight: 6 }}>
              Department Management
            </Text>
            <Feather name="arrow-right" size={16} color="#2563eb" />
          </TouchableOpacity>
        </View>

        {/* User Management */}
        <View
          style={{
            backgroundColor: "#f8fafc",
            padding: 18,
            borderRadius: 12,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 6 }}>
            Admin Management
          </Text>

          <Text style={{ color: "#64748b", marginBottom: 10 }}>
            Manage registered users and administrators. 
            View user profiles, update account information, 
            assign administrative roles, and control user access.
          </Text>

          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => router.push("/super-admin/admins")}
          >
            <Text style={{ color: "#2563eb", fontWeight: "600", marginRight: 6 }}>
              Admin Management
            </Text>
            <Feather name="arrow-right" size={16} color="#2563eb" />
          </TouchableOpacity>
        </View>

        {/* Appeals Management */}
        <View
          style={{
            backgroundColor: "#f8fafc",
            padding: 18,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 6 }}>
            Appeals Management
          </Text>

          <Text style={{ color: "#64748b", marginBottom: 10 }}>
            Review and manage appeals submitted by citizens 
            regarding grievance decisions. Super Admins can 
            evaluate appeal cases and ensure fair resolution.
          </Text>

          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={() => router.push("/super-admin/appeals")}
          >
            <Text style={{ color: "#2563eb", fontWeight: "600", marginRight: 6 }}>
              Appeals Management
            </Text>
            <Feather name="arrow-right" size={16} color="#2563eb" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}