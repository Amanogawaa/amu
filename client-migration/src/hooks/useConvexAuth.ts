"use client";

import { useConvex, useQuery } from "convex/react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";

interface ConvexUser {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  isPrivate?: boolean;
  program?: string;
  yearLevel?: string;
  githubUsername?: string;
  createdAt: number;
  updatedAt: number;
}

export const useConvexAuth = () => {
  const convex = useConvex();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<ConvexUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Query the current user from server
  const currentUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    if (currentUser !== undefined) {
      setUser(currentUser);
      setLoading(false);
    }
  }, [currentUser]);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      additionalData?: { firstName?: string; lastName?: string },
    ) => {
      try {
        setError(null);
        setLoading(true);

        // Call the password provider signup endpoint
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CONVEX_URL}/auth/password/signup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              password,
              ...additionalData,
            }),
          },
        );

        if (!response.ok) {
          const err = await response.text();
          throw new Error(err || "Signup failed");
        }

        // Redirect or update user state
        router.push("/dashboard");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "An error occurred during signup";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setError(null);
        setLoading(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CONVEX_URL}/auth/password/signin`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          },
        );

        if (!response.ok) {
          const err = await response.text();
          throw new Error(err || "Sign in failed");
        }

        // Redirect or update user state
        router.push("/dashboard");
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "An error occurred during sign in";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  const signOut = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CONVEX_URL}/auth/signout`,
        { method: "POST" },
      );

      if (!response.ok) {
        throw new Error("Sign out failed");
      }

      setUser(null);
      router.push("/");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred during sign out";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const updateProfile = useCallback(
    async (updates: {
      firstName?: string;
      lastName?: string;
      photoURL?: string;
      isPrivate?: boolean;
      program?: string;
      yearLevel?: string;
      githubUsername?: string;
    }) => {
      try {
        setError(null);
        const result = await convex.mutation(
          api.users.updateUserProfile,
          updates,
        );
        setUser(result);
        return result;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "An error occurred updating profile";
        setError(message);
        throw err;
      }
    },
    [convex],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    clearError,
  };
};
