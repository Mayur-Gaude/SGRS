import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { login as loginApi } from "../../lib/auth";
import { isValidEmail } from "../../lib/validation";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing fields", "Enter email and password");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email: email.trim().toLowerCase(),
        password,
      };

      console.log("ADMIN LOGIN PAYLOAD:", payload);

      const res = await loginApi(payload);

      console.log("ADMIN LOGIN RESPONSE:", res.data);

      Alert.alert("Success", "Admin login successful!");

      router.replace("/admin/dashboard");
    } catch (e: any) {
      console.log("ADMIN LOGIN ERROR:", e?.response?.data || e.message);

      Alert.alert(
        "Login failed",
        e?.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#1d4ed8" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            alignItems: "center",
            paddingTop: 80,
            paddingHorizontal: 16,
            paddingBottom: 40,
          }}
        >
          {/* Header */}
          <View style={{ alignItems: "center", marginBottom: 40 }}>
            <Feather name="shield" size={40} color="white" />
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
                marginTop: 16,
              }}
            >
              Admin Portal
            </Text>
            <Text style={{ color: "white", fontSize: 12, marginTop: 8 }}>
              Grievance Redressal System
            </Text>
          </View>

          {/* Login Box */}
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 24,
              width: "100%",
              maxWidth: 400,
            }}
          >
            {/* Email Label */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 6,
                color: "#334155",
              }}
            >
              Email Address
            </Text>
            {/* Email Field with Icon */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#e2e8f0",
                borderRadius: 8,
                paddingHorizontal: 12,
                marginBottom: 16,
              }}
            >
              <Feather name="mail" size={18} color="#64748b" />
              <TextInput
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  paddingLeft: 10,
                }}
              />
            </View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 6,
                color: "#334155",
              }}
            >
              Password
            </Text>
            {/* Password Field with Icon */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#e2e8f0",
                borderRadius: 8,
                paddingHorizontal: 12,
                marginBottom: 20,
              }}
            >
              <Feather name="lock" size={18} color="#64748b" />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  paddingLeft: 10,
                }}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={{
                backgroundColor: "#1d4ed8",
                borderRadius: 8,
                paddingVertical: 16,
                alignItems: "center",
                marginBottom: 16,
                opacity: loading ? 0.7 : 1,
              }}
              onPress={onLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Login to Admin Account
                </Text>
              )}
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}