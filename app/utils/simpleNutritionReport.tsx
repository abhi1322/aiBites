import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import React from "react";

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

// Calculate summary statistics
const calculateSummaryStats = (
  nutritionData: NutritionData,
  userData: UserData,
  duration: "week" | "month"
) => {
  const { calories, protein, carbs, fat } = nutritionData;
  const days = duration === "week" ? 7 : 30;

  const recentCalories = calories?.slice(-days) || [];
  const recentProtein = protein?.slice(-days) || [];
  const recentCarbs = carbs?.slice(-days) || [];
  const recentFat = fat?.slice(-days) || [];

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
  const goalAchievement = Math.round(
    (recentCalories.filter((cal) => (cal || 0) >= calorieGoal * 0.8).length /
      validDays) *
      100
  );

  return {
    averageCalories,
    averageProtein,
    averageCarbs,
    averageFat,
    goalAchievement,
    totalDays: validDays,
  };
};

// Generate Chart.js compatible data
const generateChartData = (
  nutritionData: NutritionData,
  duration: "week" | "month"
) => {
  const days = duration === "week" ? 7 : 30;
  const recentCalories = nutritionData.calories?.slice(-days) || [];
  const recentProtein = nutritionData.protein?.slice(-days) || [];
  const recentCarbs = nutritionData.carbs?.slice(-days) || [];
  const recentFat = nutritionData.fat?.slice(-days) || [];

  // Generate labels (last N days) - REVERSED ORDER
  const labels = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    labels.push(
      date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    );
  }

  return {
    labels,
    calories: recentCalories,
    protein: recentProtein,
    carbs: recentCarbs,
    fat: recentFat,
  };
};

// Generate SVG charts
const generateSVGCharts = (chartData: any, summaryStats: any) => {
  const chartWidth = 700;
  const chartHeight = 350;
  const padding = 60;
  const availableWidth = chartWidth - 2 * padding;
  const availableHeight = chartHeight - 2 * padding;

  // Calories Chart
  const maxCalories = Math.max(...chartData.calories, 2000);
  const caloriesPoints = chartData.calories
    .map((value: number, index: number) => {
      const x =
        padding + (index / (chartData.calories.length - 1)) * availableWidth;
      const y = chartHeight - padding - (value / maxCalories) * availableHeight;
      return `${x},${y}`;
    })
    .join(" ");

  const caloriesPath = `M ${caloriesPoints}`;

  // Macros Chart
  const maxMacros = Math.max(
    ...chartData.protein,
    ...chartData.carbs,
    ...chartData.fat,
    100
  );
  const proteinPoints = chartData.protein
    .map((value: number, index: number) => {
      const x =
        padding + (index / (chartData.protein.length - 1)) * availableWidth;
      const y = chartHeight - padding - (value / maxMacros) * availableHeight;
      return `${x},${y}`;
    })
    .join(" ");

  const carbsPoints = chartData.carbs
    .map((value: number, index: number) => {
      const x =
        padding + (index / (chartData.carbs.length - 1)) * availableWidth;
      const y = chartHeight - padding - (value / maxMacros) * availableHeight;
      return `${x},${y}`;
    })
    .join(" ");

  const fatPoints = chartData.fat
    .map((value: number, index: number) => {
      const x = padding + (index / (chartData.fat.length - 1)) * availableWidth;
      const y = chartHeight - padding - (value / maxMacros) * availableHeight;
      return `${x},${y}`;
    })
    .join(" ");

  const proteinPath = `M ${proteinPoints}`;
  const carbsPath = `M ${carbsPoints}`;
  const fatPath = `M ${fatPoints}`;

  // Bar Chart for Daily Comparison
  const barWidth = availableWidth / chartData.calories.length;
  const maxBarValue = Math.max(...chartData.calories, 2000);
  const bars = chartData.calories
    .map((value: number, index: number) => {
      const x = padding + index * barWidth + barWidth * 0.1;
      const barHeight = (value / maxBarValue) * availableHeight;
      const y = chartHeight - padding - barHeight;
      const width = barWidth * 0.8;
      const color =
        value >= 1800 ? "#10b981" : value >= 1500 ? "#f59e0b" : "#ef4444";
      return `<rect x="${x}" y="${y}" width="${width}" height="${barHeight}" fill="${color}" rx="4"/>`;
    })
    .join("");

  // Pie Chart for Macro Distribution
  const totalCalories = summaryStats.averageCalories;
  const proteinCalories = summaryStats.averageProtein * 4;
  const carbsCalories = summaryStats.averageCarbs * 4;
  const fatCalories = summaryStats.averageFat * 9;

  const centerX = chartWidth / 2;
  const centerY = chartHeight / 2;
  const radius = Math.min(availableWidth, availableHeight) / 3;

  const proteinAngle = (proteinCalories / totalCalories) * 360;
  const carbsAngle = (carbsCalories / totalCalories) * 360;
  const fatAngle = (fatCalories / totalCalories) * 360;

  const createPieSlice = (
    startAngle: number,
    endAngle: number,
    color: string
  ) => {
    if (endAngle <= startAngle) return "";

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    return `<path d="M ${centerX} ${centerY} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z" fill="${color}"/>`;
  };

  const pieSlices =
    createPieSlice(0, proteinAngle, "#374151") +
    createPieSlice(proteinAngle, proteinAngle + carbsAngle, "#6b7280") +
    createPieSlice(proteinAngle + carbsAngle, 360, "#9ca3af");

  // Goal Achievement Chart
  const goalAchievement = summaryStats.goalAchievement;
  const goalRadius = 80;
  const goalCircumference = 2 * Math.PI * goalRadius;
  const goalProgress = (goalAchievement / 100) * goalCircumference;

  const goalChart = `
    <circle cx="${centerX}" cy="${centerY}" r="${goalRadius}" fill="none" stroke="#e5e7eb" stroke-width="12"/>
    <circle cx="${centerX}" cy="${centerY}" r="${goalRadius}" fill="none" stroke="#374151" stroke-width="12" 
            stroke-dasharray="${goalProgress} ${goalCircumference - goalProgress}" 
            stroke-dashoffset="${goalCircumference / 4}" 
            transform="rotate(-90 ${centerX} ${centerY})"/>
    <text x="${centerX}" y="${centerY - 15}" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#111827">${goalAchievement}%</text>
    <text x="${centerX}" y="${centerY + 10}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">Goal Met</text>
  `;

  return {
    caloriesChart: `
      <svg width="${chartWidth}" height="${chartHeight}" style="background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <defs>
          <linearGradient id="caloriesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#374151;stop-opacity:0.2" />
            <stop offset="100%" style="stop-color:#374151;stop-opacity:0.05" />
          </linearGradient>
        </defs>
        <rect width="${chartWidth}" height="${chartHeight}" fill="white" rx="12"/>
        <text x="${chartWidth / 2}" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#111827">Daily Calorie Intake</text>
        <path d="${caloriesPath}" stroke="#374151" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${caloriesPath} L ${chartWidth - padding},${chartHeight - padding} L ${padding},${chartHeight - padding} Z" fill="url(#caloriesGradient)"/>
        ${chartData.labels
          .map((label: string, index: number) => {
            const x =
              padding +
              (index / (chartData.labels.length - 1)) * availableWidth;
            return `<text x="${x}" y="${chartHeight - 15}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#6b7280">${label}</text>`;
          })
          .join("")}
        <text x="50" y="60" font-family="Arial, sans-serif" font-size="12" fill="#374151">Max: ${Math.max(...chartData.calories)} cal</text>
        <text x="50" y="75" font-family="Arial, sans-serif" font-size="12" fill="#374151">Min: ${Math.min(...chartData.calories)} cal</text>
        <text x="50" y="90" font-family="Arial, sans-serif" font-size="12" fill="#374151">Avg: ${Math.round(chartData.calories.reduce((a: number, b: number) => a + b, 0) / chartData.calories.length)} cal</text>
      </svg>
    `,
    macrosChart: `
      <svg width="${chartWidth}" height="${chartHeight}" style="background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <rect width="${chartWidth}" height="${chartHeight}" fill="white" rx="12"/>
        <text x="${chartWidth / 2}" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#111827">Macronutrient Trends</text>
        <path d="${proteinPath}" stroke="#374151" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${carbsPath}" stroke="#6b7280" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${fatPath}" stroke="#9ca3af" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="60" cy="60" r="4" fill="#374151"/>
        <text x="75" y="65" font-family="Arial, sans-serif" font-size="12" fill="#111827">Protein</text>
        <circle cx="60" cy="80" r="4" fill="#6b7280"/>
        <text x="75" y="85" font-family="Arial, sans-serif" font-size="12" fill="#111827">Carbs</text>
        <circle cx="60" cy="100" r="4" fill="#9ca3af"/>
        <text x="75" y="105" font-family="Arial, sans-serif" font-size="12" fill="#111827">Fat</text>
        ${chartData.labels
          .map((label: string, index: number) => {
            const x =
              padding +
              (index / (chartData.labels.length - 1)) * availableWidth;
            return `<text x="${x}" y="${chartHeight - 15}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#6b7280">${label}</text>`;
          })
          .join("")}
        <text x="50" y="130" font-family="Arial, sans-serif" font-size="12" fill="#374151">Protein Avg: ${Math.round(chartData.protein.reduce((a: number, b: number) => a + b, 0) / chartData.protein.length)}g</text>
        <text x="50" y="145" font-family="Arial, sans-serif" font-size="12" fill="#374151">Carbs Avg: ${Math.round(chartData.carbs.reduce((a: number, b: number) => a + b, 0) / chartData.carbs.length)}g</text>
        <text x="50" y="160" font-family="Arial, sans-serif" font-size="12" fill="#374151">Fat Avg: ${Math.round(chartData.fat.reduce((a: number, b: number) => a + b, 0) / chartData.fat.length)}g</text>
      </svg>
    `,
    barChart: `
      <svg width="${chartWidth}" height="${chartHeight}" style="background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <rect width="${chartWidth}" height="${chartHeight}" fill="white" rx="12"/>
        <text x="${chartWidth / 2}" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#111827">Daily Calorie Comparison</text>
        ${bars}
        ${chartData.labels
          .map((label: string, index: number) => {
            const x = padding + index * barWidth + barWidth / 2;
            return `<text x="${x}" y="${chartHeight - 15}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#6b7280">${label}</text>`;
          })
          .join("")}
        <text x="50" y="60" font-family="Arial, sans-serif" font-size="12" fill="#374151">Max: ${Math.max(...chartData.calories)} cal</text>
        <text x="50" y="75" font-family="Arial, sans-serif" font-size="12" fill="#374151">Min: ${Math.min(...chartData.calories)} cal</text>
        <text x="50" y="90" font-family="Arial, sans-serif" font-size="12" fill="#374151">Avg: ${Math.round(chartData.calories.reduce((a: number, b: number) => a + b, 0) / chartData.calories.length)} cal</text>
        <text x="50" y="105" font-family="Arial, sans-serif" font-size="12" fill="#374151">Goal: ${summaryStats.goalAchievement >= 80 ? "Excellent" : summaryStats.goalAchievement >= 60 ? "Good" : "Needs Improvement"}</text>
        <rect x="50" y="120" width="12" height="12" fill="#10b981" rx="2"/>
        <text x="70" y="130" font-family="Arial, sans-serif" font-size="11" fill="#374151">On Target (≥1800)</text>
        <rect x="50" y="140" width="12" height="12" fill="#f59e0b" rx="2"/>
        <text x="70" y="150" font-family="Arial, sans-serif" font-size="11" fill="#374151">Moderate (1500-1799)</text>
        <rect x="50" y="160" width="12" height="12" fill="#ef4444" rx="2"/>
        <text x="70" y="170" font-family="Arial, sans-serif" font-size="11" fill="#374151">Low (&lt;1500)</text>
      </svg>
    `,
    pieChart: `
      <svg width="${chartWidth}" height="${chartHeight}" style="background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <rect width="${chartWidth}" height="${chartHeight}" fill="white" rx="12"/>
        <text x="${chartWidth / 2}" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#111827">Macro Distribution</text>
        ${pieSlices}
        <text x="60" y="60" font-family="Arial, sans-serif" font-size="12" fill="#111827">Protein: ${Math.round((proteinCalories / totalCalories) * 100)}% (${summaryStats.averageProtein}g)</text>
        <text x="60" y="75" font-family="Arial, sans-serif" font-size="12" fill="#111827">Carbs: ${Math.round((carbsCalories / totalCalories) * 100)}% (${summaryStats.averageCarbs}g)</text>
        <text x="60" y="90" font-family="Arial, sans-serif" font-size="12" fill="#111827">Fat: ${Math.round((fatCalories / totalCalories) * 100)}% (${summaryStats.averageFat}g)</text>
        <text x="${centerX}" y="${centerY + radius + 40}" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#111827">${totalCalories} cal total</text>
        <text x="${centerX}" y="${centerY + radius + 55}" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#6b7280">Daily Average</text>
      </svg>
    `,
    goalChart: `
      <svg width="${chartWidth}" height="${chartHeight}" style="background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <rect width="${chartWidth}" height="${chartHeight}" fill="white" rx="12"/>
        <text x="${chartWidth / 2}" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#111827">Goal Achievement</text>
        ${goalChart}
        <text x="60" y="60" font-family="Arial, sans-serif" font-size="12" fill="#111827">Days tracked: ${chartData.calories.length}</text>
        <text x="60" y="75" font-family="Arial, sans-serif" font-size="12" fill="#111827">Performance: ${summaryStats.goalAchievement >= 80 ? "Excellent" : summaryStats.goalAchievement >= 60 ? "Good" : "Needs Improvement"}</text>
        <text x="60" y="90" font-family="Arial, sans-serif" font-size="12" fill="#111827">Target: ${summaryStats.goalAchievement >= 80 ? "80%+ (Great job!)" : summaryStats.goalAchievement >= 60 ? "60-79% (Good progress)" : "Below 60% (Keep going!)"}</text>
      </svg>
    `,
  };
};

// Main hook for generating reports
export const useSimpleNutritionReport = () => {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const generateReport = async (
    nutritionData: NutritionData,
    userData: UserData,
    duration: "week" | "month"
  ) => {
    setIsGenerating(true);

    try {
      const summaryStats = calculateSummaryStats(
        nutritionData,
        userData,
        duration
      );
      const chartData = generateChartData(nutritionData, duration);
      const svgCharts = generateSVGCharts(chartData, summaryStats);

      // Build HTML template with SVG charts
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
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              margin: 0;
              padding: 0;
              color: #111827;
              line-height: 1.6;
              background: #f9fafb;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding: 40px 24px;
              background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
              border-bottom: 1px solid #e5e7eb;
            }
            .logo {
              width: 80px;
              height: 80px;
              margin: 0 auto 20px;
              border-radius: 12px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .header h1 {
              color: #111827;
              margin: 0 0 8px 0;
              font-size: 32px;
              font-weight: 700;
              letter-spacing: -0.025em;
            }
            .header p {
              color: #6b7280;
              margin: 0;
              font-size: 16px;
              font-weight: 500;
            }
            .content {
              padding: 40px 24px;
            }
            .section {
              margin-bottom: 48px;
            }
            .section h2 {
              color: #111827;
              font-size: 24px;
              font-weight: 700;
              margin: 0 0 24px 0;
              padding-bottom: 12px;
              border-bottom: 2px solid #e5e7eb;
              position: relative;
            }
            .section h2::after {
              content: '';
              position: absolute;
              bottom: -2px;
              left: 0;
              width: 60px;
              height: 2px;
              background: #374151;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin-bottom: 32px;
            }
            .stat-item {
              background: #f9fafb;
              padding: 24px;
              border-radius: 12px;
              border: 1px solid #e5e7eb;
              text-align: center;
              transition: all 0.2s ease;
            }
            .stat-item:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
            }
            .stat-label {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 8px;
              font-weight: 500;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .stat-value {
              font-size: 32px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 4px;
            }
            .stat-unit {
              font-size: 14px;
              color: #9ca3af;
              font-weight: 500;
            }
            .chart-container {
              margin: 24px 0;
              text-align: center;
            }
            .chart-container svg {
              max-width: 100%;
              height: auto;
            }
            .insights {
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              padding: 32px;
              border-radius: 16px;
              border-left: 4px solid #374151;
              margin: 32px 0;
            }
            .insights h3 {
              margin: 0 0 16px 0;
              color: #111827;
              font-size: 20px;
              font-weight: 600;
            }
            .insights p {
              margin: 0 0 12px 0;
              color: #374151;
              font-size: 15px;
              line-height: 1.7;
            }
            .insights strong {
              color: #111827;
              font-weight: 600;
            }
            .performance-indicator {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .performance-excellent {
              background: #dcfce7;
              color: #166534;
            }
            .performance-good {
              background: #fef3c7;
              color: #92400e;
            }
            .performance-needs-improvement {
              background: #fee2e2;
              color: #991b1b;
            }
            .footer {
              text-align: center;
              margin-top: 60px;
              padding: 32px 24px;
              background: #f9fafb;
              border-top: 1px solid #e5e7eb;
              color: #9ca3af;
              font-size: 14px;
            }
            .footer p {
              margin: 0;
            }
            .chart-section {
              background: white;
              border-radius: 16px;
              padding: 24px;
              margin: 24px 0;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            .chart-title {
              font-size: 18px;
              font-weight: 600;
              color: #111827;
              margin-bottom: 16px;
              text-align: center;
            }
            .summary-cards {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
              margin: 32px 0;
            }
            .summary-card {
              background: white;
              padding: 24px;
              border-radius: 12px;
              border: 1px solid #e5e7eb;
              box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            }
            .summary-card h4 {
              margin: 0 0 12px 0;
              color: #111827;
              font-size: 16px;
              font-weight: 600;
            }
            .summary-card p {
              margin: 0;
              color: #6b7280;
              font-size: 14px;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://res.cloudinary.com/dg2ul5woj/image/upload/v1752430610/aibites/foods/Logo_v3qbhp.png" alt="Mensura Logo" class="logo" />
              <h1>Nutrition Report</h1>
              <p>${userData.fullName || "User"} • ${dateRange}</p>
            </div>

            <div class="content">
              <div class="section">
                <h2>Overview</h2>
                <div class="stats-grid">
                  <div class="stat-item">
                    <div class="stat-label">Average Calories</div>
                    <div class="stat-value">${summaryStats.averageCalories}</div>
                    <div class="stat-unit">calories/day</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">Goal Achievement</div>
                    <div class="stat-value">${summaryStats.goalAchievement}%</div>
                    <div class="stat-unit">days on target</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">Average Protein</div>
                    <div class="stat-value">${summaryStats.averageProtein}</div>
                    <div class="stat-unit">grams/day</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-label">Average Carbs</div>
                    <div class="stat-value">${summaryStats.averageCarbs}</div>
                    <div class="stat-unit">grams/day</div>
                  </div>
                </div>
              </div>

              <div class="section">
                <h2>Daily Trends</h2>
                <div class="chart-section">
                  <div class="chart-title">Calorie Intake Over Time</div>
                  <div class="chart-container">
                    ${svgCharts.caloriesChart}
                  </div>
                </div>
                <div class="chart-section">
                  <div class="chart-title">Macronutrient Trends</div>
                  <div class="chart-container">
                    ${svgCharts.macrosChart}
                  </div>
                </div>
              </div>

              <div class="section">
                <h2>Detailed Analysis</h2>
                <div class="chart-section">
                  <div class="chart-title">Daily Calorie Comparison</div>
                  <div class="chart-container">
                    ${svgCharts.barChart}
                  </div>
                </div>
                <div class="chart-section">
                  <div class="chart-title">Macro Distribution</div>
                  <div class="chart-container">
                    ${svgCharts.pieChart}
                  </div>
                </div>
                <div class="chart-section">
                  <div class="chart-title">Goal Achievement Progress</div>
                  <div class="chart-container">
                    ${svgCharts.goalChart}
                  </div>
                </div>
              </div>

              <div class="section">
                <h2>Performance Insights</h2>
                <div class="insights">
                  <h3>Goal Performance Analysis</h3>
                  <p>You met your calorie goals on <strong>${summaryStats.goalAchievement}%</strong> of days during this period.</p>
                  <p>Your average daily intake was <strong>${summaryStats.averageCalories} calories</strong>, with a balanced distribution of macronutrients.</p>
                  <p>Performance Rating: <span class="performance-indicator ${summaryStats.goalAchievement >= 80 ? "performance-excellent" : summaryStats.goalAchievement >= 60 ? "performance-good" : "performance-needs-improvement"}">${summaryStats.goalAchievement >= 80 ? "Excellent" : summaryStats.goalAchievement >= 60 ? "Good" : "Needs Improvement"}</span></p>
                </div>

                <div class="summary-cards">
                  <div class="summary-card">
                    <h4>Calorie Management</h4>
                    <p>Your daily calorie intake shows ${summaryStats.averageCalories >= 1800 ? "consistent" : summaryStats.averageCalories >= 1500 ? "moderate" : "room for improvement"} patterns. ${summaryStats.averageCalories >= 1800 ? "Great job maintaining your target range!" : summaryStats.averageCalories >= 1500 ? "Consider increasing intake slightly for better energy levels." : "Focus on gradually increasing your daily calorie intake."}</p>
                  </div>
                  <div class="summary-card">
                    <h4>Macro Balance</h4>
                    <p>Your macronutrient distribution shows a ${summaryStats.averageProtein >= 50 ? "good" : "moderate"} protein intake of ${summaryStats.averageProtein}g daily. ${summaryStats.averageCarbs >= 200 ? "Carbohydrate intake is well-balanced" : "Consider increasing complex carbohydrates"} and ${summaryStats.averageFat >= 50 ? "healthy fats are within recommended range" : "healthy fat intake could be optimized"}.</p>
                  </div>
                  <div class="summary-card">
                    <h4>Consistency Score</h4>
                    <p>You tracked ${chartData.calories.length} days with ${summaryStats.goalAchievement}% goal achievement. ${summaryStats.goalAchievement >= 80 ? "Outstanding consistency! Keep up the great work." : summaryStats.goalAchievement >= 60 ? "Good progress! Focus on maintaining this momentum." : "Keep tracking consistently to see better results over time."}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="footer">
              <p>Generated by Mensura on ${new Date().toLocaleDateString()}</p>
              <p>This report provides insights based on your logged nutrition data</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Generate PDF
      const { uri } = await Print.printToFileAsync({ html });

      // Share PDF
      if (uri && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Share Nutrition Report",
        });
      } else {
        console.log("Sharing is not available on this device");
      }

      setIsGenerating(false);
      return { success: true, uri };
    } catch (error) {
      console.error("Error generating report:", error);
      setIsGenerating(false);
      return { success: false, error };
    }
  };

  return {
    generateReport,
    isGenerating,
  };
};

// Export types for use in other components
export type { NutritionData, UserData };
