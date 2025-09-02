'use client';

import { createContext, useContext, useState, useMemo, type ReactNode, useCallback } from 'react';
import type { User, UserRole } from '@/lib/types';
import { MOCK_USERS } from '@/lib/mock-data';

interface UserContextType {
  user: User | null;
  users: User[];
  setUser: (user: User) => void;
  setUserRole: (userId: string, role: UserRole) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  // Default to the admin user for demo purposes
  const [user, setUser] = useState<User | null>(users[0]);
  
  const handleSetUser = useCallback((newUser: User) => {
    const userInState = users.find(u => u.id === newUser.id);
    if (userInState) {
        setUser(userInState);
    }
  }, [users]);

  const setUserRole = useCallback((userId: string, role: UserRole) => {
    let updatedUser: User | null = null;
    setUsers(currentUsers => {
        const newUsers = currentUsers.map(u => {
            if (u.id === userId) {
                updatedUser = { ...u, role };
                return updatedUser;
            }
            return u;
        });

        // If the user being updated is the current user, update the current user state as well
        if (user && user.id === userId && updatedUser) {
            setUser(updatedUser);
        }
        return newUsers;
    });
  }, [user]);


  const value = useMemo(
    () => ({
      user,
      users,
      setUser: handleSetUser,
      setUserRole,
    }),
    [user, users, handleSetUser, setUserRole]
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
