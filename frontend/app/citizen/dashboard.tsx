import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import AppBar from '../../components/AppBar';
import DashboardBox from '../../components/DashboardBox';
import CategoryBox from '../../components/CategoryBox';
import FloatingAddButton from '../../components/FloatingAddButton';
import LocationVerifyModal from '../../components/LocationVerifyModal';
import { getComplaints } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

type Complaint = {
  _id?: string;
  id?: string;
  status?: string;
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
  const [showModal, setShowModal] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

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

  useFocusEffect(
    useCallback(() => {
      loadMyComplaints();
    }, [loadMyComplaints])
  );

  const stats = useMemo(() => {
    const total = complaints.length;
    const resolved = complaints.filter((c) => (c.status || '').toUpperCase() === 'RESOLVED').length;
    const closed = complaints.filter((c) => (c.status || '').toUpperCase() === 'CLOSED').length;
    const rejected = complaints.filter((c) => (c.status || '').toUpperCase() === 'REJECTED').length;
    const pending = Math.max(total - resolved - closed - rejected, 0);

    return {
      total,
      resolved,
      pending,
      mine: total,
    };
  }, [complaints]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      
      {/* App Bar */}
      <AppBar />

      <ScrollView className="pt-2">

        {/* Welcome Box */}
        {/* Welcome Box */}
        <View className="bg-blue-600 px-4 py-6 mx-4 rounded-xl mb-4 shadow-md">
          <Text className="text-white text-xl font-bold">
            Welcome back 👋
          </Text>
          <Text className="text-white text-sm mt-2">
            Edit this text later
          </Text>
        </View>

        {/* Dashboard Grid */}
        {loadingStats ? (
          <View className="px-4 py-6 items-center">
            <ActivityIndicator color="#2563eb" />
            <Text className="text-slate-500 mt-2">Loading analytics...</Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between px-4">
            <DashboardBox icon="alert-circle" title="Total Complaints" number={String(stats.total)} />
            <DashboardBox icon="check-circle" title="Resolved Complaints" number={String(stats.resolved)} />
            <DashboardBox icon="clock" title="Pending Complaints" number={String(stats.pending)} />
            <DashboardBox icon="user" title="My Complaints" number={String(stats.mine)} />
          </View>
        )}

        {/* Quick Categories */}
        <View className="px-4 mt-6">
          <Text className="text-black text-[15px] font-bold mb-3">
            Quick Categories
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <CategoryBox icon="droplet" title="Water" color="#2563eb" />
            <CategoryBox icon="zap" title="Electricity" color="#2563eb" />
            <CategoryBox icon="truck" title="Road" color="#2563eb" />
            <CategoryBox icon="home" title="Housing" color="#2563eb" />
            <CategoryBox icon="trash-2" title="Garbage" color="#2563eb" />
            <CategoryBox icon="shield" title="Security" color="#2563eb" />
            <CategoryBox icon="wifi" title="Internet" color="#2563eb" />
          </ScrollView>
        </View>

      </ScrollView>

      {/* Floating + Button */}
      <FloatingAddButton onPress={() => setShowModal(true)} />

      {/* Location Verification Modal */}
      <LocationVerifyModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onVerify={verifyLocation}
      />

    </SafeAreaView>
  );
};

export default CitizenDashboard;