import { View, Text, TouchableOpacity } from "react-native"
import { Feather } from "@expo/vector-icons"

// Define prop types
interface CoinCardProps {
  symbol: string
  name: string
  price: string
  percentage: string
  color: string
  onPress?: () => void // <-- Make onPress optional
}

export default function CoinCard({ symbol, name, price, percentage, color, onPress }: CoinCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ flex: 1, backgroundColor: "#fff", padding: 15, borderRadius: 15, margin: 5, shadowOpacity: 0.1 }}
      disabled={!onPress} // Disable button if no onPress function is provided
    >
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
        <View>
          <Text style={{ fontWeight: "bold" }}>{name}</Text>
          <Text style={{ fontSize: 12, color: "gray" }}>{name === "BTC" ? "Bitcoin" : "Ethereum"}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "bold" }}>{price}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather name="arrow-down-right" size={16} color={percentage.startsWith("-") ? "red" : "green"} />
          <Text style={{ color: percentage.startsWith("-") ? "red" : "green" }}>{percentage}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
