import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { verifyOtp, resendOtpApi } from '../../lib/auth';

export default function CitizenOtpVerify() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const user_id = Array.isArray(params.user_id) ? params.user_id[0] : params.user_id;
  const email = Array.isArray(params.email) ? params.email[0] : params.email;
  const phone = Array.isArray(params.phone) ? params.phone[0] : params.phone;
  
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [verified, setVerified] = useState({ email: false, phone: false });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleVerifyEmail = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      Alert.alert('Invalid OTP', 'Enter 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp({ user_id, otp_code: emailOtp, otp_type: 'EMAIL_VERIFICATION' });
      setVerified(prev => ({ ...prev, email: true }));
      Alert.alert('Success', 'Email verified!');
    } catch (err: any) {
      Alert.alert('Verification failed', err?.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!phoneOtp || phoneOtp.length !== 6) {
      Alert.alert('Invalid OTP', 'Enter 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      await verifyOtp({ user_id, otp_code: phoneOtp, otp_type: 'PHONE_VERIFICATION' });
      setVerified(prev => ({ ...prev, phone: true }));
      Alert.alert('Success', 'Phone verified!');
    } catch (err: any) {
      Alert.alert('Verification failed', err?.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    if (verified.email && verified.phone) {
      Alert.alert('Registration Complete!', 'Please log in with your credentials', [
        { text: 'OK', onPress: () => router.replace({ pathname: '/citizen/index' }) },
      ]);
    } else {
      Alert.alert('Incomplete', 'Verify both email and phone OTP to continue');
    }
  };

  const handleResendOtp = async (type: 'EMAIL_VERIFICATION' | 'PHONE_VERIFICATION') => {
    try {
      await resendOtpApi({ user_id, otp_type: type });
      Alert.alert('Success', `${type === 'EMAIL_VERIFICATION' ? 'Email' : 'Phone'} OTP resent`);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f5f9', paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 32, marginBottom: 8 }}>Verify Your Account</Text>
      <Text style={{ color: '#64748b', marginBottom: 32 }}>Complete both verifications to activate your account</Text>

      {/* Email OTP Section */}
      <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Email: {email}</Text>
        <TextInput
          placeholder="Enter 6-digit Email OTP"
          value={emailOtp}
          onChangeText={setEmailOtp}
          keyboardType="number-pad"
          maxLength={6}
          editable={!verified.email}
          style={{
            borderWidth: 1,
            borderColor: verified.email ? '#10b981' : '#e2e8f0',
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            backgroundColor: verified.email ? '#f0fdf4' : 'white',
          }}
        />
        {!verified.email ? (
          <>
            <TouchableOpacity
              onPress={handleVerifyEmail}
              disabled={loading}
              style={{
                backgroundColor: '#1d4ed8',
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: 'center',
                marginBottom: 8,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Verify Email</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleResendOtp('EMAIL_VERIFICATION')}>
              <Text style={{ color: '#1d4ed8', textAlign: 'center', fontSize: 12 }}>Resend Email OTP</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={{ color: '#10b981', fontWeight: 'bold', textAlign: 'center' }}>✓ Email Verified</Text>
        )}
      </View>

      {/* Phone OTP Section */}
      <View style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Phone: {phone}</Text>
        <TextInput
          placeholder="Enter 6-digit Phone OTP"
          value={phoneOtp}
          onChangeText={setPhoneOtp}
          keyboardType="number-pad"
          maxLength={6}
          editable={!verified.phone}
          style={{
            borderWidth: 1,
            borderColor: verified.phone ? '#10b981' : '#e2e8f0',
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            backgroundColor: verified.phone ? '#f0fdf4' : 'white',
          }}
        />
        {!verified.phone ? (
          <>
            <TouchableOpacity
              onPress={handleVerifyPhone}
              disabled={loading}
              style={{
                backgroundColor: '#1d4ed8',
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: 'center',
                marginBottom: 8,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Verify Phone</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleResendOtp('PHONE_VERIFICATION')}>
              <Text style={{ color: '#1d4ed8', textAlign: 'center', fontSize: 12 }}>Resend Phone OTP</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={{ color: '#10b981', fontWeight: 'bold', textAlign: 'center' }}>✓ Phone Verified</Text>
        )}
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        onPress={handleContinue}
        disabled={!verified.email || !verified.phone}
        style={{
          backgroundColor: verified.email && verified.phone ? '#10b981' : '#cbd5e1',
          borderRadius: 8,
          paddingVertical: 14,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Continue to Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
