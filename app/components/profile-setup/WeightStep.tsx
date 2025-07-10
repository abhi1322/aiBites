import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { RulerPicker } from "react-native-ruler-picker";
import { AppText } from "../AppText";

interface WeightStepProps {
  weight: number;
  updateWeight: (weight: number) => void;
}

export const WeightStep: React.FC<WeightStepProps> = ({
  weight,
  updateWeight,
}) => {
  const [localWeight, setLocalWeight] = useState(weight);

  useEffect(() => {
    setLocalWeight(weight); // Sync if parent changes
  }, [weight]);

  return (
    <ScrollView>
      <View className="flex-1 justify-between pb-20">
        <View className="mt-4 text-center items-center justify-center">
          <AppText tweight="semibold" className="text-2xl text-neutral-800">
            Select your weight
          </AppText>
          <AppText
            tweight="regular"
            className="text-neutral-500 text-sm text-center mt-2 w-[80%]"
          >
            Enter your weight in kilograms, so we can calculate your BMI.
          </AppText>
        </View>

        <View className="flex-1 h-[40vh] justify-end items-center">
          <AppText
            tweight="semibold"
            className="text-neutral-600 text-4xl text-center mb-10"
          >
            {localWeight} kg
          </AppText>
          <RulerPicker
            min={30}
            max={200}
            step={1}
            fractionDigits={0}
            initialValue={Number(weight)}
            onValueChange={(val) => setLocalWeight(Number(val))}
            onValueChangeEnd={(val) => updateWeight(Number(val))}
            unit="kg"
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
