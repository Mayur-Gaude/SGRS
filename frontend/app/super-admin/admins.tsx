import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

import { getDepartments, getAdmins, createAdmin } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";

export default function AdminManagement() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");

  const [departments, setDepartments] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Zustand auth token
  const authToken = useAuthStore((state) => state.token) || undefined;

  useEffect(() => {
    fetchDepartments();
    fetchAdmins();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await getDepartments(authToken);
      setDepartments(res.data || res.departments || []);
    } catch (e) {
      setDepartments([]);
    }
  };

  const fetchAdmins = async () => {
    try {
      const res = await getAdmins(authToken);
      setAdmins(res.data || res.admins || []);
    } catch (e) {
      setAdmins([]);
    }
  };

  const handleCreateAdmin = async () => {
    if (!name || !email || !phone || !password || !department) return;

    setLoading(true);

    try {
      const selectedDept = departments.find(
        (dept) => (dept._id || dept.id) === department
      );

      const department_id =
        selectedDept?._id || selectedDept?.id || department;

      console.log("Creating admin with:", {
        name,
        email,
        phone,
        password,
        department_id,
      });

      await createAdmin(
        {
          full_name: name,
          email,
          phone,
          password,
          department_id,
        },
        authToken
      );

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setDepartment("");

      fetchAdmins();
    } catch (e) {
      console.log("Create admin error", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>

        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} />
          </TouchableOpacity>

          <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>
            Admin Management
          </Text>
        </View>

        {/* Create Admin Form */}
        <View
          style={{
            backgroundColor: "#f8fafc",
            padding: 16,
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
            Create Admin
          </Text>

          <TextInput
            placeholder="Admin Name"
            value={name}
            onChangeText={setName}
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
            }}
          />

          <TextInput
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
            }}
          />

          <TextInput
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
            }}
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
            }}
          />

          {/* Department Picker */}
          <View
            style={{
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            <Picker
              selectedValue={department}
              onValueChange={(itemValue) => setDepartment(itemValue)}
            >
              <Picker.Item label="Select Department" value="" />

              {departments.map((dept) => (
                <Picker.Item
                  key={dept._id || dept.id || dept.code}
                  label={dept.name}
                  value={dept._id || dept.id || dept.code}
                />
              ))}
            </Picker>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: loading ? "#93c5fd" : "#2563eb",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
            onPress={handleCreateAdmin}
            disabled={loading}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>
              {loading ? "Creating..." : "Create Admin"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Existing Admins */}
        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
          Existing Admins
        </Text>

        {admins.length === 0 && <Text>No admins found.</Text>}

        {admins.map((admin) => (
          <View
            key={admin.id || admin._id}
            style={{
              backgroundColor: "#f1f5f9",
              padding: 14,
              borderRadius: 10,
              marginBottom: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={{ fontWeight: "600" }}>
                {admin.name || admin.full_name}
              </Text>

              <Text style={{ color: "#64748b" }}>{admin.email}</Text>

              <Text style={{ color: "#64748b" }}>
                Department: {
                  admin.department_id?.name
                  || departments.find(
                        (d) => d._id === (admin.department_id?._id || admin.department_id)
                    )?.name
                  || "N/A"
                }
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Feather name="edit" size={18} style={{ marginRight: 12 }} />
              <Feather name="trash" size={18} color="red" />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}