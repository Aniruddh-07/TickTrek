
'use client';

import { createContext, useContext, useState, useMemo, type ReactNode, useCallback, useEffect } from 'react';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for user in local storage to persist session
    try {
      const storedUser = localStorage.getItem('ticktrek_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
        console.error("Failed to parse user from local storage", error);
        localStorage.removeItem('ticktrek_user');
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((loggedInUser: User) => {
    localStorage.setItem('ticktrek_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    if(loggedInUser.status === 'pending-approval'){
        router.push('/awaiting-approval');
    } else {
        router.push('/dashboard');
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('ticktrek_user');
    setUser(null);
    router.push('/signin');
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
