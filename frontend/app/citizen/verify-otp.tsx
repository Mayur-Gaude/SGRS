import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { verifyOtp } from '../../lib/auth';

export default function CitizenOtpVerify() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const user_id = Array.isArray(params.user_id) ? params.user_id[0] : params.user_id;
  const email = Array.isArray(params.email) ? params.email[0] : params.email;
  const phone = Array.isArray(params.phone) ? params.phone[0] : params.phone;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpType, setOtpType] = useState<'EMAIL_VERIFICATION' | 'PHONE_VERIFICATION'>('EMAIL_VERIFICATION');

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Enter 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp({ user_id, otp_code: otp, otp_type: otpType });
      if (otpType === 'EMAIL_VERIFICATION') {
        setOtp('');
        setOtpType('PHONE_VERIFICATION');
        Alert.alert('Success', 'Email verified. Now verify the phone OTP.');
        return;
      }

      Alert.alert('Success', 'Phone verified! Account setup is complete.', [
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
      <Text style={{ marginBottom: 24 }}>
        {otpType === 'EMAIL_VERIFICATION'
          ? `Enter the OTP sent to ${email}`
          : `Enter the OTP sent to ${phone}`}
      </Text>
      <View
        style={{
          backgroundColor: '#dbeafe',
          borderColor: '#93c5fd',
          borderWidth: 1,
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
        }}
      >
        <Text style={{ color: '#1e3a8a', fontWeight: '600' }}>
          Step 1: Verify email first, then the phone OTP will open automatically.
        </Text>
      </View>
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
