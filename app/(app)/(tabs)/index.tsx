import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import moment from "moment";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CalendarStripComponent } from "../../components/CalendarStripComponent";

export default function HomeTab() {
  const { isSignedIn } = useAuth();

  const [selectedDate, setSelectedDate] = useState(moment());

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-up" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-2">
        <CalendarStripComponent
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          markedDates={["2024-06-10", "2024-06-12"]}
        />
      </View>
    </SafeAreaView>
  );
}
