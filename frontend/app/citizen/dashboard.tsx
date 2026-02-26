import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import AppBar from '../../components/AppBar';
import DashboardBox from '../../components/DashboardBox';
import CategoryBox from '../../components/CategoryBox';
import FloatingAddButton from '../../components/FloatingAddButton';
import LocationVerifyModal from '../../components/LocationVerifyModal';

const CitizenDashboard: React.FC = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const verifyLocation = () => {
    setShowModal(false);
    alert("Location verification coming soon 🚀");
  };

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
        <View className="flex-row flex-wrap justify-between px-4">
          <DashboardBox icon="alert-circle" title="Total Complaints" number="120" />
          <DashboardBox icon="check-circle" title="Resolved Complaints" number="85" />
          <DashboardBox icon="clock" title="Pending Complaints" number="35" />
          <DashboardBox icon="user" title="My Complaints" number="10" />
        </View>

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