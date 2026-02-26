import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import AppBar from '../../components/AppBar';
import { Feather } from '@expo/vector-icons';

export default function MyGrievances() {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  const tags = ['All', 'Submitted', 'In Progress', 'Resolved'];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      
      <AppBar />

      <ScrollView className="px-4 pt-4">

        {/* Title */}
        <Text className="text-xl font-bold text-slate-900 mb-3">
          My Grievances
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-3 py-2 mb-4">
          <Feather name="search" size={18} color="#64748b" />
          <TextInput
            placeholder="Search grievances..."
            value={search}
            onChangeText={setSearch}
            className="ml-2 flex-1 text-slate-800"
          />
        </View>

        {/* Status Tags */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {tags.map(tag => (
            <TouchableOpacity
              key={tag}
              onPress={() => setActiveTag(tag)}
              className={`px-4 py-2 mr-2 rounded-full border 
                ${activeTag === tag ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}
              `}
            >
              <Text className={`${activeTag === tag ? 'text-white' : 'text-slate-700'} font-medium`}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Placeholder grievance list */}
        <View className="mt-4">
          <Text className="text-slate-500 text-center mt-20">
            No grievances found
          </Text>
        </View>

      </ScrollView>

    </SafeAreaView>
  );
}