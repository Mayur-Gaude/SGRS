import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { register as registerApi } from '../../lib/auth';
import { isValidEmail, isValidIndianMobile, normalizeIndianPhone } from '../../lib/validation';

export default function CitizenSignup() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!fullName || !email || !phone || !password) {
      Alert.alert('Missing fields', 'Please fill all fields');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Invalid email', 'Enter a valid email address');
      return;
    }
    const normalized = normalizeIndianPhone(phone);
    if (!isValidIndianMobile(phone)) {
      Alert.alert('Invalid phone', 'Enter a valid Indian mobile number');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      console.log("REGISTER PAYLOAD:", { full_name: fullName, email: email.trim(), phone: normalized, password });
      const res = await registerApi({ full_name: fullName, email: email.trim(), phone: normalized, password });
      const userId = res?.data?.user_id;
      Alert.alert('Success', 'Registration successful. Please verify OTP sent to your contact.');
      router.replace({
        pathname: '/citizen/verify-otp',
        params: { user_id: userId, email: email.trim(), phone: normalized },
      });
    } catch (e: any) {
      Alert.alert('Registration failed', e?.message || 'Unable to register');
       console.log("REGISTER ERROR:", {
      message: e?.message,
      code: e?.code,
      status: e?.response?.status,
      statusText: e?.response?.statusText,
      response: e?.response?.data,
    });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1d4ed8' }}>
      <KeyboardAvoidingView style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={20}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View style={{ alignItems: 'center', paddingTop: 80, paddingHorizontal: 16, paddingBottom: 40 }}>
          {/* Header */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <Feather name="user-plus" size={40} color="white" />
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 16 }}>
              Create Account
            </Text>
            <Text style={{ color: 'white', fontSize: 12, marginTop: 8 }}>
              Register as an citizen
            </Text>
          </View>

          {/* Sign Up Box */}
          <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 24, width: '100%', maxWidth: 400 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderRadius: 8,
                paddingHorizontal: 14,
                marginBottom: 16,
              }}
            >
              <Feather name="user" size={18} color="#64748b" />
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#64748b"
                value={fullName}
                onChangeText={setFullName}
                style={{
                  flex: 1,
                  color: '#0f172a',
                  paddingVertical: 14,
                  paddingLeft: 10,
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderRadius: 8,
                paddingHorizontal: 14,
                marginBottom: 16,
              }}
            >
              <Feather name="mail" size={18} color="#64748b" />
              <TextInput
                placeholder="Email Address"
                placeholderTextColor="#64748b"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  flex: 1,
                  color: '#0f172a',
                  paddingVertical: 14,
                  paddingLeft: 10,
                }}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderRadius: 8,
                paddingHorizontal: 14,
                marginBottom: 16,
              }}
            >
              <Feather name="phone" size={18} color="#64748b" />
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#64748b"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={{
                  flex: 1,
                  color: '#0f172a',
                  paddingVertical: 14,
                  paddingLeft: 10,
                }}
              />
            </View>

            <View
              style={{
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderRadius: 8,
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
              }}
            >
              <Feather name="lock" size={18} color="#64748b" />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#64748b"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={{
                  flex: 1,
                  color: '#0f172a',
                  paddingVertical: 14,
                  paddingLeft: 10,
                }}
              />
              <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} style={{ paddingLeft: 8, paddingVertical: 4 }}>
                <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View
              style={{
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderRadius: 8,
                marginBottom: 20,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
              }}
            >
              <Feather name="lock" size={18} color="#64748b" />
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#64748b"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                style={{
                  flex: 1,
                  color: '#0f172a',
                  paddingVertical: 14,
                  paddingLeft: 10,
                }}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword((prev) => !prev)}
                style={{ paddingLeft: 8, paddingVertical: 4 }}
              >
                <Feather name={showConfirmPassword ? 'eye-off' : 'eye'} size={18} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Create Account Button */}
            <TouchableOpacity
              style={{
                backgroundColor: '#1d4ed8',
                borderRadius: 8,
                paddingVertical: 16,
                alignItems: 'center',
                marginBottom: 16,
                opacity: loading ? 0.7 : 1,
              }}
              onPress={onSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            {/* Back to Sign In */}
            <TouchableOpacity
              style={{ paddingVertical: 12, alignItems: 'center' }}
              onPress={() => router.replace('/citizen')}
            >
              <Text style={{ color: '#1d4ed8', fontSize: 14, fontWeight: 'bold' }}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
