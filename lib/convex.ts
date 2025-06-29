import { ConvexProvider, ConvexReactClient } from "convex/react";

// Get the Convex URL from environment variable
const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL!;

if (!CONVEX_URL) {
  throw new Error(
    "Missing Convex URL. Please set EXPO_PUBLIC_CONVEX_URL in your .env.local"
  );
}

// Create a Convex client for React Native
export const convex = new ConvexReactClient(CONVEX_URL);

// Export the provider component
export { ConvexProvider };
