import * as Sharing from "expo-sharing";
import React, { useRef, useState } from "react";
import { View } from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import Svg, { Circle, G, Path, Rect, Text as SvgText } from "react-native-svg";
import { captureRef } from "react-native-view-shot";

// Types for nutrition data
interface NutritionData {
  calories: number[];
  protein: number[];
  carbs: number[];
  fat: number[];
}

interface UserData {
  fullName?: string;
  calorieGoal?: number;
  proteinGoal?: number;
  carbGoal?: number;
  fatGoal?: number;
}

interface SummaryStats {
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  goalAchievement: number;
  proteinGoalMet: number;
  carbsGoalMet: number;
  fatGoalMet: number;
  totalDays: number;
}

// Chart Components
const MacroPieChart = ({
  data,
  size = 200,
}: {
  data: { protein: number; carbs: number; fat: number };
  size?: number;
}) => {
  const total = data.protein + data.carbs + data.fat;

  // Handle edge case where total is 0
  if (total === 0) {
    return (
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={size / 2 - 20} fill="#e5e7eb" />
        <SvgText
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          fontSize="12"
          fill="#6b7280"
        >
          No Data
        </SvgText>
      </Svg>
    );
  }

  const proteinAngle = (data.protein / total) * 360;
  const carbsAngle = (data.carbs / total) * 360;
  const fatAngle = (data.fat / total) * 360;

  const radius = size / 2 - 20;
  const center = size / 2;

  // Calculate SVG path for pie slices
  const createPieSlice = (
    startAngle: number,
    endAngle: number,
    color: string
  ) => {
    if (endAngle <= startAngle) return null;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    return (
      <Path
        key={`slice-${startAngle}-${endAngle}`}
        d={`M ${center} ${center} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`}
        fill={color}
      />
    );
  };

  return (
    <Svg width={size} height={size}>
      <G>
        {createPieSlice(0, proteinAngle, "#3B82F6")}
        {createPieSlice(proteinAngle, proteinAngle + carbsAngle, "#10B981")}
        {createPieSlice(proteinAngle + carbsAngle, 360, "#F59E0B")}
      </G>
      <SvgText
        x={center}
        y={center - 10}
        textAnchor="middle"
        fontSize="12"
        fill="#374151"
      >
        {Math.round((data.protein / total) * 100)}%
      </SvgText>
      <SvgText
        x={center}
        y={center + 10}
        textAnchor="middle"
        fontSize="10"
        fill="#6B7280"
      >
        Protein
      </SvgText>
    </Svg>
  );
};

const CaloriesBarChart = ({ data, max }: { data: number[]; max: number }) => {
  if (!data || data.length === 0) {
    return (
      <Svg width={320} height={180}>
        <SvgText
          x={160}
          y={90}
          textAnchor="middle"
          fontSize="14"
          fill="#6b7280"
        >
          No Data Available
        </SvgText>
      </Svg>
    );
  }

  const barWidth = Math.max(300 / data.length, 10); // Minimum bar width
  const chartHeight = 150;

  return (
    <Svg width={320} height={180}>
      {data.map((value, index) => {
        const height = max > 0 ? (value / max) * chartHeight : 0;
        const x = index * barWidth + 10;
        const y = chartHeight - height + 15;

        return (
          <G key={index}>
            <Rect
              x={x}
              y={y}
              width={Math.max(barWidth - 2, 1)}
              height={Math.max(height, 1)}
              fill="#3B82F6"
              rx={2}
            />
            <SvgText
              x={x + barWidth / 2}
              y={chartHeight + 25}
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              {index + 1}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
};

const CaloriesLineChart = ({ data, max }: { data: number[]; max: number }) => {
  if (!data || data.length === 0) {
    return (
      <Svg width={320} height={180}>
        <SvgText
          x={160}
          y={90}
          textAnchor="middle"
          fontSize="14"
          fill="#6b7280"
        >
          No Data Available
        </SvgText>
      </Svg>
    );
  }

  const chartWidth = 300;
  const chartHeight = 150;
  const pointWidth =
    data.length > 1 ? chartWidth / (data.length - 1) : chartWidth;

  // Generate valid path data
  const pathData = data
    .map((value, index) => {
      const x = index * pointWidth + 10;
      const y =
        max > 0
          ? chartHeight - (value / max) * chartHeight + 15
          : chartHeight / 2;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  // Create valid SVG path
  const pathString = pathData
    ? `M ${pathData
        .split(" ")
        .map((point, index) => (index === 0 ? point : `L ${point}`))
        .join(" ")}`
    : "";

  return (
    <Svg width={320} height={180}>
      {pathString && (
        <Path d={pathString} stroke="#3B82F6" strokeWidth="2" fill="none" />
      )}
      {data.map((value, index) => {
        const x = index * pointWidth + 10;
        const y =
          max > 0
            ? chartHeight - (value / max) * chartHeight + 15
            : chartHeight / 2;
        return <Circle key={index} cx={x} cy={y} r={3} fill="#3B82F6" />;
      })}
    </Svg>
  );
};

const MacrosLineChart = ({
  data,
  max,
}: {
  data: { protein: number[]; carbs: number[]; fat: number[] };
  max: number;
}) => {
  if (
    !data.protein ||
    !data.carbs ||
    !data.fat ||
    data.protein.length === 0 ||
    data.carbs.length === 0 ||
    data.fat.length === 0
  ) {
    return (
      <Svg width={320} height={180}>
        <SvgText
          x={160}
          y={90}
          textAnchor="middle"
          fontSize="14"
          fill="#6b7280"
        >
          No Data Available
        </SvgText>
      </Svg>
    );
  }

  const chartWidth = 300;
  const chartHeight = 150;
  const pointWidth =
    data.protein.length > 1
      ? chartWidth / (data.protein.length - 1)
      : chartWidth;

  const createLinePath = (values: number[], color: string) => {
    if (!values || values.length === 0) return null;

    const pathData = values
      .map((value, index) => {
        const x = index * pointWidth + 10;
        const y =
          max > 0
            ? chartHeight - (value / max) * chartHeight + 15
            : chartHeight / 2;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");

    const pathString = pathData
      ? `M ${pathData
          .split(" ")
          .map((point, index) => (index === 0 ? point : `L ${point}`))
          .join(" ")}`
      : "";

    return pathString ? (
      <Path
        key={`line-${color}`}
        d={pathString}
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
    ) : null;
  };

  return (
    <Svg width={320} height={180}>
      {createLinePath(data.protein, "#3B82F6")}
      {createLinePath(data.carbs, "#10B981")}
      {createLinePath(data.fat, "#F59E0B")}
    </Svg>
  );
};

// Calculate summary statistics
const calculateSummaryStats = (
  nutritionData: NutritionData,
  userData: UserData,
  duration: "week" | "month"
): SummaryStats => {
  const { calories, protein, carbs, fat } = nutritionData;
  const days = duration === "week" ? 7 : 30;

  // Use last N days of data, ensure we have valid arrays
  const recentCalories = calories?.slice(-days) || [];
  const recentProtein = protein?.slice(-days) || [];
  const recentCarbs = carbs?.slice(-days) || [];
  const recentFat = fat?.slice(-days) || [];

  // Ensure we have data to work with
  const validDays = Math.max(recentCalories.length, 1);

  const averageCalories = Math.round(
    recentCalories.reduce((sum, cal) => sum + (cal || 0), 0) / validDays
  );
  const averageProtein = Math.round(
    recentProtein.reduce((sum, pro) => sum + (pro || 0), 0) / validDays
  );
  const averageCarbs = Math.round(
    recentCarbs.reduce((sum, carb) => sum + (carb || 0), 0) / validDays
  );
  const averageFat = Math.round(
    recentFat.reduce((sum, f) => sum + (f || 0), 0) / validDays
  );

  const calorieGoal = userData.calorieGoal || 2000;
  const proteinGoal = userData.proteinGoal || 50;
  const carbGoal = userData.carbGoal || 250;
  const fatGoal = userData.fatGoal || 70;

  const goalAchievement = Math.round(
    (recentCalories.filter((cal) => (cal || 0) >= calorieGoal * 0.8).length /
      validDays) *
      100
  );
  const proteinGoalMet = Math.round(
    (recentProtein.filter((pro) => (pro || 0) >= proteinGoal * 0.9).length /
      validDays) *
      100
  );
  const carbsGoalMet = Math.round(
    (recentCarbs.filter((carb) => (carb || 0) >= carbGoal * 0.9).length /
      validDays) *
      100
  );
  const fatGoalMet = Math.round(
    (recentFat.filter((f) => (f || 0) >= fatGoal * 0.9).length / validDays) *
      100
  );

  return {
    averageCalories,
    averageProtein,
    averageCarbs,
    averageFat,
    goalAchievement,
    proteinGoalMet,
    carbsGoalMet,
    fatGoalMet,
    totalDays: validDays,
  };
};

// Chart Renderer Component
const ChartRenderer = ({
  nutritionData,
  userData,
  duration,
  onChartsReady,
}: {
  nutritionData: NutritionData;
  userData: UserData;
  duration: "week" | "month";
  onChartsReady: (chartRefs: any) => void;
}) => {
  const caloriesBarRef = useRef<View>(null);
  const macrosPieRef = useRef<View>(null);
  const caloriesLineRef = useRef<View>(null);
  const macrosLineRef = useRef<View>(null);
  const hasNotifiedRef = useRef(false);

  const summaryStats = calculateSummaryStats(nutritionData, userData, duration);
  const maxCalories = Math.max(...(nutritionData.calories || []), 2000);

  // Calculate macro totals for pie chart
  const macroTotals = {
    protein: summaryStats.averageProtein * 4, // 4 calories per gram
    carbs: summaryStats.averageCarbs * 4, // 4 calories per gram
    fat: summaryStats.averageFat * 9, // 9 calories per gram
  };

  // Simple timeout to notify parent after charts are rendered
  React.useEffect(() => {
    if (!hasNotifiedRef.current) {
      const timer = setTimeout(() => {
        console.log("Charts ready via timeout");
        hasNotifiedRef.current = true;
        onChartsReady({
          caloriesBarRef,
          macrosPieRef,
          caloriesLineRef,
          macrosLineRef,
          summaryStats,
          maxCalories,
          macroTotals,
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [nutritionData, userData, duration]);

  return (
    <View
      style={{
        position: "absolute",
        left: -9999,
        top: -9999,
        width: 400,
        height: 600,
        opacity: 0, // Make it completely invisible
      }}
    >
      <View
        ref={macrosPieRef}
        style={{
          backgroundColor: "white",
          padding: 20,
          width: 240,
          height: 240,
        }}
      >
        <MacroPieChart data={macroTotals} />
      </View>

      <View
        ref={caloriesBarRef}
        style={{
          backgroundColor: "white",
          padding: 20,
          width: 360,
          height: 220,
        }}
      >
        <CaloriesBarChart
          data={nutritionData.calories?.slice(-summaryStats.totalDays) || []}
          max={maxCalories}
        />
      </View>

      <View
        ref={caloriesLineRef}
        style={{
          backgroundColor: "white",
          padding: 20,
          width: 360,
          height: 220,
        }}
      >
        <CaloriesLineChart
          data={nutritionData.calories?.slice(-summaryStats.totalDays) || []}
          max={maxCalories}
        />
      </View>

      <View
        ref={macrosLineRef}
        style={{
          backgroundColor: "white",
          padding: 20,
          width: 360,
          height: 220,
        }}
      >
        <MacrosLineChart
          data={{
            protein:
              nutritionData.protein?.slice(-summaryStats.totalDays) || [],
            carbs: nutritionData.carbs?.slice(-summaryStats.totalDays) || [],
            fat: nutritionData.fat?.slice(-summaryStats.totalDays) || [],
          }}
          max={Math.max(
            ...(nutritionData.protein || []),
            ...(nutritionData.carbs || []),
            ...(nutritionData.fat || []),
            100
          )}
        />
      </View>
    </View>
  );
};

// Main hook for generating reports
export const useNutritionReport = () => {
  const [chartRefs, setChartRefs] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async (
    nutritionData: NutritionData,
    userData: UserData,
    duration: "week" | "month"
  ) => {
    if (!chartRefs) {
      console.error("Charts not ready yet");
      return { success: false, error: "Charts not ready" };
    }

    // Wait a bit more to ensure charts are fully rendered
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsGenerating(true);

    try {
      const {
        caloriesBarRef,
        macrosPieRef,
        caloriesLineRef,
        macrosLineRef,
        summaryStats,
      } = chartRefs;

      // Validate that all refs have current properties
      if (
        !caloriesBarRef?.current ||
        !macrosPieRef?.current ||
        !caloriesLineRef?.current ||
        !macrosLineRef?.current
      ) {
        console.error("One or more chart refs are not ready");
        console.log("Refs status:", {
          caloriesBarRef: !!caloriesBarRef?.current,
          macrosPieRef: !!macrosPieRef?.current,
          caloriesLineRef: !!caloriesLineRef?.current,
          macrosLineRef: !!macrosLineRef?.current,
        });
        return { success: false, error: "Chart refs not ready" };
      }

      console.log("All chart refs are ready, starting capture...");

      // Capture all charts as images using the current property of refs
      let caloriesBarUri, macrosPieUri, caloriesLineUri, macrosLineUri;

      try {
        caloriesBarUri = await captureRef(caloriesBarRef.current, {
          format: "png",
          quality: 1,
        });
        console.log("Calories bar chart captured successfully");
      } catch (error) {
        console.error("Error capturing calories bar chart:", error);
        return {
          success: false,
          error: `Failed to capture calories bar chart: ${error}`,
        };
      }

      try {
        macrosPieUri = await captureRef(macrosPieRef.current, {
          format: "png",
          quality: 1,
        });
        console.log("Macros pie chart captured successfully");
      } catch (error) {
        console.error("Error capturing macros pie chart:", error);
        return {
          success: false,
          error: `Failed to capture macros pie chart: ${error}`,
        };
      }

      try {
        caloriesLineUri = await captureRef(caloriesLineRef.current, {
          format: "png",
          quality: 1,
        });
        console.log("Calories line chart captured successfully");
      } catch (error) {
        console.error("Error capturing calories line chart:", error);
        return {
          success: false,
          error: `Failed to capture calories line chart: ${error}`,
        };
      }

      try {
        macrosLineUri = await captureRef(macrosLineRef.current, {
          format: "png",
          quality: 1,
        });
        console.log("Macros line chart captured successfully");
      } catch (error) {
        console.error("Error capturing macros line chart:", error);
        return {
          success: false,
          error: `Failed to capture macros line chart: ${error}`,
        };
      }

      // Build HTML template
      const dateRange =
        duration === "week"
          ? `${new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${new Date().toLocaleDateString()}`
          : `${new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toLocaleDateString()} - ${new Date().toLocaleDateString()}`;

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Nutrition Report</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 24px;
              color: #1f2937;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 32px;
              padding-bottom: 24px;
              border-bottom: 2px solid #e5e7eb;
            }
            .header h1 {
              color: #1f2937;
              margin: 0 0 8px 0;
              font-size: 28px;
              font-weight: 700;
            }
            .header p {
              color: #6b7280;
              margin: 0;
              font-size: 16px;
            }
            .section {
              margin-bottom: 32px;
            }
            .section h2 {
              color: #374151;
              font-size: 20px;
              font-weight: 600;
              margin: 0 0 16px 0;
              padding-bottom: 8px;
              border-bottom: 1px solid #e5e7eb;
            }
            .section h3 {
              color: #4b5563;
              font-size: 16px;
              font-weight: 500;
              margin: 16px 0 8px 0;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
              margin-bottom: 24px;
            }
            .stat-item {
              background: #f9fafb;
              padding: 16px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }
            .stat-label {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 4px;
            }
            .stat-value {
              font-size: 24px;
              font-weight: 700;
              color: #1f2937;
            }
            .chart-container {
              text-align: center;
              margin: 16px 0;
            }
            .chart-container img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .insights {
              background: #f0f9ff;
              padding: 16px;
              border-radius: 8px;
              border-left: 4px solid #3b82f6;
            }
            .insights h3 {
              margin-top: 0;
              color: #1e40af;
            }
            .insights ul {
              margin: 8px 0;
              padding-left: 20px;
            }
            .insights li {
              margin-bottom: 4px;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 24px;
              border-top: 1px solid #e5e7eb;
              color: #9ca3af;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Nutrition Report</h1>
            <p>${userData.fullName || "User"} • ${dateRange}</p>
          </div>

          <div class="section">
            <h2>Overview</h2>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-label">Average Calories</div>
                <div class="stat-value">${summaryStats.averageCalories}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Goal Achievement</div>
                <div class="stat-value">${summaryStats.goalAchievement}%</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Average Protein</div>
                <div class="stat-value">${summaryStats.averageProtein}g</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Average Carbs</div>
                <div class="stat-value">${summaryStats.averageCarbs}g</div>
              </div>
            </div>
            
            <h3>Macro Breakdown</h3>
            <div class="chart-container">
              <img src="${macrosPieUri}" alt="Macro Breakdown" />
            </div>
          </div>

          <div class="section">
            <h2>Daily Trends</h2>
            <h3>Calories Per Day</h3>
            <div class="chart-container">
              <img src="${caloriesBarUri}" alt="Daily Calories" />
            </div>
            
            <h3>Calories Over Time</h3>
            <div class="chart-container">
              <img src="${caloriesLineUri}" alt="Calories Trend" />
            </div>
            
            <h3>Macros Over Time</h3>
            <div class="chart-container">
              <img src="${macrosLineUri}" alt="Macros Trend" />
            </div>
          </div>

          <div class="section">
            <h2>Insights</h2>
            <div class="insights">
              <h3>Goal Performance</h3>
              <ul>
                <li><strong>Protein Goal:</strong> Met ${summaryStats.proteinGoalMet}% of days</li>
                <li><strong>Carbohydrate Goal:</strong> Met ${summaryStats.carbsGoalMet}% of days</li>
                <li><strong>Fat Goal:</strong> Met ${summaryStats.fatGoalMet}% of days</li>
                <li><strong>Overall Consistency:</strong> ${summaryStats.goalAchievement}% of days met calorie goals</li>
              </ul>
            </div>
          </div>

          <div class="footer">
            Generated by Mensura on ${new Date().toLocaleDateString()}
          </div>
        </body>
        </html>
      `;

      // Generate PDF
      const { filePath } = await RNHTMLtoPDF.convert({
        html,
        fileName: `nutrition_report_${duration}_${new Date().toISOString().split("T")[0]}`,
        base64: false,
      });

      // Share PDF
      if (filePath && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(filePath, {
          mimeType: "application/pdf",
          dialogTitle: "Share Nutrition Report",
        });
      } else {
        console.log("Sharing is not available on this device");
      }

      setIsGenerating(false);
      return { success: true, filePath };
    } catch (error) {
      console.error("Error generating report:", error);
      setIsGenerating(false);
      return { success: false, error };
    }
  };

  return {
    generateReport,
    isGenerating,
    ChartRenderer: (props: any) => (
      <ChartRenderer {...props} onChartsReady={setChartRefs} />
    ),
  };
};

// Export types for use in other components
export type { NutritionData, SummaryStats, UserData };
