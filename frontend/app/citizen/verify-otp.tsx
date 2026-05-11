import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { verifyOtp } from '../../lib/auth';

export default function CitizenOtpVerify() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const user_id = Array.isArray(params.user_id) ? params.user_id[0] : params.user_id;
  const email = Array.isArray(params.email) ? params.email[0] : params.email;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Enter 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp({ user_id, otp_code: otp, otp_type: 'EMAIL_VERIFICATION' });
      Alert.alert('Success', 'Account verified!', [
        { text: 'OK', onPress: () => router.replace({ pathname: '/citizen/dashboard' }) },
      ]);
    } catch (err: any) {
      Alert.alert('Verification failed', err?.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f5f9', padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Verify Your Account</Text>
      <Text style={{ marginBottom: 24 }}>Enter the OTP sent to {email}</Text>
      <TextInput
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
        style={{ borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, padding: 14, marginBottom: 20, backgroundColor: 'white' }}
      />
      <TouchableOpacity
        onPress={handleVerify}
        disabled={loading}
        style={{ backgroundColor: '#1d4ed8', borderRadius: 8, paddingVertical: 16, alignItems: 'center', marginBottom: 16 }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Verify OTP</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}
