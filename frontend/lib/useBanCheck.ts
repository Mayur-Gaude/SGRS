import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';

/**
 * Hook to check if user is banned and redirect accordingly
 * Should be called in the root layout to protect navigation
 */
export const useBanCheck = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token || !user) return;

    // If user is banned, redirect to ban screen
    if (user.account_status === 'BANNED') {
      router.replace('/(auth)/banned');
    }
  }, [user?.account_status, token]);

  return {
    isBanned: user?.account_status === 'BANNED',
    accountStatus: user?.account_status,
    banReason: user?.account_reason,
  };
};
