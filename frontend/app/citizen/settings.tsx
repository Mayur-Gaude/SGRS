import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AppBar from '../../components/AppBar';
import { useAuthStore } from '../../store/authStore';

export default function CitizenSettingsPage() {
  const router = useRouter();
  const clearToken = useAuthStore((state) => state.clearToken);

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const onPressPlaceholder = (title: string) => {
    Alert.alert(title, 'This action can be implemented in the next phase.');
  };

  const onLogout = () => {
    clearToken();
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <AppBar />

      <ScrollView className="px-4 pt-4" contentContainerStyle={{ paddingBottom: 120 }}>
        <Text className="text-2xl font-bold text-slate-900 mb-4">Settings</Text>

        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <Text className="text-slate-900 font-bold text-base mb-3">Notifications</Text>

          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center">
              <Feather name="bell" size={16} color="#475569" />
              <Text className="text-slate-700 ml-2">Push Notifications</Text>
            </View>
            <Switch value={pushNotifications} onValueChange={setPushNotifications} />
          </View>

          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center">
              <Feather name="mail" size={16} color="#475569" />
              <Text className="text-slate-700 ml-2">Email Notifications</Text>
            </View>
            <Switch value={emailNotifications} onValueChange={setEmailNotifications} />
          </View>
        </View>

        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <Text className="text-slate-900 font-bold text-base mb-3">App Preferences</Text>

          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center">
              <Feather name="map-pin" size={16} color="#475569" />
              <Text className="text-slate-700 ml-2">Location Services</Text>
            </View>
            <Switch value={locationEnabled} onValueChange={setLocationEnabled} />
          </View>

          <View className="flex-row items-center justify-between py-2">
            <View className="flex-row items-center">
              <Feather name="moon" size={16} color="#475569" />
              <Text className="text-slate-700 ml-2">Dark Mode</Text>
            </View>
            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>
        </View>

        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <Text className="text-slate-900 font-bold text-base mb-2">Security</Text>

          <TouchableOpacity className="py-3 border-b border-slate-200" onPress={() => onPressPlaceholder('Change Password')}>
            <Text className="text-slate-700">Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity className="py-3" onPress={() => onPressPlaceholder('Manage Devices')}>
            <Text className="text-slate-700">Manage Devices</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="bg-red-500 py-4 rounded-xl" onPress={onLogout}>
          <Text className="text-white text-center font-semibold text-lg">Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
