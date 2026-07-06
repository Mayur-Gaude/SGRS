import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { resolveMediaUrl as resolveMediaUrlHelper } from '../lib/media';
import { requestReopen, submitFeedback } from '../lib/api';
import { useAuthStore } from '../store/authStore';

type IdRef = string | { _id?: string; id?: string; name?: string };

type Complaint = {
  _id?: string;
  id?: string;
  complaint_number?: string;
  title?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  department_id?: IdRef;
  area_id?: IdRef;
  category_id?: IdRef;
};

type ComplaintMedia = {
  _id?: string;
  id?: string;
  media_url?: string;
  media_type?: string;
  createdAt?: string;
};

interface ComplaintDetailsModalProps {
  visible: boolean;
  complaint: Complaint | null;
  media: ComplaintMedia[];
  loadingMedia: boolean;
  onClose: () => void;
  resolveMediaUrl: (rawUrl?: string) => string;
  onComplaintUpdated?: () => void;
}

const getName = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.name || '';
};

export default function ComplaintDetailsModal({
  visible,
  complaint,
  media,
  loadingMedia,
  onClose,
  resolveMediaUrl,
  onComplaintUpdated,
}: ComplaintDetailsModalProps) {
  const authToken = useAuthStore((state) => state.token) || undefined;
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [reopenReason, setReopenReason] = useState('');
  const [loading, setLoading] = useState(false);

  const isResolved = (complaint?.status || '').toUpperCase() === 'RESOLVED';

  const handleFeedback = async () => {
    if (feedbackRating === 0) {
      Alert.alert('Rating Required', 'Please select a rating');
      return;
    }

    if (!complaint?._id && !complaint?.id) {
      Alert.alert('Error', 'Complaint ID not found');
      return;
    }

    setLoading(true);
    try {
      const complaintId = complaint._id || complaint.id;
      await submitFeedback(complaintId as string, feedbackRating, feedbackComment, authToken);
      Alert.alert('Success', 'Feedback submitted successfully');
      setFeedbackComment('');
      setFeedbackRating(0);
      setShowFeedbackModal(false);
      onComplaintUpdated?.();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleReopen = async () => {
    if (!reopenReason.trim()) {
      Alert.alert('Empty Reason', 'Please enter a reason for reopening');
      return;
    }

    if (!complaint?._id && !complaint?.id) {
      Alert.alert('Error', 'Complaint ID not found');
      return;
    }

    setLoading(true);
    try {
      const complaintId = complaint._id || complaint.id;
      await requestReopen(complaintId as string, reopenReason, authToken);
      Alert.alert('Success', 'Reopen request submitted successfully');
      setReopenReason('');
      setShowReopenModal(false);
      onClose();
      onComplaintUpdated?.();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to request reopening');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-4 max-h-[85%]">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-bold text-slate-900">Complaint Details</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={20} color="#0f172a" />
            </TouchableOpacity>
          </View>

          {complaint ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-slate-900 font-semibold mb-1">{complaint.title || 'Untitled Complaint'}</Text>
              {!!complaint.complaint_number && <Text className="text-slate-500 text-xs mb-2">{complaint.complaint_number}</Text>}

              <View className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3">
                <Text className="text-slate-700 text-xs mb-1">Status: {(complaint.status || 'SUBMITTED').toUpperCase()}</Text>
                {!!getName(complaint.department_id) && (
                  <Text className="text-slate-700 text-xs mb-1">Department: {getName(complaint.department_id)}</Text>
                )}
                {!!getName(complaint.area_id) && <Text className="text-slate-700 text-xs mb-1">Area: {getName(complaint.area_id)}</Text>}
                {!!getName(complaint.category_id) && (
                  <Text className="text-slate-700 text-xs mb-1">Category: {getName(complaint.category_id)}</Text>
                )}
                {!!complaint.createdAt && (
                  <Text className="text-slate-700 text-xs">Filed At: {new Date(complaint.createdAt).toLocaleString()}</Text>
                )}
              </View>

              {!!complaint.description && <Text className="text-slate-700 mb-3">{complaint.description}</Text>}

              <Text className="text-slate-800 font-semibold mb-2">Uploaded Media</Text>
              {loadingMedia ? (
                <View className="py-4 items-center">
                  <ActivityIndicator color="#2563eb" />
                </View>
              ) : media.length === 0 ? (
                <Text className="text-slate-500 text-sm mb-3">No media uploaded for this complaint.</Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
                  {media.map((m) => {
                    const mediaUrl = resolveMediaUrl(m.media_url) || resolveMediaUrlHelper(m.media_url);
                    if (!mediaUrl) return null;

                    return (
                      <Image
                        key={m._id || m.id || mediaUrl}
                        source={{ uri: mediaUrl }}
                        style={{ width: 120, height: 120, borderRadius: 12, marginRight: 10 }}
                      />
                    );
                  })}
                </ScrollView>
              )}

              {isResolved && (
                <View className="flex-row gap-2 mt-4 pt-4 border-t border-slate-200">
                  <TouchableOpacity
                    onPress={() => setShowFeedbackModal(true)}
                    className="flex-1 bg-blue-600 rounded-lg py-3 items-center"
                    disabled={loading}
                  >
                    <Text className="text-white font-semibold">Feedback</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowReopenModal(true)}
                    className="flex-1 bg-orange-500 rounded-lg py-3 items-center"
                    disabled={loading}
                  >
                    <Text className="text-white font-semibold">Reopen</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          ) : null}
        </View>
      </View>

      {/* Feedback Modal */}
      <Modal visible={showFeedbackModal} transparent animationType="fade" onRequestClose={() => setShowFeedbackModal(false)}>
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-lg font-bold text-slate-900 mb-4">Submit Feedback</Text>
            
            {/* Rating Section */}
            <View className="mb-4">
              <Text className="text-sm text-slate-700 font-semibold mb-2">How would you rate the resolution?</Text>
              <View className="flex-row justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setFeedbackRating(star)}
                    disabled={loading}
                  >
                    <Feather
                      name="star"
                      size={28}
                      color={star <= feedbackRating ? '#fbbf24' : '#d1d5db'}
                      fill={star <= feedbackRating ? '#fbbf24' : 'transparent'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Comment Section */}
            <TextInput
              multiline
              numberOfLines={4}
              placeholder="Any additional comments? (Optional)"
              placeholderTextColor="#94a3b8"
              value={feedbackComment}
              onChangeText={setFeedbackComment}
              className="border border-slate-300 rounded-lg p-3 text-slate-900 mb-4"
              editable={!loading}
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  setShowFeedbackModal(false);
                  setFeedbackComment('');
                  setFeedbackRating(0);
                }}
                className="flex-1 bg-slate-200 rounded-lg py-3 items-center"
                disabled={loading}
              >
                <Text className="text-slate-800 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleFeedback}
                className="flex-1 bg-blue-600 rounded-lg py-3 items-center"
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-semibold">Submit</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reopen Modal */}
      <Modal visible={showReopenModal} transparent animationType="fade" onRequestClose={() => setShowReopenModal(false)}>
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-lg font-bold text-slate-900 mb-2">Request Reopening</Text>
            <Text className="text-slate-600 text-sm mb-4">Why do you want to reopen this complaint?</Text>
            <TextInput
              multiline
              numberOfLines={6}
              placeholder="Please provide a reason..."
              placeholderTextColor="#94a3b8"
              value={reopenReason}
              onChangeText={setReopenReason}
              className="border border-slate-300 rounded-lg p-3 text-slate-900 mb-4"
              editable={!loading}
            />
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  setShowReopenModal(false);
                  setReopenReason('');
                }}
                className="flex-1 bg-slate-200 rounded-lg py-3 items-center"
                disabled={loading}
              >
                <Text className="text-slate-800 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleReopen}
                className="flex-1 bg-orange-500 rounded-lg py-3 items-center"
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-semibold">Request</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}
