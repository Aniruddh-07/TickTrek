'use client';

import { createContext, useContext, useState, useMemo, type ReactNode, useCallback } from 'react';
import type { User, UserRole } from '@/lib/types';
import { MOCK_USERS } from '@/lib/mock-data';

interface UserContextType {
  user: User | null;
  users: User[];
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users] = useState<User[]>(MOCK_USERS);
  // Default to the admin user for demo purposes
  const [user, setUser] = useState<User | null>(users[0]);
  
  const handleSetUser = useCallback((newUser: User) => {
    const userInState = users.find(u => u.id === newUser.id);
    if (userInState) {
        setUser(userInState);
    }
  }, [users]);


  const value = useMemo(
    () => ({
      user,
      users,
      setUser: handleSetUser,
    }),
    [user, users, handleSetUser]
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
