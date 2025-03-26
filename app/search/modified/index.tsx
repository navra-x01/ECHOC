import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "@react-navigation/native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";

interface SearchPageModifiedProps {
  initialQuery?: string;
  onClose: () => void;
}

export default function SearchPageModified({ initialQuery = "", onClose }: SearchPageModifiedProps) {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const data = [
    { name: "Digixdao", symbol: "DX", price: "$2,453.43", change: "-132.5%", color: "red" },
    { name: "Amp", symbol: "AMP", price: "$2,453.43", change: "-12.5%", color: "red" },
    { name: "Fei", symbol: "FEI", price: "$3,542.89", change: "-1.56%", color: "red" },
    { name: "Gnosis", symbol: "GNO", price: "$453.43", change: "-23.3%", color: "red" },
    { name: "USD Coin", symbol: "USDC", price: "$119,763.01", change: "+7.4%", color: "green" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <TouchableOpacity onPress={onClose} style={{ marginRight: 10 }}>
          <AntDesign name="arrowleft" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: colors.card, padding: 10, borderRadius: 10 }}>
          <Feather name="search" size={20} color={colors.text} style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search"
            placeholderTextColor={colors.text}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ flex: 1, color: colors.text }}
            autoFocus
          />
        </View>
      </View>
      
      {/* Total Balance */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: colors.text, fontSize: 14, opacity: 0.7 }}>Total Balance</Text>
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: "bold" }}>$83,432.43</Text>
      </View>
      
      {/* Coins List */}
      <ScrollView>
        {data.map((coin, index) => (
          <View key={index} style={{ backgroundColor: colors.card, padding: 16, borderRadius: 10, marginBottom: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Avatar rounded title={coin.symbol} containerStyle={{ backgroundColor: colors.primary, marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontSize: 16 }}>{coin.name}</Text>
                <Text style={{ color: colors.text, fontSize: 12, opacity: 0.6 }}>({coin.symbol})</Text>
              </View>
              <Text style={{ color: coin.color, fontSize: 14 }}>{coin.change}</Text>
            </View>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: "bold", marginTop: 5 }}>{coin.price}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Footer Navigation */}
      <View style={{ flexDirection: "row", justifyContent: "space-around", paddingVertical: 16, borderTopWidth: 1, borderColor: colors.border }}>
        {['Watchlist', 'News', 'Movers', 'Rewards'].map((tab, index) => (
          <TouchableOpacity key={index}>
            <Text style={{ color: colors.text, fontSize: 14 }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
