export interface UserProfile {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  githubUsername?: string;
  githubId?: string;
  githubConnectedAt?: Date;
  isPrivate?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
