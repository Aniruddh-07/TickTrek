
'use client';

import { createContext, useContext, useState, useMemo, type ReactNode, useCallback, useEffect } from 'react';
import type { User } from '@/lib/types';
import { useTasks } from './tasks-context';

interface UserContextType {
  user: User | null;
  users: User[];
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { users: allUsers } = useTasks();
  const [user, setUserState] = useState<User | null>(allUsers.find(u => u.role === 'admin') || null);
  
  useEffect(() => {
    // If the currently selected user gets updated (e.g. approved), refresh their state
    if(user){
      const updatedUser = allUsers.find(u => u.id === user.id);
      if(updatedUser){
        setUserState(updatedUser);
      } else {
        // Current user was deleted (denied), switch to admin
        setUserState(allUsers.find(u => u.role === 'admin') || null)
      }
    }
  }, [allUsers, user]);


  const handleSetUser = useCallback((newUser: User) => {
    const userInState = allUsers.find(u => u.id === newUser.id);
    if (userInState) {
        setUserState(userInState);
    }
  }, [allUsers]);

  const value = useMemo(
    () => ({
      user,
      users: allUsers,
      setUser: handleSetUser,
    }),
    [user, allUsers, handleSetUser]
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
