import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import AppBar from '../../components/AppBar';
import ComplaintDetailsModal from '../../components/ComplaintDetailsModal';
import {
  deleteNotification,
  getComplaintById,
  getComplaintMedia,
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../lib/api';
import { resolveMediaUrl } from '../../lib/media';
import { useAuthStore } from '../../store/authStore';

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

type NotificationItem = {
  _id: string;
  title?: string;
  message?: string;
  type?: string;
  is_read?: boolean;
  createdAt?: string;
  complaint_id?: string | {
    _id?: string;
    complaint_number?: string;
    title?: string;
    status?: string;
  };
};

const normalizeList = <T,>(res: any): T[] => {
  if (Array.isArray(res)) return res as T[];
  if (Array.isArray(res?.data)) return res.data as T[];
  if (Array.isArray(res?.items)) return res.items as T[];
  return [];
};

const normalizeNotifications = (res: any): { items: NotificationItem[]; unreadCount: number } => {
  const data = res?.data || res || {};
  const items = Array.isArray(data.items) ? data.items : [];
  const unreadCount = Number(data.unreadCount || 0);
  return { items, unreadCount };
};

export default function CitizenNotificationsScreen() {
  const authToken = useAuthStore((state) => state.token) || undefined;

  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [complaintMedia, setComplaintMedia] = useState<ComplaintMedia[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const loadNotifications = useCallback(async (isRefresh = false) => {
    if (!authToken) {
      setItems([]);
      setUnreadCount(0);
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await getMyNotifications(authToken);
      const parsed = normalizeNotifications(res);
      setItems(parsed.items);
      setUnreadCount(parsed.unreadCount);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [authToken]);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications])
  );

  const getComplaintIdFromNotification = (item: NotificationItem) => {
    const value = item?.complaint_id;
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value._id || '';
  };

  const getComplaintNumberFromNotification = (item: NotificationItem) => {
    const value = item?.complaint_id;
    if (!value || typeof value === 'string') return '';
    return value.complaint_number || '';
  };

  const onOpenItem = async (item: NotificationItem) => {
    if (!authToken) return;
    if (!item.is_read) {
      try {
        await markNotificationRead(item._id, authToken);
        setItems((prev) => prev.map((n) => (n._id === item._id ? { ...n, is_read: true } : n)));
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      } catch {
        // Ignore read failures to keep UX smooth.
      }
    }

    const complaintId = getComplaintIdFromNotification(item);
    if (complaintId) {

      setLoadingMedia(true);
      setComplaintMedia([]);

      try {
        const [complaintRes, mediaRes] = await Promise.all([
          getComplaintById(complaintId, authToken),
          getComplaintMedia(complaintId, authToken),
        ]);

        const complaintPayload = complaintRes?.data || complaintRes;
        const complaint = complaintPayload?.complaint || complaintPayload;
        setSelectedComplaint(complaint || null);
        setComplaintMedia(normalizeList<ComplaintMedia>(mediaRes));
      } catch {
        const fallback = typeof item.complaint_id === 'object' ? item.complaint_id : null;
        if (fallback) {
          setSelectedComplaint({
            _id: fallback._id,
            complaint_number: fallback.complaint_number,
            title: fallback.title,
            status: fallback.status,
          });
        }
        setComplaintMedia([]);
      } finally {
        setLoadingMedia(false);
      }
    }
  };

  const subtitle = useMemo(() => {
    if (unreadCount <= 0) return 'All caught up';
    return `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`;
  }, [unreadCount]);

  const onMarkAllRead = async () => {
    if (!authToken) return;
    try {
      await markAllNotificationsRead(authToken);
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      // Keep UI unchanged if request fails.
    }
  };

  const onDeleteItem = (item: NotificationItem) => {
    if (!authToken) return;

    Alert.alert('Delete notification', 'Are you sure you want to delete this notification?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteNotification(item._id, authToken);
            setItems((prev) => prev.filter((n) => n._id !== item._id));
            if (!item.is_read) {
              setUnreadCount((prev) => Math.max(prev - 1, 0));
            }
          } catch {
            Alert.alert('Delete failed', 'Unable to delete this notification.');
          }
        },
      },
    ]);
  };

  const renderRightActions = (item: NotificationItem) => (
    <TouchableOpacity
      onPress={() => onDeleteItem(item)}
      className="mt-2 ml-2 bg-red-600 rounded-xl items-center justify-center px-5"
      activeOpacity={0.9}
    >
      <Feather name="trash-2" size={18} color="#ffffff" />
      <Text className="text-white text-xs font-semibold mt-1">Delete</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <AppBar />

      <View className="px-4 pt-3 pb-2 flex-row items-center justify-between">
        <View>
          <Text className="text-slate-900 text-xl font-bold">Notifications</Text>
          <Text className="text-slate-500 text-xs mt-1">{subtitle}</Text>
        </View>
        <TouchableOpacity onPress={onMarkAllRead} className="px-3 py-2 rounded-lg border border-slate-200 bg-white">
          <Text className="text-slate-700 text-xs font-semibold">Mark all read</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#2563eb" />
          <Text className="text-slate-500 mt-2">Loading notifications...</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadNotifications(true)} />}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {items.length === 0 ? (
            <View className="bg-white border border-slate-200 rounded-xl p-5 mt-2 items-center">
              <Feather name="bell-off" size={22} color="#64748b" />
              <Text className="text-slate-700 font-semibold mt-2">No notifications yet</Text>
              <Text className="text-slate-500 text-xs mt-1 text-center">You will see updates here when complaint status changes.</Text>
            </View>
          ) : (
            items.map((item) => (
              <Swipeable key={item._id} renderRightActions={() => renderRightActions(item)} overshootRight={false}>
                <TouchableOpacity
                  onPress={() => onOpenItem(item)}
                  className={`mt-2 rounded-xl border p-4 ${item.is_read ? 'bg-white border-slate-200' : 'bg-blue-50 border-blue-200'}`}
                >
                  <View className="flex-row items-start justify-between">
                    <Text className="text-slate-900 font-bold flex-1 pr-2">{item.title || 'Notification'}</Text>
                    {!item.is_read && <View className="w-2 h-2 rounded-full bg-blue-600 mt-1" />}
                  </View>
                  <Text className="text-slate-600 text-sm mt-1">{item.message || ''}</Text>
                  <View className="flex-row items-center justify-between mt-2">
                    <Text className="text-slate-400 text-xs">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
                    </Text>
                    {getComplaintNumberFromNotification(item) ? (
                      <Text className="text-blue-700 text-xs font-semibold">{getComplaintNumberFromNotification(item)}</Text>
                    ) : null}
                  </View>
                </TouchableOpacity>
              </Swipeable>
            ))
          )}
        </ScrollView>
      )}

      <ComplaintDetailsModal
        visible={!!selectedComplaint}
        complaint={selectedComplaint}
        media={complaintMedia}
        loadingMedia={loadingMedia}
        onClose={() => setSelectedComplaint(null)}
        resolveMediaUrl={resolveMediaUrl}
        onComplaintUpdated={() => loadNotifications(false)}
      />
    </SafeAreaView>
  );
}
