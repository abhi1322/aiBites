# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Features

### Authentication & User Management

- **Clerk Authentication**: Integrated with Clerk for secure user authentication
- **OAuth Support**: Sign in with Google and Apple
- **Email/Password**: Traditional email and password sign-up
- **Profile Setup**: Guided profile completion flow for new users
- **Convex Database**: User data stored in Convex with real-time sync

### User Flow

1. **Sign Up**: Users can sign up using OAuth (Google/Apple) or email/password
2. **User Creation**: New users are automatically created in Convex database
3. **Profile Setup**: Users are redirected to complete their profile with:
   - Personal information (name, height, weight, gender)
   - Nutrition goals (calories, protein, carbs, fat)
4. **App Access**: Users can skip profile setup and complete it later

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Set up environment variables
   - Create a `.env.local` file with your Clerk and Convex credentials
   - Ensure `CONVEX_DEPLOYMENT` is set for your Convex deployment

3. Start the app

   ```bash
   npx expo start
   ```

4. Start Convex development server (in another terminal)

   ```bash
   npx convex dev
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Database Schema

### Users Table

- `clerkId`: Clerk user ID (primary identifier)
- `email`: User's email address
- `firstName`, `lastName`: User's name
- `height`, `weight`: Physical measurements (cm, kg)
- `gender`: User's gender (male/female/other)
- `calorieGoal`, `proteinGoal`, `carbGoal`, `fatGoal`: Nutrition goals
- `profileCompleted`: Boolean flag for profile completion status
- `createdAt`, `updatedAt`: Timestamps

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
- [Clerk Documentation](https://clerk.com/docs): Learn about authentication and user management
- [Convex Documentation](https://docs.convex.dev/): Learn about the real-time database

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
