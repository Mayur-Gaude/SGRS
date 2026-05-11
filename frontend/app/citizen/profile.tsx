import React from 'react';
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AppBar from '../../components/AppBar';

export default function ProfilePage() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <AppBar />

      <ScrollView className="px-4 pt-4 pb-10">

        {/* ===== TOP PROFILE CARD ===== */}
        <View className="bg-white rounded-2xl p-4 shadow-sm items-center mb-4">

          {/* Avatar Box */}
          <View className="relative">
            <Image
              source={{ uri: 'https://i.pravatar.cc/150' }}
              className="w-24 h-24 rounded-xl"
            />

            {/* Camera Icon */}
            <TouchableOpacity className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full">
              <Feather name="camera" size={14} color="white" />
            </TouchableOpacity>
          </View>

          {/* Name */}
          <Text className="text-lg font-bold text-slate-900 mt-3">
            Max Fernandes
          </Text>

          {/* Citizen ID */}
          <Text className="text-slate-500 text-sm">
            Citizen ID: CITZ-203984
          </Text>

          {/* Active Tag */}
          <View className="bg-green-100 px-3 py-1 rounded-full mt-2">
            <Text className="text-green-700 text-xs font-semibold">Active</Text>
          </View>

        </View>

        {/* ===== PERSONAL INFORMATION ===== */}
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">

          {/* Header */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-slate-900 font-bold text-base">
              Personal Information
            </Text>

            <TouchableOpacity>
              <Feather name="edit-2" size={18} color="#2563eb" />
            </TouchableOpacity>
          </View>

          {/* Info Items */}
          <View className="flex-row items-center mb-2">
            <Feather name="mail" size={16} color="#64748b" />
            <Text className="ml-2 text-slate-700">max@gmail.com</Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Feather name="phone" size={16} color="#64748b" />
            <Text className="ml-2 text-slate-700">+91 9876543210</Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Feather name="map-pin" size={16} color="#64748b" />
            <Text className="ml-2 text-slate-700">
              Goa, India
            </Text>
          </View>

          <View className="flex-row items-center">
            <Feather name="calendar" size={16} color="#64748b" />
            <Text className="ml-2 text-slate-700">Member since: 2024</Text>
          </View>

        </View>

        {/* ===== ACCOUNT STATISTICS ===== */}
        <View className="bg-white rounded-2xl p-8 shadow-sm mb-4">
          <Text className="text-slate-900 font-bold text-base mb-3">
            Account Statistics
          </Text>

          <View className="flex-row justify-between">

            <View className="items-center">
              <Text className="text-lg font-bold text-blue-600">25</Text>
              <Text className="text-slate-500 text-xs">Total</Text>
            </View>

            <View className="items-center">
              <Text className="text-lg font-bold text-orange-500">8</Text>
              <Text className="text-slate-500 text-xs">Pending</Text>
            </View>

            <View className="items-center">
              <Text className="text-lg font-bold text-green-600">17</Text>
              <Text className="text-slate-500 text-xs">Resolved</Text>
            </View>

          </View>
        </View>

        {/* ===== ACCOUNT HEALTH BOX ===== */}
        <View className="bg-green-50 rounded-2xl p-4 mb-4 border border-green-200">

          <Text className="text-green-800 font-bold mb-2">
            Account in Good Standing
          </Text>
          <Text className="text-green-800 font-semibold mb-2 ">
            No violation detected.Keep up the good work!
          </Text>

          {/* Score Bar */}
          <View className="w-full h-2 bg-green-200 rounded-full overflow-hidden">
            <View className="h-2 bg-green-600 w-[80%]" />
          </View>

          <Text className="text-green-700 text-xs mt-1">
            Trust Score: 80%
          </Text>

        </View>

        {/* ===== VIEW BAN HISTORY BUTTON ===== */}
        <TouchableOpacity className="bg-white border border-red-300 py-3 rounded-xl mb-3">
          <Text className="text-red-600 text-center font-semibold">
            View Ban History
          </Text>
        </TouchableOpacity>

        {/* ===== UPDATE DETAILS BUTTON ===== */}
        <TouchableOpacity className="bg-blue-600 py-4 rounded-xl">
          <Text className="text-white text-center font-semibold text-lg">
            Update Details
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}