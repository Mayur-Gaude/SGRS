import React, { useCallback, useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AppBar from '../../components/AppBar';
import { getComplaints, getMyProfile, updateMyProfile } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

type ProfileData = {
  id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  role?: string;
  is_active?: boolean;
  createdAt?: string;
};

type Complaint = {
  status?: string;
};

const normalizeList = <T,>(res: any): T[] => {
  if (Array.isArray(res)) return res as T[];
  if (Array.isArray(res?.data)) return res.data as T[];
  if (Array.isArray(res?.items)) return res.items as T[];
  return [];
};

export default function ProfilePage() {
  const authToken = useAuthStore((state) => state.token) || undefined;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');

  const loadProfileData = useCallback(async () => {
    if (!authToken) {
      setProfile(null);
      setComplaints([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [profileRes, complaintsRes] = await Promise.all([
        getMyProfile(authToken),
        getComplaints(authToken),
      ]);

      const profilePayload = profileRes?.data || profileRes;
      setProfile(profilePayload || null);
      setComplaints(normalizeList<Complaint>(complaintsRes));
    } catch {
      setProfile(null);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [loadProfileData])
  );

  const stats = useMemo(() => {
    const total = complaints.length;
    const resolved = complaints.filter((c) => (c.status || '').toUpperCase() === 'RESOLVED').length;
    const pending = Math.max(total - resolved, 0);
    return { total, pending, resolved };
  }, [complaints]);

  const memberSince = useMemo(() => {
    if (!profile?.createdAt) return 'N/A';
    return new Date(profile.createdAt).getFullYear().toString();
  }, [profile?.createdAt]);

  const avatarUri = profile?.avatar_url || 'https://i.pravatar.cc/150';

  const openEditModal = () => {
    setEditName(profile?.full_name || '');
    setEditPhone(profile?.phone || '');
    setEditAvatarUrl(profile?.avatar_url || '');
    setShowEditModal(true);
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow media permission to choose a profile image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length) {
      setEditAvatarUrl(result.assets[0].uri);
    }
  };

  const handleSaveProfile = async () => {
    if (!authToken) return;
    if (!editName.trim()) {
      Alert.alert('Invalid name', 'Name is required.');
      return;
    }
    if (!editPhone.trim()) {
      Alert.alert('Invalid phone', 'Phone is required.');
      return;
    }

    setSaving(true);
    try {
      const res = await updateMyProfile(
        {
          full_name: editName.trim(),
          phone: editPhone.trim(),
          avatar_url: editAvatarUrl.trim() || null,
        },
        authToken
      );

      const payload = res?.data || res;
      setProfile(payload || null);
      setShowEditModal(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (e: any) {
      Alert.alert('Update failed', e?.message || 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <AppBar />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#2563eb" />
          <Text className="text-slate-500 mt-2">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <AppBar />

      <ScrollView className="px-4 pt-4" contentContainerStyle={{ paddingBottom: 140 }}>

        {/* ===== TOP PROFILE CARD ===== */}
        <View className="bg-white rounded-2xl p-4 shadow-sm items-center mb-4">

          {/* Avatar Box */}
          <View className="relative">
            <Image
              source={{ uri: avatarUri }}
              className="w-24 h-24 rounded-xl"
            />

            {/* Camera Icon */}
            <TouchableOpacity className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full" onPress={openEditModal}>
              <Feather name="camera" size={14} color="white" />
            </TouchableOpacity>
          </View>

          {/* Name */}
          <Text className="text-lg font-bold text-slate-900 mt-3">
            {profile?.full_name || 'Citizen'}
          </Text>

          {/* Citizen ID */}
          <Text className="text-slate-500 text-sm">
            Citizen ID: {profile?.id ? String(profile.id).slice(-8).toUpperCase() : 'N/A'}
          </Text>

          {/* Active Tag */}
          <View className={`${profile?.is_active ? 'bg-green-100' : 'bg-red-100'} px-3 py-1 rounded-full mt-2`}>
            <Text className={`${profile?.is_active ? 'text-green-700' : 'text-red-700'} text-xs font-semibold`}>
              {profile?.is_active ? 'Active' : 'Inactive'}
            </Text>
          </View>

        </View>

        {/* ===== PERSONAL INFORMATION ===== */}
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">

          {/* Header */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-slate-900 font-bold text-base">
              Personal Information
            </Text>

            <TouchableOpacity onPress={openEditModal}>
              <Feather name="edit-2" size={18} color="#2563eb" />
            </TouchableOpacity>
          </View>

          {/* Info Items */}
          <View className="flex-row items-center mb-2">
            <Feather name="mail" size={16} color="#64748b" />
            <Text className="ml-2 text-slate-700">{profile?.email || 'N/A'}</Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Feather name="phone" size={16} color="#64748b" />
            <Text className="ml-2 text-slate-700">{profile?.phone || 'N/A'}</Text>
          </View>

          <View className="flex-row items-center mb-2">
            <Feather name="map-pin" size={16} color="#64748b" />
            <Text className="ml-2 text-slate-700">
              {profile?.role || 'USER'}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Feather name="calendar" size={16} color="#64748b" />
            <Text className="ml-2 text-slate-700">Member since: {memberSince}</Text>
          </View>

        </View>

        {/* ===== ACCOUNT STATISTICS ===== */}
        <View className="bg-white rounded-2xl p-8 shadow-sm mb-4">
          <Text className="text-slate-900 font-bold text-base mb-3">
            Account Statistics
          </Text>

          <View className="flex-row justify-between">

            <View className="items-center">
              <Text className="text-lg font-bold text-blue-600">{stats.total}</Text>
              <Text className="text-slate-500 text-xs">Total</Text>
            </View>

            <View className="items-center">
              <Text className="text-lg font-bold text-orange-500">{stats.pending}</Text>
              <Text className="text-slate-500 text-xs">Pending</Text>
            </View>

            <View className="items-center">
              <Text className="text-lg font-bold text-green-600">{stats.resolved}</Text>
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
        <TouchableOpacity className="bg-blue-600 py-4 rounded-xl" onPress={openEditModal}>
          <Text className="text-white text-center font-semibold text-lg">
            Update Details
          </Text>
        </TouchableOpacity>

      </ScrollView>

      <Modal visible={showEditModal} transparent animationType="fade" onRequestClose={() => setShowEditModal(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 bg-black/50 justify-center px-4"
        >
          <View className="bg-white rounded-2xl p-4">
            <Text className="text-lg font-bold text-slate-900 mb-3">Edit Profile</Text>

            <View className="items-center mb-4">
              <Image source={{ uri: editAvatarUrl || avatarUri }} className="w-20 h-20 rounded-xl mb-2" />
              <TouchableOpacity onPress={pickImage} className="bg-slate-100 px-3 py-2 rounded-lg">
                <Text className="text-slate-700 font-medium">Choose Image</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              value={editName}
              onChangeText={setEditName}
              placeholder="Full name"
              className="border border-slate-300 rounded-xl px-3 py-2 mb-3"
            />

            <TextInput
              value={editPhone}
              onChangeText={setEditPhone}
              placeholder="Phone"
              keyboardType="phone-pad"
              className="border border-slate-300 rounded-xl px-3 py-2 mb-4"
            />

            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                className="border border-slate-300 px-4 py-2 rounded-lg"
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveProfile}
                disabled={saving}
                className={`px-4 py-2 rounded-lg ${saving ? 'bg-blue-400' : 'bg-blue-600'}`}
              >
                {saving ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-semibold">Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}