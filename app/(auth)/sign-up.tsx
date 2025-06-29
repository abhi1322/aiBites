import { useAuth, useOAuth, useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { useCallback } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
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
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
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

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded || !emailAddress || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert("Error", "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded || !code) {
      Alert.alert("Error", "Please enter verification code");
      return;
    }

    setLoading(true);
    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(app)/(tabs)");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
        Alert.alert("Error", "Verification failed. Please try again.");
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert(
        "Error",
        "Verification failed. Please check your code and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Don't render if already signed in
  if (isLoaded && isSignedIn) {
    return null;
  }

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-full max-w-sm space-y-6">
            <View className="text-center">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                Verify your email
              </Text>
              <Text className="text-gray-600">
                We&apos;ve sent a verification code to {emailAddress}
              </Text>
            </View>

            <View className="space-y-4 ">
              <TextInput
                value={code}
                placeholder="Enter verification code"
                onChangeText={(code) => setCode(code)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
                keyboardType="number-pad"
                autoFocus
              />

              <TouchableOpacity
                onPress={onVerifyPress}
                disabled={loading}
                className={`w-full py-3 rounded-lg ${loading ? "bg-gray-400" : "bg-blue-600"}`}
              >
                <Text className="text-white text-center font-semibold text-base">
                  {loading ? "Verifying..." : "Verify Email"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-sm space-y-8">
          <View className="text-center">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </Text>
            <Text className="text-gray-600">Sign up to get started</Text>
          </View>

          <View className="gap-4 mt-8">
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
              onChangeText={(email) => setEmailAddress(email)}
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
              onPress={onSignUpPress}
              disabled={loading}
              className={`w-full py-3 rounded-lg ${loading ? "bg-gray-400" : "bg-blue-600"}`}
            >
              <Text className="text-white text-center font-semibold text-base">
                {loading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="text-center">
            <Text className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/(auth)/sign-in"
                className="text-blue-600 font-semibold"
              >
                Sign in
              </Link>
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
