'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  AuthError,
  updateProfile,
  UserCredential,
  GithubAuthProvider,
  linkWithPopup,
  unlink,
} from 'firebase/auth';
import { auth, db } from '@/utils/firebase';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/loggers';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    additionalData?: {
      firstName?: string;
      lastName?: string;
      program?: string;
      yearLevel?: string;
    }
  ) => Promise<void>;
  linkGithub: () => Promise<void>;
  unlinkGithub: () => Promise<void>;
  githubLinked: boolean;
  signInWithGoogle: () => Promise<UserCredential>;
  signOut: () => Promise<void>;
  updateProfilePicture: (photoURL: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const getErrorMessage = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completing.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please check your email and password.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [githubLinked, setGithubLinked] = useState(false);

  const refreshToken = async (currentUser: User) => {
    try {
      const token = await currentUser.getIdToken(true);
      Cookies.set('auth-token', token, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
      return token;
    } catch (err) {
      logger.error('Error refreshing ID token:', err);
      throw err;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        try {
          await refreshToken(user);
        } catch (err) {
          logger.error('Error getting ID token:', err);
        }
      } else {
        Cookies.remove('auth-token');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;

    if (user) {
      refreshInterval = setInterval(async () => {
        try {
          await refreshToken(user);
          logger.info('Token refreshed successfully');
        } catch (err) {
          logger.error('Failed to refresh token:', err);
        }
      }, 50 * 60 * 1000);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      const hasGithub = user.providerData.some(
        (provider) => provider.providerId === 'github.com'
      );
      setGithubLinked(hasGithub);
    } else {
      setGithubLinked(false);
    }
  }, [user]);

  const clearError = () => {
    setError(null);
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const errorMessage = getErrorMessage(err as AuthError);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    additionalData?: {
      firstName?: string;
      lastName?: string;
      program?: string;
      yearLevel?: string;
    }
  ) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Update display name if firstName and lastName are provided
      if (additionalData?.firstName && additionalData?.lastName) {
        await updateProfile(user, {
          displayName: `${additionalData.firstName} ${additionalData.lastName}`,
        });
      }

      // Store additional user data in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        firstName: additionalData?.firstName || '',
        lastName: additionalData?.lastName || '',
        displayName:
          additionalData?.firstName && additionalData?.lastName
            ? `${additionalData.firstName} ${additionalData.lastName}`
            : '',
        program: additionalData?.program || '',
        yearLevel: additionalData?.yearLevel || '',
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      logger.info('User profile created successfully');
    } catch (err) {
      const errorMessage = getErrorMessage(err as AuthError);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Check if user document exists, if not create it
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create user document for new Google sign-in users
        const nameParts = result.user.displayName?.split(' ') || [];
        await setDoc(userDocRef, {
          uid: result.user.uid,
          email: result.user.email,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          displayName: result.user.displayName || '',
          program: '',
          yearLevel: '',
          photoURL: result.user.photoURL || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        logger.info('Google user profile created successfully');
      }

      return result;
    } catch (err) {
      const authError = err as AuthError;

      if (
        authError.code === 'auth/popup-closed-by-user' ||
        authError.code === 'auth/cancelled-popup-request'
      ) {
        return Promise.reject({ cancelled: true });
      }

      const errorMessage = getErrorMessage(authError);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (err) {
      const errorMessage = getErrorMessage(err as AuthError);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateProfilePicture = async (photoURL: string) => {
    try {
      setError(null);
      if (!user) {
        throw new Error('No user is currently signed in');
      }
      await updateProfile(user, { photoURL });
      await user.reload();
      setUser({ ...user });
    } catch (err) {
      const errorMessage = getErrorMessage(err as AuthError);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const linkGithub = async () => {
    try {
      setError(null);

      if (!user) {
        throw new Error('No user is currently signed in');
      }

      const provider = new GithubAuthProvider();
      provider.addScope('repo');

      await linkWithPopup(user, provider);
      setGithubLinked(true);
    } catch (error) {
      const errorMessage = getErrorMessage(error as AuthError);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const unlinkGithub = async () => {
    try {
      setError(null);
      if (!user) throw new Error('No user signed in');

      await unlink(user, 'github.com');
      setGithubLinked(false);
    } catch (err) {
      const errorMessage = getErrorMessage(err as AuthError);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfilePicture,
    clearError,
    linkGithub,
    unlinkGithub,
    githubLinked,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
