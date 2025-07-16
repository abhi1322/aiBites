import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { validateName } from "../../utils/validator";
import { AppText } from "../AppText";
import { Input } from "../ui/Input";

// Profile data interface
interface ProfileData {
  firstName: string;
  lastName: string;
  profileImage?: string;
  height: string;
  weight: number;
  gender: "male" | "female" | "other" | null;
  dateOfBirth: Date;
  calorieGoal: string;
  proteinGoal: string;
  carbGoal: string;
  fatGoal: string;
}

interface BasicInfoStepProps {
  profileData: ProfileData;
  updateProfileData: (updates: Partial<ProfileData>) => void;
  showDatePicker: () => void;
  pickImage: () => void;
  formatDate: (date: Date) => string;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  profileData,
  updateProfileData,
  showDatePicker,
  pickImage,
  formatDate,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(profileData.gender);
  const [items, setItems] = useState([
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ]);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  console.log("Profile image URL:", profileData.profileImage);

  return (
    <View className="space-y-6">
      <View className="text-center">
        <AppText
          tweight="semibold"
          className="text-2xl text-center text-gray-900 mb-2"
        >
          Fill your basic information
        </AppText>
      </View>

      {/* Profile Image */}
      <View className="items-center ">
        <View className="border-neutral-200 rounded-full border-[4px]">
          <TouchableOpacity
            onPress={pickImage}
            className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center border-2  border-neutral-500"
          >
            {profileData.profileImage ? (
              <Image
                source={{ uri: profileData.profileImage }}
                className="w-24 h-24 rounded-full"
              />
            ) : (
              <Text className="text-gray-500 text-sm">Add Photo</Text>
            )}
          </TouchableOpacity>
        </View>
        <AppText
          tweight="regular"
          className="text-sm text-center mt-2 text-neutral-500"
        >
          Add Photo
        </AppText>
      </View>

      {/* Name Fields */}
      <View className="flex-row mt-8  w-full gap-4">
        <View className="w-[50%] items-start">
          <AppText
            className="text-sm text-neutral-500 text-center"
            tweight="regular"
          >
            First Name
          </AppText>
          <Input
            placeholder="Enter your first name"
            textContentType="givenName"
            value={profileData.firstName}
            onValueChange={(firstName) => updateProfileData({ firstName })}
            validator={validateName}
            error={firstNameError}
            setError={setFirstNameError}
          />
        </View>
        <View className="w-[45%] items-start">
          <AppText
            className="text-sm text-neutral-500 text-center"
            tweight="regular"
          >
            Last Name
          </AppText>
          <Input
            placeholder="Enter your last name"
            textContentType="familyName"
            value={profileData.lastName}
            onValueChange={(lastName) => updateProfileData({ lastName })}
            validator={validateName}
            error={lastNameError}
            setError={setLastNameError}
          />
        </View>
      </View>

      {/* Gender */}
      <View className="mt-4 mb-4">
        <AppText tweight="regular" className="text-neutral-500 text-sm mb-2">
          Gender *
        </AppText>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="Select gender"
          style={{ minHeight: 48, borderColor: "#E0E0E0" }}
          containerStyle={{ width: "100%" }}
          onChangeValue={(val) =>
            updateProfileData({ gender: val as "male" | "female" | "other" })
          }
          textStyle={{
            color: "#171717",
          }}
          dropDownContainerStyle={{
            backgroundColor: "#f8f9fa",
            borderColor: "#E0E0E0",
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
          }}
          badgeTextStyle={{
            color: "#171717",
          }}
        />
      </View>

      {/* Date of Birth */}
      <View>
        <AppText tweight="regular" className="text-neutral-500 text-sm mb-2">
          Date of Birth
        </AppText>
        <TouchableOpacity
          onPress={showDatePicker}
          className="border border-neutral-200 rounded-lg px-4 py-3 bg-white"
        >
          <AppText tweight="regular" className="text-neutral-500">
            {formatDate(profileData.dateOfBirth)}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export type { ProfileData };
