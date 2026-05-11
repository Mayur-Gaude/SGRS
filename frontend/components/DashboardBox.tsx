import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

interface DashboardBoxProps {
  icon: any;
  title: string;
  number: string;
}

const DashboardBox: React.FC<DashboardBoxProps> = ({ icon, title, number }) => {
  return (
    <View
      style={{
        width: screenWidth / 2 - 24, // responsive 2 per row
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
      }}
    >
      {/* ICON LEFT */}
      <View
        style={{
          backgroundColor: '#1d4ed8',
          padding: 10,
          borderRadius: 50,
          marginRight: 10,
        }}
      >
        <Feather name={icon} size={22} color="white" />
      </View>

      {/* TEXT RIGHT */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 13,
            color: '#374151',
            flexWrap: 'wrap',
          }}
          numberOfLines={2}
        >
          {title}
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#111827',
            marginTop: 2,
          }}
        >
          {number}
        </Text>
      </View>
    </View>
  );
};

export default DashboardBox;