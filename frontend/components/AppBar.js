import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useDrawer } from './SideDrawer';

export default function AppBar() {
  const { toggle } = useDrawer();

  return (
    <View
      style={{
        height: 100, // ⬅ Increased height
        backgroundColor: '#1d4ed8',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        borderBottomLeftRadius: 10,  // ⬅ Curve bottom left
        borderBottomRightRadius: 10, // ⬅ Curve bottom right
        elevation: 8,
      }}
    >
      {/* Left - Menu Icon */}
      <TouchableOpacity onPress={toggle}>
        <Feather name="menu" size={26} color="white" />
      </TouchableOpacity>

      {/* Center - Title */}
      <Text
        style={{
          color: 'white',
          fontSize: 20,
          fontWeight: 'bold',
        }}
      >
        Grievance Portal
      </Text>

      {/* Right - Notification Icon */}
      <TouchableOpacity>
        <Feather name="bell" size={26} color="white" />
      </TouchableOpacity>
    </View>
  );
}