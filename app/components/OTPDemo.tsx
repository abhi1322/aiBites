import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import OTPInput from "./OTPInput";

export default function OTPDemo() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);

  const handleComplete = (value: string) => {
    Alert.alert("OTP Complete", `You entered: ${value}`);
  };

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError(true);
      return;
    }
    setError(false);
    Alert.alert("Success", "OTP verified successfully!");
  };

  const handleResend = () => {
    setOtp("");
    setError(false);
    Alert.alert("Resend", "New OTP sent to your email");
  };

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <View className="bg-white rounded-lg p-6">
        <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
          OTP Verification
        </Text>
        <Text className="text-gray-600 text-center mb-6">
          Enter the 6-digit code sent to your email
        </Text>

        <OTPInput
          length={6}
          value={otp}
          onChange={setOtp}
          onComplete={handleComplete}
          error={error}
        />

        <TouchableOpacity
          onPress={handleVerify}
          disabled={otp.length !== 6}
          className={`w-full py-3 rounded-lg mt-4 ${
            otp.length !== 6 ? "bg-gray-400" : "bg-blue-600"
          }`}
        >
          <Text className="text-white text-center font-semibold">
            Verify OTP
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend} className="w-full py-2 mt-4">
          <Text className="text-blue-600 text-center text-sm">
            Didn't receive the code? Resend
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
