import { ConvexProvider, ConvexReactClient } from "convex/react";

// Get the Convex URL from environment variable
const CONVEX_URL = process.env.EXPO_PUBLIC_CONVEX_URL!;

if (!CONVEX_URL) {
  throw new Error(
    "Missing Convex URL. Please set EXPO_PUBLIC_CONVEX_URL in your .env.local"
  );
}

// Create a singleton Convex client for React Native
let convexClient: ConvexReactClient | null = null;

export const convex = (() => {
  if (!convexClient) {
    convexClient = new ConvexReactClient(CONVEX_URL);
  }
  return convexClient;
})();

// Export the provider component
export { ConvexProvider };
