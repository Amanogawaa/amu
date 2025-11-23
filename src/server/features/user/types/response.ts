export interface UserProfile {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  photoURL?: string;
  githubUsername?: string;
  githubId?: string;
  githubConnectedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
