import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AppBar from '../../components/AppBar';
import ComplaintDetailsModal from '../../components/ComplaintDetailsModal';
import { getComplaintMedia, getComplaints, getMyProfile } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import Constants from 'expo-constants';

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

const normalizeList = <T,>(res: any): T[] => {
  if (Array.isArray(res)) return res as T[];
  if (Array.isArray(res?.data)) return res.data as T[];
  if (Array.isArray(res?.items)) return res.items as T[];
  return [];
};

export default function MyGrievances() {
  const authToken = useAuthStore((state) => state.token) || undefined;
  const router = useRouter();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [complaintMedia, setComplaintMedia] = useState<ComplaintMedia[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const tags = ['All', 'SUBMITTED', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED', 'CLOSED'];

  const loadComplaints = useCallback(async () => {
    if (!authToken) return;

    setLoadingComplaints(true);
    try {
      // First check if user is banned
      const profileRes = await getMyProfile(authToken);
      const profile = profileRes?.data || profileRes;
      
      if (profile?.account_status === 'BANNED') {
        Alert.alert(
          'Account Banned',
          'Your account has been banned. You can view ban details and submit an appeal on your profile page.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/citizen/profile'),
            },
          ]
        );
        return;
      }

      const complaintsRes = await getComplaints(authToken);
      setComplaints(normalizeList<Complaint>(complaintsRes));
    } catch (e: any) {
      // Check if it's a ban error
      if (e?.message?.includes('banned')) {
        Alert.alert(
          'Account Banned',
          'Your account has been banned. You can view ban details and submit an appeal on your profile page.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/citizen/profile'),
            },
          ]
        );
      } else {
        // Only show alert if it's not a ban-related error
        Alert.alert('Unable to load grievances', e?.message || 'Could not fetch complaint list.');
      }
      setComplaints([]);
    } finally {
      setLoadingComplaints(false);
    }
  }, [authToken, router]);

  const getComplaintId = (c: Complaint): string => {
    const value: any = c._id || c.id;
    return typeof value === 'string' ? value : '';
  };

  const getApiBaseUrl = () => {
    const url = (Constants.expoConfig as any)?.extra?.apiUrl || (Constants.manifest as any)?.extra?.apiUrl;
    return (url || '').replace(/\/$/, '');
  };

  const getMediaUrl = (rawUrl?: string) => {
    if (!rawUrl) return '';
    if (/^https?:\/\//i.test(rawUrl) || rawUrl.startsWith('data:') || rawUrl.startsWith('file:')) {
      return rawUrl;
    }
    let normalized = rawUrl.replace(/\\/g, '/').replace(/^\/+/, '');
    const uploadsPos = normalized.toLowerCase().indexOf('uploads/');
    if (uploadsPos >= 0) {
      normalized = normalized.slice(uploadsPos);
    }
    const encoded = encodeURI(normalized);
    const base = getApiBaseUrl();
    return base ? `${base}/${encoded}` : encoded;
  };

  const openComplaintDetails = async (complaint: Complaint) => {
    const complaintId = getComplaintId(complaint);
    setSelectedComplaint(complaint);
    setComplaintMedia([]);

    if (!complaintId || !authToken) return;

    setLoadingMedia(true);
    try {
      const mediaRes = await getComplaintMedia(complaintId, authToken);
      setComplaintMedia(normalizeList<ComplaintMedia>(mediaRes));
    } catch {
      setComplaintMedia([]);
    } finally {
      setLoadingMedia(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadComplaints();
    }, [loadComplaints])
  );

  const filteredComplaints = useMemo(() => {
    const q = search.trim().toLowerCase();
    return complaints.filter((c) => {
      const statusMatch = activeTag === 'All' || (c.status || '').toUpperCase() === activeTag;
      const titleMatch = (c.title || '').toLowerCase().includes(q);
      const numberMatch = (c.complaint_number || '').toLowerCase().includes(q);
      return statusMatch && (!q || titleMatch || numberMatch);
    });
  }, [complaints, activeTag, search]);

  const renderComplaintCard = (item: Complaint) => {
    const status = (item.status || 'SUBMITTED').toUpperCase();
    const statusColor =
      status === 'RESOLVED' ? 'text-emerald-600' : status === 'REJECTED' ? 'text-red-600' : 'text-amber-600';

    return (
      <TouchableOpacity
        onPress={() => openComplaintDetails(item)}
        activeOpacity={0.9}
        className="bg-white border border-slate-200 rounded-xl p-4 mb-3"
      >
        <View className="flex-row justify-between items-start">
          <Text className="font-semibold text-slate-900 flex-1 mr-2">{item.title || 'Untitled Complaint'}</Text>
          <Text className={`text-xs font-semibold ${statusColor}`}>{status}</Text>
        </View>

        {!!item.complaint_number && <Text className="text-slate-500 text-xs mt-1">#{item.complaint_number}</Text>}

        <Text className="text-slate-400 text-xs mt-2">Tap to view full details</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <AppBar />

      <ScrollView className="px-4 pt-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-xl font-bold text-slate-900 mb-3">My Grievances</Text>

        <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-3 py-2 mb-4">
          <Feather name="search" size={18} color="#64748b" />
          <TextInput
            placeholder="Search by title or complaint number"
            value={search}
            onChangeText={setSearch}
            className="ml-2 flex-1 text-slate-800"
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {tags.map((tag) => (
            <TouchableOpacity
              key={tag}
              onPress={() => setActiveTag(tag)}
              className={`px-4 py-2 mr-2 rounded-full border ${
                activeTag === tag ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'
              }`}
            >
              <Text className={`${activeTag === tag ? 'text-white' : 'text-slate-700'} font-medium`}>
                {tag === 'All' ? 'All' : tag.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loadingComplaints ? (
          <View className="py-8 items-center">
            <ActivityIndicator color="#2563eb" />
            <Text className="text-slate-500 mt-2">Loading grievances...</Text>
          </View>
        ) : filteredComplaints.length === 0 ? (
          <View className="mt-4">
            <Text className="text-slate-500 text-center mt-10">No grievances found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredComplaints}
            keyExtractor={(item, index) => String(item._id || item.id || item.complaint_number || index)}
            renderItem={({ item }) => renderComplaintCard(item)}
            scrollEnabled={false}
            removeClippedSubviews
            initialNumToRender={6}
            windowSize={5}
            maxToRenderPerBatch={8}
            updateCellsBatchingPeriod={50}
            contentContainerStyle={{ paddingBottom: 8 }}
          />
        )}
      </ScrollView>

      <ComplaintDetailsModal
        visible={!!selectedComplaint}
        complaint={selectedComplaint}
        media={complaintMedia}
        loadingMedia={loadingMedia}
        onClose={() => setSelectedComplaint(null)}
        resolveMediaUrl={getMediaUrl}
        onComplaintUpdated={loadComplaints}
      />
    </SafeAreaView>
  );
}
