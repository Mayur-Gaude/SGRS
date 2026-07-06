import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import AppBar from '../../components/AppBar';
import DashboardBox from '../../components/DashboardBox';
import RecentComplaintsSection from '../../components/RecentComplaintsSection';
import FloatingAddButton from '../../components/FloatingAddButton';
import LocationVerifyModal from '../../components/LocationVerifyModal';
import ComplaintDetailsModal from '../../components/ComplaintDetailsModal';
import { getComplaints, getDepartments, getMyProfile, getComplaintMedia } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

type Complaint = {
  _id?: string;
  id?: string;
  complaint_number?: string;
  title?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  department_id?: any;
  area_id?: any;
  category_id?: any;
};

type Department = {
  _id?: string;
  id?: string;
  name?: string;
  description?: string;
};

type UserProfile = {
  full_name?: string;
  email?: string;
  phone?: string;
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

const CitizenDashboard: React.FC = () => {
  const router = useRouter();
  const authToken = useAuthStore((state) => state.token) || undefined;
  const setUser = useAuthStore((state) => state.setUser);
  const [showModal, setShowModal] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  
  // Modal states for viewing complaint details
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [complaintMedia, setComplaintMedia] = useState<ComplaintMedia[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  const verifyLocation = () => {
    setShowModal(false);
  };

  const loadMyComplaints = useCallback(async () => {
    if (!authToken) {
      setComplaints([]);
      return;
    }

    setLoadingStats(true);
    try {
      const res = await getComplaints(authToken);
      setComplaints(normalizeList<Complaint>(res));
    } catch {
      setComplaints([]);
    } finally {
      setLoadingStats(false);
    }
  }, [authToken]);

  const loadUserProfile = useCallback(async () => {
    if (!authToken) {
      setUserProfile(null);
      return;
    }

    setLoadingProfile(true);
    try {
      const res = await getMyProfile(authToken);
      const profile = res?.data || res;
      setUserProfile(profile);
      setUser(profile);

      // If user is banned, show alert and redirect to profile
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
      }
    } catch (e: any) {
      // Check if error is "Account banned"
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
      }
      setUserProfile(null);
    } finally {
      setLoadingProfile(false);
    }
  }, [authToken, setUser, router]);

  const loadDepartments = useCallback(async () => {
    if (!authToken) {
      setDepartments([]);
      return;
    }

    setLoadingDepartments(true);
    try {
      const res = await getDepartments(authToken);
      setDepartments(normalizeList<Department>(res));
    } catch {
      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  }, [authToken]);

  const loadComplaintMedia = useCallback(
    async (complaintId: string) => {
      if (!authToken) return;
      setLoadingMedia(true);
      try {
        const res = await getComplaintMedia(complaintId, authToken);
        setComplaintMedia(normalizeList<ComplaintMedia>(res));
      } catch {
        setComplaintMedia([]);
      } finally {
        setLoadingMedia(false);
      }
    },
    [authToken]
  );

  useFocusEffect(
    useCallback(() => {
      loadMyComplaints();
      loadDepartments();
      loadUserProfile();
    }, [loadMyComplaints, loadDepartments, loadUserProfile])
  );

  // Get department icon based on name
  const getDepartmentIcon = (name?: string) => {
    if (!name) return 'briefcase';
    const n = name.toLowerCase();
    if (n.includes('water')) return 'droplet';
    if (n.includes('electric') || n.includes('power')) return 'zap';
    if (n.includes('road') || n.includes('transport')) return 'truck';
    if (n.includes('house') || n.includes('housing')) return 'home';
    if (n.includes('garbage') || n.includes('waste')) return 'trash-2';
    if (n.includes('security') || n.includes('police')) return 'shield';
    if (n.includes('internet') || n.includes('network')) return 'wifi';
    if (n.includes('health') || n.includes('medical')) return 'heart';
    if (n.includes('education') || n.includes('school')) return 'book';
    if (n.includes('park') || n.includes('garden')) return 'sun';
    return 'briefcase';
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      
      {/* App Bar */}
      <AppBar />

      <ScrollView className="pt-2" showsVerticalScrollIndicator={false}>

        {/* Welcome Box */}
        <View className="bg-blue-600 px-4 py-6 mx-4 rounded-xl mb-4 shadow-md">
          <View className="flex-row items-center mb-2">
            <Text className="text-white text-2xl">👋</Text>
            <Text className="text-white text-xl font-bold ml-2">
              Welcome back, {userProfile?.full_name || 'User'}
            </Text>
          </View>
          <Text className="text-white text-sm mt-1">
            Your grievances matter. Track and manage them all in one place.
          </Text>
        </View>

        {/* Dashboard Grid */}
        {loadingStats ? (
          <View className="px-4 py-6 items-center">
            <ActivityIndicator color="#2563eb" />
            <Text className="text-slate-500 mt-2 text-sm">Loading analytics...</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between px-4 gap-2">
            <DashboardBox icon="alert-circle" title="Total Complaints" number={String(complaints.length)} />
            <DashboardBox icon="check-circle" title="Resolved" number={String(
              complaints.filter((c) => (c.status || '').toUpperCase() === 'RESOLVED').length
            )} />
            <DashboardBox icon="clock" title="Pending" number={String(
              complaints.filter((c) => !['RESOLVED', 'CLOSED', 'REJECTED'].includes((c.status || '').toUpperCase())).length
            )} />
            <DashboardBox icon="user" title="My Complaints" number={String(complaints.length)} />
          </View>
        )}

        {/* Active Departments */}
        <View className="px-4 mt-8">
          <Text className="text-slate-900 text-base font-bold mb-4">Active Departments</Text>

          {loadingDepartments ? (
            <View className="py-6 items-center">
              <ActivityIndicator color="#2563eb" size="small" />
              <Text className="text-slate-500 text-xs mt-2">Loading departments...</Text>
            </View>
          ) : departments.length === 0 ? (
            <View className="bg-white rounded-xl p-6 border border-slate-200 items-center">
              <Feather name="inbox" size={28} color="#cbd5e1" />
              <Text className="text-slate-500 text-sm mt-3">No departments available</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
              {departments.map((dept) => {
                const deptId = dept._id || dept.id;
                return (
                  <TouchableOpacity
                    key={deptId}
                    className="bg-white mr-3 rounded-xl border border-slate-200 w-28 py-4 px-3 items-center justify-start"
                    activeOpacity={0.7}
                  >
                    <View className="bg-blue-100 p-2.5 rounded-lg mb-2">
                      <Feather
                        name={getDepartmentIcon(dept.name)}
                        size={24}
                        color="#2563eb"
                      />
                    </View>
                    <Text className="text-slate-900 font-semibold text-xs text-center leading-4" numberOfLines={2}>
                      {dept.name || 'Department'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>

        {/* Recent Complaints Section Component */}
        <RecentComplaintsSection
          complaints={complaints}
          loading={loadingStats}
          onComplaintPress={(complaint) => {
            setSelectedComplaint(complaint);
            setShowComplaintModal(true);
            const complaintId = complaint._id || complaint.id;
            if (complaintId) {
              loadComplaintMedia(complaintId);
            }
          }}
        />

      </ScrollView>

      {/* Floating + Button */}
      <FloatingAddButton onPress={() => setShowModal(true)} />

      {/* Location Verification Modal */}
      <LocationVerifyModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onVerify={verifyLocation}
      />

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <ComplaintDetailsModal
          visible={showComplaintModal}
          complaint={selectedComplaint}
          media={complaintMedia}
          loadingMedia={loadingMedia}
          onClose={() => {
            setShowComplaintModal(false);
            setSelectedComplaint(null);
            setComplaintMedia([]);
          }}
          resolveMediaUrl={(url?: string) => url || ''}
          onComplaintUpdated={loadMyComplaints}
        />
      )}

    </SafeAreaView>
  );
};

export default CitizenDashboard;