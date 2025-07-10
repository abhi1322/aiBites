// components/profile-setup/HeightStep.tsx
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { RulerPicker } from "react-native-ruler-picker"; // Use named import
import { AppText } from "../AppText";

interface HeightStepProps {
  height: string;
  updateHeight: (height: string) => void;
}

export const HeightStep: React.FC<HeightStepProps> = ({
  height,
  updateHeight,
}) => {
  const [localHeight, setLocalHeight] = useState(height || "150");

  useEffect(() => {
    if (!height) {
      setLocalHeight("150");
      updateHeight("150");
    }
  }, []);

  return (
    <ScrollView>
      <View className="flex-1 justify-between pb-20">
        <View className="mt-4 text-center items-center justify-center">
          <AppText tweight="semibold" className="text-2xl text-neutral-800">
            Select your height
          </AppText>
          <AppText
            tweight="regular"
            className="text-neutral-500 text-sm text-center mt-2 w-[80%]"
          >
            Enter your height in centimeters, so we can calculate your BMI.
          </AppText>
        </View>

        <View className="flex-1 h-[40vh] justify-end items-center">
          <AppText
            tweight="semibold"
            className="text-neutral-600 text-4xl text-center mb-10"
          >
            {localHeight} cm
          </AppText>
          <RulerPicker
            min={100}
            max={250}
            step={1}
            fractionDigits={0}
            initialValue={Number(height)}
            onValueChange={(val) => setLocalHeight(String(val))} // update local state in real time
            onValueChangeEnd={(val) => updateHeight(String(val))} // update parent only when done
            unit="cm"
            width={300}
            height={80}
            indicatorColor="#000000"
            valueTextStyle={{
              color: "transparent",
            }}
            unitTextStyle={{
              color: "transparent",
            }}
            indicatorHeight={120}
            longStepColor="#e2e2e2"
            longStepHeight={60}
          />
          <View className="-z-10 w-[80vw] h-[2px] bg-neutral-200" />
        </View>
      </View>
    </ScrollView>
  );
};
