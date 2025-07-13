import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Rect } from "react-native-svg";

interface CustomIntakeChartProps {
  data: any;
  variant: string;
  max: number;
}

const BarChart = ({ data, max }: { data: number[]; max: number }) => {
  const [selected, setSelected] = useState<number>(0); // Start with first bar (today) selected
  const [showTooltip, setShowTooltip] = useState<boolean>(true); // Show tooltip for first bar initially

  const handlePress = (index: number) => {
    setSelected(index);
    setShowTooltip(true);

    // Auto-hide tooltip after 4 seconds (consistent timing)
    setTimeout(() => {
      setShowTooltip(false);
    }, 4000);
  };

  // Reverse the data array so today appears at the end
  const reversedData = [...data].reverse();

  return (
    <View className="flex-row justify-center gap-1 w-[90vw] relative">
      {reversedData.map((value, index) => {
        const height = (value / max) * 150;
        const originalIndex = data.length - 1 - index; // Get original index for date calculation
        const daysFromToday = originalIndex; // Days from today (0 = today, 1 = yesterday, etc.)

        const date = new Date();
        date.setDate(date.getDate() - daysFromToday);

        const dateString = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const dayString = date.toLocaleDateString("en-US", {
          weekday: "short",
        });

        return (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(index)}
            className="flex-col justify-end h-[250px] items-center relative"
            activeOpacity={0.8}
          >
            <Svg height={height} width={40} style={{ zIndex: 1 }}>
              <Rect
                x={0}
                y={0}
                width={40}
                height={height}
                fill={selected === index ? "#333333" : "#EBEBEB"}
                rx={5}
                ry={5}
              />
            </Svg>
          </TouchableOpacity>
        );
      })}

      {/* Global Tooltip - Rendered at parent level for proper z-index */}
      {reversedData.map((value, index) => {
        if (selected !== index || !showTooltip) return null;

        const originalIndex = data.length - 1 - index;
        const daysFromToday = originalIndex;

        const date = new Date();
        date.setDate(date.getDate() - daysFromToday);

        const dateString = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const dayString = date.toLocaleDateString("en-US", {
          weekday: "short",
        });

        // Calculate position based on bar index
        const barWidth = 40;
        const gap = 4; // gap-1 = 4px
        const totalBarWidth = barWidth + gap;
        const leftPosition = index * totalBarWidth + barWidth / 2;

        // Fix positioning for bars 2 and 3
        let tooltipLeft;
        if (index <= 1) {
          // Bars 0, 1: show on right
          tooltipLeft = leftPosition + 40;
        } else if (index === 2 || index === 3) {
          // Bars 2, 3: show on left with proper offset
          tooltipLeft = leftPosition - 85;
        } else {
          // Bars 4+: show on left
          tooltipLeft = leftPosition - 85;
        }


        // get height of the bar
        const barHeight = reversedData[index];
        const barHeightPercentage = (barHeight / max) * 100;
        const barHeightPixels = (barHeightPercentage / 100) * 100;

        return (
          <View
            key={`tooltip-${index}`}
            className="absolute  flex-row items-center"
            style={{
              left: tooltipLeft,
              flexDirection: index <= 1 ? "row-reverse" : "row",
              zIndex: 9999,
              bottom: barHeightPixels + 10,
            }}
          >
            {/* Tooltip Content */}
            <View className="bg-neutral-800 rounded-lg px-3 py-2 shadow-lg">
              <Text className="text-white text-sm font-bold text-center">
                {value} kcal
              </Text>
              <Text className="text-blue-100 text-xs text-center mt-1">
                {dayString} • {dateString}
              </Text>
            </View>
            {/* Tooltip Arrow */}
            <View
              className={`w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-neutral-800 -mt-2`}
              style={{
                transform: [
                  { rotate: index <= 1 ? "90deg" : "-90deg" },
                  { translateY: "-50%" },
                ],
              }}
            />
          </View>
        );
      })}
    </View>
  );
};

const LineChart = ({ data }: { data: number[] }) => {
  return (
    <View>
      <Text>LineChart</Text>
    </View>
  );
};

// calories of last 6 + today (bellow 2100)
// const data = [1800, 1900, 2000, 2100, 2000, 2080, 1850];

export default function CustomIntakeChart({
  data,
  variant,
  max,
}: CustomIntakeChartProps) {
  return (
    <View>
      <Text>CustomIntakeChart</Text>
      {variant === "bar" && <BarChart max={max} data={data} />}
    </View>
  );
}
