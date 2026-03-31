import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Props = {
  icon: any;
  title: string;
  color?: string;
};

export default function CategoryBox({ icon, title, color = "#1d4ed8" }: Props) {
  return (
    <View className="bg-white w-28 h-28 mr-3 rounded-2xl border border-slate-200 items-center justify-center">
      <View className="bg-blue-100 p-3 rounded-full">
        <Feather name={icon} size={26} color={color} />
      </View>
      <Text className="mt-2 text-sm font-bold text-slate-900">
        {title}
      </Text>
    </View>
  );
}