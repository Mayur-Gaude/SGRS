import { Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
import { login as loginApi, verify2FA } from "../../lib/auth";
import { isValidEmail } from "../../lib/validation";
import { useAuthStore } from "../../store/authStore";

export default function SuperAdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setToken = useAuthStore((state) => state.setToken);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

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

      console.log("SUPER ADMIN LOGIN PAYLOAD:", payload);

      const res = await loginApi(payload);
      if (res.data?.requires_2fa) {
        setUserId(res.data.user_id);
        setShowOtp(true);
        Alert.alert("OTP Required", "Enter the OTP sent to your email.");
        return;
      }
      const token = res.data?.token || res.data?.accessToken || res.token || res.accessToken;
      if (token) setToken(token);
      console.log("SUPER ADMIN LOGIN RESPONSE:", res.data);
      Alert.alert("Success", "Super Admin login successful!");
      router.replace("/super-admin/dashboard");
    } catch (e: any) {
      console.log("SUPER ADMIN LOGIN ERROR:", e?.response?.data || e.message);

      Alert.alert(
        "Login failed",
        e?.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async () => {
    if (!otp || !userId) {
      Alert.alert("Missing OTP", "Enter the OTP sent to your email.");
      return;
    }
    setLoading(true);
    try {
      const res = await verify2FA({ user_id: userId, otp_code: otp });
      const token = res.data?.token || res.data?.accessToken || res.token || res.accessToken;
      if (token) setToken(token);
      Alert.alert("Success", "Super Admin login successful!");
      setShowOtp(false);
      setOtp("");
      setUserId(null);
      router.replace("/super-admin/dashboard");
    } catch (e: any) {
      Alert.alert("OTP Error", e?.response?.data?.message || "Invalid or expired OTP.");
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
            <MaterialCommunityIcons name="crown" size={40} color="white" />

            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
                marginTop: 16,
              }}
            >
              Super Admin Portal
            </Text>

            <Text style={{ color: "white", fontSize: 12, marginTop: 8 }}>
              System Adminstration
            </Text>
          </View>

          {/* Login or OTP Box */}
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 24,
              width: "100%",
              maxWidth: 400,
            }}
          >
            {showOtp ? (
              <>
                <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
                  Enter OTP
                </Text>
                <TextInput
                  placeholder="Enter OTP"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  style={{
                    borderWidth: 1,
                    borderColor: "#e2e8f0",
                    borderRadius: 8,
                    padding: 14,
                    marginBottom: 16,
                  }}
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: "#1d4ed8",
                    borderRadius: 8,
                    paddingVertical: 16,
                    alignItems: "center",
                    marginBottom: 16,
                    opacity: loading ? 0.7 : 1,
                  }}
                  onPress={onVerifyOtp}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
                      Verify OTP
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
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

                {/* Email Field */}
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
                    placeholder="Enter your email"
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

                {/* Password Label */}
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

                {/* Password Field */}
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
                    placeholder="Enter your password"
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
                      Login to Super Admin Account
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}