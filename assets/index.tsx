import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Avatar } from ".././app/components/ui/avatar";
import { ChevronLeft } from "lucide-react-native";

// Define your custom theme inside this file
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

export default function AssetsPage() {
  const router = useRouter();
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateChart(true), 100);
  }, []);

  const assets = [
    { name: "Bitcoin", symbol: "BTC", percentage: 52, color: customTheme.primary, offset: "0" },
    { name: "Ethereum", symbol: "ETH", percentage: 24, color: customTheme.success, offset: "52" },
    { name: "Litecoin", symbol: "LTC", percentage: 16, color: "#8B5CF6", offset: "76" },
    { name: "Monero", symbol: "XMR", percentage: 8, color: "#EF4444", offset: "92" },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: customTheme.background, paddingBottom: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color={customTheme.text} />
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: "center", fontSize: 18, fontWeight: "500", color: customTheme.text }}>
          My Assets
        </Text>
        <Avatar source="/placeholder.svg?height=32&width=32" />
      </View>

      <View style={{ padding: 24 }}>
        <Text style={{ fontSize: 14, color: customTheme.muted }}>Total Balance</Text>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: customTheme.text }}>$23,768.42</Text>
      </View>

      <View style={{ alignItems: "center", marginBottom: 16 }}>
        {/* Pie Chart Placeholder (Replace with a proper chart component) */}
        <View style={{ width: 150, height: 150, backgroundColor: customTheme.card, borderRadius: 75, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: customTheme.text }}>%52</Text>
          <Text style={{ fontSize: 14, color: customTheme.muted }}>BTC</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 16 }}>
        {assets.map((asset, index) => (
          <View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: asset.color, marginRight: 6 }} />
            <Text style={{ color: customTheme.text }}>{asset.name} ({asset.percentage}%)</Text>
          </View>
        ))}
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: "500", color: customTheme.text, marginBottom: 8 }}>All Transactions</Text>
        <TouchableOpacity onPress={() => router.push("../../app/profile/transaction-list")}>
          <Text style={{ fontSize: 14, color: customTheme.primary }}>View all</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
