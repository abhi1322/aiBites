import { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

interface CustomIntakeChartProps {
  data: any;
  duration: "week" | "month";
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
    <View className="flex-row justify-center gap-1 w-full mx-auto mb-8 relative border-b border-gray-200">
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
            className="flex-col justify-end h-[150px] items-center relative"
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

const LineChart = ({ data, max }: { data: number[]; max: number }) => {
  const [selected, setSelected] = useState<number>(0);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);

  const handlePress = (index: number) => {
    setSelected(index);
    setShowTooltip(true);

    // Auto-hide tooltip after 4 seconds
    setTimeout(() => {
      setShowTooltip(false);
    }, 4000);
  };

  // For monthly view, we'll show data points with connecting lines
  const reversedData = [...data].reverse();

  // Chart dimensions
  const chartHeight = 150;
  // get screen width
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 30;
  const padding = 10; // Small padding for visual breathing room

  // spread this piece of code into a function
  const getPoints = () => {
    const points: string[] = [];
    const availableWidth = chartWidth - padding * 2;
    const pointWidth = availableWidth / (reversedData.length - 1);

    reversedData.forEach((value, index) => {
      const x = padding + index * pointWidth;
      const y = chartHeight - (value / max) * chartHeight;
      points.push(`${x},${y}`);
    });

    return points.join(" ");
  };

  function getSmoothPath(points: { x: number; y: number }[]) {
    if (points.length < 2) return "";

    // Create the smooth line path
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2;
      d += ` Q ${midX} ${prev.y}, ${curr.x} ${curr.y}`;
    }

    // Close the path by connecting to bottom
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];

    // Add line to bottom right
    d += ` L ${lastPoint.x} ${chartHeight}`;
    // Add line to bottom left
    d += ` L ${firstPoint.x} ${chartHeight}`;
    // Close the path back to first point
    d += ` Z`;

    return d;
  }

  function getSmoothLinePath(points: { x: number; y: number }[]) {
    if (points.length < 2) return "";

    // Create only the smooth line path (no bottom connection)
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2;
      d += ` Q ${midX} ${prev.y}, ${curr.x} ${curr.y}`;
    }

    return d;
  }

  return (
    <View className="w-full relative" style={{ height: chartHeight + 10 }}>
      {/* SVG Container that fills the width */}
      <View className="w-full" style={{ height: chartHeight }}>
        <Svg
          width={chartWidth}
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          color={"red"}
        >
          {/* Define the smooth gradient */}
          <Defs>
            <LinearGradient
              id="lineGradient"
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%" stopColor="#727272" stopOpacity="1" />
              <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* Gradient fill area */}
          <Path
            d={getSmoothPath(
              reversedData.map((value, index) => {
                const x =
                  padding +
                  (index * (chartWidth - padding * 2)) /
                    (reversedData.length - 1);
                const y = chartHeight - (value / max) * chartHeight;
                return { x, y };
              })
            )}
            fill="url(#lineGradient)"
            stroke="none"
          />

          {/* Line connecting all points (stroke only) */}
          <Path
            d={getSmoothLinePath(
              reversedData.map((value, index) => {
                const x =
                  padding +
                  (index * (chartWidth - padding * 2)) /
                    (reversedData.length - 1);
                const y = chartHeight - (value / max) * chartHeight;
                return { x, y };
              })
            )}
            fill="none"
            stroke="#3e3e3e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Vertical indicator line */}
          <Line
            x1={
              padding +
              (selected * (chartWidth - padding * 2)) /
                (reversedData.length - 1)
            }
            y1={0}
            x2={
              padding +
              (selected * (chartWidth - padding * 2)) /
                (reversedData.length - 1)
            }
            y2={chartHeight}
            stroke="#6B7280"
            strokeWidth="1"
            strokeDasharray="4,4"
          />

          {/* Data points */}
          {reversedData.map((value, index) => {
            const availableWidth = chartWidth - padding * 2;
            const pointWidth = availableWidth / (reversedData.length - 1);
            const x = padding + index * pointWidth;
            const y = chartHeight - (value / max) * chartHeight;

            return (
              <Circle
                key={index}
                cx={x}
                cy={y}
                r={selected === index ? 6 : 4}
                fill={selected === index ? "#fff" : "#3e3e3e00"}
                stroke={selected === index ? "#3e3e3e" : "#fff"}
                strokeWidth={selected === index ? 2 : 0}
              />
            );
          })}
        </Svg>
      </View>

      {/* Invisible touchable areas for interaction */}
      <View
        className="absolute top-0 left-0 w-full flex-row"
        style={{ height: chartHeight }}
      >
        {reversedData.map((value, index) => {
          const touchWidth = 100 / reversedData.length;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handlePress(index)}
              style={{
                width: `${touchWidth}%`,
                height: chartHeight,
              }}
              activeOpacity={0.8}
            />
          );
        })}
      </View>

      {/* Tooltip */}
      {showTooltip && (
        <View
          className="absolute w-full"
          style={{ top: 0, zIndex: 9999, left: 25 }}
        >
          {reversedData.map((value, index) => {
            if (selected !== index) return null;

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

            // Calculate exact position of the selected point
            const availableWidth = chartWidth - padding * 2;
            const pointWidth = availableWidth / (reversedData.length - 1);
            const pointX = padding + index * pointWidth;
            const pointY = chartHeight - (value / max) * chartHeight;

            // Position tooltip based on actual point coordinates
            // For first 4 points, show on right side to avoid going outside
            const isFirstFour = index < 4;
            const tooltipStyle = {
              position: "absolute" as const,
              left: isFirstFour ? pointX - 30 : pointX - 100, // Right side for first 4, left side for rest
              top: pointY - 60, // Position above the point
              zIndex: 9999,
            };

            return (
              <View
                key={`tooltip-${index}`}
                style={tooltipStyle as any}
                className="flex-row items-center"
              >
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
                  className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent  border-t-neutral-800"
                  style={{
                    position: "absolute",
                    bottom: -6,
                    left: isFirstFour ? 5 : 62, // Arrow on left for first 4, right for rest
                  }}
                />
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};
// calories of last 6 + today (bellow 2100)
// const data = [1800, 1900, 2000, 2100, 2000, 2080, 1850];

export default function CustomIntakeChart({
  data,
  duration,
  max,
}: CustomIntakeChartProps) {
  return (
    <View className="w-full">
      {duration === "week" && <BarChart max={max} data={data} />}
      {duration === "month" && <LineChart data={data} max={max} />}
    </View>
  );
}
