import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, borderRadius, spacing, fontSize } from "../constants/theme";
import { CertificationStatus } from "../types";
import { Ionicons } from "@expo/vector-icons";

interface StatusBadgeProps {
  status: CertificationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    PENDING: {
      label: "Pending Review",
      icon: "time-outline" as const,
      color: colors.warning,
      bg: `${colors.warning}20`,
    },
    CERTIFIED: {
      label: "Certified",
      icon: "checkmark-circle" as const,
      color: colors.success,
      bg: `${colors.success}20`,
    },
    DECLINED: {
      label: "Declined",
      icon: "close-circle" as const,
      color: colors.destructive,
      bg: `${colors.destructive}20`,
    },
  };

  const { label, icon, color, bg } = config[status];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: "600",
  },
});
