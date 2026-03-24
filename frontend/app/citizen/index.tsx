import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { login as loginApi } from '../../lib/auth';
import { isValidEmail, isValidIndianMobile, normalizeIndianPhone } from '../../lib/validation';
import { useAuthStore } from '../../store/authStore';

export default function CitizenPortal() {
  const router = useRouter();
  const [signInMethod, setSignInMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setToken = useAuthStore((state) => state.setToken);

  // const onLogin = async () => {
  //   // Validation
  //   if (signInMethod === 'email') {
  //     if (!email || !password) {
  //       Alert.alert('Missing fields', 'Enter email and password');
  //       return;
  //     }
  //     if (!isValidEmail(email)) {
  //       Alert.alert('Invalid email', 'Enter a valid email address');
  //       return;
  //     }
  //   } else {
  //     if (!phone || !password) {
  //       Alert.alert('Missing fields', 'Enter phone and password');
  //       return;
  //     }
  //     if (!isValidIndianMobile(phone)) {
  //       Alert.alert('Invalid phone', 'Enter a valid Indian mobile number');
  //       return;
  //     }
  //   }

  //   setLoading(true);

  //   try {
  //     // ✅ IMPORTANT FIX: Normalize email & phone
  //     const payload =
  //       signInMethod === 'email'
  //         ? { email: email.trim().toLowerCase(), password }
  //         : { email: normalizeIndianPhone(phone), password };

  //     console.log("LOGIN PAYLOAD:", payload);

  //     const res = await loginApi(payload);
  //     console.log("LOGIN SUCCESS:", res);

  //     Alert.alert("Success", "Login successful!");
  //     router.replace('/citizen/dashboard');

  //   } catch (e: any) {
  //     console.log("LOGIN ERROR:", e?.response?.data || e.message);

  //     Alert.alert(
  //       'Login failed',
  //       e?.response?.data?.message || e?.message || 'User not found'
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onLogin = async () => {
  if (!email || !password) {
    Alert.alert('Missing fields', 'Enter email and password');
    return;
  }

  if (!isValidEmail(email)) {
    Alert.alert('Invalid email', 'Enter valid email');
    return;
  }

  setLoading(true);

  try {
    const payload = {
      email: email.trim().toLowerCase(),  // ✅ IMPORTANT
      password,
    };

    console.log("LOGIN PAYLOAD:", payload);

    const res = await loginApi(payload);
    // Save token to Zustand
    const token = res.data?.token || res.data?.accessToken || res.token || res.accessToken;
    if (token) setToken(token);
    console.log("LOGIN SUCCESS:", res);
    Alert.alert("Success", "Login successful!");
    router.replace('/citizen/dashboard');

  } catch (e: any) {
    console.log("LOGIN ERROR:", e?.response?.data || e.message);

    Alert.alert(
      'Login failed',
      e?.response?.data?.message || e?.message || 'User not found'
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1d4ed8' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ alignItems: 'center', paddingTop: 80, paddingHorizontal: 16, paddingBottom: 40 }}>

          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Feather name="lock" size={40} color="white" />
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 16 }}>
              Welcome Back
            </Text>
            <Text style={{ color: 'white', fontSize: 12, marginTop: 8 }}>
              Sign in to your account
            </Text>
          </View>

          {/* Sign In Box */}
          <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 24, width: '100%', maxWidth: 400 }}>

            {/* Toggle */}
            <View style={{ flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 8, padding: 4, marginBottom: 24 }}>
              <TouchableOpacity
                onPress={() => setSignInMethod('email')}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  paddingVertical: 12,
                  alignItems: 'center',
                  borderRadius: 6,
                  backgroundColor: signInMethod === 'email' ? '#1d4ed8' : 'transparent'
                }}
              >
                <Feather name="mail" size={16} color={signInMethod === 'email' ? 'white' : '#64748b'} />
                <Text style={{ color: signInMethod === 'email' ? 'white' : '#64748b', fontWeight: '600' }}>
                  Email
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setSignInMethod('phone')}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  paddingVertical: 12,
                  alignItems: 'center',
                  borderRadius: 6,
                  backgroundColor: signInMethod === 'phone' ? '#1d4ed8' : 'transparent'
                }}
              >
                <Feather name="phone" size={16} color={signInMethod === 'phone' ? 'white' : '#64748b'} />
                <Text style={{ color: signInMethod === 'phone' ? 'white' : '#64748b', fontWeight: '600' }}>
                  Phone
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email or Phone Input */}
            {signInMethod === 'email' ? (
              <TextInput
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                  borderRadius: 8,
                  padding: 14,
                  marginBottom: 16
                }}
              />
            ) : (
              <TextInput
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={{
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                  borderRadius: 8,
                  padding: 14,
                  marginBottom: 16
                }}
              />
            )}

            {/* Password */}
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={{
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderRadius: 8,
                padding: 14,
                marginBottom: 20
              }}
            />

            {/* Login Button */}
            <TouchableOpacity
              style={{
                backgroundColor: '#1d4ed8',
                borderRadius: 8,
                paddingVertical: 16,
                alignItems: 'center',
                marginBottom: 16,
                opacity: loading ? 0.7 : 1
              }}
              onPress={onLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                  Sign In with {signInMethod === 'email' ? 'Email' : 'Phone'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Forgot */}
            <TouchableOpacity style={{ paddingVertical: 16, alignItems: 'center' }} onPress={() => router.push('/citizen/forgot-password')}>
              <Text style={{ color: '#1d4ed8', fontSize: 14, fontWeight: 'bold' }}>
                Forgot Password
              </Text>
            </TouchableOpacity>

            <Text style={{ color: '#64748b', textAlign: 'center', paddingVertical: 12 }}>
              Don't have an account?
            </Text>

            {/* Signup */}
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: '#1d4ed8',
                borderRadius: 8,
                paddingVertical: 16,
                alignItems: 'center'
              }}
              onPress={() => router.push('/citizen/signup')}
            >
              <Text style={{ color: '#1d4ed8', fontSize: 16, fontWeight: 'bold' }}>
                Create Account
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}