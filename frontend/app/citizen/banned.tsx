import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { getMyBan, getMyAppeal } from '../../lib/api';
import AppealForm from '../../components/AppealForm';

type Ban = {
  _id?: string;
  id?: string;
  ban_type?: 'TEMPORARY' | 'PERMANENT';
  ban_reason?: string;
  ban_start?: string;
  ban_end?: string;
};

type BanAppeal = {
  _id?: string;
  id?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  appeal_reason?: string;
  created_at?: string;
  reviewed_at?: string;
};

export default function BanScreen() {
  const authToken = useAuthStore((state) => state.token) || undefined;
  const [ban, setBan] = useState<Ban | null>(null);
  const [appeal, setAppeal] = useState<BanAppeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAppealForm, setShowAppealForm] = useState(false);

  const loadBanData = useCallback(async () => {
    if (!authToken) return;

    setLoading(true);
    try {
      const banRes = await getMyBan(authToken);
      if (banRes?.data?.status === 'ACTIVE') {
        setBan(banRes.data.ban);
      } else if (banRes?.status === 'ACTIVE') {
        setBan(banRes.ban);
      }

      try {
        const appealRes = await getMyAppeal(authToken);
        if (appealRes?.data) {
          setAppeal(appealRes.data);
        } else if (Array.isArray(appealRes) && appealRes.length > 0) {
          setAppeal(appealRes[0]);
        }
      } catch {
        // No appeal found, that's ok
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load ban information');
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useFocusEffect(
    useCallback(() => {
      loadBanData();
    }, [loadBanData])
  );

  const getBanDurationText = (ban: Ban): string => {
    if (ban.ban_type === 'PERMANENT') {
      return 'Permanent';
    }

    if (ban.ban_end) {
      const endDate = new Date(ban.ban_end);
      const now = new Date();
      const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysLeft > 0) {
        return `Temporary - ${daysLeft} days remaining`;
      } else {
        return 'Ban period expired';
      }
    }

    return 'Temporary';
  };

  const getAppealStatusColor = (status?: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-50 border-yellow-200';
      case 'APPROVED':
        return 'bg-green-50 border-green-200';
      case 'REJECTED':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const getAppealStatusIcon = (status?: string) => {
    switch (status) {
      case 'PENDING':
        return 'clock';
      case 'APPROVED':
        return 'check-circle';
      case 'REJECTED':
        return 'x-circle';
      default:
        return 'alert-circle';
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator color="#2563eb" size="large" />
        <Text className="text-slate-600 mt-4">Loading ban information...</Text>
      </SafeAreaView>
    );
  }

  if (!ban) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center p-4">
        <Text className="text-slate-900 text-lg font-bold">No active ban found</Text>
      </SafeAreaView>
    );
  }

  const canAppeal = !appeal || appeal.status === 'REJECTED';

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header */}
        <View className="bg-red-600 px-4 py-6">
          <View className="flex-row items-center gap-3 mb-2">
            <Feather name="alert-circle" size={32} color="white" />
            <Text className="text-white text-2xl font-bold">Account Banned</Text>
          </View>
          <Text className="text-red-100 text-sm">Your account has been temporarily restricted</Text>
        </View>

        <View className="p-4">
          {/* Ban Information Card */}
          <View className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
            <Text className="text-slate-900 text-lg font-bold mb-4">Ban Details</Text>

            {/* Reason */}
            <View className="mb-4 pb-4 border-b border-slate-200">
              <Text className="text-slate-600 text-xs font-semibold mb-1">REASON</Text>
              <Text className="text-slate-900 text-sm">{ban.ban_reason || 'Policy Violation'}</Text>
            </View>

            {/* Type & Duration */}
            <View className="flex-row gap-4 mb-4 pb-4 border-b border-slate-200">
              <View className="flex-1">
                <Text className="text-slate-600 text-xs font-semibold mb-1">TYPE</Text>
                <Text className="text-slate-900 text-sm font-medium">{ban.ban_type || 'PERMANENT'}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-slate-600 text-xs font-semibold mb-1">DURATION</Text>
                <Text className="text-slate-900 text-sm font-medium">{getBanDurationText(ban)}</Text>
              </View>
            </View>

            {/* Dates */}
            <View>
              <Text className="text-slate-600 text-xs font-semibold mb-1">BANNED SINCE</Text>
              <Text className="text-slate-900 text-sm">
                {ban.ban_start ? new Date(ban.ban_start).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          </View>

          {/* Appeal Status Card */}
          {appeal && (
            <View className={`rounded-xl border p-5 mb-5 ${getAppealStatusColor(appeal.status)}`}>
              <View className="flex-row items-center gap-3 mb-3">
                <Feather
                  name={getAppealStatusIcon(appeal.status)}
                  size={20}
                  color={appeal.status === 'APPROVED' ? '#10b981' : appeal.status === 'REJECTED' ? '#ef4444' : '#f59e0b'}
                />
                <Text className="text-slate-900 font-semibold flex-1">
                  {appeal.status === 'PENDING' && 'Appeal Pending Review'}
                  {appeal.status === 'APPROVED' && 'Appeal Approved'}
                  {appeal.status === 'REJECTED' && 'Appeal Rejected'}
                </Text>
              </View>

              {appeal.status === 'PENDING' && (
                <Text className="text-slate-700 text-sm mb-2">
                  Your appeal has been submitted and is awaiting review from our team. This typically takes 1-2 business days.
                </Text>
              )}

              {appeal.status === 'APPROVED' && (
                <Text className="text-slate-700 text-sm mb-2">
                  Congratulations! Your ban appeal has been approved. Your account will be restored on your next login.
                </Text>
              )}

              {appeal.status === 'REJECTED' && (
                <Text className="text-slate-700 text-sm mb-2">
                  Your ban appeal was reviewed and rejected. You can submit another appeal below.
                </Text>
              )}

              <Text className="text-slate-600 text-xs">
                Submitted: {appeal.created_at ? new Date(appeal.created_at).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          )}

          {/* Appeal Form Section */}
          {canAppeal && (
            <>
              <Text className="text-slate-900 text-lg font-bold mb-3">Request Ban Appeal</Text>
              <Text className="text-slate-600 text-sm mb-4">
                If you believe this ban was issued in error, you can submit an appeal explaining your situation. Our team will carefully review your request.
              </Text>

              <TouchableOpacity
                onPress={() => setShowAppealForm(true)}
                className="bg-blue-600 rounded-lg py-4 items-center mb-4"
              >
                <View className="flex-row items-center gap-2">
                  <Feather name="send" size={18} color="white" />
                  <Text className="text-white font-semibold">Submit Appeal</Text>
                </View>
              </TouchableOpacity>
            </>
          )}

          {/* Info Box */}
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <View className="flex-row gap-3">
              <Feather name="info" size={20} color="#2563eb" />
              <View className="flex-1">
                <Text className="text-blue-900 font-semibold text-sm mb-1">Need Help?</Text>
                <Text className="text-blue-800 text-xs">
                  If you have questions about your ban or need assistance, please contact our support team.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Appeal Form Modal */}
      <AppealForm
        visible={showAppealForm}
        banId={ban._id || ban.id || ''}
        onClose={() => setShowAppealForm(false)}
        onSuccess={loadBanData}
      />
    </SafeAreaView>
  );
}
