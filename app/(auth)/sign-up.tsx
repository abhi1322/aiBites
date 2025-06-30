import { useOAuth, useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
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

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  // OAuth hooks
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({
    strategy: "oauth_apple",
  });

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (!emailAddress || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      console.log("Starting sign-up process...");
      const signUpAttempt = await signUp.create({
        emailAddress,
        password,
      });

      console.log("Sign-up attempt status:", signUpAttempt.status);
      console.log("Sign-up attempt:", JSON.stringify(signUpAttempt, null, 2));

      if (signUpAttempt.status === "complete") {
        console.log("Sign-up completed successfully");
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(app)");
      } else if (signUpAttempt.status === "missing_requirements") {
        console.log("Missing requirements, preparing email verification...");
        // Prepare email verification before showing verification screen
        try {
          await signUp.prepareEmailAddressVerification();
          console.log("Email verification prepared successfully");
          setPendingVerification(true);
        } catch (verificationError) {
          console.error(
            "Failed to prepare email verification:",
            verificationError
          );
          Alert.alert(
            "Error",
            "Failed to send verification code. Please try again."
          );
        }
      } else {
        console.error("Unexpected sign-up status:", signUpAttempt.status);
        Alert.alert("Error", "Sign up failed. Please try again.");
      }
    } catch (err) {
      console.error("Sign-up error:", JSON.stringify(err, null, 2));
      Alert.alert("Error", "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    if (!code.trim()) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting email verification with code:", code);
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      console.log("Verification attempt status:", signUpAttempt.status);
      console.log(
        "Verification attempt:",
        JSON.stringify(signUpAttempt, null, 2)
      );

      if (signUpAttempt.status === "complete") {
        console.log("Verification completed successfully");
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/(app)");
      } else {
        console.error("Verification failed with status:", signUpAttempt.status);
        Alert.alert("Error", "Verification failed. Please try again.");
      }
    } catch (err) {
      console.error("Verification error:", JSON.stringify(err, null, 2));
      Alert.alert("Error", "Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onResendCode = async () => {
    if (!isLoaded) return;

    try {
      console.log("Resending verification code...");
      await signUp.prepareEmailAddressVerification();
      Alert.alert("Success", "Verification code resent to your email");
    } catch (err) {
      console.error("Resend error:", JSON.stringify(err, null, 2));
      Alert.alert(
        "Error",
        "Failed to resend verification code. Please try again."
      );
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
      Alert.alert("Error", "Google sign up failed. Please try again.");
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
      Alert.alert("Error", "Apple sign up failed. Please try again.");
    }
  }, []);

  if (pendingVerification) {
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
                    Verify Your Email
                  </Text>
                  <Text className="text-gray-600">
                    Enter the verification code sent to your email
                  </Text>
                </View>

                <View className="gap-4">
                  <TextInput
                    value={code}
                    placeholder="Enter verification code"
                    onChangeText={(code) => setCode(code)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base"
                    keyboardType="numeric"
                    returnKeyType="done"
                    blurOnSubmit={true}
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

                  <TouchableOpacity
                    onPress={onResendCode}
                    className="w-full py-2"
                  >
                    <Text className="text-blue-600 text-center text-sm">
                      Didn&apos;t receive the code? Resend
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

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
                  Create Account
                </Text>
                <Text className="text-gray-600">Sign up to get started</Text>
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
                {/* Email/Password Form */}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
