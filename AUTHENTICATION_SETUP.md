# Authentication Setup with Clerk

This Expo app uses Clerk for authentication with the following features:

## Authentication Flow

1. **App Launch**: When the app opens, it checks the user's authentication status
2. **Unauthenticated Users**: Redirected to the sign-up page with multiple sign-in options
3. **Authenticated Users**: Redirected to the protected home screen
4. **Route Protection**: All app routes are protected and require authentication

## Sign-in Options

### Social Authentication

- **Google Sign-in**: Uses OAuth flow with Google
- **Apple Sign-in**: Uses OAuth flow with Apple ID

### Email/Password Authentication

- **Sign Up**: Email verification required
- **Sign In**: Direct access with email and password

## Folder Structure

```
app/
├── _layout.tsx              # Root layout with auth state management
├── index.tsx                # Entry point with auth redirects
├── (auth)/                  # Authentication routes (unprotected)
│   ├── _layout.tsx          # Auth layout
│   ├── sign-in.tsx          # Sign in page
│   └── sign-up.tsx          # Sign up page
├── (app)/                   # Protected app routes
│   ├── _layout.tsx          # Protected layout with auth check
│   └── index.tsx            # Home screen (protected)
└── components/
    ├── LoadingScreen.tsx    # Loading component
    ├── SignOutButton.tsx    # Sign out button
    └── CalendarStripComponent.tsx    # Calendar strip component
```

## Environment Variables

Make sure to set up your `.env` file with:

```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Clerk Configuration

In your Clerk dashboard, make sure to:

1. **Enable OAuth Providers**:
   - Google OAuth
   - Apple OAuth

2. **Configure Redirect URLs**:
   - Add your app's redirect URLs for OAuth flows

3. **Email Verification**:
   - Configure email verification settings

## Features

- ✅ Protected routes
- ✅ Social authentication (Google, Apple)
- ✅ Email/password authentication
- ✅ Email verification
- ✅ Loading states
- ✅ Error handling
- ✅ Automatic redirects
- ✅ Sign out functionality
- ✅ Calendar strip component

## Usage

1. **First Launch**: Users see the sign-up page
2. **Authentication**: Users can choose social or email sign-in
3. **Protected Access**: Once authenticated, users access the home screen
4. **Sign Out**: Users can sign out and return to auth flow

The authentication state is managed at the root level, ensuring proper route protection throughout the app.
