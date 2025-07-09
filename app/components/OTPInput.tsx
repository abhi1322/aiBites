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
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  const handleChange = (text: string, index: number) => {
    const newValue = value.split("");
    newValue[index] = text;
    const result = newValue.join("");
    onChange(result);

    // Auto-focus next input
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
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
                  ? "border-neutral-500 bg-neutral-50"
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
              selectionColor={error ? "#ef4444" : "#000000"}
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
    </View>
  );
}
