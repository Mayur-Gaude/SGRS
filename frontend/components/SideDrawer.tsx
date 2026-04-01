import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Pressable, Text, View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import { getMyProfile } from '../lib/api';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = Math.min(300, Math.round(SCREEN_WIDTH * 0.8));

// Context to control the drawer globally
interface DrawerContextType {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}

const DrawerContext = createContext<DrawerContextType | null>(null);

export const useDrawer = () => {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('useDrawer must be used within DrawerProvider');
  return ctx;
};

// Provider that renders the drawer UI and exposes controls via context
export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerName, setDrawerName] = useState('Citizen');
  const [drawerEmail, setDrawerEmail] = useState('');
  const [drawerAvatar, setDrawerAvatar] = useState('');
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const token = useAuthStore((state) => state.token) || undefined;
  const clearToken = useAuthStore((state) => state.clearToken);

  const hydrateDrawerProfile = useCallback(async () => {
    if (!token) {
      setDrawerName('Citizen');
      setDrawerEmail('');
      setDrawerAvatar('');
      return;
    }

    try {
      const res = await getMyProfile(token);
      const profile = res?.data || res;
      setDrawerName(profile?.full_name || 'Citizen');
      setDrawerEmail(profile?.email || '');
      setDrawerAvatar(profile?.avatar_url || '');
    } catch {
      setDrawerName('Citizen');
      setDrawerEmail('');
      setDrawerAvatar('');
    }
  }, [token]);

  const open = useCallback(() => {
    hydrateDrawerProfile();
    setIsOpen(true);
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0.35,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateX, backdropOpacity, hydrateDrawerProfile]);

  const close = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -DRAWER_WIDTH,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setIsOpen(false);
    });
  }, [translateX, backdropOpacity]);

  const toggle = useCallback(() => {
    if (isOpen) close(); else open();
  }, [isOpen, open, close]);

  const ctx = useMemo(() => ({ open, close, toggle, isOpen }), [open, close, toggle, isOpen]);

  const go = (href: string) => {
    close();
    setTimeout(() => router.push(href as any), 120);
  };

  return (
    <DrawerContext.Provider value={ctx}>
      <View className="flex-1">
        {children}
        {isOpen && (
          <Pressable className="absolute inset-0" onPress={close}>
            <Animated.View className="absolute inset-0 bg-black" style={{ opacity: backdropOpacity }} />
          </Pressable>
        )}
        <Animated.View className="absolute top-0 bottom-0 left-0 bg-white" style={{ width: DRAWER_WIDTH, transform: [{ translateX }] }}> 
          {/* Blue header area up to AppBar height */}
          <View className="h-[100px] bg-blue-700 flex-row items-center px-4">
            <Image
              source={{ uri: drawerAvatar || 'https://i.pravatar.cc/120' }}
              className="w-12 h-12 rounded-full bg-blue-300"
            />
            <View className="ml-3">
              <Text className="text-white text-base font-bold">{drawerName}</Text>
              <Text className="text-white/90 text-xs mt-0.5">{drawerEmail || 'No email'}</Text>
            </View>
          </View>
          {/* White content area */}
          <View className="flex-1 bg-white py-2">
            <Pressable className="flex-row items-center py-3 px-4" onPress={() => go('/citizen/dashboard')}>
              <Feather name="home" size={18} color="#0f172a" />
              <Text className="text-slate-900 text-base ml-3">Home</Text>
            </Pressable>
            <Pressable className="flex-row items-center py-3 px-4" onPress={() => go('/citizen/create-grievance')}>
              <Feather name="file-text" size={18} color="#0f172a" />
              <Text className="text-slate-900 text-base ml-3">My Grievances</Text>
            </Pressable>
            <Pressable className="flex-row items-center py-3 px-4" onPress={() => go('/citizen/profile')}>
              <Feather name="user" size={18} color="#0f172a" />
              <Text className="text-slate-900 text-base ml-3">Profile</Text>
            </Pressable>
            <Pressable className="flex-row items-center py-3 px-4" onPress={() => go('/citizen/settings')}>
              <Feather name="settings" size={18} color="#0f172a" />
              <Text className="text-slate-900 text-base ml-3">Settings</Text>
            </Pressable>
          </View>

          {/* Bottom logout */}
          <Pressable
            className="absolute bottom-3 left-0 right-0 px-4 py-3 flex-row items-center"
            onPress={() => {
              clearToken();
              go('/');
            }}
          >
            <Feather name="log-out" size={18} color="#ef4444" />
            <Text className="text-red-500 text-base ml-3 font-semibold">Log out</Text>
          </Pressable>
        </Animated.View>
      </View>
    </DrawerContext.Provider>
  );
}

export default DrawerProvider;
