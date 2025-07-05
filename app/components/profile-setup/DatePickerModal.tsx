import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { Platform } from "react-native";

interface DatePickerModalProps {
  value: Date;
  onChange: (event: any, selectedDate?: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  value,
  onChange,
  maximumDate = new Date(),
  minimumDate = new Date(1900, 0, 1),
}) => {
  return (
    <DateTimePicker
      value={value}
      mode="date"
      display={Platform.OS === "ios" ? "spinner" : "default"}
      onChange={onChange}
      maximumDate={maximumDate}
      minimumDate={minimumDate}
    />
  );
};
