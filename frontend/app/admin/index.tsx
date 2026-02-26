import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

export default function AdminPortal() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: '#f8fafc' }}>
        <View style={{ alignItems: 'center', paddingTop: 80, paddingHorizontal: 16, paddingBottom: 40 }}>
          <Text style={{ color: '#7e22ce', fontSize: 24, fontWeight: 'bold', marginTop: 16 }}>Admin Portal</Text>
          <Text style={{ color: '#666', fontSize: 14, marginTop: 8 }}>Manage grievances and resolutions</Text>

          {/* Admin Portal Content */}
          <View style={{ marginTop: 20, width: '100%' }}>
            <Text style={{ fontSize: 16, color: '#333' }}>Welcome to the Admin Portal</Text>
            {/* Add admin-specific features here */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}