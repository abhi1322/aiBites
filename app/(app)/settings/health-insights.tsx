import { AppText } from "@/app/components/AppText";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  ChevronDown,
  Target,
  TrendingUp,
} from "lucide-react-native";
import moment from "moment";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../../../convex/_generated/api";
import CustomIntakeChart from "../../components/CustomIntakeChart";
import DashedSeparator from "../../components/ui/DashedSeparator";

type DurationType = "week" | "month";

// Types for nutrition data
interface NutritionData {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface ChartData {
  calories: number[];
  protein: number[];
  carbs: number[];
  fat: number[];
}

interface OverviewStats {
  averageCalories: number;
  goalAchievement: number;
  averageProtein: number;
  totalDays: number;
}

// Data fetching and processing logic
const useNutritionData = (userId: string, duration: DurationType) => {
  // Calculate date range
  const getDateRange = useCallback(() => {
    const endDate = moment().format("YYYY-MM-DD");
    const startDate =
      duration === "week"
        ? moment().subtract(6, "days").format("YYYY-MM-DD")
        : moment().subtract(29, "days").format("YYYY-MM-DD");

    return { startDate, endDate };
  }, [duration]);

  const { startDate, endDate } = getDateRange();

  // Fetch food items for the date range
  const foodItems = useQuery(
    api.food.getFoodItemsByUser,
    userId ? { createdBy: userId } : "skip"
  );

  // Process data for charts and tables
  const processedData = useMemo(() => {
    if (!foodItems || !userId) return null;

    // Filter food items by date range
    const filteredItems = foodItems.filter((item) => {
      const itemDate = moment(item._creationTime).format("YYYY-MM-DD");
      return itemDate >= startDate && itemDate <= endDate;
    });

    // Group food items by date
    const groupedByDate = filteredItems.reduce(
      (acc: Record<string, any>, item: any) => {
        const date = moment(item._creationTime).format("YYYY-MM-DD");
        if (!acc[date]) {
          acc[date] = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
            items: [],
          };
        }

        acc[date].calories += item.calories?.total || 0;
        acc[date].protein += parseFloat(item.protein) || 0;
        acc[date].carbs += parseFloat(item.carbs) || 0;
        acc[date].fat += parseFloat(item.fat) || 0;
        acc[date].items.push(item);

        return acc;
      },
      {} as Record<string, any>
    );

    // Create arrays for each nutrition type
    const days = duration === "week" ? 7 : 30;
    const calories: number[] = [];
    const protein: number[] = [];
    const carbs: number[] = [];
    const fat: number[] = [];

    // Fill arrays with data for each day (oldest to newest)
    for (let i = days - 1; i >= 0; i--) {
      const date = moment().subtract(i, "days").format("YYYY-MM-DD");
      const dayData = groupedByDate[date];

      calories.push(dayData?.calories || 0);
      protein.push(dayData?.protein || 0);
      carbs.push(dayData?.carbs || 0);
      fat.push(dayData?.fat || 0);
    }

    return {
      chartData: {
        calories: calories.reverse(), // Reverse to show newest at end
        protein: protein.reverse(),
        carbs: carbs.reverse(),
        fat: fat.reverse(),
      },
      dailyData: groupedByDate,
      totalDays: days,
    };
  }, [foodItems, duration, userId, startDate, endDate]);

  return processedData;
};

// Calculate overview statistics
const useOverviewStats = (chartData: ChartData | null, userGoals: any) => {
  return useMemo(() => {
    if (!chartData) return null;

    const { calories, protein } = chartData;
    const totalDays = calories.length;

    // Calculate average calories
    const totalCalories = calories.reduce((sum, cal) => sum + cal, 0);
    const averageCalories = Math.round(totalCalories / totalDays);

    // Calculate goal achievement (days meeting calorie goal)
    const calorieGoal = userGoals?.calorieGoal || 2000;
    const goalAchievement = calories.filter(
      (cal) => cal >= calorieGoal * 0.8
    ).length;

    // Calculate average protein
    const totalProtein = protein.reduce((sum, pro) => sum + pro, 0);
    const averageProtein = Math.round(totalProtein / totalDays);

    return {
      averageCalories,
      goalAchievement,
      averageProtein,
      totalDays,
    };
  }, [chartData, userGoals]);
};

// Keyboard Spinner Picker Component
const SpinnerPicker = ({
  value,
  onValueChange,
}: {
  value: DurationType;
  onValueChange: (value: DurationType) => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const options = [
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
  ];

  const selectedOption = options.find((option) => option.value === value);

  const showPicker = () => {
    setIsVisible(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hidePicker = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
    });
  };

  const handleSelect = (option: DurationType) => {
    onValueChange(option);
    hidePicker();
  };

  return (
    <>
      <TouchableOpacity
        onPress={showPicker}
        className="bg-neutral-100 border border-neutral-200 rounded-lg px-4 py-2 flex-row items-center justify-between"
        style={{ minHeight: 40, width: 120 }}
      >
        <Text className="text-neutral-900 font-medium text-sm">
          {selectedOption?.label || "Select"}
        </Text>
        <ChevronDown size={16} color="#6b7280" />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hidePicker}
        className=""
      >
        <Animated.View
          className="flex-1 bg-black/20"
          style={{ opacity: fadeAnim }}
        >
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={hidePicker}
          />

          <Animated.View
            className="bg-white rounded-t-3xl"
            style={{
              transform: [{ translateY: slideAnim }],
              paddingBottom: 34, // Safe area for home indicator
            }}
          >
            {/* Handle Bar */}
            <View className="items-center py-3">
              <View className="w-12 h-1 bg-gray-300 rounded-full" />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
              <TouchableOpacity onPress={hidePicker}>
                <Text className="text-neutral-500 font-medium">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-gray-900">
                Select Duration
              </Text>
              <TouchableOpacity onPress={hidePicker}>
                <Text className="text-neutral-800 font-medium">Done</Text>
              </TouchableOpacity>
            </View>

            {/* Picker Options */}
            <View className="py-4">
              {options.map((option, index) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleSelect(option.value as DurationType)}
                  className={`py-4 px-6 mx-4 rounded-xl mb-2 ${
                    value === option.value
                      ? "bg-neutral-50 border-2 border-neutral-200"
                      : "bg-gray-50 border border-gray-100"
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <Text
                      className={`text-lg font-medium ${
                        value === option.value
                          ? "text-neutral-600"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </Text>
                    {value === option.value && (
                      <View className="w-6 h-6 bg-neutral-800 rounded-full items-center justify-center">
                        <Text className="text-white text-sm font-bold">✓</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
};

export default function HealthInsightsScreen() {
  const [duration, setDuration] = useState<DurationType>("week");
  const { user } = useUser();
  const router = useRouter();
  const userData = useQuery(
    api.users.getUserByClerkId,
    user?.id ? { clerkId: user.id } : "skip"
  );

  // Fetch nutrition data
  const nutritionData = useNutritionData(userData?.clerkId || "", duration);

  // Calculate overview statistics
  const overviewStats = useOverviewStats(
    nutritionData?.chartData || null,
    userData
  );

  // Handle duration change
  const handleDurationChange = useCallback((newValue: DurationType) => {
    setDuration(newValue);
  }, []);

  // Get current data for chart
  const getCurrentData = useCallback(() => {
    return nutritionData?.chartData?.calories || [];
  }, [nutritionData]);

  // Get max value for chart scaling
  const getMaxValue = useCallback(() => {
    const calories = nutritionData?.chartData?.calories || [];
    const maxCalories = Math.max(...calories, 2000); // Default to 2000 if no data
    return Math.ceil(maxCalories / 100) * 100; // Round up to nearest 100
  }, [nutritionData]);

  // Get weekly data arrays
  const proteinData = nutritionData?.chartData?.protein || [];
  const carbsData = nutritionData?.chartData?.carbs || [];
  const fatData = nutritionData?.chartData?.fat || [];
  const days = duration === "week" ? 7 : 30;

  // Get user goals (fallbacks if not set)
  const proteinGoal = userData?.proteinGoal || 50; // grams
  const carbsGoal = userData?.carbGoal || 250; // grams
  const fatGoal = userData?.fatGoal || 70; // grams

  // Calculate % of days meeting each macro goal (for week only)
  function getMacroProgress(data: number[], goal: number, days: number) {
    if (!data.length || !goal) return 0;
    const periodData = data.slice(-days);
    const metGoalDays = periodData.filter((val) => val >= goal * 0.9).length; // 90% threshold
    return Math.round((metGoalDays / periodData.length) * 100);
  }

  const periodDays = duration === "week" ? 7 : 30;
  const proteinProgress = getMacroProgress(
    proteinData,
    proteinGoal,
    periodDays
  );
  const carbsProgress = getMacroProgress(carbsData, carbsGoal, periodDays);
  const fatProgress = getMacroProgress(fatData, fatGoal, periodDays);

  if (!user) return null;
  if (userData === undefined)
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500">Loading...</Text>
      </View>
    );
  if (userData === null)
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500">No user data found.</Text>
      </View>
    );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white mt-4 pb-4 px-4 ">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center"
          >
            <ArrowLeft size={24} color="#374151" />
            <AppText
              tweight="medium"
              className="flex-1 text-center text-lg text-neutral-600 ml-2"
            >
              Health Insights
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Daily Intake Chart */}
        <View
          className="bg-white rounded-2xl mb-8 border border-neutral-200"
          style={styles.shadow}
        >
          <View className="flex-row items-center justify-between px-6 py-8 border-b border-neutral-200">
            <AppText tweight="regular" className="text-xl text-neutral-800">
              Daily Intake
            </AppText>

            {/* Keyboard Spinner Picker */}
            <SpinnerPicker
              value={duration}
              onValueChange={handleDurationChange}
            />
          </View>

          <View className="my-8 ">
            <CustomIntakeChart
              data={getCurrentData()}
              duration={duration}
              max={getMaxValue()}
            />
          </View>
        </View>

        {/* Overview Statistics */}
        <View
          className="bg-white rounded-2xl mb-8 border border-neutral-200"
          style={styles.shadow}
        >
          <AppText
            tweight="regular"
            className="text-xl text-neutral-800 px-6 py-8 border-b border-neutral-200"
          >
            {duration === "week" ? "This Week's" : "This Month's"} Overview
          </AppText>

          <View className="space-y-4 px-6 overflow-hidden">
            <View className="flex-row items-center justify-between my-6">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-neutral-100 rounded-lg items-center justify-center">
                  <BarChart3 size={20} color="#3e3e3e" />
                </View>
                <View className="ml-3">
                  <AppText
                    tweight="medium"
                    className="text-base text-neutral-800"
                  >
                    Average Calories
                  </AppText>
                  <AppText className="text-sm text-neutral-500">
                    Daily intake this {duration}
                  </AppText>
                </View>
              </View>
              <AppText className="text-lg font-bold text-neutral-500">
                {overviewStats?.averageCalories || 0}
              </AppText>
            </View>
            <DashedSeparator width={500} />

            <View className="flex-row items-center justify-between my-6">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-neutral-100 rounded-lg items-center justify-center">
                  <Target size={20} color="#3e3e3e" />
                </View>
                <View className="ml-3">
                  <AppText
                    tweight="medium"
                    className="text-base text-neutral-800"
                  >
                    Goal Achievement
                  </AppText>
                  <AppText className="text-sm text-neutral-500">
                    Days meeting calorie goal
                  </AppText>
                </View>
              </View>
              <AppText className="text-lg font-bold text-neutral-500">
                {overviewStats?.goalAchievement || 0}/
                {overviewStats?.totalDays || 0}
              </AppText>
            </View>
            <DashedSeparator width={500} />

            <View className="flex-row items-center justify-between my-6">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-neutral-100 rounded-lg items-center justify-center">
                  <TrendingUp size={20} color="#3e3e3e" />
                </View>
                <View className="ml-3">
                  <AppText
                    tweight="medium"
                    className="text-base text-neutral-800"
                  >
                    Protein Intake
                  </AppText>
                  <AppText className="text-sm text-neutral-500">
                    Average daily protein
                  </AppText>
                </View>
              </View>
              <AppText className="text-lg font-bold text-neutral-500">
                {overviewStats?.averageProtein || 0}g
              </AppText>
            </View>
          </View>
        </View>

        {/* Nutrition Trends */}
        <View
          className="bg-white rounded-2xl mb-8 border border-neutral-200"
          style={styles.shadow}
        >
          <AppText
            tweight="regular"
            className="text-xl text-neutral-800 px-6 py-8 border-b border-neutral-200"
          >
            Nutrition Trends
          </AppText>

          <View className="space-y-4 px-6 overflow-hidden">
            <>
              <View className="my-6">
                <AppText className="text-sm font-medium text-neutral-800 mb-2">
                  Protein Intake Trend
                </AppText>
                <View className="flex-row items-center">
                  <View className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-neutral-800 rounded-full"
                      style={{ width: `${proteinProgress}%` }}
                    />
                  </View>
                  <AppText className="text-sm text-neutral-600 ml-2">
                    {proteinProgress}%
                  </AppText>
                </View>
                <AppText className="text-xs text-neutral-500 mt-1">
                  Meeting your daily protein goal
                </AppText>
              </View>
              <DashedSeparator width={500} />

              <View className="my-6">
                <AppText className="text-sm font-medium text-neutral-800 mb-2">
                  Carbohydrate Balance
                </AppText>
                <View className="flex-row items-center">
                  <View className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-neutral-800 rounded-full"
                      style={{ width: `${carbsProgress}%` }}
                    />
                  </View>
                  <AppText className="text-sm text-neutral-600 ml-2">
                    {carbsProgress}%
                  </AppText>
                </View>
                <AppText className="text-xs text-neutral-500 mt-1">
                  Within recommended range
                </AppText>
              </View>
              <DashedSeparator width={500} />

              <View className=" my-6">
                <AppText className="text-sm font-medium text-neutral-800 mb-2">
                  Fat Intake
                </AppText>
                <View className="flex-row items-center">
                  <View className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-neutral-800 rounded-full"
                      style={{ width: `${fatProgress}%` }}
                    />
                  </View>
                  <AppText className="text-sm text-neutral-600 ml-2">
                    {fatProgress}%
                  </AppText>
                </View>
                <AppText className="text-xs text-neutral-500 mt-1">
                  Below recommended intake
                </AppText>
              </View>
            </>
          </View>
        </View>

        {/* Historical Data */}
        <View
          className="bg-white rounded-2xl mb-8 border border-neutral-200"
          style={styles.shadow}
        >
          <AppText
            tweight="regular"
            className="text-xl text-neutral-800 px-6 py-8 border-b border-neutral-200"
          >
            Historical Data
          </AppText>

          <View className="space-y-4 px-6 overflow-hidden">
            <TouchableOpacity className="flex-row items-center justify-between my-6">
              <View className="flex-row items-center">
                <Calendar size={20} color="#6b7280" />
                <AppText className="text-base font-medium text-neutral-800 ml-3">
                  Monthly Report
                </AppText>
              </View>
              <AppText className="text-neutral-600">View</AppText>
            </TouchableOpacity>
            <DashedSeparator width={500} />

            <TouchableOpacity className="flex-row items-center justify-between my-6">
              <View className="flex-row items-center">
                <BarChart3 size={20} color="#6b7280" />
                <AppText className="text-base font-medium text-neutral-800 ml-3">
                  Progress Charts
                </AppText>
              </View>
              <AppText className="text-neutral-600">View</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
});
