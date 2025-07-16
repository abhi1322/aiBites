import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { AppText } from "../AppText";

interface InputProps extends TextInputProps {
  label?: string;
  validator?: (value: string) => string | null; // returns error message or null
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  setError?: (err: string) => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  validator,
  value,
  onValueChange,
  error: errorProp,
  setError: setErrorProp,
  onBlur,
  className = "",
  secureTextEntry,
  ...props
}) => {
  const [touched, setTouched] = useState(false);
  const [localError, setLocalError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const error = errorProp !== undefined ? errorProp : localError;
  const setError = setErrorProp !== undefined ? setErrorProp : setLocalError;

  const handleBlur = (e: any) => {
    setTouched(true);
    if (validator) {
      const err = validator(value);
      setError(err || "");
    }
    if (onBlur) onBlur(e);
  };

  const handleChange = (text: string) => {
    onValueChange(text);
    if (error) setError("");
  };

  const isPassword = !!secureTextEntry;

  return (
    <View className="w-full mb-2">
      {label && (
        <AppText className="text-sm text-neutral-500 mb-1">{label}</AppText>
      )}
      <View style={{ position: "relative", width: "100%" }}>
        <TextInput
          value={value}
          onChangeText={handleChange}
          onBlur={handleBlur}
          className={`w-full h-14 rounded-md border p-2 pr-12 ${error ? "border-red-500" : "border-[#E0E0E0]"} ${className}`}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={{
              position: "absolute",
              right: 16,
              top: 0,
              height: "100%",
              justifyContent: "center",
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <AppText className="text-red-500 text-xs mt-1">{error}</AppText>
      ) : null}
    </View>
  );
};

export default Input;
