import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Button } from "../src/components/Button";
import { Input } from "../src/components/Input";
import { spacing, fontSize, borderRadius } from "../src/constants/theme";
import { useAuth } from "../src/context/AuthContext";
import { useTheme } from "../src/context/ThemeContext";

// Same sunset farm background as welcome page
const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&q=80";

export default function RegisterScreen() {
  const { register } = useAuth();
  const { colors, isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    farmSize: "",
    cropType: "",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.farmSize) newErrors.farmSize = "Farm size is required";
    if (!formData.cropType) newErrors.cropType = "Crop type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const detectLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required to detect your farm location.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setFormData({
        ...formData,
        latitude: location.coords.latitude.toFixed(6),
        longitude: location.coords.longitude.toFixed(6),
      });
      setLocationDetected(true);
    } catch (error) {
      Alert.alert("Error", "Unable to detect location. Please enter manually.");
    } finally {
      setLocationLoading(false);
    }
  };

  const clearLocation = () => {
    setFormData({ ...formData, latitude: "", longitude: "" });
    setLocationDetected(false);
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const registerData: any = {
        ...formData,
        farmSize: parseFloat(formData.farmSize),
      };

      // Include location if provided
      if (formData.latitude && formData.longitude) {
        registerData.latitude = parseFloat(formData.latitude);
        registerData.longitude = parseFloat(formData.longitude);
      }

      await register(registerData);
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic styles based on theme
  const formCardStyle = {
    backgroundColor: isDark ? "rgba(30, 41, 59, 0.95)" : "rgba(255,255,255,0.95)",
  };

  const linkColor = isDark ? colors.mutedForeground : "#6b7280";
  const locationBoxBg = isDark ? "rgba(34, 197, 94, 0.15)" : "rgba(34, 197, 94, 0.1)";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ImageBackground
        source={{ uri: BACKGROUND_IMAGE }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.85)"]}
          style={styles.gradient}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <ScrollView 
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
            >
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </TouchableOpacity>

              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Ionicons name="leaf" size={40} color="#22c55e" />
                </View>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Register as a new farmer</Text>
              </View>

              <View style={[styles.formCard, formCardStyle]}>
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  error={errors.name}
                />

                <Input
                  label="Email Address"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                />

                <Input
                  label="Password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry
                  error={errors.password}
                />

                <View style={styles.row}>
                  <View style={styles.halfInput}>
                    <Input
                      label="Farm Size (acres)"
                      placeholder="5.0"
                      value={formData.farmSize}
                      onChangeText={(text) => setFormData({ ...formData, farmSize: text })}
                      keyboardType="decimal-pad"
                      error={errors.farmSize}
                    />
                  </View>
                  <View style={styles.halfInput}>
                    <Input
                      label="Crop Type"
                      placeholder="Maize"
                      value={formData.cropType}
                      onChangeText={(text) => setFormData({ ...formData, cropType: text })}
                      error={errors.cropType}
                    />
                  </View>
                </View>

                {/* Location Section */}
                <View style={[styles.locationSection, { backgroundColor: locationBoxBg }]}>
                  <View style={styles.locationHeader}>
                    <View style={styles.locationTitleRow}>
                      <Ionicons name="location" size={18} color="#22c55e" />
                      <Text style={[styles.locationTitle, { color: isDark ? "#fff" : "#000" }]}>
                        Farm Location
                      </Text>
                      <Text style={styles.optionalBadge}>(optional)</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.detectButton}
                      onPress={detectLocation}
                      disabled={locationLoading}
                    >
                      {locationLoading ? (
                        <ActivityIndicator size="small" color="#22c55e" />
                      ) : locationDetected ? (
                        <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                      ) : (
                        <Ionicons name="navigate" size={18} color="#22c55e" />
                      )}
                      <Text style={styles.detectButtonText}>
                        {locationLoading ? "Detecting..." : locationDetected ? "Detected" : "Detect"}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {locationDetected && (
                    <Text style={styles.locationSuccess}>
                      ✓ Location detected! You can adjust if needed.
                    </Text>
                  )}

                  <View style={styles.row}>
                    <View style={styles.halfInput}>
                      <Input
                        label="Latitude"
                        placeholder="-1.286389"
                        value={formData.latitude}
                        onChangeText={(text) => setFormData({ ...formData, latitude: text })}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={styles.halfInput}>
                      <Input
                        label="Longitude"
                        placeholder="36.817223"
                        value={formData.longitude}
                        onChangeText={(text) => setFormData({ ...formData, longitude: text })}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  {(formData.latitude || formData.longitude) && (
                    <TouchableOpacity onPress={clearLocation} style={styles.clearButton}>
                      <Ionicons name="close-circle-outline" size={14} color="#888" />
                      <Text style={styles.clearButtonText}>Clear location</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Button title="Register" onPress={handleRegister} loading={loading} size="md" />

                <TouchableOpacity onPress={() => router.push("/login")}>
                  <Text style={[styles.link, { color: linkColor }]}>
                    Already have an account? <Text style={styles.linkHighlight}>Sign in</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingTop: (StatusBar.currentHeight || 44) + spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.full,
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: "700",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: fontSize.md,
    color: "rgba(255,255,255,0.7)",
    marginTop: spacing.xs,
  },
  formCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  locationSection: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  locationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationTitle: {
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  optionalBadge: {
    fontSize: fontSize.xs,
    color: "#888",
  },
  detectButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    backgroundColor: "rgba(34, 197, 94, 0.2)",
  },
  detectButtonText: {
    fontSize: fontSize.xs,
    color: "#22c55e",
    fontWeight: "500",
  },
  locationSuccess: {
    fontSize: fontSize.xs,
    color: "#22c55e",
    marginBottom: spacing.sm,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: spacing.xs,
  },
  clearButtonText: {
    fontSize: fontSize.xs,
    color: "#888",
  },
  link: {
    textAlign: "center",
    marginTop: spacing.lg,
  },
  linkHighlight: {
    color: "#22c55e",
    fontWeight: "600",
  },
});
