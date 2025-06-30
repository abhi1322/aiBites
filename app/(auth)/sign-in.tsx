import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // OAuth hooks
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({
    strategy: "oauth_apple",
  });

  const onSignInPress = async () => {
    if (!isLoaded) return;

    if (!emailAddress || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(app)");
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

  const onGooglePress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleOAuthFlow();

      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
        router.replace("/(app)");
      }
    } catch (err) {
      console.error("OAuth error", err);
      Alert.alert("Error", "Google sign in failed. Please try again.");
    }
  }, []);

  const onApplePress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startAppleOAuthFlow();

      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
        router.replace("/(app)");
      }
    } catch (err) {
      console.error("OAuth error", err);
      Alert.alert("Error", "Apple sign in failed. Please try again.");
    }
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 items-center justify-center px-6 py-8">
            <View className="w-full max-w-sm gap-4">
              <View className="text-center">
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </Text>
                <Text className="text-gray-600">Sign in to your account</Text>
              </View>

              {/* Social Login Buttons */}
              <View className="space-y-3">
                <TouchableOpacity
                  onPress={onGooglePress}
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg flex-row items-center justify-center space-x-3"
                >
                  <Text className="text-2xl">🔍</Text>
                  <Text className="text-gray-700 font-semibold text-base">
                    Continue with Google
                  </Text>
                </TouchableOpacity>

                {Platform.OS === "ios" && (
                  <TouchableOpacity
                    onPress={onApplePress}
                    className="w-full py-3 px-4 bg-black rounded-lg flex-row items-center justify-center space-x-3"
                  >
                    <Text className="text-2xl">🍎</Text>
                    <Text className="text-white font-semibold text-base">
                      Continue with Apple
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Divider */}
              <View className="flex-row items-center space-x-4">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="text-gray-500 font-medium">or</Text>
                <View className="flex-1 h-px bg-gray-300" />
              </View>

              <View className="gap-4">
                <TextInput
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Email address"
                  onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
                  keyboardType="email-address"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />

                <TextInput
                  value={password}
                  placeholder="Password"
                  secureTextEntry={true}
                  onChangeText={(password) => setPassword(password)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
                  returnKeyType="done"
                  blurOnSubmit={true}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
