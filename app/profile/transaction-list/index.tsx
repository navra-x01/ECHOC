import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, Filter, Calendar, ArrowDownUp } from "lucide-react-native";

// Define custom theme inside the file
const customTheme = {
  primary: "#4F46E5",
  success: "#22C55E",
  muted: "#6B7280",
  background: "#F9FAFB",
  card: "#FFFFFF",
  text: "#111827",
  border: "#E5E7EB",
  notification: "#EF4444",
};

export default function TransactionList() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: customTheme.background }}>
      <View style={{ padding: 16, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: customTheme.border }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color={customTheme.text} />
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: "center", fontSize: 18, fontWeight: "500", color: customTheme.text }}>
          Transaction History
        </Text>
        <TouchableOpacity>
          <Calendar size={24} color={customTheme.text} />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 12 }}>
          <Filter size={24} color={customTheme.text} />
        </TouchableOpacity>
      </View>

      <View style={{ padding: 16, flexDirection: "row", justifyContent: "space-around" }}>
        {['all', 'income', 'expense', 'pending'].map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 20,
              backgroundColor: activeFilter === filter ? customTheme.primary : customTheme.card,
            }}
          >
            <Text style={{ color: activeFilter === filter ? "#FFFFFF" : customTheme.text }}>{filter.charAt(0).toUpperCase() + filter.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <Text style={{ fontSize: 14, fontWeight: "500", color: customTheme.text }}>Today</Text>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
          <ArrowDownUp size={16} color={customTheme.text} />
          <Text style={{ fontSize: 12, marginLeft: 4, color: customTheme.text }}>Sort</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
