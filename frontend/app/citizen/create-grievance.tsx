import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import AppBar from '../../components/AppBar';
import { getComplaints } from '../../lib/api';
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

const getName = (value: any): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.name || '';
};

const normalizeList = <T,>(res: any): T[] => {
  if (Array.isArray(res)) return res as T[];
  if (Array.isArray(res?.data)) return res.data as T[];
  if (Array.isArray(res?.items)) return res.items as T[];
  return [];
};

export default function MyGrievances() {
  const authToken = useAuthStore((state) => state.token) || undefined;

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [loadingComplaints, setLoadingComplaints] = useState(false);

  const tags = ['All', 'SUBMITTED', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED', 'CLOSED'];

  const loadComplaints = useCallback(async () => {
    if (!authToken) return;

    setLoadingComplaints(true);
    try {
      const complaintsRes = await getComplaints(authToken);
      setComplaints(normalizeList<Complaint>(complaintsRes));
    } catch (e: any) {
      Alert.alert('Unable to load grievances', e?.message || 'Could not fetch complaint list.');
      setComplaints([]);
    } finally {
      setLoadingComplaints(false);
    }
  }, [authToken]);

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
      <View key={item._id || item.id || item.complaint_number} className="bg-white border border-slate-200 rounded-xl p-4 mb-3">
        <View className="flex-row justify-between items-start">
          <Text className="font-semibold text-slate-900 flex-1 mr-2">{item.title || 'Untitled Complaint'}</Text>
          <Text className={`text-xs font-semibold ${statusColor}`}>{status}</Text>
        </View>

        {!!item.complaint_number && <Text className="text-slate-500 text-xs mt-1">#{item.complaint_number}</Text>}

        {!!item.description && <Text className="text-slate-700 mt-2">{item.description}</Text>}

        <View className="mt-3">
          {!!getName(item.department_id) && <Text className="text-slate-500 text-xs">Department: {getName(item.department_id)}</Text>}
          {!!getName(item.area_id) && <Text className="text-slate-500 text-xs">Area: {getName(item.area_id)}</Text>}
          {!!getName(item.category_id) && <Text className="text-slate-500 text-xs">Category: {getName(item.category_id)}</Text>}
          {!!item.createdAt && (
            <Text className="text-slate-400 text-xs mt-1">{new Date(item.createdAt).toLocaleString()}</Text>
          )}
        </View>
      </View>
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
          <View className="mb-2">{filteredComplaints.map(renderComplaintCard)}</View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
