import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function SuperAdminAppeals() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View
        style={{
          backgroundColor: '#1d4ed8',
          paddingTop: 20,
          paddingBottom: 20,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10 }}>
          <Feather name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Appeals Management</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View
          style={{
            backgroundColor: '#f8fafc',
            borderRadius: 12,
            padding: 18,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 8 }}>
            Appeals Module
          </Text>
          <Text style={{ color: '#64748b', lineHeight: 20 }}>
            Appeals management screen is ready for integration. You can now safely navigate here from Super Admin Dashboard.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
