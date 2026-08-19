"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type UserProfile = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  title?: string | null;
  profileImage?: string | null;
};

type UserContextType = {
  user: UserProfile | null;
  loading: boolean;
  updateUser: (updatedData: Partial<UserProfile>) => Promise<boolean>;
  refreshUser: () => Promise<void>;
};

const API_URL = "http://localhost:3001";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>({
    id: "",
    fullName: "Dexter",
    username: "Dexuser",
    email: "Dexter@gmail.com",
    title: "Designer",
    profileImage: null,
  });
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      if (res.ok) {
        const users = await res.json();
        if (users.length > 0) {
          setUser(users[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const updateUser = async (updatedData: Partial<UserProfile>) => {
    if (!user || !user.id) return false;

    // Optimistic update
    const prevUser = user;
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);

    try {
      const res = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        const savedUser = await res.json();
        setUser(savedUser);
        return true;
      } else {
        setUser(prevUser);
        return false;
      }
    } catch (err) {
      console.error(err);
      setUser(prevUser);
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
