"use client";

import { createContext, useContext } from "react";
import { User } from "../features/auth/domain";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type AuthContextType = {
  user: User | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  isLoading: true,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useQuery(api.user.getCurrentUser);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading: user === undefined,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
