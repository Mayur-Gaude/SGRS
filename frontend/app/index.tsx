import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1d4ed8' }}>
      <ScrollView
        style={{ backgroundColor: '#1d4ed8' }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20,
            paddingVertical: 40,
          }}
        >
          {/* Logo */}
          <Feather name="shield" size={50} color="white" />

          {/* Title */}
          <Text
            style={{
              color: 'white',
              fontSize: 28,
              fontWeight: 'bold',
              marginTop: 16,
              textAlign: 'center',
            }}
          >
            Grievance Redressal System
          </Text>

          <Text
            style={{
              color: 'white',
              fontSize: 15,
              marginTop: 8,
              textAlign: 'center',
              opacity: 0.9,
            }}
          >
            Government of Goa
          </Text>

          {/* Citizen Portal Card */}
          <View style={{ width: '100%', marginTop: 40 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.replace('/citizen')}
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                padding: 20,
                elevation: 4,
              }}
            >
              <View style={{ alignItems: 'center' }}>
                <View
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    backgroundColor: '#DBEAFE',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Feather name="user" size={32} color="#1d4ed8" />
                </View>

                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#111827',
                    marginTop: 16,
                  }}
                >
                  Citizen Portal
                </Text>

                <Text
                  style={{
                    fontSize: 14,
                    color: '#6B7280',
                    textAlign: 'center',
                    marginTop: 10,
                    lineHeight: 22,
                  }}
                >
                  Submit complaints, track grievances, and provide feedback on
                  resolutions.
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                >
                  <Text
                    style={{
                      color: '#1d4ed8',
                      fontWeight: 'bold',
                      fontSize: 15,
                      marginRight: 8,
                    }}
                  >
                    Access Portal
                  </Text>

                  <Feather
                    name="arrow-right"
                    size={20}
                    color="#1d4ed8"
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}