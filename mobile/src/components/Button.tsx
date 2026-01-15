import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { borderRadius, spacing, fontSize } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "default" | "secondary" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = "default",
  size = "md",
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const { colors } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    switch (variant) {
      case "default":
        return { backgroundColor: colors.primary };
      case "secondary":
        return { backgroundColor: colors.muted };
      case "outline":
        return { backgroundColor: "transparent", borderWidth: 2, borderColor: colors.primary };
      case "destructive":
        return { backgroundColor: colors.destructive };
      default:
        return { backgroundColor: colors.primary };
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case "default":
        return { color: "#ffffff" };
      case "secondary":
        return { color: colors.foreground };
      case "outline":
        return { color: colors.primary };
      case "destructive":
        return { color: "#ffffff" };
      default:
        return { color: "#ffffff" };
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case "sm":
        return { paddingVertical: spacing.sm, paddingHorizontal: spacing.md };
      case "lg":
        return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl };
      default:
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };
    }
  };

  const getTextSizeStyle = (): TextStyle => {
    switch (size) {
      case "sm":
        return { fontSize: fontSize.sm };
      case "lg":
        return { fontSize: fontSize.lg };
      default:
        return { fontSize: fontSize.md };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        getButtonStyle(),
        getSizeStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? colors.primary : "#ffffff"}
          size="small"
        />
      ) : (
        <Text style={[styles.text, getTextStyle(), getTextSizeStyle()]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: "600",
  },
});
