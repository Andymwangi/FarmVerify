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
  Modal,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { StatusBadge } from "../src/components/StatusBadge";
import { Button } from "../src/components/Button";
import { spacing, fontSize, borderRadius } from "../src/constants/theme";
import { useAuth } from "../src/context/AuthContext";
import { useTheme } from "../src/context/ThemeContext";
import { farmerApi } from "../src/lib/services";
import { Farmer } from "../src/types";

export default function FarmerDashboard() {
  const { user, logout, isFarmer } = useAuth();
  const { colors, isDark } = useTheme();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [locationModal, setLocationModal] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [updatingLocation, setUpdatingLocation] = useState(false);
  const [tempLocation, setTempLocation] = useState({ latitude: "", longitude: "" });

  useEffect(() => {
    if (!isFarmer) {
      router.replace("/");
      return;
    }
    fetchStatus();
  }, [isFarmer]);

  const fetchStatus = async () => {
    try {
      const response = await farmerApi.getMyStatus();
      if (response.success && response.data) {
        setFarmer(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!farmer) return;

    setDownloading(true);
    try {
      await farmerApi.downloadCertificate(farmer.id);
      Alert.alert("Success", "Certificate downloaded and ready to share!");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to download certificate"
      );
    } finally {
      setDownloading(false);
    }
  };

  const openLocationModal = () => {
    setTempLocation({
      latitude: farmer?.latitude?.toString() || "",
      longitude: farmer?.longitude?.toString() || "",
    });
    setLocationModal(true);
  };

  const detectLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setTempLocation({
        latitude: location.coords.latitude.toFixed(6),
        longitude: location.coords.longitude.toFixed(6),
      });
    } catch (error) {
      Alert.alert("Error", "Unable to detect location.");
    } finally {
      setLocationLoading(false);
    }
  };

  const updateLocation = async () => {
    if (!farmer || !tempLocation.latitude || !tempLocation.longitude) {
      Alert.alert("Error", "Please enter valid coordinates.");
      return;
    }

    setUpdatingLocation(true);
    try {
      const lat = parseFloat(tempLocation.latitude);
      const lng = parseFloat(tempLocation.longitude);

      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        Alert.alert("Error", "Invalid coordinates.");
        return;
      }

      const response = await farmerApi.updateLocation(farmer.id, lat, lng);
      if (response.success && response.data) {
        setFarmer(response.data);
        Alert.alert("Success", "Location updated successfully!");
        setLocationModal(false);
      }
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to update location");
    } finally {
      setUpdatingLocation(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centered}>
          <View style={styles.loadingSpinner}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Ionicons name="leaf" size={24} color={colors.primary} style={styles.loadingLeaf} />
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
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Welcome,</Text>
            <Text style={[styles.name, { color: colors.foreground }]}>{farmer?.name || "Farmer"}</Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        {farmer && (
          <>
            <View style={[styles.statusCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.statusHeader}>
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>Certification Status</Text>
                <StatusBadge status={farmer.certificationStatus} />
              </View>

              <View style={styles.infoGrid}>
                <View style={[styles.infoItem, { backgroundColor: colors.muted }]}>
                  <Ionicons name="person-outline" size={20} color={colors.primary} />
                  <View>
                    <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Name</Text>
                    <Text style={[styles.infoValue, { color: colors.foreground }]}>{farmer.name}</Text>
                  </View>
                </View>

                <View style={[styles.infoItem, { backgroundColor: colors.muted }]}>
                  <Ionicons name="leaf-outline" size={20} color={colors.primary} />
                  <View>
                    <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Crop Type</Text>
                    <Text style={[styles.infoValue, { color: colors.foreground }]}>{farmer.cropType}</Text>
                  </View>
                </View>

                <View style={[styles.infoItem, { backgroundColor: colors.muted }]}>
                  <Ionicons name="resize-outline" size={20} color={colors.primary} />
                  <View>
                    <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Farm Size</Text>
                    <Text style={[styles.infoValue, { color: colors.foreground }]}>{farmer.farmSize} acres</Text>
                  </View>
                </View>

                <View style={[styles.infoItem, { backgroundColor: colors.muted }]}>
                  <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                  <View>
                    <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>Registered</Text>
                    <Text style={[styles.infoValue, { color: colors.foreground }]}>
                      {new Date(farmer.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>

              {farmer.certificationStatus === "CERTIFIED" && farmer.certifiedAt && (
                <View style={[styles.certifiedBanner, { backgroundColor: `${colors.success}15` }]}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  <Text style={[styles.certifiedText, { color: colors.success }]}>
                    Certified on {new Date(farmer.certifiedAt).toLocaleDateString()}
                  </Text>
                </View>
              )}

              {farmer.certificationStatus === "DECLINED" && farmer.declineReason && (
                <View style={[styles.declinedBanner, { backgroundColor: `${colors.destructive}15` }]}>
                  <Ionicons name="information-circle" size={20} color={colors.destructive} />
                  <Text style={[styles.declinedText, { color: colors.destructive }]}>
                    Reason: {farmer.declineReason}
                  </Text>
                </View>
              )}

              {/* Location Section */}
              <TouchableOpacity 
                style={[styles.locationBanner, { backgroundColor: `${colors.primary}10` }]}
                onPress={openLocationModal}
              >
                <Ionicons name="location" size={20} color={colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.locationLabel, { color: colors.primary }]}>Farm Location</Text>
                  {farmer.locationAddress ? (
                    <Text style={[styles.locationAddress, { color: colors.foreground }]}>
                      {farmer.locationAddress}
                    </Text>
                  ) : null}
                  {farmer.latitude && farmer.longitude ? (
                    <Text style={[styles.locationText, { color: colors.mutedForeground }]}>
                      GPS: {farmer.latitude.toFixed(6)}, {farmer.longitude.toFixed(6)}
                    </Text>
                  ) : (
                    <Text style={[styles.locationText, { color: colors.mutedForeground }]}>
                      Tap to add location
                    </Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            {farmer.certificationStatus === "CERTIFIED" && (
              <Button
                title={downloading ? "Downloading..." : "Download Certificate"}
                onPress={handleDownloadCertificate}
                loading={downloading}
                variant="default"
              />
            )}

            <View style={{ height: spacing.sm }} />

            <Button
              title="Refresh Status"
              onPress={fetchStatus}
              variant="outline"
            />

            {/* Contact Section */}
            <View style={[styles.helpCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.helpTitle, { color: colors.foreground }]}>Need Help?</Text>
              <Text style={[styles.helpText, { color: colors.mutedForeground }]}>
                Contact our support team for assistance.
              </Text>
              <View style={styles.contactRow}>
                <Ionicons name="location-outline" size={16} color={colors.primary} />
                <Text style={[styles.contactText, { color: colors.mutedForeground }]}>
                  106 Mwimuto/Kibichiku, Nairobi
                </Text>
              </View>
              <View style={styles.contactRow}>
                <Ionicons name="call-outline" size={16} color={colors.primary} />
                <Text style={[styles.contactText, { color: colors.mutedForeground }]}>
                  (+254) 781 050 960
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Location Update Modal */}
      <Modal visible={locationModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Update Location</Text>
              <TouchableOpacity onPress={() => setLocationModal(false)}>
                <Ionicons name="close" size={24} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.detectBtn, { backgroundColor: `${colors.primary}15` }]}
              onPress={detectLocation}
              disabled={locationLoading}
            >
              {locationLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons name="navigate" size={20} color={colors.primary} />
              )}
              <Text style={[styles.detectBtnText, { color: colors.primary }]}>
                {locationLoading ? "Detecting..." : "Detect Current Location"}
              </Text>
            </TouchableOpacity>

            <View style={styles.inputRow}>
              <View style={styles.inputHalf}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>Latitude</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground }]}
                  value={tempLocation.latitude}
                  onChangeText={(t) => setTempLocation({ ...tempLocation, latitude: t })}
                  placeholder="-1.286389"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputHalf}>
                <Text style={[styles.inputLabel, { color: colors.foreground }]}>Longitude</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground }]}
                  value={tempLocation.longitude}
                  onChangeText={(t) => setTempLocation({ ...tempLocation, longitude: t })}
                  placeholder="36.817223"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Button
              title={updatingLocation ? "Updating..." : "Save Location"}
              onPress={updateLocation}
              loading={updatingLocation}
            />
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
  loadingLeaf: {
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
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: fontSize.md,
  },
  name: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
  },
  logoutButton: {
    padding: spacing.sm,
  },
  statusCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
  },
  infoGrid: {
    gap: spacing.md,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  infoLabel: {
    fontSize: fontSize.xs,
  },
  infoValue: {
    fontSize: fontSize.md,
    fontWeight: "500",
  },
  certifiedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  certifiedText: {
    fontSize: fontSize.sm,
    fontWeight: "500",
  },
  declinedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  declinedText: {
    fontSize: fontSize.sm,
  },
  locationBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  locationLabel: {
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  locationAddress: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  locationText: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  helpCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
  },
  helpTitle: {
    fontSize: fontSize.md,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  helpText: {
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  contactText: {
    fontSize: fontSize.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: "600",
  },
  detectBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  detectBtnText: {
    fontSize: fontSize.sm,
    fontWeight: "500",
  },
  inputRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  inputHalf: {
    flex: 1,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    fontWeight: "500",
    marginBottom: spacing.xs,
  },
  input: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    fontSize: fontSize.md,
  },
});
