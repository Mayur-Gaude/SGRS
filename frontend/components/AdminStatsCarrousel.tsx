import React from "react";
import { ScrollView, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

type Stat = {
  id: string;
  title: string;
  value: number;
  icon: keyof typeof Feather.glyphMap;
  color: string;
};

interface Props {
  stats: Stat[];
}

export default function AdminStatsCarousel({ stats }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
    >
      {stats.map((item) => (
        <View
          key={item.id}
          style={{
            backgroundColor: "white",
            width: 150,
            padding: 16,
            borderRadius: 12,
            marginRight: 12,
          }}
        >
          <Feather name={item.icon} size={22} color={item.color} />
          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 6 }}>
            {item.value}
          </Text>
          <Text style={{ color: "#64748b" }}>{item.title}</Text>
        </View>
      ))}
    </ScrollView>
  );
}