import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { isValidEmail } from '../../lib/validation';
import {
  requestPasswordReset,
  verifyResetOtp,
  setNewPasswordApi,
} from '../../lib/auth';

export default function ForgotPassword() {
  const router = useRouter();

  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [userId, setUserId] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  // STEP 1: SEND OTP
  const handleSendOtp = async () => {
    if (!email || !isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Enter a valid email');
      return;
    }

    setLoading(true);

    try {
      const res = await requestPasswordReset(
        email.trim().toLowerCase()
      );
      console.log("FULL RESPONSE:", res.data);
      const receivedUserId = res.data.user_id;
      setUserId(receivedUserId);

      Alert.alert('Success', 'OTP sent to your email');
      setStep('otp');
    } catch (error: any) {
        console.log("FORGOT PASSWORD ERROR:", error?.response?.data || error);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to send OTP'
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: VERIFY OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Enter 6-digit OTP');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'User not found. Restart process.');
      return;
    }

    setLoading(true);

    try {
      const res = await verifyResetOtp({
        user_id: userId,
        otp_code: otp,
      });

      console.log("VERIFY RESPONSE:", res.data);
      const token = res.data.reset_token;
      setResetToken(token);

      Alert.alert('Success', 'OTP verified successfully');
      setStep('reset');
    } catch (error: any) {
      Alert.alert(
        'Invalid OTP',
        error?.response?.data?.message || 'OTP verification failed'
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: RESET PASSWORD
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Missing Fields', 'Fill all fields');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Weak Password', 'Minimum 6 characters required');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match');
      return;
    }

    if (!resetToken) {
      Alert.alert('Error', 'Reset token missing.');
      return;
    }

    setLoading(true);

    try {
      await setNewPasswordApi({
        reset_token: resetToken,
        new_password: newPassword,
      });

      Alert.alert('Success', 'Password reset successful!', [
        {
          text: 'OK',
          onPress: () => router.replace('/citizen'),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Reset Failed',
        error?.response?.data?.message || 'Password reset failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-6 pt-10">
      <Text className="text-2xl font-bold mb-6 text-black">
        Forgot Password
      </Text>

      {step === 'email' && (
        <>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="border border-slate-300 rounded-lg p-4 mb-4 bg-white"
          />

          <TouchableOpacity
            onPress={handleSendOtp}
            disabled={loading}
            className="bg-blue-600 py-4 rounded-lg items-center"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold">Send OTP</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {step === 'otp' && (
        <>
          <Text className="text-slate-600 mb-3">
            OTP sent to {email}
          </Text>

          <TextInput
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            className="border border-slate-300 rounded-lg p-4 mb-4 bg-white"
          />

          <TouchableOpacity
            onPress={handleVerifyOtp}
            disabled={loading}
            className="bg-blue-600 py-4 rounded-lg items-center"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold">Verify OTP</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {step === 'reset' && (
        <>
          <TextInput
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            className="border border-slate-300 rounded-lg p-4 mb-4 bg-white"
          />

          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            className="border border-slate-300 rounded-lg p-4 mb-4 bg-white"
          />

          <TouchableOpacity
            onPress={handleResetPassword}
            disabled={loading}
            className="bg-blue-600 py-4 rounded-lg items-center"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold">
                Reset Password
              </Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
}