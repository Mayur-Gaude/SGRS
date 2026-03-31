import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1d4ed8' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ backgroundColor: '#1d4ed8' }}>
        <View style={{ alignItems: 'center', paddingTop: 80, paddingHorizontal: 16, paddingBottom: 40 }}>
          <Feather name="shield" size={40} color="white" />
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 16 }}>Grievance Redressal System</Text>
          <Text style={{ color: 'white', fontSize: 14, marginTop: 8 }}>Government Of Goa</Text>

          {/* Three Boxes */}
          <View style={{ marginTop: 20, width: '100%' }}>
            {/* Box 1 */}
            <TouchableOpacity
              onPress={() => router.push('/citizen')}
              style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <View style={{ width: 50, height: 50, backgroundColor: '#dbeafe', borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                    <Feather name="user" size={24} color="#1d4ed8" />
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000',marginTop: 10}}>Citizen Portal</Text>
                    <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Submit Complaints,track grievances and provide feeedback on the resolutions</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center',marginTop: 12 }}>
                      <Text style={{ fontSize: 12, color: '#1d4ed8', fontWeight: 'bold', marginRight: 8 }}>Access Portal</Text>
                      <Feather name="arrow-right" size={20} color="#1d4ed8" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

            {/* Box 2 */}
            <TouchableOpacity
              onPress={() => router.push('/admin')}
              style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <View style={{ width: 50, height: 50, backgroundColor: '#f3e8ff', borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                    <Feather name="shield" size={24} color="#7e22ce" />
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000',marginTop: 10}}>Admin Portal</Text>
                    <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Submit Complaints,track grievances and provide feeedback on the resolutions</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center',marginTop: 12 }}>
                      <Text style={{ fontSize: 12, color: '#7e22ce', fontWeight: 'bold', marginRight: 8 }}>Access Portal</Text>
                      <Feather name="arrow-right" size={20} color="#7e22ce" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

            {/* Box 3 */}
            <TouchableOpacity
              onPress={() => router.push('/super-admin')}
              style={{ backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <View style={{ width: 50, height: 50, backgroundColor: '#fee2e2', borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="crown" size={24} color="#b91c1c" />
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000',marginTop: 10}}>Super Admin Portal</Text>
                    <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Submit Complaints,track grievances and provide feeedback on the resolutions</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center',marginTop: 12 }}>
                      <Text style={{ fontSize: 12, color: '#b91c1c', fontWeight: 'bold', marginRight: 8 }}>Access Portal</Text>
                      <Feather name="arrow-right" size={20} color="#b91c1c" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}