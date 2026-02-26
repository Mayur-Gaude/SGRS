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
      await registerApi({ full_name: fullName, email: email.trim(), phone: normalized, password });
      Alert.alert('Success', 'Registration successful. Please verify OTP sent to your contact.');
      router.replace('/citizen/dashboard');
    } catch (e: any) {
      Alert.alert('Registration failed', e?.message || 'Unable to register');
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
            <TextInput
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              style={{
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderRadius: 8,
                padding: 14,
                marginBottom: 16,
              }}
            />

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
                marginBottom: 16,
              }}
            />

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
                marginBottom: 16,
              }}
            />

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
                marginBottom: 16,
              }}
            />

            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={{
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderRadius: 8,
                padding: 14,
                marginBottom: 20,
              }}
            />

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
              onPress={() => router.replace('/citizen/index')}
            >
              <Text style={{ color: '#1d4ed8', fontSize: 14, fontWeight: 'bold' }}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
