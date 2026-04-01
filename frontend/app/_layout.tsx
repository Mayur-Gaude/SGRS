import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DrawerProvider } from "../components/SideDrawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

// Suppress specific deprecation warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string') {
    if (args[0].includes('props.pointerEvents is deprecated') ||
        args[0].includes('SafeAreaView has been deprecated')) {
      return;
    }
  }
  originalWarn(...args);
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <StatusBar hidden/>
    <DrawerProvider>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="citizen/index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="citizen/signup" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="citizen/dashboard" 
          options={{ headerShown: false }} 
        />
         <Stack.Screen 
          name="citizen/create-grievance" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="citizen/profile" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="citizen/settings" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="citizen/forgot-password" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="citizen/verify-otp" 
          options={{ headerShown: false }} 
        />
         <Stack.Screen 
          name="admin/index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="admin/dashboard" 
          options={{ headerShown: false }} 
        />
         <Stack.Screen 
          name="super-admin/index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="super-admin/dashboard" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="super-admin/departments" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="super-admin/admins" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="super-admin/appeals" 
          options={{ headerShown: false }} 
        />
      </Stack>
    </DrawerProvider>
    </GestureHandlerRootView>
  );
}
