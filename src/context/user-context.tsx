'use client';

import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type { User } from '@/lib/types';
import { MOCK_USERS } from '@/lib/mock-data';

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // Default to the admin user for demo purposes
  const [user, setUser] = useState<User | null>(MOCK_USERS[0]);

  const value = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user]
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
