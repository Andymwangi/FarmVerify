import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../src/components/Button";
import { spacing, fontSize, borderRadius } from "../src/constants/theme";
import { useAuth } from "../src/context/AuthContext";
import { useTheme } from "../src/context/ThemeContext";
import Svg, { Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

// Sunset farm background from Unsplash
const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&q=80";

// Curved underline SVG component
function CurvedUnderline({ color = "#22c55e", width: w = 180 }: { color?: string; width?: number }) {
  return (
    <Svg width={w} height="12" viewBox="0 0 180 12" style={{ marginTop: -4 }}>
      <Path
        d="M2 10C30 2 60 2 90 6C120 10 150 10 178 4"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

export default function HomeScreen() {
  const { isAuthenticated, isFarmer, isAdmin } = useAuth();
  const { colors } = useTheme();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnimLogo = useRef(new Animated.Value(-30)).current;
  const slideAnimHero = useRef(new Animated.Value(50)).current;
  const slideAnimFeatures = useRef(new Animated.Value(50)).current;
  const slideAnimActions = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Staggered entrance animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimLogo, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(slideAnimHero, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(slideAnimFeatures, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnimActions, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        router.replace("/admin");
      } else if (isFarmer) {
        router.replace("/farmer");
      }
    }
  }, [isAuthenticated, isAdmin, isFarmer]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <ImageBackground
        source={{ uri: BACKGROUND_IMAGE }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.85)"]}
          style={styles.gradient}
        >
          {/* Header with Logo - Fixed at top */}
          <Animated.View 
            style={[
              styles.header,
              { 
                opacity: fadeAnim, 
                transform: [{ translateY: slideAnimLogo }] 
              }
            ]}
          >
            <View style={styles.logoContainer}>
              <Ionicons name="leaf" size={28} color="#22c55e" />
            </View>
            <Text style={styles.brandName}>FarmVerify</Text>
          </Animated.View>

          {/* Main Content - Centered */}
          <View style={styles.content}>
            {/* Hero Section */}
            <Animated.View 
              style={[
                styles.heroSection,
                { 
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnimHero },
                    { scale: scaleAnim }
                  ] 
                }
              ]}
            >
              <Text style={styles.heroTitle}>
                Empowering
              </Text>
              <View style={styles.underlineWrapper}>
                <Text style={styles.heroTitleHighlight}>Sustainable</Text>
                <CurvedUnderline />
              </View>
              <Text style={styles.heroTitle}>
                Agriculture
              </Text>
              <Text style={styles.heroSubtitle}>
                Get your farm certified with our smart verification platform.
                Track, verify, and grow with confidence.
              </Text>
            </Animated.View>

            {/* Features */}
            <Animated.View 
              style={[
                styles.features,
                { 
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnimFeatures }] 
                }
              ]}
            >
              {[
                { icon: "shield-checkmark", label: "Verified", sublabel: "Certification" },
                { icon: "flash", label: "Fast", sublabel: "Processing" },
                { icon: "location", label: "GPS", sublabel: "Tracking" },
              ].map((feature, index) => (
                <Animated.View 
                  key={feature.label} 
                  style={[
                    styles.featureItem,
                    { 
                      opacity: fadeAnim,
                    }
                  ]}
                >
                  <View style={styles.featureIcon}>
                    <Ionicons name={feature.icon as any} size={22} color="#22c55e" />
                  </View>
                  <Text style={styles.featureLabel}>{feature.label}</Text>
                  <Text style={styles.featureSublabel}>{feature.sublabel}</Text>
                </Animated.View>
              ))}
            </Animated.View>

            {/* Action Buttons */}
            <Animated.View 
              style={[
                styles.actions,
                { 
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnimActions }] 
                }
              ]}
            >
              <Button
                title="Get Started"
                onPress={() => router.push("/register")}
                size="lg"
                style={styles.primaryButton}
              />
              <Button
                title="Sign In"
                onPress={() => router.push("/login")}
                variant="outline"
                size="lg"
                style={styles.outlineButton}
              />
            </Animated.View>

            {/* Footer */}
            <Animated.Text style={[styles.footer, { opacity: fadeAnim }]}>
              Trusted by farmers across Kenya
            </Animated.Text>
          </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: (StatusBar.currentHeight || 44) + spacing.md,
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: "#ffffff",
    marginLeft: spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: "flex-end",
    paddingBottom: spacing.xxl,
  },
  heroSection: {
    marginBottom: spacing.xl,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: 46,
  },
  heroTitleHighlight: {
    fontSize: 40,
    fontWeight: "800",
    color: "#22c55e",
    lineHeight: 46,
  },
  underlineWrapper: {
    alignItems: "flex-start",
  },
  heroSubtitle: {
    fontSize: fontSize.md,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 24,
    marginTop: spacing.md,
  },
  features: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xl,
  },
  featureItem: {
    alignItems: "center",
    flex: 1,
  },
  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  featureLabel: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: "#ffffff",
  },
  featureSublabel: {
    fontSize: fontSize.xs,
    color: "rgba(255,255,255,0.6)",
  },
  actions: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  primaryButton: {
    backgroundColor: "#22c55e",
  },
  outlineButton: {
    borderColor: "rgba(255,255,255,0.5)",
  },
  footer: {
    textAlign: "center",
    fontSize: fontSize.xs,
    color: "rgba(255,255,255,0.5)",
  },
});
