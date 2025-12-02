import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { updateProfile as updateFirebaseProfile } from 'firebase/auth';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  program?: string;
  yearLevel?: string;
  photoURL?: string;
}

export const updateUserProfile = async (
  uid: string,
  data: UpdateProfileData
) => {
  try {
    const userDocRef = doc(db, 'users', uid);

    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(userDocRef, updateData);

    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const updateUserProfileWithAuth = async (
  user: any,
  data: UpdateProfileData
) => {
  try {
    // Update Firebase Auth profile if displayName or photoURL changed
    if (data.displayName !== undefined || data.photoURL !== undefined) {
      const authUpdateData: { displayName?: string; photoURL?: string } = {};
      if (data.displayName !== undefined)
        authUpdateData.displayName = data.displayName;
      if (data.photoURL !== undefined) authUpdateData.photoURL = data.photoURL;

      await updateFirebaseProfile(user, authUpdateData);
    }

    // Update Firestore document
    await updateUserProfile(user.uid, data);

    return { success: true };
  } catch (error) {
    console.error('Error updating user profile with auth:', error);
    throw error;
  }
};
