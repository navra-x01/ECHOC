import { StyleSheet } from "react-native"
import { DefaultTheme } from "@react-navigation/native";

export const GlobalStyles = StyleSheet.create({
  lightTheme: {
    backgroundColor: "#f8f8f8",
  },
  darkTheme: {
    backgroundColor: "#141b29",
  },
  
  textPrimary: {
    color: "#484d58",
  },
  textSecondary: {
    color: "#8d9096",
  },
  textTertiary: {
    color: "#70747c",
  },
  cardPrimary: {
    backgroundColor: "#00bdb0",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#00bdb0",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  accentTeal: {
    color: "#00bdb0",
  },
  accentRed: {
    color: "#f15950",
  },
  accentGreen: {
    color: "#10dc78",
  },

  // Navigation Bar Styles
  navContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#d6d7d8",
    paddingVertical: 10,
    backgroundColor: "#f8f8f8",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  },
})

export const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    success: "#4CAF50",
    purple: "#9C27B0",
    red: "#F44336",
    muted: "#9E9E9E", // Add muted color
  },
};

