import { useAuth, useOAuth, useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({
    strategy: "oauth_apple",
  });
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Redirect if already signed in
  React.useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/(app)/(tabs)");
    }
  }, [isLoaded, isSignedIn, router]);

  const onGooglePress = useCallback(async () => {
    if (isSignedIn) {
      router.replace("/(app)/(tabs)");
      return;
    }

    try {
      setLoading(true);
      const { createdSessionId, setActive } = await startGoogleOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace("/(app)/(tabs)");
      }
    } catch (err) {
      console.error("OAuth error", err);
      if (err instanceof Error && err.message.includes("already signed in")) {
        router.replace("/(app)/(tabs)");
      } else {
        Alert.alert("Error", "Failed to sign in with Google");
      }
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, router]);

  const onApplePress = useCallback(async () => {
    if (isSignedIn) {
      router.replace("/(app)/(tabs)");
      return;
    }

    try {
      setLoading(true);
      const { createdSessionId, setActive } = await startAppleOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace("/(app)/(tabs)");
      }
    } catch (err) {
      console.error("OAuth error", err);
      if (err instanceof Error && err.message.includes("already signed in")) {
        router.replace("/(app)/(tabs)");
      } else {
        Alert.alert("Error", "Failed to sign in with Apple");
      }
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, router]);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded || !emailAddress || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(app)/(tabs)");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Sign in failed. Please try again.");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Error", "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Don't render if already signed in
  if (isLoaded && isSignedIn) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-sm gap-4">
          <View className="text-center">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </Text>
            <Text className="text-gray-600">Sign in to your account</Text>
          </View>

          <View className="gap-4">
            {/* Social Sign-in Buttons */}
            <TouchableOpacity
              onPress={onGooglePress}
              disabled={loading}
              className="w-full py-3 border border-gray-300 rounded-lg flex-row items-center justify-center space-x-2"
            >
              <Text className="text-gray-700 font-semibold">
                Continue with Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onApplePress}
              disabled={loading}
              className="w-full py-3 bg-black rounded-lg flex-row items-center justify-center space-x-2"
            >
              <Text className="text-white font-semibold">
                Continue with Apple
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center space-x-4">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="text-gray-500">or</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Email/Password Form */}
            <TextInput
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Email address"
              onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
              keyboardType="email-address"
            />

            <TextInput
              value={password}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
            />

            <TouchableOpacity
              onPress={onSignInPress}
              disabled={loading}
              className={`w-full py-3 rounded-lg ${loading ? "bg-gray-400" : "bg-blue-600"}`}
            >
              <Text className="text-white text-center font-semibold text-base">
                {loading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="text-center">
            <Text className="text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/(auth)/sign-up"
                className="text-blue-600 font-semibold"
              >
                Sign up
              </Link>
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
