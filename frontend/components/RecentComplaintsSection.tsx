import React, { useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

type Complaint = {
  _id?: string;
  id?: string;
  complaint_number?: string;
  title?: string;
  description?: string;
  status?: string;
  createdAt?: string;
};

interface RecentComplaintsSectionProps {
  complaints: Complaint[];
  loading: boolean;
  onComplaintPress: (complaint: Complaint) => void;
}

const getStatusColor = (status?: string) => {
  const s = (status || '').toUpperCase();
  if (s === 'RESOLVED' || s === 'CLOSED') return '#10b981';
  if (s === 'REJECTED') return '#ef4444';
  if (s === 'UNDER_REVIEW') return '#f59e0b';
  return '#6b7280';
};

const getStatusIcon = (status?: string) => {
  const s = (status || '').toUpperCase();
  if (s === 'RESOLVED' || s === 'CLOSED') return 'check-circle';
  if (s === 'REJECTED') return 'x-circle';
  if (s === 'UNDER_REVIEW') return 'clock';
  return 'alert-circle';
};

export default function RecentComplaintsSection({
  complaints,
  loading,
  onComplaintPress,
}: RecentComplaintsSectionProps) {
  const router = useRouter();

  // Get recent 3 complaints sorted by date
  const recentComplaints = useMemo(() => {
    return [...complaints]
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 3);
  }, [complaints]);

  return (
    <View className="px-4 mt-8 mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-slate-900 text-base font-bold">Recent Complaints</Text>
        <TouchableOpacity
          onPress={() => router.push('/citizen/create-grievance')}
          activeOpacity={0.6}
        >
          <Text className="text-blue-600 text-sm font-semibold">View All →</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="py-4 items-center">
          <ActivityIndicator color="#2563eb" size="small" />
          <Text className="text-slate-500 text-xs mt-2">Loading complaints...</Text>
        </View>
      ) : recentComplaints.length === 0 ? (
        <View className="bg-white rounded-xl p-6 border border-slate-200 items-center">
          <Feather name="inbox" size={32} color="#cbd5e1" />
          <Text className="text-slate-500 text-sm mt-3 font-medium">No complaints yet</Text>
          <Text className="text-slate-400 text-xs mt-1">Start by filing your first complaint</Text>
        </View>
      ) : (
        <View className="space-y-2">
          {recentComplaints.map((complaint) => {
            const complaintId = complaint._id || complaint.id;
            const formattedDate = complaint.createdAt
              ? new Date(complaint.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : 'N/A';

            return (
              <TouchableOpacity
                key={complaintId}
                className="bg-white rounded-lg p-3 border border-slate-200 flex-row items-start active:bg-slate-50"
                activeOpacity={0.7}
                onPress={() => onComplaintPress(complaint)}
              >
                {/* Status Icon */}
                <View className="mt-0.5">
                  <Feather
                    name={getStatusIcon(complaint.status)}
                    size={18}
                    color={getStatusColor(complaint.status)}
                  />
                </View>

                {/* Content */}
                <View className="flex-1 ml-3">
                  <Text className="text-slate-900 font-semibold text-sm" numberOfLines={1}>
                    {complaint.title || 'Untitled Complaint'}
                  </Text>
                  <Text className="text-slate-500 text-xs mt-1" numberOfLines={1}>
                    {complaint.complaint_number || 'No number'}
                  </Text>
                </View>

                {/* Status & Date */}
                <View className="items-end ml-2">
                  <View
                    style={{
                      backgroundColor: getStatusColor(complaint.status) + '20',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      marginBottom: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '600',
                        color: getStatusColor(complaint.status),
                      }}
                      numberOfLines={1}
                    >
                      {(complaint.status || 'SUBMITTED').toUpperCase().replace(/_/g, ' ')}
                    </Text>
                  </View>
                  <Text className="text-slate-400 text-xs">{formattedDate}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
