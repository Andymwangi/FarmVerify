import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useColorScheme, Appearance } from "react-native";
import { lightColors, darkColors } from "../constants/theme";

type ColorScheme = "light" | "dark";

interface ThemeContextType {
  isDark: boolean;
  colors: typeof lightColors;
  toggleTheme: () => void;
  setTheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    systemColorScheme === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme: newScheme }) => {
      if (newScheme) {
        setColorScheme(newScheme);
      }
    });

    return () => subscription.remove();
  }, []);

  const isDark = colorScheme === "dark";
  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = () => {
    setColorScheme(isDark ? "light" : "dark");
  };

  const setTheme = (scheme: ColorScheme) => {
    setColorScheme(scheme);
  };

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
