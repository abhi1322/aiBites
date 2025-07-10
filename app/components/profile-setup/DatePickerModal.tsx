import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { AppText } from "../AppText";

interface DatePickerModalProps {
  value: Date;
  onChange: (event: any, selectedDate?: Date) => void;
  onClose: () => void;
  visible: boolean;
  maximumDate?: Date;
  minimumDate?: Date;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  value,
  onChange,
  onClose,
  visible,
  maximumDate = new Date(),
  minimumDate = new Date(1900, 0, 1),
}) => {
  const [selectedDate, setSelectedDate] = useState(value);

  // Update local state when value prop changes
  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleDone = () => {
    onChange(null, selectedDate);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-[#00000040] justify-end">
        <View className="bg-white rounded-t-3xl p-6">
          <View className="flex-row justify-between items-center mb-4">
            <AppText className="text-lg font-semibold text-gray-900">
              Select Date of Birth
            </AppText>
            <TouchableOpacity onPress={handleDone}>
              <AppText className="text-blue-600 text-lg font-semibold">
                Done
              </AppText>
            </TouchableOpacity>
          </View>

          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            style={{ height: 200 }}
          />
        </View>
      </View>
    </Modal>
  );
};
