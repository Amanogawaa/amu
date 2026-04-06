export interface User {
  _id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  program?: string;
  year?: number;
  school?: string;
  photoURL?: string;
  isPrivate?: boolean;
  githubUsername?: string;
  githubId?: string;
  githubConnectedAt?: number;
  tokenIdentifier: string;
}
