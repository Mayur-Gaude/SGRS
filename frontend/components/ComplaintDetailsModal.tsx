import React from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

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
}: ComplaintDetailsModalProps) {
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
                    const mediaUrl = resolveMediaUrl(m.media_url);
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
            </ScrollView>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
