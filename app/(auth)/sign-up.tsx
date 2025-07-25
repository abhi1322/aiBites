import { useOAuth, useSignUp } from "@clerk/clerk-expo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../components/AppText";
import OTPInput from "../components/OTPInput";
import { DarkButton, LightButton } from "../components/ui/Button";
import DashedSeparator from "../components/ui/DashedSeparator";
import { Input } from "../components/ui/Input";
import { validateEmail, validatePassword } from "../utils/validator";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
      const signUpAttempt = await signUp.create({
        emailAddress,
        password,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("../(app)/profile-setup");
      } else if (signUpAttempt.status === "missing_requirements") {
        try {
          await signUp.prepareEmailAddressVerification();
          setPendingVerification(true);
        } catch (verificationError) {
          Alert.alert(
            "Error",
            "Failed to send verification code. Please try again."
          );
        }
      } else {
        Alert.alert("Error", "Sign up failed. Please try again.");
      }
    } catch (err) {
      console.error("Sign-up error:", err);
      let errorMessage = "Failed to create account. Please try again.";
      if (typeof err === "object" && err !== null) {
        // Check for Clerk error format
        if (
          Array.isArray((err as any).errors) &&
          (err as any).errors[0]?.message
        ) {
          errorMessage = (err as any).errors[0].message;
        } else if (typeof (err as any).message === "string") {
          errorMessage = (err as any).message;
        }
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    if (!code.trim() || code.length !== 6) {
      setOtpError(true);
      return;
    }

    setOtpError(false);
    setLoading(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("../(app)/profile-setup");
      } else {
        setOtpError(true);
      }
    } catch (err) {
      console.error("Verification error:", err);
      setOtpError(true);
    } finally {
      setLoading(false);
    }
  };

  const onResendCode = async () => {
    if (!isLoaded) return;

    try {
      await signUp.prepareEmailAddressVerification();
      setOtpError(false);
      setCode("");
      Alert.alert("Success", "Verification code resent to your email");
    } catch (err) {
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
        router.replace("../(app)");
      }
    } catch (err) {
      Alert.alert("Error", "Google sign up failed. Please try again.");
    }
  }, []);

  const onApplePress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startAppleOAuthFlow();

      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
        router.replace("../(app)");
      }
    } catch (err) {
      Alert.alert("Error", "Apple sign up failed. Please try again.");
    }
  }, []);

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 bg-white text-center">
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
              <View className="w-full max-w-sm gap-6">
                <View className="text-center">
                  <Image
                    source={require("../../assets/icons/Logo.png")}
                    style={{
                      width: 150,
                      height: 50,
                      alignSelf: "center",
                    }}
                    className="mb-4"
                    resizeMode="contain"
                  />
                  <AppText
                    tweight="semibold"
                    className="text-3xl text-center text-neutral-800 mt-4 mb-2"
                  >
                    You&apos;re Almost There!
                  </AppText>

                  <AppText
                    tweight="regular"
                    className="text-sm  text-neutral-400 text-center"
                  >
                    We&apos;ve sent a verification code to your email. Please
                    enter it to continue.
                  </AppText>
                </View>

                <OTPInput
                  length={6}
                  value={code}
                  onChange={(newCode) => {
                    console.log("Code changed from:", code, "to:", newCode);
                    setCode(newCode);
                  }}
                  error={otpError}
                  disabled={loading}
                />
                <DarkButton
                  onPress={onVerifyPress}
                  disabled={loading || code.length !== 6}
                  className="items-end"
                >
                  {loading ? "Verifying..." : "Verify Email"}
                </DarkButton>
                <TouchableOpacity
                  onPress={onResendCode}
                  disabled={loading}
                  className="w-full py-2"
                >
                  <Text
                    className={`text-center text-sm ${
                      loading ? "text-gray-400" : "text-neutral-600 underline"
                    }`}
                  >
                    Didn&apos;t receive the code? Resend
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 w-[100vw] bg-white items-center ">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          className="flex-1 w-[100%] h-full"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo and text */}
          <View className="flex-1  items-center justify-center">
            <Image
              source={require("../../assets/icons/Logo.png")}
              style={{
                width: 150,
                height: 50,
                alignSelf: "center",
              }}
              resizeMode="contain"
            />
            <AppText className="text-3xl text-center mt-4" tweight="semibold">
              Welcome
            </AppText>
            <AppText
              className="text-sm text-neutral-500 text-center"
              tweight="regular"
            >
              Create your account to get started
            </AppText>
          </View>
          <View className="w-full flex-col items-center justify-center gap-4">
            {/* Buttons Container google and apple */}
            <View className="flex-1 w-[90vw] gap-4">
              <LightButton
                icon={<Ionicons name="logo-google" size={24} />}
                iconPosition="left"
                className="my-2 w-full py-4 rounded-2xl"
                onPress={onGooglePress}
              >
                Continue with Google
              </LightButton>
              <DarkButton
                icon={<Ionicons name="logo-apple" size={24} color="white" />}
                className="my-2 w-full py-4"
                iconPosition="left"
                onPress={onApplePress}
              >
                Continue with Apple ID
              </DarkButton>
            </View>
            {/* Divider */}
            <View className="w-full flex-row items-center justify-center gap-4">
              <DashedSeparator
                color="#A3A3A3"
                thickness={1}
                width={120}
                className="w-[40vw]"
                gap={10}
              />
              <AppText
                className="text-sm text-neutral-500 text-center"
                tweight="regular"
              >
                or
              </AppText>
              <DashedSeparator
                color="#A3A3A3"
                thickness={1}
                width={120}
                className="w-[40vw]"
                gap={10}
              />
            </View>
            {/* Email and password */}
            <View className="flex-1 w-[90vw] gap-4 justify-end">
              {/* Email */}
              <View className="flex items-start">
                <Input
                  label="Email"
                  value={emailAddress}
                  onValueChange={setEmailAddress}
                  validator={validateEmail}
                  error={emailError}
                  setError={setEmailError}
                  placeholder="Enter your email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  className="mb-2"
                />
              </View>
              {/* Password */}
              <View className="flex items-start">
                <Input
                  label="Password"
                  value={password}
                  onValueChange={setPassword}
                  validator={validatePassword}
                  error={passwordError}
                  setError={setPasswordError}
                  placeholder="Enter your password"
                  secureTextEntry={true}
                  autoCapitalize="none"
                />
              </View>
              {/* Sign up */}
              <AppText className="text-sm text-neutral-500" tweight="regular">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-neutral-800 underline">
                  Sign in
                </Link>
              </AppText>
              {/* Create Account button */}
              <View className="w-full mt-16">
                <DarkButton
                  icon={
                    <Ionicons
                      name="arrow-forward-outline"
                      size={24}
                      color={"#ffffff"}
                    />
                  }
                  className="w-full py-4"
                  iconPosition="right"
                  onPress={onSignUpPress}
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </DarkButton>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
