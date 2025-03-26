import { View, Text } from "react-native"
import { Feather } from "@expo/vector-icons"

// Define the expected props
interface TrendingCardProps {
  symbol: string
  name: string
  priceChange: string
  color: string
}

export default function TrendingCard({ symbol, name, priceChange, color }: TrendingCardProps) {
  return (
    <View style={{ backgroundColor: "#fff", padding: 15, borderRadius: 15, shadowOpacity: 0.1 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: color,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>{symbol}</Text>
        </View>
        <Text style={{ fontWeight: "bold", flex: 1 }}>{name}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather name="arrow-up-right" size={16} color="green" />
          <Text style={{ color: "green" }}>{priceChange}</Text>
        </View>
      </View>
    </View>
  )
}
