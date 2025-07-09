import { useOAuth, useSignIn, useUser } from "@clerk/clerk-expo";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../components/AppText";
import { DarkButton, LightButton } from "../components/ui/Button";
import DashedSeparator from "../components/ui/DashedSeparator";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const { user } = useUser();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OAuth hooks
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({
    strategy: "oauth_apple",
  });

  // Remove automatic redirect - let app layout handle it
  // useEffect(() => {
  //   if (user) {
  //     router.replace("../../(app)/(tabs)/home");
  //   }
  // }, [user]);

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
        // Let app layout handle redirect based on profile completion
        router.replace("../(app)");
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
        // Let app layout handle redirect based on profile completion
        router.replace("../(app)");
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
        // Let app layout handle redirect based on profile completion
        router.replace("../(app)");
      }
    } catch (err) {
      console.error("OAuth error", err);
      Alert.alert("Error", "Apple sign in failed. Please try again.");
    }
  }, []);

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
              Welcome Back!
            </AppText>
            <AppText
              className="text-sm text-neutral-500 text-center"
              tweight="regular"
            >
              Sign into your account
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
            {/* <View className="w-[90vw] h-20 border-neutral-200 border-dashed border" /> */}

            {/* Email and password */}
            <View className="flex-1 w-[90vw] gap-4 justify-end">
              {/* Email */}
              <View className="flex items-start">
                <AppText
                  className="text-sm text-neutral-500 text-center"
                  tweight="regular"
                >
                  Email
                </AppText>
                <TextInput
                  placeholder="Enter your email"
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  className="w-full h-14 rounded-md border border-[#E0E0E0] p-2"
                />
              </View>
              {/* Password */}
              <View className="flex items-start">
                <AppText
                  className="text-sm text-neutral-500 text-center"
                  tweight="regular"
                >
                  Password
                </AppText>
                <View className="w-full h-14 rounded-md border border-[#E0E0E0] flex-row items-center px-2">
                  <TextInput
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    className="flex-1 h-full"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                    className="pl-2 pr-1"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    {/* Use a real icon in production, e.g. from react-native-vector-icons */}
                    <AppText className="text-xl">
                      {showPassword ? (
                        <Ionicons name="eye-outline" size={24} color="black" />
                      ) : (
                        <Ionicons
                          name="eye-off-outline"
                          size={24}
                          color="black"
                        />
                      )}
                    </AppText>
                  </TouchableOpacity>
                </View>
              </View>
              {/* Sign up */}
              <AppText className="text-sm text-neutral-500" tweight="regular">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="text-neutral-800 underline">
                  Sign up
                </Link>
              </AppText>
              {/* Login button */}
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
                  onPress={onSignInPress}
                >
                  Login
                </DarkButton>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
