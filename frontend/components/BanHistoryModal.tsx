import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createBanAppeal, getMyBan } from '../lib/api';
import { useAuthStore } from '../store/authStore';

interface BanHistoryModalProps {
  visible: boolean;
  ban: any;
  onClose: () => void;
  onSuccess?: () => void;
  onAppealSubmitted?: () => void;
}

export default function BanHistoryModal({ visible, ban, onClose, onSuccess, onAppealSubmitted }: BanHistoryModalProps) {
  const authToken = useAuthStore((state) => state.token) || undefined;
  const [showAppealForm, setShowAppealForm] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [localBan, setLocalBan] = useState<any>(ban || null);

  console.log("MODAL RENDER - visible:", visible, "ban prop:", ban, "localBan state:", localBan);

  React.useEffect(() => {
    let mounted = true;
    const fetchBan = async () => {
      console.log("EFFECT RUN - visible:", visible, "ban prop:", ban, "authToken exists:", !!authToken);
      
      if (!visible) {
        console.log("EFFECT: Modal not visible, skipping");
        return;
      }
      
      if (ban) {
        console.log("EFFECT: Using ban prop:", JSON.stringify(ban, null, 2));
        setLocalBan(ban);
        return;
      }
      
      if (!authToken) {
        console.log("EFFECT: No auth token");
        return;
      }
      
      try {
        console.log("EFFECT: Calling getMyBan API");
        const res = await getMyBan(authToken);
        console.log("EFFECT: getMyBan response:", JSON.stringify(res, null, 2));
        
        // Extract ban from response
        // Backend returns: { status: "ACTIVE", ban: {...} }
        let data = null;
        if (res?.status === 'ACTIVE' && res?.ban) {
          data = res.ban;
        } else if (res?.data?.status === 'ACTIVE' && res?.data?.ban) {
          data = res.data.ban;
        } else if (res?.ban) {
          data = res.ban;
        } else if (res?.data?.ban) {
          data = res.data.ban;
        }
        
        console.log("EFFECT: Extracted ban data:", JSON.stringify(data, null, 2));
        
        if (mounted && data) {
          setLocalBan(data);
          console.log("EFFECT: Set localBan to:", JSON.stringify(data, null, 2));
        }
      } catch (e: any) {
        console.log("EFFECT: getMyBan error:", e?.message);
      }
    };
    
    fetchBan();
    return () => {
      mounted = false;
    };
  }, [visible, ban, authToken]);

    const handleSubmitAppeal = async () => {
    if (!reason.trim()) {
      Alert.alert('Empty Reason', 'Please provide a reason for your appeal');
      return;
    }

    if (reason.trim().length < 10) {
      Alert.alert('Reason Too Short', 'Please provide at least 10 characters');
      return;
    }

    setLoading(true);
    try {
      const banId = localBan?._id || localBan?.id;
      console.log("BAN OBJECT:", JSON.stringify(localBan, null, 2));
      console.log("BAN ID EXTRACTED:", banId);
      console.log("REASON:", reason);
      
      // If banId not present, still attempt to submit appeal without banId
      // Backend should associate appeal with user if banId missing
      const payloadBanId = banId || '';
      console.log("PAYLOAD BAN ID:", payloadBanId);

      console.log("SUBMITTING APPEAL WITH:", { banId: payloadBanId, reason });
      const response = await createBanAppeal(payloadBanId, reason, authToken);
      console.log("APPEAL RESPONSE:", JSON.stringify(response, null, 2));
      
      setReason('');
      setShowAppealForm(false);
      onSuccess?.();
      onAppealSubmitted?.();
      Alert.alert('Success', 'Your appeal has been submitted successfully.');
    } catch (error: any) {
      console.log("APPEAL SUBMISSION ERROR:", error?.message || error);
      Alert.alert('Error', error.message || 'Failed to submit appeal');
    } finally {
      setLoading(false);
    }
  };

  const getBanDurationText = (): string => {
    const b = localBan;
    if (b?.ban_type === 'PERMANENT') {
      return 'Permanent Ban';
    }

    if (b?.ban_end) {
      const endDate = new Date(b.ban_end);
      const now = new Date();
      const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysLeft > 0) {
        return `Temporary Ban - ${daysLeft} days remaining`;
      } else {
        return 'Ban period expired';
      }
    }

    return 'Ban';
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-4 max-h-[90%]">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-slate-900">Ban Details</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#0f172a" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Ban Info Card */}
            <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <View className="mb-4">
                <Text className="text-slate-600 text-xs font-semibold mb-1">STATUS</Text>
                <View className="flex-row items-center gap-2">
                  <Feather name="alert-circle" size={18} color="#dc2626" />
                  <Text className="text-red-600 font-semibold">{getBanDurationText()}</Text>
                </View>
              </View>

              <View className="mb-4 pb-4 border-b border-red-200">
                <Text className="text-slate-600 text-xs font-semibold mb-1">REASON FOR BAN</Text>
                <Text className="text-slate-900">{localBan?.ban_reason || ban?.ban_reason || 'Policy Violation'}</Text>
              </View>

              <View className="flex-row gap-4 mb-4 pb-4 border-b border-red-200">
                <View className="flex-1">
                  <Text className="text-slate-600 text-xs font-semibold mb-1">BAN TYPE</Text>
                  <Text className="text-slate-900">{localBan?.ban_type || ban?.ban_type || 'PERMANENT'}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-slate-600 text-xs font-semibold mb-1">BANNED ON</Text>
                  <Text className="text-slate-900">
                    {ban?.ban_start ? new Date(ban.ban_start).toLocaleDateString() : 'N/A'}
                  </Text>
                </View>
              </View>

              {ban?.ban_end && (
                <View>
                  <Text className="text-slate-600 text-xs font-semibold mb-1">BAN EXPIRES</Text>
                  <Text className="text-slate-900">{new Date(ban.ban_end).toLocaleDateString()}</Text>
                </View>
              )}
            </View>

            {/* Info Box */}
            <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <View className="flex-row gap-3">
                <Feather name="info" size={20} color="#2563eb" />
                <View className="flex-1">
                  <Text className="text-blue-900 font-semibold text-sm mb-1">What is this?</Text>
                  <Text className="text-blue-800 text-xs">
                    Your account has been banned due to policy violations. You can submit an appeal requesting review of this decision.
                  </Text>
                </View>
              </View>
            </View>

            {/* Appeal Form Section */}
            {!showAppealForm ? (
              <TouchableOpacity
                onPress={() => setShowAppealForm(true)}
                className="bg-blue-600 rounded-lg py-3 items-center"
              >
                <View className="flex-row items-center gap-2">
                  <Feather name="send" size={18} color="white" />
                  <Text className="text-white font-semibold">Submit Appeal</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View>
                <Text className="text-slate-900 font-semibold mb-2">Request Ban Appeal</Text>
                <Text className="text-slate-600 text-sm mb-3">
                  Explain why you believe this ban should be lifted. Our team will review your request carefully.
                </Text>

                <TextInput
                  multiline
                  numberOfLines={5}
                  placeholder="Enter your appeal reason..."
                  placeholderTextColor="#94a3b8"
                  value={reason}
                  onChangeText={setReason}
                  className="border border-slate-300 rounded-lg p-3 text-slate-900 mb-2"
                  editable={!loading}
                  textAlignVertical="top"
                />

                <Text className="text-xs text-slate-500 mb-4">
                  {reason.length} characters (minimum 10)
                </Text>

                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => {
                      setShowAppealForm(false);
                      setReason('');
                    }}
                    className="flex-1 bg-slate-200 rounded-lg py-3 items-center"
                    disabled={loading}
                  >
                    <Text className="text-slate-800 font-semibold">Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSubmitAppeal}
                    className="flex-1 bg-blue-600 rounded-lg py-3 items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white font-semibold">Submit Appeal</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View className="h-4" />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
