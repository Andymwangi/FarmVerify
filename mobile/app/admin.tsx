import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBadge } from "../src/components/StatusBadge";
import { Button } from "../src/components/Button";
import { colors, spacing, fontSize, borderRadius } from "../src/constants/theme";
import { useAuth } from "../src/context/AuthContext";
import { adminApi } from "../src/lib/services";
import { Farmer, CertificationStatus, FarmerStats } from "../src/types";

export default function AdminDashboard() {
  const { user, logout, isAdmin } = useAuth();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [stats, setStats] = useState<FarmerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CertificationStatus | "ALL">("ALL");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/");
      return;
    }
    fetchData();
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      const [farmersRes, statsRes] = await Promise.all([
        adminApi.getAllFarmers(),
        adminApi.getStats(),
      ]);
      if (farmersRes.success && farmersRes.data) setFarmers(farmersRes.data);
      if (statsRes.success && statsRes.data) setStats(statsRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (farmerId: string, status: CertificationStatus, reason?: string) => {
    setProcessingId(farmerId);
    try {
      const response = await adminApi.updateFarmerStatus(farmerId, { status, reason });
      if (response.success && response.data) {
        setFarmers((prev) =>
          prev.map((f) => (f.id === farmerId ? response.data! : f))
        );
        fetchData();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
    } finally {
      setProcessingId(null);
    }
  };

  const confirmDecline = (farmerId: string) => {
    Alert.prompt(
      "Decline Application",
      "Enter reason for decline (optional):",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Decline",
          style: "destructive",
          onPress: (reason?: string) => handleStatusChange(farmerId, "DECLINED", reason),
        },
      ],
      "plain-text"
    );
  };

  const filteredFarmers = farmers.filter(
    (f) => filter === "ALL" || f.certificationStatus === filter
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.title}>Admin Dashboard</Text>
            <Text style={styles.subtitle}>Manage farmer certifications and review applications</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          {[
            { label: "Total", value: stats?.total ?? 0, color: colors.primary },
            { label: "Pending", value: stats?.pending ?? 0, color: colors.warning },
            { label: "Certified", value: stats?.certified ?? 0, color: colors.success },
            { label: "Declined", value: stats?.declined ?? 0, color: colors.destructive },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.filterRow}>
          {(["ALL", "PENDING", "CERTIFIED", "DECLINED"] as const).map((status) => (
            <TouchableOpacity
              key={status}
              style={[styles.filterButton, filter === status && styles.filterButtonActive]}
              onPress={() => setFilter(status)}
            >
              <Text
                style={[styles.filterText, filter === status && styles.filterTextActive]}
              >
                {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredFarmers.map((farmer) => (
          <View key={farmer.id} style={styles.farmerCard}>
            <View style={styles.farmerHeader}>
              <View>
                <Text style={styles.farmerName}>{farmer.name}</Text>
                <Text style={styles.farmerEmail}>{farmer.user?.email}</Text>
              </View>
              <StatusBadge status={farmer.certificationStatus} />
            </View>

            <View style={styles.farmerDetails}>
              <Text style={styles.detailText}>Farm: {farmer.farmSize} acres</Text>
              <Text style={styles.detailText}>Crop: {farmer.cropType}</Text>
            </View>

            {farmer.certificationStatus === "PENDING" && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.certifyButton}
                  onPress={() => handleStatusChange(farmer.id, "CERTIFIED")}
                  disabled={processingId === farmer.id}
                >
                  <Ionicons name="checkmark-circle" size={18} color={colors.background} />
                  <Text style={styles.certifyText}>Certify</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={() => confirmDecline(farmer.id)}
                  disabled={processingId === farmer.id}
                >
                  <Ionicons name="close-circle" size={18} color={colors.background} />
                  <Text style={styles.declineText}>Decline</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: fontSize.md,
    color: colors.mutedForeground,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: colors.foreground,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
    marginTop: spacing.xs,
  },
  logoutButton: {
    padding: spacing.sm,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    marginTop: spacing.xs,
  },
  filterRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    fontWeight: "500",
  },
  filterTextActive: {
    color: colors.background,
  },
  farmerCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  farmerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  farmerName: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.foreground,
  },
  farmerEmail: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
  },
  farmerDetails: {
    flexDirection: "row",
    gap: spacing.lg,
    marginBottom: spacing.sm,
  },
  detailText: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  certifyButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.success,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  certifyText: {
    color: colors.background,
    fontWeight: "600",
    fontSize: fontSize.sm,
  },
  declineButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.destructive,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  declineText: {
    color: colors.background,
    fontWeight: "600",
    fontSize: fontSize.sm,
  },
});
