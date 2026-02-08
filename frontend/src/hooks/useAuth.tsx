import { useAuthStore } from '@/stores/auth-store';

/**
 * useAuth Hook
 * 
 * Provides authentication state and methods.
 * Now uses Zustand store instead of Context API.
 */
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const firebaseUser = useAuthStore((state) => state.firebaseUser);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const register = useAuthStore((state) => state.register);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);

  return {
    user,
    firebaseUser,
    isLoading,
    isAuthenticated,
    register,
    login,
    logout,
    updateUser,
  };
};

// Type for the hook return value (for backwards compatibility)
export type AuthHookType = ReturnType<typeof useAuth>;