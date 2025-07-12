import React, { useEffect, useRef, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { AppText } from "./AppText";

interface OTPInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
}

export default function OTPInput({
  length,
  value,
  onChange,
  onComplete,
  error = false,
  disabled = false,
}: OTPInputProps) {
  const inputRefs = useRef<TextInput[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  // Focus first input when component mounts
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
      setFocusedIndex(0);
    }, 500);
  }, []);

  const handleChange = (text: string, index: number) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, "");

    // Create new value array
    const newValue = value.split("");

    // Update the current index
    if (numericText.length > 0) {
      newValue[index] = numericText[0];
    } else {
      newValue[index] = "";
    }

    const result = newValue.join("");
    console.log(
      `Input ${index}: "${text}" -> "${numericText[0] || ""}", Result: "${result}"`
    );

    // Update the value
    onChange(result);

    // Move to next input if we have a digit
    if (numericText.length > 0 && index < length - 1) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
        setFocusedIndex(index + 1);
      }, 100);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace") {
      if (!value[index] && index > 0) {
        // If current field is empty and backspace is pressed, go to previous field
        inputRefs.current[index - 1]?.focus();
        setFocusedIndex(index - 1);
      } else if (value[index]) {
        // If current field has value, clear it first
        const newValue = value.split("");
        newValue[index] = "";
        onChange(newValue.join(""));
      }
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
    setFocusedIndex(index);
  };

  return (
    <View className="w-full">
      <View className="flex-row justify-center gap-2 mb-4">
        {Array.from({ length }, (_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => focusInput(index)}
            className={`w-12 h-12 border-2 rounded-lg items-center justify-center ${
              error
                ? "border-red-500 bg-red-50"
                : focusedIndex === index
                  ? "border-blue-500 bg-blue-50"
                  : value[index]
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 bg-white"
            }`}
          >
            <TextInput
              ref={(ref) => {
                if (ref) inputRefs.current[index] = ref;
              }}
              value={value[index] || ""}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              className="text-center text-lg font-bold text-gray-900"
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
              editable={!disabled}
              selectionColor={error ? "#ef4444" : "#3b82f6"}
              autoFocus={index === 0}
              style={{ minWidth: 20, minHeight: 20 }}
            />
          </TouchableOpacity>
        ))}
      </View>

      {error && (
        <AppText
          tweight="regular"
          className="text-red-500 text-center text-sm mb-2"
        >
          Invalid verification code
        </AppText>
      )}

      {/* Debug info */}
      <AppText className="text-xs text-gray-400 text-center mt-2">
        Code: {value} (Length: {value.length})
      </AppText>
    </View>
  );
}
