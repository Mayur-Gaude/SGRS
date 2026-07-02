import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { createBanAppeal } from '../lib/api';
import { useAuthStore } from '../store/authStore';

interface AppealFormProps {
  visible: boolean;
  banId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AppealForm({ visible, banId, onClose, onSuccess }: AppealFormProps) {
  const authToken = useAuthStore((state) => state.token) || undefined;
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
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
      await createBanAppeal(banId, reason, authToken);
      Alert.alert('Success', 'Your appeal has been submitted successfully. Our team will review it shortly.');
      setReason('');
      onClose();
      onSuccess?.();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit appeal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-slate-900">Request Ban Appeal</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#0f172a" />
            </TouchableOpacity>
          </View>

          <Text className="text-slate-600 text-sm mb-4">
            Please explain why you believe your ban should be lifted. Our team will review your appeal carefully.
          </Text>

          <TextInput
            multiline
            numberOfLines={6}
            placeholder="Enter your appeal reason..."
            placeholderTextColor="#94a3b8"
            value={reason}
            onChangeText={setReason}
            className="border border-slate-300 rounded-lg p-3 text-slate-900 mb-4"
            editable={!loading}
            textAlignVertical="top"
          />

          <Text className="text-xs text-slate-500 mb-4">
            {reason.length} characters (minimum 10)
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => {
                onClose();
                setReason('');
              }}
              className="flex-1 bg-slate-200 rounded-lg py-3 items-center"
              disabled={loading}
            >
              <Text className="text-slate-800 font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
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
      </View>
    </Modal>
  );
}
