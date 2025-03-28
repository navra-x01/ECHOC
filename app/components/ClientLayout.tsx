import { View, StatusBar } from "react-native";
import { useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalStyles } from "../../styles";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  // Load theme from AsyncStorage
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) {
        setIsDarkMode(savedTheme === "dark");
      } else {
        setIsDarkMode(systemTheme === "dark");
      }
    };
    loadTheme();
  }, []);

  // Save theme to AsyncStorage
  useEffect(() => {
    if (isDarkMode !== null) {
      AsyncStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }
  }, [isDarkMode]);

  // Ensure theme is properly applied
  const themeStyles = isDarkMode ? GlobalStyles.darkTheme : GlobalStyles.lightTheme;

  if (isDarkMode === null) return null; // Prevent flickering

  return (
    <View style={[{ flex: 1 }, themeStyles]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      {children}
    </View>
  );
}
