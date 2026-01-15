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
  Modal,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBadge } from "../src/components/StatusBadge";
import { Button } from "../src/components/Button";
import { spacing, fontSize, borderRadius } from "../src/constants/theme";
import { useAuth } from "../src/context/AuthContext";
import { useTheme } from "../src/context/ThemeContext";
import { adminApi } from "../src/lib/services";
import { Farmer, CertificationStatus, FarmerStats } from "../src/types";

export default function AdminDashboard() {
  const { user, logout, isAdmin } = useAuth();
  const { colors, isDark } = useTheme();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [stats, setStats] = useState<FarmerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CertificationStatus | "ALL">("ALL");
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Decline modal state
  const [declineModal, setDeclineModal] = useState(false);
  const [declineFarmerId, setDeclineFarmerId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");

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
        Alert.alert("Success", status === "CERTIFIED" ? "Farmer certified!" : "Application declined.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update status");
    } finally {
      setProcessingId(null);
    }
  };

  const openDeclineModal = (farmerId: string) => {
    setDeclineFarmerId(farmerId);
    setDeclineReason("");
    setDeclineModal(true);
  };

  const confirmDecline = () => {
    if (declineFarmerId) {
      handleStatusChange(declineFarmerId, "DECLINED", declineReason || undefined);
      setDeclineModal(false);
      setDeclineFarmerId(null);
      setDeclineReason("");
    }
  };

  const confirmCertify = (farmerId: string) => {
    Alert.alert(
      "Certify Farmer",
      "Are you sure you want to certify this farmer?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Certify", onPress: () => handleStatusChange(farmerId, "CERTIFIED") },
      ]
    );
  };

  const filteredFarmers = farmers.filter(
    (f) => filter === "ALL" || f.certificationStatus === filter
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centered}>
          <View style={styles.loadingSpinner}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Ionicons name="shield-checkmark" size={24} color={colors.primary} style={styles.loadingIcon} />
          </View>
          <Text style={[styles.loadingText, { color: colors.foreground }]}>Loading dashboard</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Welcome back,</Text>
            <Text style={[styles.title, { color: colors.foreground }]}>Admin Dashboard</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Manage farmer certifications
            </Text>
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
            <View key={stat.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.filterRow}>
          {(["ALL", "PENDING", "CERTIFIED", "DECLINED"] as const).map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                { borderColor: colors.border },
                filter === status && { backgroundColor: colors.primary, borderColor: colors.primary },
              ]}
              onPress={() => setFilter(status)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: colors.mutedForeground },
                  filter === status && { color: colors.background },
                ]}
              >
                {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredFarmers.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="people-outline" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No farmers found</Text>
          </View>
        ) : (
          filteredFarmers.map((farmer) => (
            <View key={farmer.id} style={[styles.farmerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.farmerHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.farmerName, { color: colors.foreground }]}>{farmer.name}</Text>
                  <Text style={[styles.farmerEmail, { color: colors.mutedForeground }]}>{farmer.user?.email}</Text>
                </View>
                <StatusBadge status={farmer.certificationStatus} />
              </View>

              <View style={styles.farmerDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="resize-outline" size={14} color={colors.mutedForeground} />
                  <Text style={[styles.detailText, { color: colors.mutedForeground }]}>{farmer.farmSize} acres</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="leaf-outline" size={14} color={colors.mutedForeground} />
                  <Text style={[styles.detailText, { color: colors.mutedForeground }]}>{farmer.cropType}</Text>
                </View>
              </View>

              {farmer.locationAddress && (
                <View style={[styles.locationRow, { backgroundColor: `${colors.primary}10` }]}>
                  <Ionicons name="location-outline" size={14} color={colors.primary} />
                  <Text style={[styles.locationText, { color: colors.foreground }]} numberOfLines={1}>
                    {farmer.locationAddress}
                  </Text>
                </View>
              )}

              {farmer.certificationStatus === "PENDING" && (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.certifyButton, { backgroundColor: colors.success }]}
                    onPress={() => confirmCertify(farmer.id)}
                    disabled={processingId === farmer.id}
                  >
                    {processingId === farmer.id ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <Ionicons name="checkmark-circle" size={18} color="#fff" />
                        <Text style={styles.buttonText}>Certify</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.declineButton, { backgroundColor: colors.destructive }]}
                    onPress={() => openDeclineModal(farmer.id)}
                    disabled={processingId === farmer.id}
                  >
                    <Ionicons name="close-circle" size={18} color="#fff" />
                    <Text style={styles.buttonText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              )}

              {farmer.certificationStatus === "DECLINED" && farmer.declineReason && (
                <View style={[styles.declineReasonBox, { backgroundColor: `${colors.destructive}10` }]}>
                  <Text style={[styles.declineReasonLabel, { color: colors.destructive }]}>Reason:</Text>
                  <Text style={[styles.declineReasonText, { color: colors.foreground }]}>{farmer.declineReason}</Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Decline Modal - Works on both iOS and Android */}
      <Modal visible={declineModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Ionicons name="close-circle" size={40} color={colors.destructive} />
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Decline Application</Text>
            </View>
            
            <Text style={[styles.modalLabel, { color: colors.mutedForeground }]}>
              Reason for decline (optional):
            </Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.muted, color: colors.foreground }]}
              value={declineReason}
              onChangeText={setDeclineReason}
              placeholder="e.g., Missing documentation..."
              placeholderTextColor={colors.mutedForeground}
              multiline
              numberOfLines={3}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, { borderColor: colors.border }]}
                onPress={() => setDeclineModal(false)}
              >
                <Text style={[styles.modalCancelText, { color: colors.foreground }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirmBtn, { backgroundColor: colors.destructive }]}
                onPress={confirmDecline}
              >
                <Text style={styles.modalConfirmText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingSpinner: {
    position: "relative",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingIcon: {
    position: "absolute",
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
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
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: fontSize.sm,
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
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: fontSize.xs,
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
  },
  filterText: {
    fontSize: fontSize.xs,
    fontWeight: "500",
  },
  emptyCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    alignItems: "center",
    gap: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.md,
  },
  farmerCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
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
  },
  farmerEmail: {
    fontSize: fontSize.xs,
  },
  farmerDetails: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: fontSize.sm,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  locationText: {
    fontSize: fontSize.xs,
    flex: 1,
  },
  actionRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  certifyButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  declineButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: fontSize.sm,
  },
  declineReasonBox: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  declineReasonLabel: {
    fontSize: fontSize.xs,
    fontWeight: "600",
  },
  declineReasonText: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  modalContent: {
    width: "100%",
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    marginTop: spacing.sm,
  },
  modalLabel: {
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
  modalInput: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSize.md,
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: fontSize.md,
    fontWeight: "500",
  },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: "center",
  },
  modalConfirmText: {
    color: "#fff",
    fontSize: fontSize.md,
    fontWeight: "600",
  },
});
