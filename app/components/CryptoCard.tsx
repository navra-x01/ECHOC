import { View, Text } from "react-native"
import { Feather } from "@expo/vector-icons"

interface CryptoCardProps {
  total: string
  profit: string
  percentage: string
}

export default function CryptoCard({ total, profit, percentage }: CryptoCardProps) {
  return (
    <View style={{ backgroundColor: "#fff", padding: 15, borderRadius: 15, marginBottom: 20, shadowOpacity: 0.1 }}>
      <Text style={{ fontSize: 14, color: "gray" }}>Total Coins</Text>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{total}</Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
        <View>
          <Text style={{ fontSize: 14, color: "gray" }}>Today's Profit</Text>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{profit}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#00bdb0", padding: 5, borderRadius: 10 }}>
          <Feather name="arrow-up-right" size={16} color="white" />
          <Text style={{ color: "white", fontWeight: "bold", marginLeft: 5 }}>{percentage}</Text>
        </View>
      </View>
    </View>
  )
}
