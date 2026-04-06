# Convex Password Provider Implementation

## Overview

The Convex password provider has been implemented to handle user authentication with email/password credentials. This replaces the previous Firebase auth setup.

## Setup Components

### 1. Backend Configuration

#### `convex/auth.config.ts`

- Configured Convex site URL as the provider domain
- Set session timeout to 30 days absolute expiration
- Enabled password provider support

#### `convex/auth.ts`

- Integrated password provider via `@convex-dev/auth/providers/Password`
- Also included GitHub provider for OAuth
- Exported auth functions: `auth`, `signIn`, `signOut`, `store`, `isAuthenticated`

#### `convex/http.ts`

- Routes all authentication requests through `auth.addHttpRoutes(http)`
- Automatically creates endpoints:
  - `/auth/password/signup` - User registration
  - `/auth/password/signin` - User login
  - `/auth/signout` - User logout
  - `/auth/github` - GitHub OAuth flow

#### `convex/schema.ts`

- Imports `authTables` from `@convex-dev/auth/server` (manages user credentials)
- Extended schema with custom `users` table for profile data:
  - email (indexed)
  - firstName, lastName
  - photoURL
  - githubUsername, githubId
  - isPrivate flag
  - timestamps (createdAt, updatedAt)
- Includes existing tables: courses, chapters, lessons, enrollments, progress

#### `convex/users.ts`

- Query: `getCurrentUser` - Retrieves authenticated user's profile
- Mutation: `updateUserProfile` - Updates user profile fields
- Query: `checkEmailExists` - Validates email availability
- Mutation: `createUserProfile` - Creates user profile after auth

### 2. Frontend Integration

#### `src/hooks/useConvexAuth.ts`

React hook providing authentication interface:

```typescript
const {
  user, // Current user profile or null
  loading, // Loading state
  error, // Error message if any
  signUp, // (email, password, additionalData?) => Promise<void>
  signIn, // (email, password) => Promise<void>
  signOut, // () => Promise<void>
  updateProfile, // (updates) => Promise<ConvexUser>
  clearError, // () => void
} = useConvexAuth();
```

## Usage Examples

### Sign Up

```typescript
import { useConvexAuth } from "@/hooks/useConvexAuth";

function SignUp() {
  const { signUp, loading, error } = useConvexAuth();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await signUp(
        formData.get("email") as string,
        formData.get("password") as string,
        {
          firstName: formData.get("firstName") as string,
          lastName: formData.get("lastName") as string,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <input name="firstName" />
      <input name="lastName" />
      <button type="submit" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

### Sign In

```typescript
const { signIn, loading, error } = useConvexAuth();

await signIn(email, password);
```

### Get Current User

```typescript
const { user, loading } = useConvexAuth();

if (loading) return <div>Loading...</div>;
if (!user) return <div>Not authenticated</div>;

return <div>Welcome, {user.firstName}!</div>;
```

### Update Profile

```typescript
const { updateProfile } = useConvexAuth();

await updateProfile({
  firstName: "John",
  lastName: "Doe",
  photoURL: "https://example.com/photo.jpg",
});
```

## Environment Setup

Ensure these environment variables are set:

```env
# .env.local (frontend)
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url

# Backend automatically uses CONVEX_SITE_URL and CONVEX_DEPLOYMENT from Convex config
```

## Migration Steps

If migrating from Firebase:

1. **Update Components**: Replace `useAuth()` (Firebase) with `useConvexAuth()` (Convex)
2. **Update API Calls**: Switch from Firebase SDK calls to Convex mutation/query calls
3. **Database Sync**: Migrate existing user data to Convex database
4. **Test Auth Flow**: Test signup, signin, logout, and profile updates

## Authentication Flow

### Sign Up Flow

1. User submits email + password to signup endpoint
2. Password provider hashes password securely
3. Creates user record in auth system
4. User profile created in custom `users` table
5. Session established (30-day expiry)
6. Redirect to dashboard

### Sign In Flow

1. User submits email + password to signin endpoint
2. Password provider validates credentials
3. Session established
4. User can access protected routes

### Sign Out Flow

1. User initiates logout
2. Session destroyed on backend
3. Redirect to home page

## Security Notes

- Passwords are automatically hashed by Convex password provider
- Session tokens are HTTP-only cookies (secure by default)
- User authorization checked via `auth.getUserIdentity(ctx)` in mutations/queries
- Email is normalized to lowercase for consistency

## API Endpoints (Auto-generated)

All endpoints are HTTP-based and managed by Convex:

- `POST /auth/password/signup` - Register new user
- `POST /auth/password/signin` - Sign in with credentials
- `POST /auth/signout` - Clear session
- `GET /auth/github` - GitHub OAuth redirect
- `POST /auth/github/callback` - GitHub OAuth callback

## Troubleshooting

### Issue: "User not authenticated" error

- Check if user session is valid
- Verify cookies are being sent in requests
- Check CONVEX_SITE_URL matches frontend domain

### Issue: Email already exists error

- Use `checkEmailExists` query to validate before signup
- Redirect existing users to signin instead

### Issue: Profile data not updating

- Ensure user is authenticated before calling `updateUserProfile`
- Check field names match schema definition

## Next Steps

1. Update login/signup forms to use `useConvexAuth` hook
2. Update password reset flow (if needed)
3. Implement email verification (optional)
4. Set up SAML/OAuth providers (optional)
