// app/chart/index.tsx
import { View, Text, ScrollView, StyleSheet } from "react-native"
import { useTheme } from "@react-navigation/native"
import Header from "../components/Header"

export default function LeaderboardPage() {
  const { colors } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Leaderboard" />
      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: colors.text }]}>Top Traders</Text>
        {/* Add leaderboard content here */}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
});
