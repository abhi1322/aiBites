import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import * as Svg from "react-native-svg";

interface DashedSeparatorProps {
  color?: string;
  thickness?: number;
  width?: number | `${number}%`;
  dashLength?: number;
  gap?: number;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

const DashedSeparator: React.FC<DashedSeparatorProps> = ({
  color = "#E5E7EB", // Tailwind neutral-200
  thickness = 1,
  width = 100,
  dashLength = 6,
  gap = 4,
  style,
  className = "",
}) => {
  // If width is percent string, fallback to 100% in parent View
  if (typeof width === "string") {
    return (
      <Svg.Svg
        height={thickness}
        width="100%"
        style={[{ alignSelf: "center" }, style]}
        className={className}
      >
        <Svg.Line
          x1="0"
          y1={thickness / 2}
          x2="100%"
          y2={thickness / 2}
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={`${dashLength},${gap}`}
        />
      </Svg.Svg>
    );
  }
  // width is number (pixels)
  return (
    <Svg.Svg
      height={thickness}
      width={width}
      style={[{ alignSelf: "center" }, style]}
      className={className}
    >
      <Svg.Line
        x1={0}
        y1={thickness / 2}
        x2={width}
        y2={thickness / 2}
        stroke={color}
        strokeWidth={thickness}
        strokeDasharray={`${dashLength},${gap}`}
      />
    </Svg.Svg>
  );
};

export default DashedSeparator;
