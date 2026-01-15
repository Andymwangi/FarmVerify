import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { Button } from "../src/components/Button";
import { Input } from "../src/components/Input";
import { spacing, fontSize, borderRadius } from "../src/constants/theme";
import { useAuth } from "../src/context/AuthContext";
import { useTheme } from "../src/context/ThemeContext";

// Same sunset farm background as welcome page
const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&q=80";

export default function LoginScreen() {
  const { login } = useAuth();
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedEmail = await SecureStore.getItemAsync("remembered_email");
      const savedRemember = await SecureStore.getItemAsync("remember_me");
      if (savedEmail && savedRemember === "true") {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch (error) {
      console.error("Failed to load saved credentials:", error);
    }
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      if (rememberMe) {
        await SecureStore.setItemAsync("remembered_email", email);
        await SecureStore.setItemAsync("remember_me", "true");
      } else {
        await SecureStore.deleteItemAsync("remembered_email");
        await SecureStore.deleteItemAsync("remember_me");
      }

      await login({ email, password });
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic styles based on theme
  const formCardStyle = {
    backgroundColor: isDark ? "rgba(30, 41, 59, 0.95)" : "rgba(255,255,255,0.95)",
  };

  const textColor = isDark ? colors.foreground : "#374151";
  const linkColor = isDark ? colors.mutedForeground : "#6b7280";

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
                  <Ionicons name="person-circle" size={40} color="#22c55e" />
                </View>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to your account</Text>
              </View>

              <View style={[styles.formCard, formCardStyle]}>
                <Input
                  label="Email Address"
                  placeholder="john@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                />

                <Input
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  error={errors.password}
                />

                <View style={styles.rememberRow}>
                  <Switch
                    value={rememberMe}
                    onValueChange={setRememberMe}
                    trackColor={{ false: isDark ? "#475569" : "#d1d5db", true: "#16a34a" }}
                    thumbColor={rememberMe ? "#22c55e" : isDark ? "#94a3b8" : "#9ca3af"}
                  />
                  <Text style={[styles.rememberText, { color: textColor }]}>Remember me</Text>
                </View>

                <Button title="Sign In" onPress={handleLogin} loading={loading} size="md" />

                <TouchableOpacity onPress={() => router.push("/register")}>
                  <Text style={[styles.link, { color: linkColor }]}>
                    Don't have an account? <Text style={styles.linkHighlight}>Register</Text>
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.demoCredentials}>
                <Text style={styles.demoTitle}>Demo Credentials</Text>
                <Text style={styles.demoText}>Admin: admin@tradecare.com / admin123</Text>
                <Text style={styles.demoText}>Farmer: john.kamau@example.com / farmer123</Text>
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
    marginBottom: spacing.lg,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  rememberText: {
    fontSize: fontSize.sm,
  },
  link: {
    textAlign: "center",
    marginTop: spacing.lg,
  },
  linkHighlight: {
    color: "#22c55e",
    fontWeight: "600",
  },
  demoCredentials: {
    padding: spacing.md,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  demoTitle: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    marginBottom: spacing.xs,
  },
  demoText: {
    fontSize: fontSize.xs,
    color: "rgba(255,255,255,0.6)",
  },
});
